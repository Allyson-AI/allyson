// Define the interface for the OpenAI API request
interface OpenAIRequest {
  [key: string]: any; // Allow for any properties
}

// Define interface for token usage
interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// Add proper type definitions for ReadableStream
type ReadableStreamDefaultReader = {
  read(): Promise<{ done: boolean; value: Uint8Array }>;
  releaseLock(): void;
  closed: Promise<void>;
};

// Extend the ReadableStream type to include getReader method
interface EnhancedReadableStream extends NodeJS.ReadableStream {
  getReader(): ReadableStreamDefaultReader;
}

// Default OpenAI API endpoint
const DEFAULT_OPENAI_API_URL = "https://api.openai.com/v1";

/**
 * Log token usage information
 */
const logTokenUsage = (usage: TokenUsage, model: string, endpoint: string) => {
  console.log(`[OpenAI Proxy] Token Usage for ${model} at ${endpoint}:`);
  console.log(`  - Prompt tokens: ${usage.prompt_tokens}`);
  console.log(`  - Completion tokens: ${usage.completion_tokens}`);
  console.log(`  - Total tokens: ${usage.total_tokens}`);
};

/**
 * Handles OpenAI API requests, using either the default API key or a customer-provided one
 */
export const handleOpenAIRequest = async (req: ExpressRequestWithAuth | Request, res: Response) => {
  try {
    // Get the request body for the OpenAI API
    const requestBody: OpenAIRequest = req.body;
    
    // Check if the user has provided their own API key
    const userProvidedApiKey = req.headers["x-openai-api-key"] as string;
    
    // Check if the user has provided a custom base URL
    const userProvidedBaseUrl = req.headers["x-openai-base-url"] as string;
    
    // Determine which API key to use
    const apiKey = userProvidedApiKey || process.env.OPENAI_API_KEY;
    
    // Determine which base URL to use
    const baseUrl = userProvidedBaseUrl || DEFAULT_OPENAI_API_URL;
    
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "OpenAI API key not found.",
      });
    }

    // Get the path from the original request
    const path = req.path;
    
    // Construct the full endpoint URL with query parameters
    const url = new URL(`${baseUrl}${path}`);
    
    // Add query parameters
    Object.entries(req.query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value as string);
      }
    });
    
    const endpoint = url.toString();
    
    console.log(`[OpenAI Proxy] Forwarding ${req.method} request to: ${endpoint}`);
    console.log(`[OpenAI Proxy] Using ${userProvidedApiKey ? 'customer' : 'default'} API key`);
    console.log(`[OpenAI Proxy] Using ${userProvidedBaseUrl ? 'custom' : 'default'} base URL`);
    
    // Log the prompt being sent
    if (requestBody.messages || requestBody.prompt) {
      console.log(`[OpenAI Proxy] Prompt:`, JSON.stringify(requestBody.messages || requestBody.prompt, null, 2));
    }
    
    // Log the model being used
    const model = requestBody.model || 'unknown';
    console.log(`[OpenAI Proxy] Model: ${model}`);
    
    // Prepare headers to forward
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    };
 
    // Handle streaming responses with fetch
    if (requestBody.stream) {
      console.log(`[OpenAI Proxy] Streaming response enabled`);
      
      const response = await fetch(endpoint, {
        method: req.method,
        headers,
        body: req.method !== 'GET' ? JSON.stringify(requestBody) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`[OpenAI Proxy] Error from API: ${response.status}`, errorData);
        return res.status(response.status).json(errorData);
      }

      // Set appropriate headers for streaming
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Stream the response
      const reader = (response.body as EnhancedReadableStream).getReader();
      const decoder = new TextDecoder();
      
      // For streaming responses, we need to collect the entire response to extract token usage
      let fullResponse = '';
      let responseContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        
        // Collect content for logging
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
                responseContent += data.choices[0].delta.content;
              }
            } catch (e) {
              // Ignore parsing errors in streaming data
            }
          }
        }
        
        res.write(chunk);
      }
      
      res.end();
      console.log(`[OpenAI Proxy] Streaming response completed`);
      
      // Log the response content
      console.log(`[OpenAI Proxy] Response content:`, responseContent);
      
      // Try to extract usage information from the full response
      // Note: OpenAI doesn't provide token usage in streaming responses directly,
      // but we can try to extract it from the final message if available
      try {
        const lines = fullResponse.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.usage) {
                logTokenUsage(data.usage, model, endpoint);
                break;
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      } catch (error) {
        console.log(`[OpenAI Proxy] Could not extract token usage from streaming response`);
      }
      
      return;
    }

    // Handle non-streaming responses with fetch
    const response = await fetch(endpoint, {
      method: req.method,
      headers,
      body: req.method !== 'GET' ? JSON.stringify(requestBody) : undefined,
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error(`[OpenAI Proxy] Error from API: ${response.status}`, data);
      return res.status(response.status).json(data);
    }

    // Log the response content
    if (data.choices) {
      const content = data.choices.map(choice => {
        if (choice.message && choice.message.content) {
          return choice.message.content;
        } else if (choice.text) {
          return choice.text;
        }
        return null;
      }).filter(Boolean).join('\n');
      
      console.log(`[OpenAI Proxy] Response content:`, content);
    }
    
    // Log token usage for non-streaming responses
    if (data.usage) {
      logTokenUsage(data.usage, model, endpoint);
    }

    console.log(`[OpenAI Proxy] Request successful`);
    return res.status(200).json(data);
  } catch (error) {
    console.error("[OpenAI Proxy] Error handling request:", error);
    return res.status(500).json({
      success: false,
      error: "Error processing OpenAI request",
      details: error.message,
    });
  }
}; 