export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    
    return new Response(text, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ error: error.message }), 
        { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return new Response(
      JSON.stringify({ error: 'An unknown error occurred' }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 