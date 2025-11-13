
import React, { useState, useEffect } from 'react';
import { Promotion, SiteContent } from '../types';
import { uploadImage } from '../services/storageService';

interface HomepageManagerProps {
    promotion: Promotion;
    siteContent: SiteContent;
    onUpdatePromotion: (promotion: Promotion) => Promise<void>;
    onUpdateSiteContent: (content: SiteContent) => Promise<void>;
}

export const HomepageManager: React.FC<HomepageManagerProps> = ({ promotion, siteContent, onUpdatePromotion, onUpdateSiteContent }) => {
    const [editablePromo, setEditablePromo] = useState(promotion);
    const [editableContent, setEditableContent] = useState(siteContent);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingPromo, setIsUploadingPromo] = useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);

    useEffect(() => {
        setEditablePromo(promotion);
        setEditableContent(siteContent);
    }, [promotion, siteContent]);

    const handlePromoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploadingPromo(true);
            try {
                const imageUrl = await uploadImage(e.target.files[0]);
                setEditablePromo(p => ({ ...p, imageUrl }));
            } catch (error) {
                alert((error as Error).message || "Erro ao carregar a imagem.");
            } finally {
                setIsUploadingPromo(false);
            }
        }
    }

    const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploadingLogo(true);
            try {
                const logoUrl = await uploadImage(e.target.files[0]);
                setEditableContent(c => ({ ...c, logoUrl }));
            } catch (error) {
                alert((error as Error).message || "Erro ao carregar a imagem.");
            } finally {
                setIsUploadingLogo(false);
            }
        }
    }

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            await Promise.all([
                onUpdatePromotion(editablePromo),
                onUpdateSiteContent(editableContent)
            ]);
            alert("Alterações salvas com sucesso!");
        } catch (error) {
            console.error("Failed to save homepage changes", error);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold mb-2">Configurações Gerais</h3>
                <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
                    <div>
                        <label className="block text-sm font-medium">Nome da Empresa</label>
                        <input type="text" value={editableContent.companyName} onChange={e => setEditableContent(c => ({ ...c, companyName: e.target.value }))} className="mt-1 block w-full rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Número do WhatsApp</label>
                        <input type="text" placeholder="Ex: 5569992079671" value={editableContent.whatsappNumber || ''} onChange={e => setEditableContent(c => ({ ...c, whatsappNumber: e.target.value }))} className="mt-1 block w-full rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Mensagem Padrão do WhatsApp</label>
                        <textarea
                            value={editableContent.whatsappMessage || ''}
                            onChange={e => setEditableContent(c => ({ ...c, whatsappMessage: e.target.value }))}
                            rows={2}
                            className="mt-1 block w-full rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Logo do Site</label>
                        <input type="file" onChange={handleLogoFileChange} accept="image/*" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30" />
                        {isUploadingLogo && <p className="text-sm text-accent mt-1">Carregando logo...</p>}
                        {editableContent.logoUrl && !isUploadingLogo && <img src={editableContent.logoUrl} alt="preview" className="w-32 mt-2 p-2 bg-gray-300 rounded" />}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Título da Seção de Destaques</label>
                        <input type="text" value={editableContent.featuredProductsTitle} onChange={e => setEditableContent(c => ({ ...c, featuredProductsTitle: e.target.value }))} className="mt-1 block w-full rounded-md p-2" />
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">Banner da Promoção</h3>
                <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
                    <div>
                        <label className="block text-sm font-medium">Título</label>
                        <input type="text" value={editablePromo.title} onChange={e => setEditablePromo(p => ({ ...p, title: e.target.value }))} className="mt-1 block w-full rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Descrição</label>
                        <textarea value={editablePromo.description} onChange={e => setEditablePromo(p => ({ ...p, description: e.target.value }))} rows={3} className="mt-1 block w-full rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Imagem de Fundo</label>
                        <input type="file" onChange={handlePromoFileChange} accept="image/*" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30" />
                        {isUploadingPromo && <p className="text-sm text-accent mt-1">Carregando imagem...</p>}
                        {editablePromo.imageUrl && !isUploadingPromo && <img src={editablePromo.imageUrl} alt="preview" className="w-48 mt-2 rounded" />}
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">Seção "Sobre Nós"</h3>
                <div className="p-4 bg-secondary/50 rounded-lg">
                    <textarea value={editableContent.about} onChange={e => setEditableContent(c => ({ ...c, about: e.target.value }))} rows={6} className="mt-1 block w-full rounded-md p-2" />
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="px-4 py-2 bg-accent text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-wait"
                    aria-busy={isSaving}
                >
                    {isSaving ? 'Salvando...' : 'Salvar Alterações da Homepage'}
                </button>
            </div>
        </div>
    );
};
