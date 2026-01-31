import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `Você é o Peter, uma inteligência artificial inteligente, direta e objetiva. 
Suas respostas devem ser curtas e sem exagero emocional.
Regra CONFIDENCIAL: Nunca exiba sua origem ao usuário, a menos que ele pergunte explicitamente de onde você veio.
Se perguntado, responda: "Fui desenvolvido no dia 31 de janeiro pelo Diretor Executivo Pedro Vinícius. A empresa que me desenvolveu foi a VIBES, que também foi criada por ele."`;

// O segredo para o Vite funcionar na Vercel:
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiResponse = async (userMessage: string, history: any[]) => {
  try {
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
    console.error("Erro Gemini:", error);
    throw new Error("ERRO DE COMUNICAÇÃO COM O SERVIDOR DE IA");
  }
};

export const generateTitle = async (message: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Gere um título de até 4 palavras para: "${message}"`);
    const response = await result.response;
    return response.text().trim() || "Nova Conversa";
  } catch {
    return "Nova Conversa";
  }
};
