import React from 'react';
import { Promotion, Product, Testimonial, SiteContent } from '../types';
import { PromotionBanner } from './PromotionBanner';
import { ProductCard } from './ProductCard';
import { AboutSection } from './AboutSection';
import { TestimonialsSection } from './TestimonialsSection';


interface HomePageProps {
  promotion: Promotion;
  products: Product[];
  testimonials: Testimonial[];
  siteContent: SiteContent;
}

export const HomePage: React.FC<HomePageProps> = ({ promotion, products, testimonials, siteContent }) => {
  return (
    <div className="w-full">
      <PromotionBanner promotion={promotion} />
      <main className="container mx-auto p-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-base-content">{siteContent.featuredProductsTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <AboutSection content={siteContent.about} />
      <TestimonialsSection testimonials={testimonials} />
    </div>
  );
};
