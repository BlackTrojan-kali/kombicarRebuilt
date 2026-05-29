// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Affiche un spinner ou un écran de chargement pendant la vérification du token
    return <div className="flex justify-center items-center h-screen">Chargement sécurisé...</div>;
  }

  if (!isAuthenticated) {
    // Redirige vers le login, mais garde en mémoire la page que l'utilisateur essayait de visiter
    // (très utile pour le rediriger au bon endroit après sa connexion)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si connecté, on affiche les routes enfants (Outlet)
  return <Outlet />;
};