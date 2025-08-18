import React from 'react';
import { Outlet } from 'react-router-dom';
import DashHeader from './LayoutComponents/DashHeader';
import DashSideBar from './LayoutComponents/DashSideBar';

const DashboardLayout = () => {
  return (
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
        <main className="flex-1 p-6 overflow-y-auto pt-20 lg:ml-[250px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;