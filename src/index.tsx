// FIX: Replaced the failing triple-slash directive for "vite/client" with a manual global
// declaration for `import.meta.env`. This resolves errors related to Vite's environment
// variables across the project.
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_KEY: string;
      readonly VITE_SUPABASE_URL: string;
      readonly VITE_SUPABASE_ANON_KEY: string;
    }
  }
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
