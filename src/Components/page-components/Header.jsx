import { Link } from "react-router-dom";
import useColorScheme from "../../hooks/useColorScheme"; // Ajustez le chemin
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars, faMoon, faSun, faCar, faTaxi, faUserCircle,
    faRightFromBracket, faSignInAlt, faUserPlus, faMagnifyingGlass,
    faPlusCircle, faRoute, faComment,
    faBell 
} from "@fortawesome/free-solid-svg-icons"; 
import { useState, useEffect } from "react";
import HeaderDropDown from "./HeaderDropDown";
import useAuth from "../../hooks/useAuth"; // Ajustez le chemin

import { useNotification } from "../../hooks/useNotifications"; // Ajustez le chemin


const Header = () => {
    const { theme, setTheme } = useColorScheme();
    const [showNav, setShowNav] = useState(false);
    const { user, logout } = useAuth();
    
    // UTILISATION DU HOOK DE NOTIFICATION
    const { unreadCount, getUnreadCount } = useNotification(); 
    

    // LOGIQUE DE CHARGEMENT INITIAL DU DÉCOMPTE NON LU
    useEffect(() => {
        // Charge le décompte uniquement si l'utilisateur est connecté.
        if (user) {
             getUnreadCount(); 
        }
    }, [user, getUnreadCount]); 


    const toggleDarkMode = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const toggleResponsiveNav = () => {
        setShowNav(!showNav);
    };

    const handleLogout = () => {
        logout();
        setShowNav(false); // 💡 Ferme la navigation mobile après déconnexion
    };

    // Composant du badge de notification (réutilisable)
    const NotificationBadge = ({ isMobile = false }) => (
        <Link
            to="/profile/notifications"
            onClick={() => setShowNav(false)} // Ferme la nav mobile lors du clic
            // Classe de base
            className={`relative flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-kombigreen-500 dark:hover:text-green-400 transition-colors duration-200 ${
                isMobile ? 'w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md font-semibold' : 'text-lg'
            }`}
            aria-label="Mes notifications"
        >
            {/* L'icône de la cloche */}
            <FontAwesomeIcon icon={faBell} className={isMobile ? 'text-base' : ''} />
            
            {/* Affichage du compteur non lu en exposant */}
            {(unreadCount > 0) && (
                <span 
                    // Positionnement du badge
                    className={`absolute ${isMobile ? 'top-0.5 left-5' : 'top-[-5px] right-[-10px]'} 
                                 // Style du badge
                                 text-center text-[0.6rem] font-bold leading-tight px-[5px] min-w-[18px] h-4 flex items-center justify-center 
                                 text-red-100 bg-red-600 rounded-full shadow-md
                                 transform translate-x-1/2`}
                >
                    {unreadCount > 99 ? '99+' : unreadCount}
                </span>
            )}
            {isMobile && <span>Mes Notifications</span>}
        </Link>
    );


    return (
        <header className="fixed top-0 left-0 w-full z-50 py-3 px-4 sm:px-6 lg:px-12 xl:px-24 bg-white shadow-md flex items-center justify-between dark:bg-gray-800 dark:shadow-lg transition-colors duration-300">
            {/* Logo et Nom de l'application */}
            <Link to="/" className="flex items-center text-xl font-bold text-gray-800 dark:text-white">
                <img src="/default/logo.png" className="w-6 h-7 object-contain" alt="Kombicar Logo" />
                <span className="leading-none">ombicar</span>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center gap-6 text-kombiblue-500 font-semibold dark:text-blue-300">
                <Link to="/covoiturage" className="flex items-center gap-2 hover:text-kombigreen-500 dark:hover:text-green-400 transition-colors duration-200">
                    <FontAwesomeIcon icon={faCar} />
                    Covoiturage
                </Link>

                {/* LIEN MES CONVERSATIONS POUR DESKTOP */}
                {user && (
                    <Link 
                        to="/profile/chats" 
                        className="flex items-center gap-2 hover:text-kombigreen-500 dark:hover:text-green-400 transition-colors duration-200"
                    >
                        <FontAwesomeIcon icon={faComment} />
                        Conversations
                    </Link>
                )}

                {/* Bouton "Publier un Trajet" pour Desktop */}
                {user && (
                    <Link
                        to="/publish-trip"
                        className="px-4 py-2 bg-kombigreen-500 text-white rounded-full font-bold hover:bg-kombigreen-600 transition-colors duration-200 shadow-md flex items-center gap-2 text-sm"
                    >
                        <FontAwesomeIcon icon={faPlusCircle} />
                        <FontAwesomeIcon icon={faRoute} />
                        Publier un Trajet
                    </Link>
                )}
            </nav>

            {/* Actions (Dropdown, Dark Mode Toggle, Burger Menu) */}
            <div className="flex items-center gap-4">
                
                {/* BOUTON NOTIFICATION DESKTOP */}
                {user && (
                    <div className="hidden sm:block">
                        <NotificationBadge />
                    </div>
                )}
                
                {/* Lien "Rechercher" pour Desktop et Mobile */}
                <Link
                    to="/results"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-kombigreen-500 dark:hover:text-green-400 transition-colors duration-200 text-sm md:text-base"
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <span className="hidden sm:inline">Rechercher</span>
                </Link>

                {/* HeaderDropDown */}
                <HeaderDropDown />

                {/* Bouton Dark Mode */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center text-lg"
                    aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
                >
                    {theme === "dark" ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}
                </button>

                {/* Bouton Burger (pour mobile) */}
                <button
                    onClick={toggleResponsiveNav}
                    className="md:hidden p-2 rounded-md border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 text-lg"
                    aria-expanded={showNav}
                    aria-controls="responsive-navbar"
                    aria-label={showNav ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>

            {/* Navigation Mobile (Responsive) */}
            <nav
                id="responsive-navbar"
                className={`fixed top-[64px] left-0 w-full md:hidden flex flex-col px-4 sm:px-6 py-4 gap-4 text-kombiblue-500 font-semibold dark:text-blue-300 transition-all duration-300 ease-in-out z-40 bg-white dark:bg-gray-800 h-screen overflow-y-auto ${
                    showNav ? 'transform-none visible opacity-100' : 'transform -translate-x-full invisible opacity-0'
                }`}
            >
                <Link 
                    to="/covoiturage" 
                    onClick={() => setShowNav(false)}
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                >
                    <FontAwesomeIcon icon={faCar} />
                    Covoiturage
                </Link>
                <hr className="w-full border-gray-200 dark:border-gray-600 my-2" />

                {/* Bouton "Publier un Trajet" pour Mobile */}
                {user && (
                    <>
                        <Link
                            to="/publish-trip"
                            onClick={() => setShowNav(false)}
                            className="flex items-center gap-2 w-full p-2 bg-kombigreen-500 text-white rounded-md font-bold hover:bg-kombigreen-600 transition-colors duration-200 shadow-md"
                        >
                            <FontAwesomeIcon icon={faPlusCircle} />
                            <FontAwesomeIcon icon={faRoute} />
                            Publier un Trajet
                        </Link>
                        <hr className="w-full border-gray-200 dark:border-gray-600 my-2" />
                    </>
                )}

                {/* Liens conditionnels pour l'authentification en mobile */}
                {user ? (
                    <>
                        <Link 
                            to="/profile" 
                            onClick={() => setShowNav(false)}
                            className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                        >
                            <FontAwesomeIcon icon={faUserCircle} />
                            Mon Profil
                        </Link>
                        {/* LIEN NOTIFICATIONS EN MOBILE */}
                        <NotificationBadge isMobile={true} />
                        <Link 
                            to="/profile/chats" 
                            onClick={() => setShowNav(false)}
                            className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                        >
                            <FontAwesomeIcon icon={faComment} />
                            Mes conversations
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-2 w-full p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md transition-colors duration-200">
                            <FontAwesomeIcon icon={faRightFromBracket} />
                            Déconnexion
                        </button>
                    </>
                ) : (
                    <>
                        <Link 
                            to="/auth/signin" 
                            onClick={() => setShowNav(false)}
                            className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                        >
                            <FontAwesomeIcon icon={faSignInAlt} />
                            Connexion
                        </Link>
                        <Link 
                            to="/auth/signup" 
                            onClick={() => setShowNav(false)}
                            className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                        >
                            <FontAwesomeIcon icon={faUserPlus} />
                            S'inscrire
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;