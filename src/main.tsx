// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './features/auth/AuthContext';
import { ThemeProvider } from './features/theme/ThemeContext'; // Ajout de l'import
import { router } from './routes/routes';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider> {/* Enveloppe toute l'app */}
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster 
          position="top-right" 
          toastOptions={{ duration: 4000 }} 
        />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);