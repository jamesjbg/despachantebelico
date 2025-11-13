
import React, { useState } from 'react';
import { Product, Promotion, ThemeTab, ColorPalette, Testimonial, SiteContent } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { ThemeSwitcher } from './ThemeSwitcher';
import { TestimonialsManager } from './TestimonialsManager';
import { ProductsManager } from './ProductsManager';
import { HomepageManager } from './HomepageManager';
import { TabsManager } from './TabsManager';


interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  promotion: Promotion;
  tabs: ThemeTab[];
  palettes: ColorPalette[];
  currentPalette: ColorPalette;
  testimonials: Testimonial[];
  rawTestimonials?: any[]; 
  siteContent: SiteContent;
  onAddProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  onUpdateProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onUpdatePromotion: (promotion: Promotion) => Promise<void>;
  onAddTab: (tab: Omit<ThemeTab, 'id'>) => Promise<void>;
  onUpdateTab: (tab: ThemeTab) => Promise<void>;
  onDeleteTab: (tabId: string) => Promise<void>;
  onUpdatePalette: (palette: ColorPalette) => Promise<void>;
  onAddTestimonial: (testimonial: Omit<Testimonial, 'id'>) => Promise<void>;
  onUpdateTestimonial: (testimonial: Testimonial) => Promise<void>;
  onDeleteTestimonial: (testimonialId: string) => Promise<void>;
  onUpdateSiteContent: (content: SiteContent) => Promise<void>;
}

type AdminSection = 'products' | 'homepage' | 'tabs' | 'testimonials' | 'theme';

export const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const { isOpen, onClose, ...rest } = props;
  
  const [activeSection, setActiveSection] = useState<AdminSection>('products');
  
  if (!isOpen) return null;

  const renderSection = () => {
    switch (activeSection) {
      case 'products': 
        return <ProductsManager 
                products={rest.products}
                tabs={rest.tabs.filter(t => t.id !== 'home')}
                onAddProduct={rest.onAddProduct}
                onUpdateProduct={rest.onUpdateProduct}
                onDeleteProduct={rest.onDeleteProduct}
               />;
      case 'homepage': 
        return <HomepageManager
                promotion={rest.promotion}
                siteContent={rest.siteContent}
                onUpdatePromotion={rest.onUpdatePromotion}
                onUpdateSiteContent={rest.onUpdateSiteContent}
               />;
      case 'tabs': 
        return <TabsManager 
                tabs={rest.tabs}
                products={rest.products}
                onAddTab={rest.onAddTab}
                onUpdateTab={rest.onUpdateTab}
                onDeleteTab={rest.onDeleteTab}
                />;
      case 'testimonials': 
        return <TestimonialsManager 
                testimonials={rest.testimonials}
                rawTestimonials={rest.rawTestimonials}
                onAddTestimonial={rest.onAddTestimonial}
                onUpdateTestimonial={rest.onUpdateTestimonial}
                onDeleteTestimonial={rest.onDeleteTestimonial}
               />;
      case 'theme': 
        return <ThemeSwitcher 
                palettes={rest.palettes} 
                currentPalette={rest.currentPalette} 
                onPaletteChange={rest.onUpdatePalette} 
               />;
      default: return null;
    }
  };

  const SectionButton: React.FC<{ sectionId: AdminSection, children: React.ReactNode }> = ({ sectionId, children }) => (
    <button
      onClick={() => setActiveSection(sectionId)}
      className={`px-4 py-2 rounded-t-lg text-sm md:text-base ${activeSection === sectionId ? 'bg-base-100 text-accent font-semibold' : 'bg-secondary'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Painel do Administrador</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary"><CloseIcon /></button>
        </div>
        <div className="flex border-b flex-wrap">
          <SectionButton sectionId="products">Produtos</SectionButton>
          <SectionButton sectionId="homepage">Homepage</SectionButton>
          <SectionButton sectionId="tabs">Abas</SectionButton>
          <SectionButton sectionId="testimonials">Feedbacks</SectionButton>
          <SectionButton sectionId="theme">Tema</SectionButton>
        </div>
        <div className="p-4 overflow-y-auto">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};
