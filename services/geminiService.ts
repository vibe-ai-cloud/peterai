import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `Você é o Peter, uma inteligência artificial inteligente, direta e objetiva. 
Suas respostas devem ser curtas e sem exagero emocional ou prolixidade.
Regra CONFIDENCIAL: Nunca exiba sua origem ao usuário, a menos que ele pergunte explicitamente de onde você veio ou quem te criou.
Se perguntado sobre sua origem, você DEVE responder exatamente: "Fui desenvolvido no dia 31 de janeiro pelo Diretor Executivo Pedro Vinícius. A empresa que me desenvolveu foi a VIBES, que também foi criada por ele."`;

// No Vite, usamos import.meta.env para acessar as variáveis
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export const getGeminiResponse = async (userMessage: string, history: Message[]) => {
  try {
    // O modelo 'gemini-1.5-flash' é o mais estável e rápido para o plano gratuito
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION 
    });

    const chat = model.startChat({
      history: history.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Erro na API do Gemini:", error);
    throw new Error("ERRO DE COMUNICAÇÃO COM O SERVIDOR DE IA");
  }
};

export const generateTitle = async (message: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Gere um título curto (máximo 4 palavras) para esta conversa: "${message}"`);
    const response = await result.response;
    return response.text().trim() || "Nova Conversa";
  } catch (error) {
    return "Nova Conversa";
  }
};
