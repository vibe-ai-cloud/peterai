import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export const getGeminiResponse = async (userMessage: string, history: any[]) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Você é o Peter, criado por Pedro Vinícius na VIBES." 
    });
    const chat = model.startChat({
      history: history.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    });
    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    throw new Error("ERRO DE COMUNICAÇÃO COM O SERVIDOR DE IA");
  }
};

export const generateTitle = async (message: string) => {
  return "Nova Conversa";
};
