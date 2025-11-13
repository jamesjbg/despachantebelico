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
  INITIAL_PRODUCTS, 
  INITIAL_PROMOTION, 
  INITIAL_TABS, 
  COLOR_PALETTES, 
  INITIAL_TESTIMONIALS, 
  INITIAL_SITE_CONTENT,
  ADMIN_USERNAME,
  ADMIN_PASSWORD
} from './constants';


const App: React.FC = () => {
  // Main data states loaded from Supabase or initial constants
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [promotion, setPromotion] = useState<Promotion>(INITIAL_PROMOTION);
  const [tabs, setTabs] = useState<ThemeTab[]>(INITIAL_TABS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
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
            const homeTab = INITIAL_TABS.find(t => t.id === 'home')!;
            const otherTabs = data.tabs.filter(t => t.id !== 'home');
            setTabs([homeTab, ...otherTabs]);
            setTestimonials(data.testimonials);
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

  // --- CRUD Handlers with Error Handling ---
  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct = await dataService.addProduct(productData);
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };
  const handleUpdateProduct = async (product: Product) => {
    try {
      const updatedProduct = await dataService.updateProduct(product);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };
  const handleDeleteProduct = async (productId: string) => {
    try {
      await dataService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  const handleUpdatePromotion = async (promo: Promotion) => {
    try {
      const updatedPromotion = await dataService.updatePromotion(promo);
      setPromotion(updatedPromotion);
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };
  
  const handleAddTab = async (tabData: Omit<ThemeTab, 'id'>) => {
    try {
      const newTab = await dataService.addTab(tabData);
      setTabs(prev => [...prev, newTab]);
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };
  const handleUpdateTab = async (tab: ThemeTab) => {
    try {
      const updatedTab = await dataService.updateTab(tab);
      setTabs(prev => prev.map(t => t.id === updatedTab.id ? updatedTab : t));
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };
  const handleDeleteTab = async (tabId: string) => {
    try {
      await dataService.deleteTab(tabId);
      setTabs(prev => prev.filter(t => t.id !== tabId));
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  const handleUpdatePalette = async (palette: ColorPalette) => {
    try {
      const updatedPalette = await dataService.updateTheme(palette);
      setCurrentPalette(updatedPalette);
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  const handleAddTestimonial = async (testimonialData: Omit<Testimonial, 'id'>) => {
    try {
      const newTestimonial = await dataService.addTestimonial(testimonialData);
      setTestimonials(prev => [...prev, newTestimonial]);
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };
  const handleUpdateTestimonial = async (testimonial: Testimonial) => {
    try {
      const updatedTestimonial = await dataService.updateTestimonial(testimonial);
      setTestimonials(prev => prev.map(t => t.id === updatedTestimonial.id ? updatedTestimonial : t));
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };
  const handleDeleteTestimonial = async (testimonialId: string) => {
    try {
      await dataService.deleteTestimonial(testimonialId);
      setTestimonials(prev => prev.filter(t => t.id !== testimonialId));
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };
  
  const handleUpdateSiteContent = async (content: SiteContent) => {
    try {
      const updatedContent = await dataService.updateSiteContent(content);
      setSiteContent(updatedContent);
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };


  const renderContent = () => {
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
  
  if (isLoading) {
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
            tabs={tabs.filter(t => t.id !== 'home')}
            palettes={COLOR_PALETTES}
            currentPalette={currentPalette}
            testimonials={testimonials}
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