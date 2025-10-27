import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faUsers,
  faUserTie,
  faCar,
  faUserShield,
  faRoad,
  faHourglassHalf,
  faCalendarDay,
  faCheckCircle,
  faTruck,
  faTags,
  faTicket,
  faChevronDown,
  faIdCard,
  faTimesCircle,
  faHandHoldingUsd,
  faGlobeAfrica,
  faBell,
  faBellConcierge,
} from '@fortawesome/free-solid-svg-icons';

import useAuth from '../../hooks/useAuth';
import useColorScheme from '../../hooks/useColorScheme';
import useUser from '../../hooks/useUser';
import { toast } from 'sonner';
import { useSidebarContext } from '../../contexts/SidebarContext';

// ###################################################
// Liste des pays disponibles
// ###################################################
const COUNTRIES = {
  OTHERS: { code: 0, name: 'International' },
  CM: { code: 237, name: 'Cameroun' },
  CI: { code: 225, name: "Côte d'Ivoire" },
  SN: { code: 221, name: 'Sénégal' },
  CD: { code: 243, name: 'RDC' },
  ML: { code: 223, name: 'Mali' },
  BJ: { code: 229, name: 'Bénin' },
  TG: { code: 228, name: 'Togo' },
  GN: { code: 224, name: 'Guinée' },
  BF: { code: 226, name: 'Burkina Faso' },
  FR: { code: 33, name: 'France' },
};

