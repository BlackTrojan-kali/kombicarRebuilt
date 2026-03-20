import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars, faMoon, faCar, faUserCircle,
    faRightFromBracket, faSignInAlt, faUserPlus, faMagnifyingGlass,
    faPlusCircle, faComment,
    faBell, faLightbulb, faQuestion,
    faCalendar
} from "@fortawesome/free-solid-svg-icons";

import useColorScheme from "../../hooks/useColorScheme";
import useAuth from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotifications";
import HeaderDropDown from "./HeaderDropDown";

const Header = () => {
    const { theme, setTheme } = useColorScheme();
    const [showNav, setShowNav] = useState(false);
    const { user, logout } = useAuth();
    const [notification, setNotification] = useState([]);
    
    // Récupération du state global 'notification' et de la fonction de fetch
    const { getNotification } = useNotification(); 
    
    // Calcul des notifications non lues (isRead est la propriété de votre API)
    const unreadCount = Array.isArray(notification) 
        ? notification.filter(n => !n.isRead).length 
        : 0; 

    // Chargement initial des notifications au montage si l'utilisateur est connecté
    useEffect(() => {
        if (user) {
            getNotification(1).then((res) => {
                setNotification(res?.data?.items);
            }).catch(err => 
                console.error("Erreur de chargement initial des notifs:", err)
            );
        }
    }, [user, getNotification]);

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
        <header className="fixed top-0 left-0 w-full z-50 py-4 px-4 sm:px-6 lg:px-12 xl:px-24 bg-white shadow-sm flex items-center justify-between dark:bg-gray-900 dark:border-b dark:border-gray-800 transition-colors duration-300">
            
            {/* --- LOGO --- */}
            <Link to="/" className="flex items-center text-2xl font-bold text-gray-800 dark:text-white">
                <img src="/default/logo.png" className="w-8 h-9 object-contain mr-1" alt="Kombicar Logo" />
                <span className="leading-none tracking-tight text-kombiblue-600 dark:text-blue-400">ombicar</span>
            </Link>

            {/* --- NAVIGATION DESKTOP (Épurée) --- */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-gray-700 dark:text-gray-300 font-medium text-sm">
                
                <Link to="/covoiturage" className="flex items-center gap-2 hover:text-kombigreen-500 dark:hover:text-kombigreen-400 transition-colors duration-200">
                    <FontAwesomeIcon icon={faCar} className="text-lg" />
                    Covoiturage
                </Link>

                {user ? (
                    <Link to="/publish-trip" className="flex items-center gap-2 hover:text-kombigreen-500 dark:hover:text-kombigreen-400 transition-colors duration-200">
                        <FontAwesomeIcon icon={faPlusCircle} className="text-lg" />
                        Publier un Trajet
                    </Link>
                ) : (
                    <Link to="/auth/signin" className="flex items-center gap-2 hover:text-kombigreen-500 dark:hover:text-kombigreen-400 transition-colors duration-200">
                        <FontAwesomeIcon icon={faPlusCircle} className="text-lg" />
                        Publier un Trajet
                    </Link>
                )}

                <Link to="/contact" className="flex items-center gap-2 hover:text-kombigreen-500 dark:hover:text-kombigreen-400 transition-colors duration-200">
                    <FontAwesomeIcon icon={faQuestion} className="text-lg" />
                    Aide
                </Link>

                {!user && (
                    <Link to="/auth/signup" className="flex items-center gap-2 hover:text-kombigreen-500 dark:hover:text-kombigreen-400 transition-colors duration-200">
                        <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
                        S'inscrire
                    </Link>
                )}

                {user && (
                    <>
                        <Link to="/profile/chats" className="flex items-center gap-2 hover:text-kombigreen-500 dark:hover:text-kombigreen-400 transition-colors duration-200">
                            <FontAwesomeIcon icon={faComment} className="text-lg" />
                            Conversations
                        </Link>
                        <Link to="/suggest-trip" className="flex items-center gap-2 hover:text-kombigreen-500 dark:hover:text-kombigreen-400 transition-colors duration-200">
                            <FontAwesomeIcon icon={faCalendar} className="text-lg" />
                            Planifier
                        </Link>
                    </>
                )}
            </nav>

            {/* --- ACTIONS DROITE --- */}
            <div className="flex items-center gap-4">
                
                <Link to="/results" className="hidden sm:flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-kombigreen-500 text-sm md:text-base mr-2">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <span className="hidden sm:inline">Rechercher</span>
                </Link>

                {/* Bouton Connexion (Style "Contour" épuré) visible uniquement si déconnecté */}
                {!user && (
                    <Link 
                        to="/auth/signin" 
                        className="hidden sm:flex items-center gap-2 px-5 py-2 border-[1.5px] border-kombigreen-500 text-kombigreen-600 dark:text-kombigreen-400 dark:border-kombigreen-400 rounded-lg font-semibold hover:bg-kombigreen-50 dark:hover:bg-gray-800 transition-all duration-200 text-sm"
                    >
                        <FontAwesomeIcon icon={faSignInAlt} />
                        Connexion
                    </Link>
                )}

                {/* Notifications & Profil (Si connecté) */}
                {user && (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/profile/notifications"
                            className="relative text-gray-700 dark:text-gray-300 hover:text-kombigreen-500 transition-colors text-xl p-2"
                        >
                            <FontAwesomeIcon icon={faBell} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-gray-900">
                                    {unreadCount > 9 ? '9+' : unreadCount} 
                                </span>
                            )}
                        </Link>
                        <HeaderDropDown />
                    </div>
                )}

                {/* Bouton Dark Mode */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-kombigreen-500 dark:hover:text-kombigreen-400 transition-colors text-lg"
                    aria-label="Basculer le thème"
                >
                    <FontAwesomeIcon icon={theme === "dark" ? faMoon : faLightbulb} />
                </button>

                {/* Menu Hamburger Mobile */}
                <button
                    onClick={toggleResponsiveNav}
                    className="lg:hidden p-2 text-gray-700 dark:text-gray-300 text-xl"
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>

            {/* --- NAVIGATION MOBILE --- */}
            <nav
                className={`fixed top-[72px] left-0 w-full lg:hidden flex flex-col px-6 py-6 gap-4 text-gray-800 font-medium dark:text-gray-200 transition-all duration-300 bg-white dark:bg-gray-900 h-screen overflow-y-auto z-40 ${
                    showNav ? 'translate-x-0 opacity-100 visible' : '-translate-x-full opacity-0 invisible'
                }`}
            >
                <Link to="/results" onClick={() => setShowNav(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-kombigreen-500 w-5" /> Rechercher
                </Link>

                <Link to="/covoiturage" onClick={() => setShowNav(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                    <FontAwesomeIcon icon={faCar} className="text-kombigreen-500 w-5" /> Covoiturage
                </Link>

                {user ? (
                    <Link to="/publish-trip" onClick={() => setShowNav(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                        <FontAwesomeIcon icon={faPlusCircle} className="text-kombigreen-500 w-5" /> Publier un Trajet
                    </Link>
                ) : (
                    <Link to="/auth/signin" onClick={() => setShowNav(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                        <FontAwesomeIcon icon={faPlusCircle} className="text-kombigreen-500 w-5" /> Publier un Trajet
                    </Link>
                )}
                
                <Link to="/contact" onClick={() => setShowNav(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                    <FontAwesomeIcon icon={faQuestion} className="text-kombigreen-500 w-5" /> Aide
                </Link>

                <hr className="my-2 border-gray-100 dark:border-gray-800" />

                {user ? (
                    <>
                        <Link to="/suggest-trip" onClick={() => setShowNav(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                            <FontAwesomeIcon icon={faCalendar} className="text-kombigreen-500 w-5" /> Planifier un trajet
                        </Link>
                        
                        <Link to="/profile/chats" onClick={() => setShowNav(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                            <FontAwesomeIcon icon={faComment} className="text-kombigreen-500 w-5" /> Conversations
                        </Link>

                        <Link to="/profile" onClick={() => setShowNav(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                            <FontAwesomeIcon icon={faUserCircle} className="text-gray-500 w-5" /> Mon Profil
                        </Link>

                        <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-left w-full mt-4">
                            <FontAwesomeIcon icon={faRightFromBracket} className="w-5" /> Déconnexion
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/auth/signup" onClick={() => setShowNav(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                            <FontAwesomeIcon icon={faUserPlus} className="text-gray-500 w-5" /> S'inscrire
                        </Link>
                        
                        <Link to="/auth/signin" onClick={() => setShowNav(false)} className="flex items-center justify-center gap-2 p-3 mt-4 border border-kombigreen-500 text-kombigreen-600 rounded-lg font-bold">
                            <FontAwesomeIcon icon={faSignInAlt} /> Connexion
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;