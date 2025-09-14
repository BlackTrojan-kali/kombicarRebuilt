import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import DashSideBar from '../../components/DashSideBar';
import DashHeader from '../../components/DashHeader';

// Ce composant est un "Layout" ou une "Garde de Route"
const AdminLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'Admin') {
        console.log("Accès refusé. Redirection vers la page de connexion.");
        navigate('/admin/signin', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Affiche un état de chargement pendant la vérification initiale.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-300">
            Chargement de l'interface d'administration...
          </p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est un Admin, on rend le layout complet
  if (user && user.role === 'Admin') {
    return (
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
          <DashSideBar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashHeader onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto pt-16 p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  return null;
};

export default AdminLayout;