import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  faWallet,
  faHandHoldingUsd,
  faChevronDown,
  faGift,
  faTicket,
  faPlus,
  faIdCard,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../hooks/useAuth';

// Composant DropDown mis à jour
const DropDown = ({ icon, title, sublinks = [] }) => {
  const [active, setActive] = useState(false);
  const location = useLocation();

  const handleToggle = () => {
    setActive(!active);
  };

  // Détermine si un des sous-liens est actif pour garder le menu ouvert
  const isSublinkActive = sublinks.some(sublink => location.pathname === sublink.link);

  return (
    <div>
      <div
        onClick={handleToggle}
        className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors duration-200 mb-1'
      >
        <div className='w-8 h-8 flex items-center justify-center text-lg text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200'>
          <FontAwesomeIcon icon={icon} />
        </div>
        <p className='text-md font-medium flex-grow'>{title}</p>
        {sublinks.length > 0 && (
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`text-xs transition-transform duration-300 ${active || isSublinkActive ? "rotate-180" : ""}`}
          />
        )}
      </div>

      {(active || isSublinkActive) && sublinks.length > 0 && (
        <div
          className='flex flex-col pl-6 border-l-2 border-gray-200 dark:border-gray-700 mx-5 mb-2'
          role="menu"
          aria-orientation="vertical"
        >
          {sublinks.map((sublink, index) => (
            <Link
              key={index}
              to={sublink.link}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors duration-200 my-1
                         ${location.pathname === sublink.link ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              role="menuitem"
              onClick={() => setActive(false)}
            >
              {sublink.icon && <FontAwesomeIcon icon={sublink.icon} className="w-4 h-4" />}
              {sublink.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const DashSideBar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const activeLinkClass = "flex items-center gap-4 p-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold mb-2 transition-colors duration-200";
  const defaultLinkClass = "flex items-center gap-4 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 mb-2";

  return (
    <div className='flex flex-col w-[280px] py-4 px-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 fixed h-full shadow-lg transition-all duration-300 z-20 overflow-y-auto'>
      <div className='flex items-center justify-start h-16 mb-8'>
        <h1 className='text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500'>
          KombiCar-Admin
        </h1>
      </div>

      {user && (
        <div className='flex items-center gap-4 p-4 mb-6 rounded-xl bg-gray-100 dark:bg-gray-700'>
          <img
            src={user.pictureProfileUrl || "https://via.placeholder.com/40"}
            alt="User Profile"
            className='w-12 h-12 rounded-full object-cover border-2 border-blue-500'
          />
          <div className='flex flex-col'>
            <span className='font-bold text-gray-900 dark:text-gray-100 truncate'>
              {user.firstName}
            </span>
            <span className='text-sm text-gray-600 dark:text-gray-400'>
              {user.role}
            </span>
          </div>
        </div>
      )}

      <nav className='flex flex-col flex-grow space-y-2'>
        <Link
          to="/admin/dashboard"
          className={location.pathname === "/admin/dashboard" ? activeLinkClass : defaultLinkClass}
        >
          <div className='w-8 h-8 flex items-center justify-center text-lg text-gray-600 dark:text-gray-400'>
            <FontAwesomeIcon icon={faTachometerAlt} />
          </div>
          <span className='text-md font-medium'>Tableau de bord</span>
        </Link>

        <DropDown
          icon={faUsers}
          title="Utilisateurs"
          sublinks={[
            { icon: faUserTie, title: "Clients", link: "/admin/users" },
            { icon: faCar, title: "Chauffeurs", link: "/admin/drivers" },
            { icon: faUserShield, title: "Administrateurs", link: "/admin/admins" },
          ]}
        />

        <DropDown
          icon={faRoad}
          title="Trajets"
          sublinks={[
            { icon: faHourglassHalf, title: "En cours", link: `/admin/trajets/0` },
            { icon: faCalendarDay, title: "À venir", link: `/admin/trajets/2` },
            { icon: faCheckCircle, title: "Non Verifie", link: `/admin/trajets/3` },
          ]}
        />

        <DropDown
          icon={faTruck}
          title="Véhicules"
          sublinks={[
            { icon: faTags, title: "Marques", link: "/admin/cars" },
            { icon: faShapes, title: "Types", link: "/admin/cars-type" },
            { icon: faPalette, title: "Couleurs", link: "/admin/colors" },
          ]}
        />

        <DropDown
          icon={faTicket}
          title="Codes Promo"
          sublinks={[
            { icon: faCheckCircle, title: "Codes Actifs", link: `/admin/promocodes/list/active` },
            { icon: faHourglassHalf, title: "Codes Expirés", link: `/admin/promocodes/list/expired` },
            { icon: faTicket, title: "Tous les Codes", link: `/admin/promocodes/list/all` },
          ]}
        />

        {/* 🆕 MISE À JOUR : DropDown pour la gestion des retraits */}
        <DropDown
          icon={faHandHoldingUsd}
          title="Retraits"
          sublinks={[
            { icon: faHourglassHalf, title: "Demandes en attente", link: "/admin/withdrawals/pending" },
            { icon: faCalendarDay, title: "Historique complet", link: "/admin/withdrawals/history" },
            { icon: faUsers, title: "Historique par utilisateur", link: "/admin/withdrawals/user-history/example-user-id" },
          ]}
        />

        <DropDown
          icon={faIdCard}
          title="Permis de Conduire"
          sublinks={[
            { icon: faHourglassHalf, title: "En attente", link: `/admin/licences/0/1` },
            { icon: faCheckCircle, title: "Vérifiés", link: `/admin/licences/1/1` },
            { icon: faTimesCircle, title: "Rejetés", link: `/admin/licences/2/1` },
          ]}
        />

      </nav>
    </div>
  );
};

export default DashSideBar;