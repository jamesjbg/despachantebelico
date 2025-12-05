// src/contexts/ClientConfigContext.tsx

import React, { createContext, useContext, ReactNode } from 'react';

// 1. DEFINIÇÃO DA INTERFACE (O FORMATO DOS DADOS)
// Isso é o que o seu App vai carregar do Supabase para cada cliente
interface ClientConfig {
  slug: string;             // O identificador na URL (ex: 'patriotas')
  nome_empresa: string;     // Nome para exibir (ex: 'Patriotas Despachante')
  logo_url: string;         // Onde buscar a logo do cliente no Supabase Storage
  cor_primaria: string;     // A cor principal da marca do cliente (ex: '#B91C1C' para vermelho)
}

// 2. DEFINIÇÃO DO CONTEXTO (O QUE OS COMPONENTES VÃO RECEBER)
interface ClientConfigContextType {
  config: ClientConfig;
  isLoading: boolean; // Indica se os dados estão sendo carregados
}

// Valor padrão para o Contexto (Usado antes de carregar o cliente)
const initialConfig: ClientConfig = {
  slug: 'default',
  nome_empresa: 'PortalCAC (Master)',
  logo_url: '/default-logo.svg', // Logo padrão do seu SaaS
  cor_primaria: '#0369A1',       // Cor padrão do seu SaaS
};

// Criação do objeto Contexto
const ClientConfigContext = createContext<ClientConfigContextType>({
  config: initialConfig,
  isLoading: true, // Começa como true
});

// 3. HOOK SIMPLIFICADO PARA USO
// Qualquer componente usa este hook para acessar a configuração: useClientConfig()
export const useClientConfig = () => useContext(ClientConfigContext);

// 4. PROVIDER
// Este componente envolverá as rotas no AppLoader para "fornecer" o Contexto
export const ClientConfigProvider: React.FC<{ 
  children: ReactNode, 
  value: ClientConfigContextType 
}> = ({ children, value }) => (
  <ClientConfigContext.Provider value={value}>
    {children}
  </ClientConfigContext.Provider>
);