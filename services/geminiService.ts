import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export const getGeminiResponse = async (userMessage: string, history: any[]) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(userMessage);
    return result.response.text();
  } catch (error) {
    throw new Error("ERRO DE COMUNICAÇÃO");
  }
};

export const generateTitle = async () => "Nova Conversa";
