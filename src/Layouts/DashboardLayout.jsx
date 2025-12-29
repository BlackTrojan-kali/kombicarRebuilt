import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DashHeader from './LayoutComponents/DashHeader';
import DashSideBar from './LayoutComponents/DashSideBar';
import useAuth from '../hooks/useAuth';
import { SidebarProvider } from '../contexts/Admin/SidebarContext';
import { RoleProvider } from '../contexts/Admin/RoleContext';
import { UsersAdminContextProvider } from '../contexts/Admin/UsersAdminContext';
import { AdminSuggestionProvider } from '../contexts/Admin/AdminSuggestionsContext';

const DashboardLayout = () => {
   // Utilise le hook useAuth pour obtenir l'état de l'utilisateur et le statut de chargement.
    const { user, loading } = useAuth();
    // Hook de navigation pour les redirections.
    const navigate = useNavigate();

    // useEffect est utilisé pour vérifier l'état d'authentification et le rôle de l'utilisateur
    // à chaque fois que l'état 'user' ou 'loading' change.
    useEffect(() => {
        // La vérification doit se faire après le chargement initial de l'authentification.
        if (!loading) {
            // Si l'utilisateur n'est pas connecté ou si son rôle n'est pas 'Admin',
            // on le redirige.
            if (!user || user.role !== 'ADMIN' && user.role !== "SUPER_ADMIN") {
                console.log("Accès refusé. Redirection vers la page de connexion.");
                // 'replace: true' empêche l'utilisateur de revenir en arrière avec le bouton du navigateur.
                navigate('/admin/signin', { replace: true });
            }
        }
    }, [user, loading, navigate]); // Les dépendances assurent que le useEffect se déclenche correctement.

    // Affiche un état de chargement pendant la vérification initiale.
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-700">Chargement en cours...</p>
            </div>
        );
    }
    
  return (
    <SidebarProvider>
      <UsersAdminContextProvider>
      <RoleProvider>
      <AdminSuggestionProvider>
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Barre Latérale (Sidebar) */}
      <DashSideBar />

      {/* Contenu Principal du Tableau de Bord */}
      <div className="flex flex-col flex-1 relative"> {/* 'relative' est utile si des éléments enfants sont 'absolute' */}
        {/* En-tête (Header) */}
        <DashHeader />

        {/* Contenu des Routes (Outlet) */}
        {/*
          La classe 'pt-20' est une bonne approche si votre DashHeader a une hauteur fixe de 80px (20 * 4px).
          'overflow-y-auto' assure que seul le contenu de 'main' défile verticalement si nécessaire.
          'lg:ml-0' est ajouté ici si votre DashSideBar est positionnée de manière absolue pour les petits écrans
          et que le 'ml-[250px]' est géré par la sidebar elle-même ou un wrapper.
          Si DashSideBar est statique, le 'ml-[250px]' devrait être sur ce div ici, mais pour les grands écrans uniquement.
        */}
        <main className="flex-1 pl-12  pt-20 pb-40  md:pl-5 overflow-y-auto  lg:ml-[250px]">
          <Outlet />
        </main>
      </div>
    </div>
    </AdminSuggestionProvider>
    </RoleProvider>
    </UsersAdminContextProvider>
    </SidebarProvider>
  );
};

export default DashboardLayout;