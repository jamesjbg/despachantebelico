// src/components/AppLoader.tsx

import React, { useState, useEffect } from 'react';
// Importa hooks necessários do React Router
import { Outlet, useLocation } from 'react-router-dom'; 
// Importa o Contexto que criamos
import { ClientConfigProvider } from '../contexts/ClientConfigContext';

// --- DEFINIÇÕES DE DADOS ---

// Mock de Configuração (simula o formato que o Supabase retornaria)
interface ClientConfig {
  slug: string;
  nome_empresa: string;
  logo_url: string;
  cor_primaria: string;
}

// Configuração padrão para o seu domínio principal (portalcac.com.br)
const DEFAULT_CONFIG: ClientConfig = {
  slug: 'default',
  nome_empresa: 'PortalCAC (Master)',
  logo_url: '/default-logo.svg',
  cor_primaria: '#0369A1', // Exemplo: Cor Teal/Azul forte
};

// Componente simples para tela de erro (404)
const NotFound: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <h1 className="text-2xl font-bold text-red-600">404 - Cliente Não Encontrado ou URL Inválida.</h1>
    <p className="text-gray-600 mt-2">Verifique o endereço digitado.</p>
  </div>
);

// --------------------------------------------------------
// O Componente Principal: AppLoader
// --------------------------------------------------------

export const AppLoader: React.FC = () => {
  // Hook para pegar informações da URL
  const location = useLocation(); 

  const [config, setConfig] = useState<ClientConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // 1. EXTRAÇÃO DO SLUG:
  // Pega todos os segmentos da URL (Ex: ['', 'patriotas', 'dashboard'])
  const pathSegments = location.pathname.split('/').filter(Boolean); 
  // O slug do cliente é o primeiro segmento ('patriotas')
  const clientSlug = pathSegments[0]; 

  useEffect(() => {
    // 2. LÓGICA DE CARREGAMENTO:
    
    // Caso 1: Acesso ao domínio principal (portalcac.com.br/)
    if (clientSlug === undefined || clientSlug === '') {
      setConfig(DEFAULT_CONFIG);
      setIsLoading(false);
      return;
    }
    
    // Caso 2: Acesso com SLUG de cliente (portalcac.com.br/patriotas)
    const fetchClientConfig = async () => {
      setIsLoading(true);
      setIsError(false);

      // --- SIMULAÇÃO DA BUSCA NO SUPABASE ---
      // **AQUI VOCÊ VAI COLOCAR O CÓDIGO REAL DO SUPABASE DEPOIS:**
      // const { data, error } = await supabase.from('clientes').select('*').eq('slug', clientSlug).single();
      
      // Simulação para fins de teste e aprendizado:
      await new Promise(resolve => setTimeout(resolve, 800)); 
      
      if (clientSlug === 'patriotas' || clientSlug === 'clubemanaus') {
        // Cliente Encontrado!
        setConfig({
          slug: clientSlug,
          nome_empresa: clientSlug === 'patriotas' ? "Patriotas Despachante" : "Clube de Tiro Manaus",
          logo_url: `/logo-${clientSlug}.svg`,
          cor_primaria: clientSlug === 'patriotas' ? "#B91C1C" : "#059669", // Cores diferentes
        });
        setIsError(false);
      } else {
        // Cliente NÃO Encontrado!
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchClientConfig();
  }, [clientSlug]);

  // 3. RENDERIZAÇÃO CONDICIONAL:
  if (isLoading) {
    // Tela de Carregamento
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl text-gray-700">Carregando perfil de {clientSlug || 'SaaS'}...</div>
      </div>
    );
  }

  if (isError || !config) {
    // Tela de Erro (URL Inválida)
    return <NotFound />;
  }

  // 4. FORNECER CONTEXTO E RENDERIZAR O APP:
  return (
    // Usa o ClientConfigProvider para que todos os filhos tenham acesso à "config"
    <ClientConfigProvider value={{ config, isLoading: false }}>
      {/* O Outlet renderiza o restante das páginas do seu App */}
      <Outlet /> 
    </ClientConfigProvider>
  );
};