import { faChevronDown, faChevronUp, faUserCircle, faRightFromBracket, faSignInAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons"; // Correction: Utilisez faUserCircle pour un icône de profil plus générique
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../../hooks/useAuth"; // Assurez-vous que useAuth retourne 'user' correctement
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react"; // Import useRef et useEffect

const HeaderDropDown = () => {
    const {user} = useAuth(); // Supposons que 'user' est null ou un objet selon l'état de connexion
    const [showDrop, setShowDrop] = useState(false);
    const dropdownRef = useRef(null); // Référence pour détecter les clics en dehors

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

    const handleLinkClick = () => {
        setShowDrop(false); // Ferme le dropdown après avoir cliqué sur un lien
    };

    return (
        <div className="relative flex items-center" ref={dropdownRef}> {/* Ajout de ref ici et alignement vertical */}
            {/* Bouton du dropdown - visible sur desktop */}
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
                <FontAwesomeIcon icon={faUserCircle} className="text-xl" /> {/* Utilisation de faUserCircle */}
                <FontAwesomeIcon icon={showDrop ? faChevronUp : faChevronDown} className="text-sm" />
            </button>

            {/* Menu Dropdown - Affiché conditionnellement */}
            {showDrop && (
                <div
                    className="absolute top-full right-0 mt-2 w-[200px] py-2 bg-white rounded-lg shadow-xl border border-gray-100
                               flex flex-col z-50 transform origin-top-right transition-all duration-200 ease-out
                               dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                >
                    {user ? (
                        <>
                            <Link
                                to="/profile"
                                onClick={handleLinkClick}
                                className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                            >
                                Profil
                                <FontAwesomeIcon icon={faUserCircle} className="text-sm text-gray-500 dark:text-gray-400" />
                            </Link>
                            <button
                                onClick={handleLinkClick} // Ferme le dropdown même pour un bouton
                                className="flex items-center justify-between w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-b-lg transition-colors duration-150"
                            >
                                Déconnexion
                                <FontAwesomeIcon icon={faRightFromBracket} className="text-sm text-red-400" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/auth/signin"
                                onClick={handleLinkClick}
                                className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                            >
                                Connexion
                                <FontAwesomeIcon icon={faSignInAlt} className="text-sm text-gray-500 dark:text-gray-400" />
                            </Link>
                            <Link
                                to="/auth/signup"
                                onClick={handleLinkClick}
                                className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                            >
                                S'inscrire
                                <FontAwesomeIcon icon={faUserPlus} className="text-sm text-gray-500 dark:text-gray-400" />
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default HeaderDropDown;