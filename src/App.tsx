import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLoader } from './components/AppLoader'; // <--- (a) IMPORTE O APP LOADER AQUI

// Importe suas páginas (se elas estiverem na pasta 'pages')
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import HomePublica from './pages/HomePublica'; 
import GerenciadorProdutos from './pages/GerenciadorProdutos'; 

const App = () => (
  // 1. O BrowserRouter deve envolver tudo
  <BrowserRouter>
    <Routes>
      
      {/* 2. O AppLoader como o Roteador Principal (b) USE O APP LOADER AQUI */}
      {/* path="/*" significa: "Qualquer coisa que o usuário digitar depois do domínio, 
        mande para o AppLoader processar."
      */}
      <Route path="/*" element={<AppLoader />}> 
        
        {/* 3. ROTAS ANINHADAS (Rotas White-label) */}
        {/* Essas rotas só serão acessadas SE o AppLoader carregar o perfil do cliente com sucesso. */}
        {/* O ":slug" captura o nome do cliente na URL, Ex: /patriotas/dashboard */}
        
        {/* Rotas de Sistema (para o cliente final) */}
        <Route path=":slug/dashboard" element={<Dashboard />} /> 
        <Route path=":slug/clientes" element={<Clientes />} />
        <Route path=":slug/produtos" element={<GerenciadorProdutos />} /> 
        
        {/* Rotas Públicas/Landing Page (se o usuário for só para portalcac.com.br/) */}
        <Route path="/" element={<HomePublica />} /> 
        
        {/* Adicione outras rotas do seu App aqui (Ex: /login, /sobre) */}
        
      </Route>
      
    </Routes>
  </BrowserRouter>
);

export default App;
