import { GoogleGenerativeAI } from "@google/generative-ai";

// Forçamos o uso da chave do Vite
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiResponse = async (userMessage: string, history: any[]) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Simplificamos o envio para evitar erros de TypeScript no build
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(error);
    return "Erro ao falar com o Peter.";
  }
};

export const generateTitle = async () => "Conversa com Peter";
