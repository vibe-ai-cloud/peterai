export const getGeminiResponse = async (userMessage: string) => {
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Erro desconhecido");
    }

    return data.text;
  } catch (error) {
    console.error(error);
    return "Erro ao falar com o servidor.";
  }
};

export const generateTitle = async () => {
  return "Conversa";
};
