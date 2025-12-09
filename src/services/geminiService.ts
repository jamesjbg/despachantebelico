// src/services/geminiService.ts
import { GoogleGenAI } from "@google/genai";

// A variável foi corrigida para o nome que você usou no Secret do Codespaces
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 

if (!API_KEY) {
  // CORREÇÃO FINAL: Este aviso impede que o App quebre se o Codespaces não carregar a chave.
  console.log("AVISO: VITE_GEMINI_API_KEY não configurada. A funcionalidade Gemini estará desativada.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); 
// ... (O restante do código de generateDescription segue abaixo)
// Se você está copiando do arquivo antigo, mantenha a função generateDescription inalterada.

export const generateDescription = async (productName: string): Promise<string> => {
    if (!API_KEY) {
      return "Serviço de IA indisponível. A chave de API não foi configurada.";
    }
    // ... (o restante do try/catch da função generateDescription)
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