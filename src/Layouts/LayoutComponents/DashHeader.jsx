import React, { useState, useEffect, useRef } from 'react';
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
    faSun,
    faCheckDouble, // Icône pour Marquer comme lu
    faSpinner // Icône pour le chargement
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useColorScheme from '../../hooks/useColorScheme';
import { useNotification } from '../../hooks/useNotifications';


// Fonction utilitaire inchangée pour les initiales
const generateInitialsSvg = (firstName, lastName, theme) => {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    const bgColor = theme === 'dark' ? '#374151' : '#E5E7EB';
    const textColor = theme === 'dark' ? '#F9FAFB' : '#1F2937';

    const svg = `<svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="150" rx="75" fill="${bgColor}"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="${textColor}">
            ${initials}
        </text>
    </svg>`;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Composant simple pour un élément de Dropdown
const DropdownItem = ({ icon, text, to, onClick, isUnread }) => (
    <Link
        to={to || '#'}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-200 
            ${isUnread 
                ? 'text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/40 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
        `}
    >
        <FontAwesomeIcon 
            icon={icon} 
            className={`w-4 h-4 ${isUnread ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} 
        />
        <span>{text}</span>
    </Link>
);

const getNotificationIcon = (type) => {
    // Adapter les icônes selon le type de notification renvoyé par l'API
    switch (type) {
        case 'MESSAGE':
            return faInbox;
        case 'TRIP_CONFIRMATION':
            return faCalendarCheck;
        // Ajoutez d'autres types d'icônes ici
        default:
            return faBell;
    }
}

// Fonction pour déterminer le lien pour l'admin (exemple)
const getNotificationAdminLink = (notificationId, isAdmin) => {
    if (isAdmin) {
        // Lien vers la page d'administration des notifications
        return `/admin/notifications/${notificationId}`;
    }
    // Lien utilisateur standard
    return `/notifications/${notificationId}`; 
}

const DashHeader = () => {
    const { user, logout, API_URL } = useAuth();
    const { theme, setTheme } = useColorScheme();
    // 💡 Intégration du contexte de notification
    const { 
        unreadCount, 
        notifications, 
        loadingCount, 
        markNotificationsAsRead,
        getNotification // Fonction pour charger la liste complète (si nécessaire)
    } = useNotification(); 

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    // Références pour gérer le clic à l'extérieur
    const notificationsRef = useRef(null);
    const profileRef = useRef(null);
    
    // Logique de fermeture des menus au clic extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fonction pour basculer entre les modes clair et sombre
    const toggleDarkMode = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };
    
    // Gère le marquage de toutes les notifications non lues affichées
    const handleMarkAllAsRead = async (e) => {
        e.preventDefault();
        // Collecter les IDs des notifications non lues (is_read === false)
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        
        if (unreadIds.length > 0) {
            try {
                // Appel à la fonction du contexte pour marquer comme lu
                await markNotificationsAsRead(unreadIds);
            } catch (error) {
                console.error("Erreur lors du marquage comme lu", error);
            }
        }
    };
    
    // Simuler un rôle Admin pour l'exemple
    const isAdmin = user?.role === 'ADMIN'; 

    return (
        <div className='flex justify-end items-center h-16 bg-white dark:bg-gray-900 shadow-md md:shadow-lg px-6 fixed top-0 right-0 w-full lg:w-[calc(100%-250px)] z-20 transition-all duration-300 border-b border-gray-200 dark:border-gray-800'>
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
                <div className='relative' ref={notificationsRef}>
                    <button
                        onClick={() => { 
                            setIsNotificationsOpen(!isNotificationsOpen); 
                            setIsProfileOpen(false); 
                            // 💡 Optionnel: Charger la liste des notifications ici si l'on ne charge que le décompte au montage
                            // if (!isNotificationsOpen) { getNotification(1); }
                        }}
                        className='relative p-2.5 rounded-full text-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-300'
                        aria-label="Notifications"
                    >
                        {loadingCount 
                            ? <FontAwesomeIcon icon={faSpinner} spin className="text-sm" /> 
                            : <FontAwesomeIcon icon={faBell} />
                        }
                        
                        {unreadCount > 0 && (
                            <span className='absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-bold leading-none text-white bg-red-600 rounded-full -mt-1 -mr-1 animate-pulse'>
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {isNotificationsOpen && (
                        <div className='absolute right-0 mt-2 w-80 max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-40 border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 origin-top-right scale-100'>
                            <div className='flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700'>
                                <span className='text-sm font-bold text-gray-800 dark:text-gray-200'>
                                    Notifications ({unreadCount} non lu{unreadCount > 1 ? 'es' : ''})
                                </span>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className='text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 flex items-center gap-1'
                                    >
                                        <FontAwesomeIcon icon={faCheckDouble} className='w-3 h-3' />
                                        Tout lire
                                    </button>
                                )}
                            </div>
                            <div className='max-h-80 overflow-y-auto'>
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <DropdownItem
                                            key={notification.id}
                                            icon={getNotificationIcon(notification.type)}
                                            text={notification.message || notification.text}
                                            to={getNotificationAdminLink(notification.id, isAdmin)} // 💡 Lien Admin Conditionnel
                                            isUnread={!notification.is_read}
                                            onClick={() => setIsNotificationsOpen(false)} 
                                        />
                                    ))
                                ) : (
                                    <p className='px-4 py-4 text-sm text-gray-500 dark:text-gray-400 text-center'>Aucune notification récente.</p>
                                )}
                            </div>
                            <div className='border-t border-gray-200 dark:border-gray-700 pt-2'>
                                <Link 
                                    to={isAdmin ? '/admin/notifications' : '/notifications'} 
                                    className='block text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 py-1'
                                >
                                    Voir toutes les notifications
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dropdown du Profil Utilisateur */}
                <div className='relative' ref={profileRef}>
                    <button
                        onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
                        className='flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors duration-300 p-1 rounded-full'
                        aria-label="Menu du profil"
                    >
                        <img
                            src={user?.pictureProfileUrl ? `${API_URL}${user.pictureProfileUrl}` : generateInitialsSvg(user?.firstName || "N/A", user?.lastName || "N/A", theme)}
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
