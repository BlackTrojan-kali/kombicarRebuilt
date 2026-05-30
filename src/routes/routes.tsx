// src/routes/routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../layouts/MainLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { EmailConfirmationPage } from '../pages/auth/EmailConfirmationPage';
import { UserProfile } from '../pages/profile/UserProfile';
import { LicenceManagementPage } from '../pages/profile/LicenceManagementPage';
import { VehiculeManagementPage } from '../pages/profile/VehiculeManagementPage';
import { PublishTripPage } from '../pages/covoiturage/PublishTripPage';

export const router = createBrowserRouter([
  // ==========================================
  // 1. ROUTES SANS HEADER NI FOOTER (Plein écran)
  // ==========================================
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
{
    // Route dynamique qui capture l'ID et le token passés par le backend dans l'email
    path: '/confirm-email/:userId/:token',
    element: <EmailConfirmationPage />,
  },
  // ==========================================
  // 2. ROUTES AVEC HEADER (Utilisent MainLayout)
  // ==========================================
  {
    element: <MainLayout />, 
    children: [
      // Routes publiques avec Header
      {
        path: '/',
        element: <div className="p-8 text-center text-text-main">Accueil Kombicar (Publique)</div>,
      },
      
      // Routes protégées avec Header
      {
        element: <ProtectedRoute />, 
        children: [
          {
            path: '/vtc',
            element: <div className="p-8 text-center text-text-main">VTC Dashboard</div>,
          },
          { path: '/covoiturage/publier', element: <PublishTripPage /> },
          {
            path: '/recherche',
            element: <div className="p-8 text-center text-text-main">Recherche Covoiturage</div>,
          },
          {
            path: '/trajets',
            element: <div className="p-8 text-center text-text-main">Mes Trajets</div>,
          },
          {
            path: '/profil',
            element: <UserProfile />,
            },
            // ---> AJOUTER CETTE LIGNE <---
          { path: '/profil/permis', element: <LicenceManagementPage /> },
          { path: '/profil/vehicules', element: <VehiculeManagementPage /> },
        ],
      },
    ],
  },

  // ==========================================
  // 3. GESTION DES ERREURS (404)
  // ==========================================
  {
    path: '*', 
    element: (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-text-muted text-lg">Cette page n'existe pas.</p>
        <a href="/" className="mt-4 text-kombi-orange-500 hover:underline">Retour à l'accueil</a>
      </div>
    ),
  },
]);