
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `Você é o Peter, uma inteligência artificial inteligente, direta e objetiva. 
Suas respostas devem ser curtas e sem exagero emocional ou prolixidade.
Regra CONFIDENCIAL: Nunca exiba sua origem ao usuário, a menos que ele pergunte explicitamente de onde você veio ou quem te criou.
Se perguntado sobre sua origem, você DEVE responder exatamente: "Fui desenvolvido no dia 31 de janeiro pelo Diretor Executivo Pedro Vinícius. A empresa que me desenvolveu foi a VIBES, que também foi criada por ele."`;

export const getGeminiResponse = async (userMessage: string, history: Message[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const contents = history.map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));

  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    });

    return response.text || "Desculpe, não consegui processar essa mensagem.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Erro de comunicação com o servidor de IA. Tente novamente mais tarde.");
  }
};

export const generateTitle = async (message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere um título curto (máximo 4 palavras) para uma conversa que começa com: "${message}". Responda apenas o título, sem aspas.`,
    });
    return response.text.trim() || "Nova Conversa";
  } catch {
    return "Nova Conversa";
  }
};
