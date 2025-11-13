import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginAttempt: (user: string, pass: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginAttempt }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginAttempt(username, password);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-2 right-2 p-2 rounded-full hover:bg-secondary" aria-label="Fechar modal de login">
            <CloseIcon />
        </button>
        <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Acesso Restrito</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium">Usuário</label>
                    <input 
                        type="text" 
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 bg-secondary/50" 
                    />
                </div>
                 <div>
                    <label htmlFor="password-login" className="block text-sm font-medium">Senha</label>
                    <input 
                        type="password" 
                        id="password-login"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 bg-secondary/50" 
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full px-4 py-2 bg-accent text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                >
                    Entrar
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};
