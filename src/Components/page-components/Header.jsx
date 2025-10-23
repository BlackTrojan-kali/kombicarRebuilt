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

// Import du hook de notification
import { useNotification } from "../../hooks/useNotifications"; 


const Header = () => {
    const { theme, setTheme } = useColorScheme();
    const [showNav, setShowNav] = useState(false);
    const { user, logout } = useAuth();
    
    // 💡 MISE À JOUR IMPORTANTE : Déstructurer le state 'notification' et la fonction 'getNotification'
    const { notification, getNotification } = useNotification(); 
    const [notifications,setNotifications]  = useState();
    // 💡 NOUVEAU : Calculer le nombre de notifications non lues à partir du state 'notification'
    // Nous utilisons 'is_read' qui est le nom de la propriété dans le contexte.
    const unreadCount = notification.filter(n => !n.is_read).length; 

    // 💡 NOUVEAU : Ajouter un useEffect pour charger les notifications initiales (Page 1) 
    // afin que le state 'notification' du contexte soit rempli et que le badge fonctionne.
    useEffect(() => {
        // Charger les notifications seulement si l'utilisateur est connecté et si le state 'notification' est vide
        // On suppose que le state 'notification' contient les notifications de la Page 1 (récemment reçues)
        if (user) {
             // On ne gère pas le retour et l'erreur ici, juste l'appel pour remplir le state.
             getNotification(1).catch(err => console.error("Erreur de chargement initial des notifs pour le badge:", err));
        }
    }, [user, notification.length]);

console.log(notification.length);
    const toggleDarkMode = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const toggleResponsiveNav = () => {
        setShowNav(!showNav);
    };

    const handleLogout = () => {
        logout();
        setShowNav(false); // Ferme la navigation mobile après déconnexion
    };

    // --- Composant NotificationBadge ---
    // Nous allons l'intégrer directement dans le JSX pour le rendre plus simple.

    return (
        <header className="fixed top-0 left-0 w-full z-20  py-3 px-4 sm:px-6 lg:px-12 xl:px-24 bg-white shadow-md flex items-center justify-between dark:bg-gray-800 dark:shadow-lg transition-colors duration-300">
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
                
                {/* BOUTON NOTIFICATION DESKTOP AVEC BADGE */}
                {user && (
                    <Link
                        to="/profile/notifications"
                        className="hidden sm:block relative text-gray-700 dark:text-gray-300 hover:text-kombigreen-500 dark:hover:text-green-400 transition-colors duration-200 text-xl p-1"
                        aria-label="Mes notifications"
                    >
                        <FontAwesomeIcon icon={faBell} />
                        {/* 💡 NOUVEAU : Affichage du badge si le compteur est > 0 */}
                        {unreadCount > 0 && (
                            <span 
                                className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
                                aria-label={`${unreadCount} notifications non lues`}
                            >
                                {unreadCount > 9 ? '9+' : unreadCount} 
                            </span>
                        )}
                    </Link>
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
                        {/* LIEN NOTIFICATIONS EN MOBILE AVEC BADGE */}
                        <Link
                            to="/profile/notifications"
                            onClick={() => setShowNav(false)} // Ferme la nav mobile lors du clic
                            className="relative flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-kombigreen-500 dark:hover:text-green-400 transition-colors duration-200 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md font-semibold"
                            aria-label="Mes notifications"
                        >
                            <FontAwesomeIcon icon={faBell} className='text-base' />
                            <span>Mes Notifications</span>
                            {/* 💡 NOUVEAU : Affichage du badge si le compteur est > 0 */}
                            {unreadCount > 0 && (
                                <span 
                                    className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full"
                                    aria-label={`${unreadCount} notifications non lues`}
                                >
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Link>
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