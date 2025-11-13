
import React from 'react';
import { Promotion } from '../types';

interface PromotionBannerProps {
  promotion: Promotion;
}

export const PromotionBanner: React.FC<PromotionBannerProps> = ({ promotion }) => {
  if (!promotion || !promotion.active) {
    return null;
  }

  return (
    <section className="relative w-full h-64 md:h-80 bg-gray-400 text-white mb-8">
      <img 
        src={promotion.imageUrl} 
        alt={promotion.title} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-4">
        <h2 className="text-2xl md:text-4xl font-bold drop-shadow-md">{promotion.title}</h2>
        <p className="mt-2 max-w-2xl drop-shadow-md">{promotion.description}</p>
      </div>
    </section>
  );
};
