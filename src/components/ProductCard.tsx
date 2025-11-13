import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-base-100 rounded-lg shadow-md overflow-hidden flex flex-col transform hover:scale-105 transition-transform duration-300">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-base-content mb-2">{product.name}</h3>
        <p className="text-base-content/80 text-sm flex-grow mb-4">{product.description}</p>
        {product.showPrice ? (
          <p className="text-accent font-bold text-lg mt-auto">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
        ) : (
          <p className="text-gray-500 italic mt-auto">Preço sob consulta</p>
        )}
      </div>
    </div>
  );
};
