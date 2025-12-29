import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars, faMoon, faCar, faUserCircle,
    faRightFromBracket, faSignInAlt, faUserPlus, faMagnifyingGlass,
    faPlusCircle, faRoute, faComment,
    faBell, faLightbulb, faQuestion
} from "@fortawesome/free-solid-svg-icons";

import useColorScheme from "../../hooks/useColorScheme";
import useAuth from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotifications";
import HeaderDropDown from "./HeaderDropDown";

const Header = () => {
    const { theme, setTheme } = useColorScheme();
    const [showNav, setShowNav] = useState(false);
    const { user, logout } = useAuth();
    
    const { notification, getNotification } = useNotification(); 
    
    // Calcul des notifications non lues
    const unreadCount = notification ? notification.filter(n => !n.is_read).length : 0; 

    useEffect(() => {
        if (user) {
            getNotification(1).catch(err => 
                console.error("Erreur de chargement initial des notifs:", err)
            );
        }
    }, [user]);

    const toggleDarkMode = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const toggleResponsiveNav = () => {
        setShowNav(!showNav);
    };

    const handleLogout = () => {
        logout();
        setShowNav(false);
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 py-3 px-4 sm:px-6 lg:px-12 xl:px-24 bg-white shadow-md flex items-center justify-between dark:bg-gray-800 dark:shadow-lg transition-colors duration-300">
            
            {/* --- LOGO --- */}
            <Link to="/" className="flex items-center text-xl font-bold text-gray-800 dark:text-white">
                <img src="/default/logo.png" className="w-6 h-7 object-contain" alt="Kombicar Logo" />
                <span className="leading-none">ombicar</span>
            </Link>

            {/* --- NAVIGATION DESKTOP --- */}
            <nav className="hidden md:flex items-center gap-4 text-kombiblue-500 font-semibold dark:text-blue-300">
                <Link to="/covoiturage" className="flex items-center gap-2 hover:text-kombigreen-500 dark:hover:text-green-400 transition-colors duration-200">
                    <FontAwesomeIcon icon={faCar} />
                    Covoiturage
                </Link>
                
                <Link to="/contact" className="flex items-center gap-2 hover:text-kombigreen-500 dark:hover:text-green-400 transition-colors duration-200">
                    <FontAwesomeIcon icon={faQuestion} />
                    Aide
                </Link>

                {user && (
                    <>
                        <Link to="/profile/chats" className="flex items-center gap-2 hover:text-kombigreen-500 dark:hover:text-green-400 transition-colors duration-200">
                            <FontAwesomeIcon icon={faComment} />
                            Conversations
                        </Link>

                        {/* BOUTON SUGGÉRER (Desktop) */}
                        <Link
                            to="/suggest-trip"
                            className="px-4 py-2 border-2 border-kombigreen-500 text-kombigreen-600 dark:text-kombigreen-400 rounded-full font-bold hover:bg-kombigreen-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2 text-sm"
                        >
                            <FontAwesomeIcon icon={faLightbulb} />
                            Suggérer
                        </Link>

                        {/* BOUTON PUBLIER (Desktop) */}
                        <Link
                            to="/publish-trip"
                            className="px-4 py-2 bg-kombigreen-500 text-white rounded-full font-bold hover:bg-kombigreen-600 transition-colors duration-200 shadow-md flex items-center gap-2 text-sm"
                        >
                            <FontAwesomeIcon icon={faPlusCircle} />
                            Publier un Trajet
                        </Link>
                    </>
                )}
            </nav>

            {/* --- ACTIONS DROITE --- */}
            <div className="flex items-center gap-4">
                
                {/* NOTIFICATIONS DESKTOP */}
                {user && (
                    <Link
                        to="/profile/notifications"
                        className="hidden sm:block relative text-gray-700 dark:text-gray-300 hover:text-kombigreen-500 transition-colors text-xl p-1"
                    >
                        <FontAwesomeIcon icon={faBell} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                {unreadCount > 9 ? '9+' : unreadCount} 
                            </span>
                        )}
                    </Link>
                )}
                
                <Link to="/results" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-kombigreen-500 text-sm md:text-base">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <span className="hidden sm:inline">Rechercher</span>
                </Link>

                <HeaderDropDown />

                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 transition-all text-lg"
                >
                    <FontAwesomeIcon icon={theme === "dark" ? faMoon : faLightbulb} />
                </button>

                <button
                    onClick={toggleResponsiveNav}
                    className="md:hidden p-2 rounded-md border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>

            {/* --- NAVIGATION MOBILE --- */}
            <nav
                className={`fixed top-[64px] left-0 w-full md:hidden flex flex-col px-4 py-4 gap-4 text-kombiblue-500 font-semibold dark:text-blue-300 transition-all duration-300 bg-white dark:bg-gray-800 h-screen overflow-y-auto z-40 ${
                    showNav ? 'translate-x-0 opacity-100 visible' : '-translate-x-full opacity-0 invisible'
                }`}
            >
                <Link to="/covoiturage" onClick={() => setShowNav(false)} className="flex items-center gap-2 p-2">
                    <FontAwesomeIcon icon={faCar} /> Covoiturage
                </Link>
                
                <Link to="/contact" onClick={() => setShowNav(false)} className="flex items-center gap-2 p-2">
                    <FontAwesomeIcon icon={faQuestion} /> Contact
                </Link>

                <hr className="dark:border-gray-600" />

                {user ? (
                    <>
                        {/* SUGGÉRER (Mobile) */}
                        <Link
                            to="/suggest-trip"
                            onClick={() => setShowNav(false)}
                            className="flex items-center gap-2 w-full p-2 border border-kombigreen-500 text-kombigreen-600 rounded-md font-bold"
                        >
                            <FontAwesomeIcon icon={faLightbulb} /> Suggérer un trajet
                        </Link>

                        {/* PUBLIER (Mobile) */}
                        <Link
                            to="/publish-trip"
                            onClick={() => setShowNav(false)}
                            className="flex items-center gap-2 w-full p-2 bg-kombigreen-500 text-white rounded-md font-bold shadow-md"
                        >
                            <FontAwesomeIcon icon={faPlusCircle} /> Publier un Trajet
                        </Link>

                        <hr className="dark:border-gray-600" />

                        <Link to="/profile" onClick={() => setShowNav(false)} className="flex items-center gap-2 p-2">
                            <FontAwesomeIcon icon={faUserCircle} /> Mon Profil
                        </Link>

                        <Link to="/profile/notifications" onClick={() => setShowNav(false)} className="relative flex items-center gap-2 p-2">
                            <FontAwesomeIcon icon={faBell} /> 
                            Mes Notifications
                            {unreadCount > 0 && (
                                <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>

                        <button onClick={handleLogout} className="flex items-center gap-2 p-2 text-red-500 text-left">
                            <FontAwesomeIcon icon={faRightFromBracket} /> Déconnexion
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/auth/signin" onClick={() => setShowNav(false)} className="flex items-center gap-2 p-2">
                            <FontAwesomeIcon icon={faSignInAlt} /> Connexion
                        </Link>
                        <Link to="/auth/signup" onClick={() => setShowNav(false)} className="flex items-center gap-2 p-2">
                            <FontAwesomeIcon icon={faUserPlus} /> S'inscrire
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;