
import React, { useState } from 'react';
import { Product, ThemeTab } from '../types';
import { ProductForm } from './ProductForm';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { PlusIcon } from './icons/PlusIcon';

interface ProductsManagerProps {
    products: Product[];
    tabs: ThemeTab[];
    onAddProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    onUpdateProduct: (product: Product) => Promise<void>;
    onDeleteProduct: (productId: string) => Promise<void>;
}

export const ProductsManager: React.FC<ProductsManagerProps> = ({ products, tabs, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleSaveProduct = async (productToSave: Product) => {
        try {
            if (editingProduct) {
                await onUpdateProduct(productToSave);
            } else {
                const { id, ...newProduct } = productToSave;
                await onAddProduct(newProduct);
            }
            setIsFormVisible(false);
            setEditingProduct(null);
        } catch (error) {
            // Error is handled in App.tsx
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await onDeleteProduct(productId);
            } catch (error) {
                // Error is handled in App.tsx
            }
        }
    };

    const handleAddNewProduct = () => {
        setEditingProduct(null);
        setIsFormVisible(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsFormVisible(true);
    };

    if (isFormVisible) {
        return <ProductForm product={editingProduct} tabs={tabs} onSave={handleSaveProduct} onCancel={() => setIsFormVisible(false)} />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Gerenciar Produtos</h3>
                <button onClick={handleAddNewProduct} className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-md text-sm hover:opacity-90">
                    <PlusIcon className="w-5 h-5" /> Adicionar
                </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {products.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 bg-base-100 rounded-md">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded flex-shrink-0" />
                            <span className="truncate">{p.name}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEditProduct(p)} className="p-2 hover:bg-secondary rounded-full"><EditIcon /></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-2 hover:bg-secondary rounded-full text-red-500"><DeleteIcon /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
