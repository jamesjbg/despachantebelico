
import React, { useState } from 'react';
import { Testimonial } from '../types';
import { uploadImage } from '../services/storageService';
import { DiagnosticCard } from './DiagnosticCard';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { PlusIcon } from './icons/PlusIcon';

interface TestimonialsManagerProps {
  testimonials: Testimonial[];
  rawTestimonials?: any[];
  onAddTestimonial: (testimonial: Omit<Testimonial, 'id'>) => Promise<void>;
  onUpdateTestimonial: (testimonial: Testimonial) => Promise<void>;
  onDeleteTestimonial: (testimonialId: string) => Promise<void>;
}

export const TestimonialsManager: React.FC<TestimonialsManagerProps> = ({
  testimonials,
  rawTestimonials,
  onAddTestimonial,
  onUpdateTestimonial,
  onDeleteTestimonial,
}) => {
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    try {
      if (editingTestimonial.id) {
        await onUpdateTestimonial(editingTestimonial as Testimonial);
      } else {
        await onAddTestimonial(editingTestimonial as Omit<Testimonial, 'id'>);
      }
      setEditingTestimonial(null);
    } catch (error) {
      // Errors are handled in the App component
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este feedback?')) {
      try {
        await onDeleteTestimonial(id);
      } catch (error) {
         // Errors are handled in the App component
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadImage(e.target.files[0]);
        setEditingTestimonial(prev => ({ ...prev, imageUrl }));
      } catch (error) {
        alert((error as Error).message || "Erro ao carregar a imagem.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  if (editingTestimonial) {
    return (
      <form onSubmit={handleSave} className="p-4 bg-secondary/50 rounded-lg space-y-3">
        <h3 className="text-xl font-semibold">{editingTestimonial.id ? 'Editar Feedback' : 'Novo Feedback'}</h3>
        <div>
          <label className="block text-sm font-medium">Autor</label>
          <input type="text" value={editingTestimonial.author || ''} onChange={e => setEditingTestimonial(prev => ({ ...prev, author: e.target.value }))} className="mt-1 block w-full rounded-md p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Texto do Feedback</label>
          <textarea value={editingTestimonial.text || ''} onChange={e => setEditingTestimonial(prev => ({ ...prev, text: e.target.value }))} rows={4} className="mt-1 block w-full rounded-md p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Foto do Autor (Opcional)</label>
          <input type="file" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30" />
          {isUploading && <p className="text-sm text-accent mt-1">Carregando foto...</p>}
          {editingTestimonial.imageUrl && !isUploading && <img src={editingTestimonial.imageUrl} alt="preview" className="w-20 h-20 rounded-full mt-2" />}
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setEditingTestimonial(null)} className="px-4 py-2 bg-gray-300 rounded-md">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md">Salvar</button>
        </div>
      </form>
    );
  }

  // --- Advanced Diagnostics ---
  if (!Array.isArray(testimonials)) {
    return <DiagnosticCard title="Erro ao Carregar Feedbacks" type="error">
      <p>Os dados dos feedbacks não foram recebidos no formato esperado (não são uma lista). Isso pode indicar um problema de conexão ou configuração da API.</p>
    </DiagnosticCard>;
  }

  const rawCount = rawTestimonials?.length ?? 0;
  const validCount = testimonials.length;
  const malformedEntry = rawTestimonials?.find(t => !t || typeof t.id === 'undefined' || t.id === null);

  if (rawCount > validCount) {
    return <DiagnosticCard title="Alguns Feedbacks Não Foram Carregados" type="error" data={malformedEntry}>
      <p>
        Detectamos que sua tabela no Supabase tem {rawCount} linha(s), mas apenas {validCount} puderam ser carregadas.
      </p>
      <p className="mt-3">
        Isso geralmente acontece quando uma ou mais linhas na tabela <strong>'testimonials'</strong> não possuem um valor na coluna <code className="bg-red-200 text-red-900 px-1 rounded">'id'</code>. Cada feedback precisa de um 'id' único para ser exibido.
      </p>
      <p className="mt-3">
        <strong>Solução:</strong> Verifique sua tabela no Supabase e garanta que todas as linhas que você deseja exibir tenham um 'id' preenchido.
      </p>
    </DiagnosticCard>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Gerenciar Feedbacks</h3>
        <button onClick={() => setEditingTestimonial({ author: '', text: '', imageUrl: '' })} className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-md text-sm hover:opacity-90">
          <PlusIcon className="w-5 h-5" /> Adicionar
        </button>
      </div>
      {validCount > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {testimonials.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-base-100 rounded-md">
              <div className="flex items-center gap-3 overflow-hidden">
                {item.imageUrl && <img src={item.imageUrl} alt={item.author || ''} className="w-10 h-10 object-cover rounded-full flex-shrink-0" />}
                <span className="truncate">{item.author || '[Sem autor]'} - "{item.text?.substring(0, 30) || '[vazio]'}..."</span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditingTestimonial(item)} className="p-2 hover:bg-secondary rounded-full"><EditIcon /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-secondary rounded-full text-red-500"><DeleteIcon /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DiagnosticCard title="Nenhum Feedback Encontrado" type="info">
          <p>Não encontramos nenhum feedback na sua base de dados. Clique em "Adicionar" para criar o primeiro!</p>
          <p className="mt-3 text-xs">Se você já adicionou dados no Supabase e eles não aparecem, verifique se a Segurança em Nível de Linha (RLS) está desativada para a tabela `testimonials` ou se existe uma política de `SELECT` que permite a leitura dos dados.</p>
        </DiagnosticCard>
      )}
    </div>
  );
};
