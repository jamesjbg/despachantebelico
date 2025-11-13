
import { GoogleGenAI } from "@google/genai";

// Ensure API_KEY is available in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this environment, we assume it's always present.
  console.warn("API_KEY not found in environment variables. Gemini service will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateDescription = async (productName: string): Promise<string> => {
  if (!API_KEY) {
    return "Serviço de IA indisponível. Por favor, insira a descrição manualmente.";
  }
  
  try {
    const prompt = `Gere uma descrição de produto curta, encantadora e otimizada para SEO para um item artesanal chamado "${productName}". Destaque a qualidade única e o toque pessoal. Mantenha o texto com no máximo 2 frases.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Não foi possível gerar a descrição. Tente novamente.";
  }
};
