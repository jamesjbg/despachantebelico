
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { AdminPanel } from './components/AdminPanel';
import { LoginModal } from './components/LoginModal';
import { HomePage } from './components/HomePage';
import { ProductCard } from './components/ProductCard';
import { Product, Promotion, ThemeTab, ColorPalette, Testimonial, SiteContent } from './types';
import * as dataService from './services/dataService';
import { 
  COLOR_PALETTES, 
  ADMIN_USERNAME,
  ADMIN_PASSWORD
} from './constants';


const App: React.FC = () => {
  // Main data states loaded from Supabase or initial constants
  const [products, setProducts] = useState<Product[]>([]);
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [tabs, setTabs] = useState<ThemeTab[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [rawTestimonials, setRawTestimonials] = useState<any[] | undefined>(undefined); // For debugging
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(COLOR_PALETTES[0]);

  // UI/Session states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  
  // Effect to load all data from Supabase
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
        const data = await dataService.fetchAllData();
        if (data) {
            setProducts(data.products);
            setPromotion(data.promotion);
            // Ensure 'home' tab is always present
            const homeTab: ThemeTab = { id: 'home', title: 'Início' };
            const otherTabs = data.tabs.filter(t => t.id !== 'home');
            setTabs([homeTab, ...otherTabs]);
            setTestimonials(data.testimonials);
            setRawTestimonials((data as any)._rawTestimonials); // Store raw data for diagnostics
            setSiteContent(data.siteContent);
            setCurrentPalette(data.currentPalette);
        }
    } catch (error) {
        console.error("Failed to load data from Supabase:", error);
        alert((error as Error).message || "Não foi possível carregar os dados do site. Verifique a conexão com o banco de dados.");
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);


  // Effect to apply color theme
  useEffect(() => {
    const root = document.documentElement;
    if (currentPalette && currentPalette.colors) {
        root.style.setProperty('--color-primary', currentPalette.colors.primary);
        root.style.setProperty('--color-secondary', currentPalette.colors.secondary);
        root.style.setProperty('--color-accent', currentPalette.colors.accent);
        root.style.setProperty('--color-base-100', currentPalette.colors['base-100']);
        root.style.setProperty('--color-base-content', currentPalette.colors['base-content']);
    }
  }, [currentPalette]);

  const handleLoginToggle = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setIsAdminPanelOpen(false);
    } else {
      setIsLoginModalOpen(true);
    }
  };
  
  const handleLoginAttempt = (user: string, pass: string) => {
    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      setIsAdminPanelOpen(true);
    } else {
      alert('Usuário ou senha inválidos.');
    }
  };

  // --- CRUD Handlers with Error Handling & Data Reloading ---
  const createCrudHandler = (serviceFunction: (...args: any[]) => Promise<any>) => {
    return async (...args: any[]) => {
      try {
        await serviceFunction(...args);
        await loadData(); // Reload all data to ensure consistency
      } catch (error: any) {
        console.error(`Operation failed: ${serviceFunction.name}`, error);
        alert(error.message || `Ocorreu um erro ao executar a operação.`);
        throw error; // Re-throw to allow individual components to handle it
      }
    };
  };

  const handleAddProduct = createCrudHandler(dataService.addProduct);
  const handleUpdateProduct = createCrudHandler(dataService.updateProduct);
  const handleDeleteProduct = createCrudHandler(dataService.deleteProduct);
  const handleAddTab = createCrudHandler(dataService.addTab);
  const handleUpdateTab = createCrudHandler(dataService.updateTab);
  const handleDeleteTab = createCrudHandler(dataService.deleteTab);
  const handleAddTestimonial = createCrudHandler(dataService.addTestimonial);
  const handleUpdateTestimonial = createCrudHandler(dataService.updateTestimonial);
  const handleDeleteTestimonial = createCrudHandler(dataService.deleteTestimonial);
  
  // Handlers for single-row tables that don't need a full reload
  const handleUpdatePromotion = async (promo: Promotion) => {
    try {
      const updatedPromotion = await dataService.updatePromotion(promo);
      setPromotion(updatedPromotion);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
      throw error;
    }
  };

  const handleUpdatePalette = async (palette: ColorPalette) => {
    try {
      const updatedPalette = await dataService.updateTheme(palette);
      setCurrentPalette(updatedPalette);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
      throw error;
    }
  };
  
  const handleUpdateSiteContent = async (content: SiteContent) => {
    try {
      const updatedContent = await dataService.updateSiteContent(content);
      setSiteContent(updatedContent);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
      throw error;
    }
  };


  const renderContent = () => {
    if (!promotion || !siteContent) return null; // Don't render content until essential data is loaded
    
    if (activeTab === 'home') {
      return <HomePage 
        promotion={promotion} 
        products={products} 
        testimonials={testimonials}
        siteContent={siteContent}
      />;
    }
    
    const currentTabData = tabs.find(tab => tab.id === activeTab);
    const filteredProducts = products.filter(p => p.tabId === activeTab);
    
    return (
      <main className="container mx-auto p-4 flex-grow">
        <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-base-content">{currentTabData?.title}</h2>
            {currentTabData?.description && <p className="mt-2 text-base-content/80 max-w-2xl mx-auto">{currentTabData.description}</p>}
        </div>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-base-content/70 py-10">Nenhum produto encontrado nesta categoria.</p>
        )}
      </main>
    );
  };
  
  if (isLoading || !siteContent || !promotion) {
    return (
        <div className="bg-base-100 min-h-screen flex justify-center items-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-lg">Carregando...</p>
            </div>
        </div>
    )
  }

  return (
    <div className="bg-base-100 text-base-content min-h-screen flex flex-col font-sans">
      <Header
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        onLoginToggle={handleLoginToggle}
        siteContent={siteContent}
      />
      <div className="flex-grow">
        {renderContent()}
      </div>
      <Footer companyName={siteContent.companyName} />
      <FloatingWhatsAppButton 
        whatsappNumber={siteContent.whatsappNumber} 
        whatsappMessage={siteContent.whatsappMessage} 
      />
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginAttempt={handleLoginAttempt}
      />
      {isAdminPanelOpen && (
          <AdminPanel
            isOpen={isAdminPanelOpen}
            onClose={() => setIsAdminPanelOpen(false)}
            products={products}
            promotion={promotion}
            tabs={tabs}
            palettes={COLOR_PALETTES}
            currentPalette={currentPalette}
            testimonials={testimonials}
            rawTestimonials={rawTestimonials}
            siteContent={siteContent}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdatePromotion={handleUpdatePromotion}
            onAddTab={handleAddTab}
            onUpdateTab={handleUpdateTab}
            onDeleteTab={handleDeleteTab}
            onUpdatePalette={handleUpdatePalette}
            onAddTestimonial={handleAddTestimonial}
            onUpdateTestimonial={handleUpdateTestimonial}
            onDeleteTestimonial={handleDeleteTestimonial}
            onUpdateSiteContent={handleUpdateSiteContent}
          />
      )}
    </div>
  );
};

export default App;
