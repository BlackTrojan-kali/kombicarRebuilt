import { faChevronDown, faChevronUp, faUserCircle, faRightFromBracket, faSignInAlt, faUserPlus, faComment, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useNotification } from "../../hooks/useNotifications"; // Ajustez le chemin

const HeaderDropDown = () => {
    const { user, logout } = useAuth();
    const [showDrop, setShowDrop] = useState(false);
    const dropdownRef = useRef(null);
    const { unreadCount } = useNotification(); 

    // Gère le clic en dehors pour fermer le dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDrop(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropDownMenu = () => {
        setShowDrop(prev => !prev);
    };

    const handleLogoutAndClose = () => {
        setShowDrop(false);
        logout(); 
    };

    // Composant utilitaire pour le style des liens
    const DropdownLink = ({ to, icon, label, isDanger = false, onClick = () => setShowDrop(false) }) => (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150 ${isDanger ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50' : 'text-gray-800 dark:text-gray-200'}`}
        >
            <div className="relative flex items-center gap-1">
                {label}
                {/* Afficher un petit point si ce sont les notifications et qu'il y a un décompte */}
                {(icon === faBell && unreadCount > 0) && (
                    <span 
                        className="absolute top-0 right-[-10px] w-2 h-2 bg-red-600 rounded-full"
                        aria-label={`${unreadCount} notifications non lues`}
                    ></span>
                )}
            </div>
            <FontAwesomeIcon icon={icon} className={`text-sm ${isDanger ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'}`} />
        </Link>
    );
    
    // Composant Bouton de Déconnexion
    const LogoutButton = () => (
        <button
            onClick={handleLogoutAndClose} 
            className="flex items-center justify-between w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors duration-150"
        >
            Déconnexion
            <FontAwesomeIcon icon={faRightFromBracket} className="text-sm text-red-400" />
        </button>
    );

    return (
        <div className="relative flex items-center" ref={dropdownRef}>
            <button
                onClick={toggleDropDownMenu}
                className="hidden md:flex items-center gap-2 p-2 rounded-full cursor-pointer
                           bg-blue-100 text-blue-600 hover:bg-blue-200
                           dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600
                           transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={showDrop}
                aria-haspopup="true"
                aria-label="Ouvrir le menu utilisateur"
            >
                <FontAwesomeIcon icon={faUserCircle} className="text-xl" />
                <FontAwesomeIcon icon={showDrop ? faChevronUp : faChevronDown} className="text-sm" />
            </button>

            {showDrop && (
                <div
                    className="absolute top-full right-0 mt-2 w-[200px] py-2 bg-white rounded-lg shadow-xl border border-gray-100
                               flex flex-col z-50 transform origin-top-right transition-all duration-200 ease-out
                               dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                >
                    {user ? (
                        <>
                            <DropdownLink to="/profile" icon={faUserCircle} label="Mon Profil" />
                            
                            {/* LIEN NOTIFICATIONS AVEC BADGE (desktop dropdown) */}
                            <DropdownLink to="/profile/notifications" icon={faBell} label="Notifications" />

                            <DropdownLink to="/profile/chats" icon={faComment} label="Mes conversations" />
                            <hr className="my-1 border-gray-100 dark:border-gray-600" />
                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <DropdownLink to="/auth/signin" icon={faSignInAlt} label="Connexion" />
                            <DropdownLink to="/auth/signup" icon={faUserPlus} label="S'inscrire" />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default HeaderDropDown;