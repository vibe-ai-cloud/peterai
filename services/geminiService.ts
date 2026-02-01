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

    console.log("STATUS:", res.status);
    console.log("DATA:", data);

    if (!res.ok) {
      throw new Error(data.error || "Erro desconhecido");
    }

    return data.text; // ⚠️ TEM QUE SER data.text
  } catch (error) {
    console.error("ERRO FRONTEND:", error);
    return "Erro ao falar com o servidor.";
  }
};
