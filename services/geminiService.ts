import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiResponse = async (userMessage: string, history: any[]) => {
  try {
    // Forçamos o modelo estável "gemini-pro" se o flash falhar
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    // Se der erro, ele vai te avisar se o problema é a CHAVE
    if (error.message.includes("API_KEY_INVALID")) {
      return "Sua Chave de API está inválida no Google.";
    }
    return "Erro de conexão. Verifique se a cota do Google acabou.";
  }
};

export const generateTitle = async () => "Conversa Peter";
