import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import DashSideBar from '../../components/DashSideBar';
import DashHeader from '../../components/DashHeader';

// Ce composant est un "Layout" ou une "Garde de Route"
const AdminLayout = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    
    // 💡 L'état `isCollapsed` remplacera `isSidebarOpen` 
    // et sera passé aux enfants pour synchroniser leur affichage.
    const [isCollapsed, setIsCollapsed] = useState(false); 

    // Définition de la largeur de la sidebar pour les classes dynamiques
    const sidebarWidth = isCollapsed ? '70px' : '280px';
    
    // Calcul de la marge gauche (padding-left) du contenu principal.
    // Cette classe est appliquée uniquement sur les grands écrans (lg)
    const contentMarginClass = isCollapsed ? 'lg:ml-[70px]' : 'lg:ml-[280px]';

    useEffect(() => {
        // Vérification du rôle 'Admin'. Notez l'ajout de `!loading` pour éviter la redirection prématurée.
        if (!loading && (!user || (user.role !== 'Admin' && user.role !== 'SUPER_ADMIN'))) {
            console.log("Accès refusé. Redirection vers la page de connexion.");
            navigate('/admin/signin', { replace: true });
        }
    }, [user, loading, navigate]);

    // Fonction passée à DashHeader pour contrôler l'état de la sidebar
    const toggleSidebar = () => {
        setIsCollapsed(prev => !prev);
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
    if (user && (user.role === 'Admin' || user.role === 'SUPER_ADMIN')) {
        return (
            <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
                
                {/* 1. Sidebar (Position fixe, affichage conditionnel) */}
                {/* NOTE: On utilise l'état isCollapsed directement dans la SideBar, qui gère elle-même son "translate-x" interne */}
                <DashSideBar 
                    isCollapsed={isCollapsed} 
                    setIsCollapsed={setIsCollapsed} // Permet à DashSideBar de gérer son propre toggle si désiré (comme le bouton interne)
                />

                <div className={`flex-1 flex flex-col overflow-hidden w-full`}>
                    
                    {/* 2. Header (Position fixe, ajustement de la largeur géré en interne via son propre hook ou contexte) */}
                    {/* J'ai supprimé la prop onToggleSidebar car DashHeader doit se connecter à l'état isCollapsed. */}
                    {/* Le DashHeader doit simplement se positionner et se dimensionner en fonction de l'état "isCollapsed" de la SideBar (voir ma réponse précédente) */}
                    <DashHeader isSidebarCollapsed={isCollapsed} /> 
                    
                    {/* 3. Contenu principal (avec la marge dynamique) */}
                    <main 
                        className={`flex-1 overflow-x-hidden overflow-y-auto pt-16 p-6 lg:p-8 transition-all duration-300 ${contentMarginClass}`}
                    >
                        <Outlet />
                    </main>
                </div>
            </div>
        );
    }

    // Retourne null si la vérification est terminée et l'utilisateur n'est pas autorisé
    return null;
};

export default AdminLayout;