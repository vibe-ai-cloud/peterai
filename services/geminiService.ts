import { GoogleGenerativeAI } from "@google/generative-ai";

// Na Vercel, ele vai ler VITE_GEMINI_API_KEY
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiResponse = async (userMessage: string, history: any[]) => {
  if (!apiKey) return "ERRO: Chave API não configurada na Vercel.";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(userMessage);
    return result.response.text();
  } catch (error: any) {
    console.error("Erro detalhado:", error);
    return `Erro de conexão. Verifique se a região está em São Paulo e a chave está ativa.`;
  }
};

export const generateTitle = async (msg: string) => "Conversa Peter";
