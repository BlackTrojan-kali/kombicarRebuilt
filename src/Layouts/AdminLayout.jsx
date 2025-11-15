// src/layouts/AdminLayout.jsx

import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import DashSideBar from '../../components/DashSideBar';
import DashHeader from '../../components/DashHeader';
import { SidebarProvider, useSidebarContext } from '../../context/SidebarContext'; // Import du Provider et du Hook

// Composant qui utilise le contexte pour déterminer la marge
const MainContent = () => {
    const { isCollapsed } = useSidebarContext();
    
    // 💡 CORRECTION CLÉ : Ajout de 'ml-[70px]' par défaut (pour tous les écrans)
    // Et application de la marge dynamique 'lg:ml-[...]' pour les grands écrans.
    const defaultMarginClass = 'ml-[70px]'; // Marge de base pour les écrans < lg
    const dynamicMarginClass = isCollapsed ? 'lg:ml-[70px]' : 'lg:ml-[280px]';

    return (
        // Le conteneur englobant doit permettre le défilement et la croissance
        <div className={`flex-1 flex flex-col overflow-hidden w-full h-full`}>
            
            {/* 1. Header se connecte via le hook useSidebarContext */}
            {/* Si DashHeader ne gère pas de marges, il devrait être positionné correctement par rapport au Main. */}
            {/* Assurez-vous que DashHeader a une classe 'fixed top-0 w-full' OU 'sticky' et la bonne marge. */}
            <DashHeader /> 
            
            {/* 2. Contenu principal (avec la marge dynamique) */}
            <main 
                // Application de la marge par défaut et de la marge dynamique
                className={`flex-1 overflow-x-scroll h-full    pt-16 m lg:p-8 transition-all duration-300 ${defaultMarginClass} ${dynamicMarginClass} `}
            >
                {/* 💡 Outlet rend le composant de la route enfant (ex: DashboardContent) */}
                <Outlet />
            </main>
        </div>
    );
}


// Composant principal AdminLayout
const AdminLayout = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Vérification du rôle 'Admin'
        if (!loading && (!user || (user.role !== 'Admin' && user.role !== 'SUPER_ADMIN'))) {
          
        console.log(user)
            console.log("Accès refusé. Redirection vers la page de connexion.");
            navigate('/admin/signin', { replace: true });
        }
    }, [user, loading, navigate]);

    // Affiche un état de chargement
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
    if (user && (user.role === 'Admin' || user.role === 'SUPER_ADMIN')) {
        return (
            // 💡 1. ENVELOPPEMENT avec le SidebarProvider
            <SidebarProvider>
                {/* La classe 'flex' ici permet à Sidebar et MainContent de coexister côte à côte */}
                <div className="flex min-h-screen  bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
                    
                    {/* 2. Sidebar est positionnée fixed */}
                    <DashSideBar /> 

                    {/* 3. Contenu principal, qui gère le décalage (marge) */}
                    <MainContent />
                </div>
            </SidebarProvider>
        );
    }

    return null;
};

export default AdminLayout;