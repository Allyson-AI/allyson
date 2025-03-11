
import { Request, Response } from "express";

interface GetFileRequest extends Request {
  body: {
    url: string;
  }
}

async function getFile(req: GetFileRequest, res: Response): Promise<void> {
  const { url } = req.body;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text();
    
    res.status(200).json({
      content: data
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Error getting file:", errorMessage);
    res.status(500).json({ error: "Failed to get file" });
  }
}

export { getFile };
