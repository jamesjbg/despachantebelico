
import React, { useState } from 'react';
import { Product, ThemeTab } from '../types';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { PlusIcon } from './icons/PlusIcon';

interface TabsManagerProps {
    tabs: ThemeTab[];
    products: Product[];
    onAddTab: (tab: Omit<ThemeTab, 'id'>) => Promise<void>;
    onUpdateTab: (tab: ThemeTab) => Promise<void>;
    onDeleteTab: (tabId: string) => Promise<void>;
}

export const TabsManager: React.FC<TabsManagerProps> = ({ tabs, products, onAddTab, onUpdateTab, onDeleteTab }) => {
    const [editingTab, setEditingTab] = useState<Partial<ThemeTab> | null>(null);

    const handleSaveTab = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTab || !editingTab.title) {
            alert("O título da aba é obrigatório.");
            return;
        };
        try {
            if (editingTab.id) {
                await onUpdateTab(editingTab as ThemeTab);
            } else {
                await onAddTab(editingTab as Omit<ThemeTab, 'id'>);
            }
            setEditingTab(null);
        } catch (error) {
            // Error is handled in App.tsx
        }
    };

    const handleDeleteTab = async (tabId: string) => {
        if (products.some(p => p.tabId === tabId)) {
            alert("Não é possível excluir esta aba, pois existem produtos associados a ela.");
            return;
        }
        if (window.confirm('Tem certeza que deseja excluir esta aba?')) {
            try {
                await onDeleteTab(tabId);
            } catch (error) {
                // Error is handled in App.tsx
            }
        }
    }

    if (editingTab) {
        return (
            <form onSubmit={handleSaveTab} className="p-4 bg-secondary/50 rounded-lg space-y-3">
                <h3 className="text-xl font-semibold">{editingTab.id ? 'Editar Aba' : 'Nova Aba'}</h3>
                <div>
                    <label className="block text-sm font-medium">Título</label>
                    <input type="text" value={editingTab.title || ''} onChange={e => setEditingTab(prev => ({ ...prev, title: e.target.value }))} className="mt-1 block w-full rounded-md p-2" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Descrição da Coleção</label>
                    <textarea value={editingTab.description || ''} onChange={e => setEditingTab(prev => ({ ...prev, description: e.target.value }))} rows={3} className="mt-1 block w-full rounded-md p-2" />
                </div>
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setEditingTab(null)} className="px-4 py-2 bg-gray-300 rounded-md">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md">Salvar</button>
                </div>
            </form>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Gerenciar Abas (Coleções)</h3>
                <button onClick={() => setEditingTab({ title: '', description: '' })} className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-md text-sm hover:opacity-90">
                    <PlusIcon className="w-5 h-5" /> Adicionar Aba
                </button>
            </div>
            <div className="space-y-2">
                {tabs.map(tab => (
                    <div key={tab.id} className="flex items-center justify-between p-2 bg-base-100 rounded-md">
                        <span>{tab.title}</span>
                        <div className="flex gap-2">
                            {tab.id !== 'home' && ( // Prevent editing/deleting home tab
                                <>
                                    <button onClick={() => setEditingTab(tab)} className="p-2 hover:bg-secondary rounded-full"><EditIcon /></button>
                                    <button onClick={() => handleDeleteTab(tab.id)} className="p-2 hover:bg-secondary rounded-full text-red-500"><DeleteIcon /></button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};
