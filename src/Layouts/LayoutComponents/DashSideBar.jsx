import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faUsers,
  faUserTie,
  faCar,
  faUserShield,
  faUserCircle,
  faRoad,
  faHourglassHalf,
  faCalendarDay,
  faCheckCircle,
  faTruck,
  faTags,
  faShapes,
  faPalette,
  faWallet, // Nouvelle icône pour le portefeuille
  faHandHoldingUsd, // Icône pour les demandes de paiement
} from '@fortawesome/free-solid-svg-icons';
import DropDown from './DropDown';
import useAuth from '../../hooks/useAuth';

const DashSideBar = () => {
  const { user } = useAuth();

  return (
    <div className='flex flex-col w-[250px] py-4 overflow-x-scroll px-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 fixed h-full shadow-lg transition-all duration-300 z-20'>
      {/* Logo ou Titre du Tableau de Bord */}
      <div className='flex items-center justify-center h-16 mb-6'>
        <h1 className='text-3xl font-extrabold text-blue-600 dark:text-blue-400 text-center'>
          KombiCar-Admin
        </h1>
      </div>

      {/* Section de l'utilisateur connecté */}
      {user && (
        <div className='flex items-center gap-3 p-4 mb-6 rounded-lg bg-gray-100 dark:bg-gray-700'>
          <img
            src={user.profilePicture || "https://via.placeholder.com/40"}
            alt="User Profile"
            className='w-10 h-10 rounded-full object-cover border-2 border-blue-500'
          />
          <div className='flex flex-col'>
            <span className='font-semibold text-gray-900 dark:text-gray-100 truncate'>
              {user.username}
            </span>
            <span className='text-sm text-gray-600 dark:text-gray-400'>
   
            </span>
          </div>
        </div>
      )}

      {/* Lien vers le Tableau de Bord (Dashboard) */}
      <Link
        to="/admin/dashboard"
        className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 mb-2'
      >
        <FontAwesomeIcon icon={faTachometerAlt} className='text-xl' />
        <span className='text-lg font-medium'>Tableau de bord</span>
      </Link>

      {/* Dropdown pour les Utilisateurs */}
      <DropDown
        icon={faUsers}
        title="Utilisateurs"
        sublinks={[
          { icon: faUserTie, title: "Clients", link: "/admin/users" },
          { icon: faCar, title: "Chauffeurs", link: "/admin/drivers" },
          { icon: faUserShield, title: "Administrateurs", link: "/admin/admins" },
        ]}
      />

      {/* Dropdown pour les Trajets */}
      <DropDown
        icon={faRoad}
        title="Trajets"
        sublinks={[
          { icon: faHourglassHalf, title: "En cours", link: "/admin/trajets" },
          { icon: faCalendarDay, title: "À venir", link: "/admin/trajets" },
          { icon: faCheckCircle, title: "Effectuées", link: "/admin/trajets" },
        ]}
      />

      {/* Dropdown pour les Véhicules */}
      <DropDown
        icon={faTruck}
        title="Véhicules"
        sublinks={[
          { icon: faTags, title: "Marques", link: "/admin/cars" },
          { icon: faShapes, title: "Types", link: "/admin/cars-type" },
          { icon: faPalette, title: "Couleurs", link: "/admin/colors" },
        ]}
      />

      {/* Nouveau Dropdown pour le Portefeuille */}
      <DropDown
        icon={faWallet} // Icône générale pour le portefeuille
        title="Portefeuille"
        sublinks={[
          { icon: faUserCircle, title: "Portefeuille utilisateurs", link: "/admin/wallets" },
          { icon: faHandHoldingUsd, title: "Demandes de paiement", link: "/dashboard/wallet/payment-requests" },
        ]}
      />

      {/* Autres DropDowns ou liens peuvent être ajoutés ici */}
    </div>
  );
};

export default DashSideBar;