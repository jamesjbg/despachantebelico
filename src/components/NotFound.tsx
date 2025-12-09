// src/components/NotFound.tsx

import React from 'react';

const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
    <h1 className="text-4xl font-bold text-red-600">404 - Página Não Encontrada</h1>
    <p className="mt-2 text-gray-600">A rota ou cliente solicitado não existe.</p>
  </div>
);

export default NotFound;