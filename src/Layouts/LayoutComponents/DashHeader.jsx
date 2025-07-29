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
  faMoon, // Import de l'icône lune
  faSun   // Import de l'icône soleil
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useColorScheme from '../../hooks/useColorScheme'; // Import du hook useColorScheme

// Composant simple pour un élément de Dropdown
const DropdownItem = ({ icon, text, to, onClick }) => (
  <Link
    to={to || '#'}
    onClick={onClick}
    className='flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
  >
    <FontAwesomeIcon icon={icon} className='text-gray-500 dark:text-gray-400' />
    {text}
  </Link>
);

const DashHeader = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useColorScheme(); // Utilisation du hook useColorScheme

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
    <div className='flex justify-end items-center h-16 bg-white dark:bg-gray-800 shadow-md px-6 fixed top-0 right-0 w-full lg:w-[calc(100%-250px)] z-30 transition-all duration-300'>
      <div className='flex items-center gap-6'>
        {/* Bouton Dark Mode */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center text-lg"
          aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {theme === "dark" ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}
        </button>

        {/* Dropdown des Notifications */}
        <div className='relative'>
          <button
            onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
            className='relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none'
            aria-label="Notifications"
          >
            <FontAwesomeIcon icon={faBell} className='text-xl' />
            {unreadNotificationsCount > 0 && (
              <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2'>
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className='absolute right-0 mt-2 w-72 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-40 border border-gray-200 dark:border-gray-600'>
              <div className='px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400'>
                Notifications
              </div>
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
                <p className='px-4 py-2 text-sm text-gray-500 dark:text-gray-400'>Aucune nouvelle notification.</p>
              )}
            </div>
          )}
        </div>

        {/* Dropdown du Profil Utilisateur */}
        <div className='relative'>
          <button
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
            className='flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none'
            aria-label="Menu du profil"
          >
            <img
              src={user?.profilePicture || 'https://via.placeholder.com/40'}
              alt='Profile'
              className='w-9 h-9 rounded-full object-cover border border-gray-300 dark:border-gray-600'
            />
            <span className='hidden md:inline font-medium'>{user?.username || 'Utilisateur'}</span>
            <FontAwesomeIcon icon={faCaretDown} className='ml-1 text-sm' />
          </button>

          {isProfileOpen && (
            <div className='absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-40 border border-gray-200 dark:border-gray-600'>
              <div className='px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600'>
                Connecté en tant que <span className='font-semibold'>{user?.username || 'Invité'}</span>
              </div>
              <DropdownItem icon={faUserCircle} text="Voir le profil" to="/profile" onClick={() => setIsProfileOpen(false)} />
              <DropdownItem icon={faCog} text="Paramètres" to="/settings" onClick={() => setIsProfileOpen(false)} />
              <div className='border-t border-gray-200 dark:border-gray-600 my-1'></div>
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