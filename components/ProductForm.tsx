
import React, { useState, useEffect } from 'react';
import { Product, ThemeTab } from '../types';
import { generateDescription } from '../services/geminiService';
import { uploadImage } from '../services/storageService';
import { GenerateIcon } from './icons/GenerateIcon';

interface ProductFormProps {
  product: Product | null;
  tabs: ThemeTab[];
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const newProductTemplate: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  showPrice: true,
  imageUrl: '',
  tabId: '',
};

export const ProductForm: React.FC<ProductFormProps> = ({ product, tabs, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>(newProductTemplate);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData(newProductTemplate);
    }
  }, [product]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadImage(e.target.files[0]);
        setFormData(prev => ({ ...prev, imageUrl }));
      } catch (error) {
        console.error("Error uploading file", error);
        alert((error as Error).message || "Erro ao carregar a imagem.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
        setFormData((prev) => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    }
  };
  
  const handleGenerateDescription = async () => {
    if (!formData.name) {
      alert('Por favor, insira um nome para o produto primeiro.');
      return;
    }
    setIsGenerating(true);
    const description = await generateDescription(formData.name);
    setFormData(prev => ({ ...prev, description }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tabId) {
        alert("Por favor, selecione uma aba para o produto.");
        return;
    }
     if (!formData.imageUrl) {
        alert("Por favor, adicione uma imagem para o produto.");
        return;
    }
    onSave({
      ...formData,
      id: product?.id || new Date().toISOString(),
    });
  };
  
  const availableTabs = tabs.filter(t => t.id !== 'home');

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-secondary/50 rounded-lg">
      <h3 className="text-xl font-semibold">{product ? 'Editar Produto' : 'Adicionar Produto'}</h3>
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Nome do Produto</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">Descrição</label>
        <div className="relative">
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 pr-10" />
          <button 
            type="button" 
            onClick={handleGenerateDescription} 
            disabled={isGenerating}
            className="absolute top-2 right-2 p-1 text-accent rounded-full hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Gerar descrição com IA"
          >
            {isGenerating ? 
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div> : 
              <GenerateIcon />
            }
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium">Imagem do Produto</label>
        <input type="file" name="image" id="image" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30"/>
        {isUploading && <p className="text-sm text-accent">Carregando imagem...</p>}
        {formData.imageUrl && !isUploading && (
            <img src={formData.imageUrl} alt="Preview" className="mt-2 rounded-md h-24 w-24 object-cover"/>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium">Preço (R$)</label>
          <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} step="0.01" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2" />
        </div>
        <div>
          <label htmlFor="tabId" className="block text-sm font-medium">Aba Temática</label>
          <select name="tabId" id="tabId" value={formData.tabId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2">
            <option value="">Selecione...</option>
            {availableTabs.map(tab => (
              <option key={tab.id} value={tab.id}>{tab.title}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center">
        <input type="checkbox" name="showPrice" id="showPrice" checked={formData.showPrice} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent" />
        <label htmlFor="showPrice" className="ml-2 block text-sm">Exibir Preço</label>
      </div>
      <div className="flex justify-end gap-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:opacity-90">Salvar</button>
      </div>
    </form>
  );
};