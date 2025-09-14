import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faUserCircle,
  faCaretDown,
  faSignOutAlt,
  faCog,
  faInbox,
  faCalendarCheck,
  faMoon,
  faSun
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useColorScheme from '../../hooks/useColorScheme';

// Composant simple pour un élément de Dropdown
const DropdownItem = ({ icon, text, to, onClick }) => (
  <Link
    to={to || '#'}
    onClick={onClick}
    className='flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
  >
    <FontAwesomeIcon icon={icon} className='w-4 h-4 text-gray-500 dark:text-gray-400' />
    <span>{text}</span>
  </Link>
);

const DashHeader = () => {
  // Utilisation du hook `useAuth` pour accéder à l'objet `user` et à la fonction `logout`.
  const { user, logout } = useAuth();
  // Utilisation du hook `useColorScheme` pour gérer le mode clair/sombre.
  const { theme, setTheme } = useColorScheme();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fonction pour basculer entre les modes clair et sombre
  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const notifications = [
    { id: 1, text: "Nouveau message de Jean Dupont", read: false, link: "/messages/1" },
    { id: 2, text: "Votre trajet Douala-Yaoundé est confirmé", read: false, link: "/trips/5" },
    { id: 3, text: "Rappel : Paiement en attente", read: true, link: "/payments" },
  ];

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className='flex justify-end items-center h-16 bg-white dark:bg-gray-900 shadow-md md:shadow-lg px-6 fixed top-0 right-0 w-full lg:w-[calc(100%-250px)] z-10 transition-all duration-300 border-b border-gray-200 dark:border-gray-800'>
      <div className='flex items-center gap-4 sm:gap-6'>
        {/* Bouton Dark Mode */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full text-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center"
          aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {theme === "dark" ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
        </button>

        {/* Dropdown des Notifications */}
        <div className='relative'>
          <button
            onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
            className='relative p-2.5 rounded-full text-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-300'
            aria-label="Notifications"
          >
            <FontAwesomeIcon icon={faBell} />
            {unreadNotificationsCount > 0 && (
              <span className='absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-bold leading-none text-white bg-red-600 rounded-full -mt-1 -mr-1'>
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className='absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-40 border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 origin-top-right scale-100'>
              <div className='px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700'>
                Notifications ({unreadNotificationsCount} non lues)
              </div>
              <div className='max-h-64 overflow-y-auto'>
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <DropdownItem
                      key={notification.id}
                      icon={faInbox}
                      text={notification.text}
                      to={notification.link}
                    />
                  ))
                ) : (
                  <p className='px-4 py-4 text-sm text-gray-500 dark:text-gray-400 text-center'>Aucune nouvelle notification.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dropdown du Profil Utilisateur */}
        <div className='relative'>
          <button
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
            className='flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors duration-300 p-1 rounded-full'
            aria-label="Menu du profil"
          >
            <img
              src={user?.pictureProfileUrl || 'https://via.placeholder.com/40'}
              alt='Profile'
              className='w-9 h-9 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-colors duration-200'
            />
            <span className='hidden md:inline font-semibold text-sm'>{user?.firstName || 'Utilisateur'}</span>
            <FontAwesomeIcon icon={faCaretDown} className='text-xs text-gray-500 dark:text-gray-400' />
          </button>

          {isProfileOpen && (
            <div className='absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-40 border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 origin-top-right scale-100'>
              <div className='px-4 py-3 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700'>
                Connecté en tant que <span className='font-semibold text-gray-800 dark:text-gray-200'>{user?.firstName || 'Invité'}</span>
              </div>
              <DropdownItem icon={faUserCircle} text="Voir le profil" to="/profile" onClick={() => setIsProfileOpen(false)} />
              <DropdownItem icon={faCog} text="Paramètres" to="/settings" onClick={() => setIsProfileOpen(false)} />
              <div className='border-t border-gray-200 dark:border-gray-700 my-1'></div>
              <DropdownItem
                icon={faSignOutAlt}
                text="Déconnexion"
                onClick={() => { logout(); setIsProfileOpen(false); }}
                to="#"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashHeader;