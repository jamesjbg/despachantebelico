// src/App.tsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import HomePublica from './pages/HomePublica';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import GerenciadorProdutos from './pages/GerenciadorProdutos';
import NotFound from './components/NotFound';
import { supabase } from './services/supabaseClient'; // Importação do Supabase
import * as constants from './constants'; // Importação do constants.ts

// --- Roteador Principal White-label ---

interface DashboardAppProps {
  isAuth: boolean;
  user: string;
}

const DashboardApp: React.FC<DashboardAppProps> = ({ isAuth, user }) => {
  // Simulação de navegação para forçar login/logout
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aqui estaria a lógica de logout do Supabase
    navigate('/');
    window.location.reload(); // Força a reinicialização após logout
  };

  if (!isAuth) {
    // Redireciona para a página pública se não estiver autenticado
    return <HomePublica />;
  }

  // Se autenticado, mostra o dashboard do cliente
  return (
    <div className="flex">
      <nav className="w-64 min-h-screen bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Portal {user}</h2>
        <ul>
          <li className="mb-2">
            <button onClick={() => navigate(`/${user}/dashboard`)} className="hover:text-yellow-400">Dashboard</button>
          </li>
          <li className="mb-2">
            <button onClick={() => navigate(`/${user}/clientes`)} className="hover:text-yellow-400">Clientes</button>
          </li>
          <li className="mb-2">
            <button onClick={() => navigate(`/${user}/produtos`)} className="hover:text-yellow-400">Produtos</button>
          </li>
        </ul>
        <button onClick={handleLogout} className="mt-8 px-4 py-2 bg-red-600 rounded hover:bg-red-700">
          Logout
        </button>
      </nav>
      <main className="flex-1 p-8">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="produtos" element={<GerenciadorProdutos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

// --- Roteador de Nível Superior ---

const App: React.FC = () => {
  const [currentClient, setCurrentClient] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Lógica de Identificação do Cliente (White-label)
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const clientPath = pathSegments[0];

    // Simulação: Verifica se o primeiro segmento da URL é um cliente válido
    // (A variável constants.CLIENTES_VALIDOS é lida aqui)
    if (clientPath && constants.CLIENTES_VALIDOS.includes(clientPath)) {
      setCurrentClient(clientPath);
    } else {
      setCurrentClient(null); // Trata como página pública
    }

    // 2. Lógica de Autenticação (SIMPLIFICADA PARA TESTE)
    const checkAuth = async () => {
      // ** CÓDIGO SIMPLIFICADO AQUI **
      if (clientPath === 'patriotas') {
          // FORÇA AUTENTICAÇÃO para testar a rota /patriotas (ignora Supabase)
          setIsAuthenticated(true); 
      } else {
          setIsAuthenticated(false);
      }
      // ** FIM DO CÓDIGO SIMPLIFICADO **
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        Carregando...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota do Cliente White-label: /patriotas ou /loja */}
        {currentClient && (
          <Route 
            path={`/${currentClient}/*`} 
            element={<DashboardApp isAuth={isAuthenticated} user={currentClient} />} 
          />
        )}
        
        {/* Rota Pública (Home Page) */}
        <Route path="/" element={<HomePublica />} />
        
        {/* Rota 404 para URLs que não são clientes e não são a home */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;