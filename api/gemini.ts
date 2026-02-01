import { GoogleGenerativeAI } from "@google/generative-ai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem vazia" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API KEY não encontrada" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(message);
    const text = result.response.text();

    return res.status(200).json({ text });

  } catch (err: any) {
    console.error("ERRO GEMINI REAL:", err);

    return res.status(500).json({
      error: "Erro real ao chamar Gemini",
      details: err?.message || err,
    });
  }
}
