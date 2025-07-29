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
      <div className="flex flex-col flex-1 lg:ml-[250px]"> {/* Ajoute une marge à gauche pour laisser de la place à la sidebar */}
        {/* En-tête (Header) */}
        <DashHeader />

        {/* Contenu des Routes (Outlet) */}
        <main className="flex-1 p-6 overflow-y-auto pt-20"> {/* Ajoute un padding-top pour le header fixe */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;