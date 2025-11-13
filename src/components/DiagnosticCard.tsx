
import React from 'react';

interface DiagnosticCardProps {
  title: string;
  type: 'info' | 'error';
  data?: any;
  children: React.ReactNode;
}

export const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ title, type, data, children }) => {
  const baseClasses = "text-left p-4 rounded-lg border";
  const typeClasses = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <div className="text-sm space-y-2">
        {children}
      </div>
      {data && (
        <div className="mt-4">
          <p className="text-xs font-semibold mb-1">Exemplo de dados recebidos:</p>
          <pre className="block bg-gray-800 text-white p-2 rounded text-xs mt-1 overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
