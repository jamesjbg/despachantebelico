// src/pages/HomePublica.tsx

import React from 'react';

const HomePublica: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Portal CAC!</h1>
            <p className="text-xl mb-6">Esta é a página pública do seu SaaS White-label.</p>
            <p className="text-sm">Para testar o dashboard, adicione ***/patriotas*** na URL.</p>
        </div>
    );
};

export default HomePublica;