// Génère un avatar SVG avec initiales
const generateInitialsSvg = (firstName, lastName, theme) => {
  const initials = `${firstName?.charAt(0) || '?'}${lastName?.charAt(0) || '?'}`.toUpperCase();
  const bgColor = theme === 'dark' ? '#374151' : '#E5E7EB';
  const textColor = theme === 'dark' ? '#F9FAFB' : '#1F2937';

  const svg = `<svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="150" height="150" rx="75" fill="${bgColor}"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="60" font-weight="bold" fill="${textColor}">
      ${initials}
    </text>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// ----------------------------------------------------------------------
// DropDown Menu
// ----------------------------------------------------------------------
const DropDown = ({ icon, title, sublinks = [], isCollapsed }) => {
  const [active, setActive] = useState(false);
  const location = useLocation();

  const toggleDropdown = () => {
    if (!isCollapsed) setActive(!active);
  };

  const isSublinkActive = sublinks.some(s => location.pathname === s.link);
  const isOpen = active || isSublinkActive;

  if (isCollapsed) {
    return (
      <Link
        to={sublinks[0]?.link || '#'}
        title={title}
        className="flex items-center justify-center w-full h-14 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mb-1"
      >
        <FontAwesomeIcon icon={icon} className="text-2xl" />
      </Link>
    );
  }

  return (
    <div>
      <div
        onClick={toggleDropdown}
        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 mb-1"
      >
        <FontAwesomeIcon icon={icon} className="text-lg text-gray-600 dark:text-gray-400" />
        <p className="text-md font-medium flex-grow">{title}</p>
        {sublinks.length > 0 && (
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </div>

      {isOpen && sublinks.length > 0 && (
        <div className="flex flex-col pl-6 border-l-2 border-gray-200 dark:border-gray-700 mx-4 mb-2">
          {sublinks.map((s, i) => (
            <Link
              key={i}
              to={s.link}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md my-1 transition-colors duration-200 ${
                location.pathname === s.link
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {s.icon && <FontAwesomeIcon icon={s.icon} className="w-4 h-4" />}
              {s.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// Sélecteur de pays (admins uniquement)
// ----------------------------------------------------------------------
const CountrySwitcher = ({ isCollapsed }) => {
  const { user, setUser, refreshAdminToken } = useAuth();
  const { updateAdminCountryAccess } = useUser();
  const [active, setActive] = useState(false);

  const currentCode = user?.adminAccesCountry || COUNTRIES.OTHERS.code;
  const currentCountry = Object.values(COUNTRIES).find(c => c.code === currentCode);

  const handleChange = async (newCode) => {
    if (!user || !user.role.includes('Admin')) return;
    setActive(false);
    try {
      await updateAdminCountryAccess(user.id, newCode);
      setUser(prev => ({ ...prev, adminAccesCountry: newCode }));
      await refreshAdminToken(localStorage.getItem('refreshToken'));
      toast.success(`Pays d'accès mis à jour : ${COUNTRIES[newCode]?.name}`);
    } catch {
      toast.error('Erreur lors du changement de pays.');
    }
  };

  if (isCollapsed) {
    return (
      <div className="flex justify-center items-center h-14 mb-4">
        <FontAwesomeIcon icon={faGlobeAfrica} className="text-2xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div
        onClick={() => setActive(!active)}
        className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer"
      >
        <FontAwesomeIcon icon={faGlobeAfrica} className="text-blue-600" />
        <span className="flex-grow text-sm font-semibold">
          {currentCountry?.name || 'International'}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-xs transition-transform duration-300 ${active ? 'rotate-180' : ''}`}
        />
      </div>

      {active && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-inner mt-2 max-h-60 overflow-y-auto">
          {Object.values(COUNTRIES).map((c) => (
            <button
              key={c.code}
              onClick={() => handleChange(c.code)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                c.code === currentCode
                  ? 'bg-blue-50 dark:bg-blue-800 text-blue-600 font-semibold'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// COMPOSANT PRINCIPAL : DashSideBar
// ----------------------------------------------------------------------
const DashSideBar = () => {
  const { user, API_URL } = useAuth();
  const { theme } = useColorScheme();
  const location = useLocation();
  const { isCollapsed, setIsCollapsed } = useSidebarContext();

  const isAdmin = user?.role?.includes('Admin') || user?.role?.includes('SUPER_ADMIN');

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  const activeLinkClass = `flex items-center gap-4 p-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold mb-2 ${
    isCollapsed ? 'justify-center' : ''
  }`;
  const defaultLinkClass = `flex items-center gap-4 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 mb-2 transition-colors duration-200 ${
    isCollapsed ? 'justify-center' : ''
  }`;

  const SidebarLink = ({ to, icon, title }) => (
    <Link
      to={to}
      title={title}
      className={location.pathname === to ? activeLinkClass : defaultLinkClass}
    >
      <FontAwesomeIcon icon={icon} className={`${isCollapsed ? 'text-2xl' : 'text-lg'}`} />
      {!isCollapsed && <span className="text-md font-medium">{title}</span>}
    </Link>
  );

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col z-50 overflow-y-auto ${
        isCollapsed ? 'w-[70px] items-center' : 'w-[280px] items-start'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 w-full">
        {!isCollapsed && (
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            KombiCar
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`text-xl transition-transform duration-300 ${
              isCollapsed ? '-rotate-90' : 'rotate-90'
            }`}
          />
        </button>
      </div>

      {/* User */}
      {user && (
        <div
          className={`flex items-center gap-4 p-4 mb-6 rounded-xl bg-gray-100 dark:bg-gray-700 w-full ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <img
            src={
              user.pictureProfileUrl
                ? `${API_URL}${user.pictureProfileUrl}`
                : generateInitialsSvg(user.firstName, user.lastName, theme)
            }
            alt="Profil"
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
          />
          {!isCollapsed && (
            <div>
              <p className="font-bold text-gray-900 dark:text-gray-100">{user.firstName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.role}</p>
            </div>
          )}
        </div>
      )}

      {/* Country Switcher */}
      {isAdmin && <CountrySwitcher isCollapsed={isCollapsed} />}

      {/* Menu */}
      <nav className="flex flex-col flex-grow px-3 space-y-2">
        <SidebarLink to="/admin/dashboard" icon={faTachometerAlt} title="Tableau de bord" />

        <DropDown
          icon={faUsers}
          title="Utilisateurs"
          isCollapsed={isCollapsed}
          sublinks={[
            { icon: faUserTie, title: 'Clients', link: '/admin/users' },
            { icon: faCar, title: 'Chauffeurs', link: '/admin/drivers' },
            { icon: faUserShield, title: 'Administrateurs', link: '/admin/admins' },
          ]}
        />

        <DropDown
          icon={faRoad}
          title="Trajets"
          isCollapsed={isCollapsed}
          sublinks={[
            { icon: faHourglassHalf, title: 'Publiés', link: '/admin/trajets/0' },
            { icon: faCalendarDay, title: 'Terminés', link: '/admin/trajets/2' },
            { icon: faCheckCircle, title: 'Non vérifiés', link: '/admin/trajets/3' },
          ]}
        />

        <DropDown
          icon={faTruck}
          title="Véhicules"
          isCollapsed={isCollapsed}
          sublinks={[{ icon: faTags, title: 'Véhicules', link: '/admin/cars' }]}
        />

        <DropDown
          icon={faTicket}
          title="Codes Promo"
          isCollapsed={isCollapsed}
          sublinks={[
            { icon: faCheckCircle, title: 'Actifs', link: '/admin/promocodes/list/active' },
            { icon: faHourglassHalf, title: 'Expirés', link: '/admin/promocodes/list/expired' },
            { icon: faTicket, title: 'Tous', link: '/admin/promocodes/list/all' },
          ]}
        />

        <DropDown
          icon={faHandHoldingUsd}
          title="Retraits"
          isCollapsed={isCollapsed}
          sublinks={[
            { icon: faHourglassHalf, title: 'En attente', link: '/admin/withdrawals/pending' },
            { icon: faCalendarDay, title: 'Historique', link: '/admin/withdrawals/history' },
          ]}
        />

        <DropDown
          icon={faIdCard}
          title="Permis de conduire"
          isCollapsed={isCollapsed}
          sublinks={[
            { icon: faHourglassHalf, title: 'En attente', link: '/admin/licences/0/1' },
            { icon: faCheckCircle, title: 'Vérifiés', link: '/admin/licences/1/1' },
            { icon: faTimesCircle, title: 'Rejetés', link: '/admin/licences/2/1' },
          ]}
        />

        <DropDown
          icon={faBell}
          title="Notifications"
          isCollapsed={isCollapsed}
          sublinks={[{ icon: faBellConcierge, title: 'Liste & Publier', link: '/admin/notifications' }]}
        />
      </nav>
    </aside>
  );
};

export default DashSideBar;
