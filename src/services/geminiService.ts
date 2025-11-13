import { GoogleGenAI } from "@google/genai";

// Em projetos Vite, as variáveis de ambiente do lado do cliente devem começar com VITE_
// e são acessadas através de `import.meta.env`
const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  console.warn("A variável VITE_API_KEY não foi encontrada. O serviço Gemini não funcionará.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateDescription = async (productName: string): Promise<string> => {
  if (!API_KEY) {
    return "Serviço de IA indisponível. A chave de API não foi configurada.";
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