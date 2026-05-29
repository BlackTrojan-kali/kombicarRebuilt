// src/routes/routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Idéalement, importe tes pages depuis src/pages/
// (Ici je mets des composants fictifs pour l'exemple)
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { VtcDashboard } from '../pages/vtc/VtcDashboard';
import { CovoiturageSearch } from '../pages/covoiturage/CovoiturageSearch';
import { UserProfile } from '../pages/profil/UserProfile';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  // --- ROUTES PUBLIQUES ---
  {
    path: '/',
    element: <div>Page d'accueil publique (Landing Page)</div>,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  
  // --- ROUTES PROTÉGÉES ---
  // On enveloppe un groupe de routes avec notre composant ProtectedRoute
  {
    element: <ProtectedRoute />, 
    children: [
      {
        path: '/vtc',
        element: <VtcDashboard />,
      },
      {
        path: '/covoiturage',
        element: <CovoiturageSearch />,
      },
      {
        path: '/profil',
        element: <UserProfile />,
      }
    ],
  },

  // --- GESTION DES ERREURS (404) ---
  {
    path: '*', // Capture toutes les URL qui ne correspondent à rien
    element: <NotFoundPage />,
  },
]);