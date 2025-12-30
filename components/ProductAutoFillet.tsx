import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { Product } from '../types';

interface ProductAutoFillerProps {
    onDataReceived: (data: Product) => void;
}

export const ProductAutoFiller: React.FC<ProductAutoFillerProps> = ({ onDataReceived }) => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleAutoFill = async () => {
        if (!url) {
            alert("Por favor, cole um link para pesquisar.");
            return;
        }
        
        setLoading(true);
        setStatus('IA analisando o link em tempo real...');

        try {
            // Inicializa com a chave de ambiente injetada pela Vercel/Vite
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `Analise o seguinte link de armamento agora: ${url}. 
                Sua tarefa é extrair os dados técnicos reais do produto. 
                Não invente dados. Se não achar o preço, retorne 0.
                Retorne apenas um JSON puro conforme o esquema solicitado.`,
                config: {
                    tools: [{ googleSearch: {} }],
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            nome_completo: { type: Type.STRING },
                            marca: { type: Type.STRING },
                            modelo: { type: Type.STRING },
                            calibre: { type: Type.STRING },
                            capacidade_municao: { type: Type.NUMBER },
                            preco: { type: Type.NUMBER },
                            descricao_longa: { type: Type.STRING },
                            pce: { type: Type.BOOLEAN },
                            imagem_capa_url: { type: Type.STRING }
                        },
                        required: ["nome_completo", "marca", "modelo"]
                    }
                }
            });

            const result = JSON.parse(response.text || '{}');
            onDataReceived(result as Product);
            setStatus('Importado com sucesso!');

        } catch (err: any) {
            console.error("Erro na extração IA:", err);
            alert(`Falha na IA: Verifique se você adicionou a 'API_KEY' nas configurações da Vercel.`);
        } finally {
            setLoading(false);
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl mb-6 shadow-sm">
            <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                🤖 Preenchimento Automático por IA
            </h3>
            <div className="flex gap-2">
                <input 
                    type="url" 
                    value={url} 
                    onChange={e => setUrl(e.target.value)}
                    placeholder="Link do produto (ex: taurusarmas.com.br/...)"
                    className="flex-grow border border-indigo-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
                <button 
                    onClick={handleAutoFill} 
                    disabled={loading || !url}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-bold text-sm transition-all"
                >
                    {loading ? 'Lendo...' : 'Extrair Dados'}
                </button>
            </div>
            {status && <p className="text-[10px] text-indigo-600 mt-2 font-bold animate-pulse">{status}</p>}
        </div>
    );
};
