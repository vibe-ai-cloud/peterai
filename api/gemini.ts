import type { VercelRequest, VercelResponse } from "vercel";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY not set" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await model.generateContent(message);
    const response = result.response.text();

    return res.status(200).json({ reply: response });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error?.message || "Unknown error",
    });
  }
}
