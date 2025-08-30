import { Link } from "react-router-dom";
import useColorScheme from "../../hooks/useColorScheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBars, faMoon, faSun, faCar, faTaxi, faUserCircle, 
  faRightFromBracket, faSignInAlt, faUserPlus, faMagnifyingGlass,
  faPlusCircle, faRoute // Ajout des icônes pour le bouton "Publier un Trajet"
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import HeaderDropDown from "./HeaderDropDown";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  const { theme, setTheme } = useColorScheme();
  const [showNav, setShowNav] = useState(false);
  const {user} = useAuth(); // Assume 'user' est un objet si connecté, null/undefined sinon

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleResponsiveNav = () => {
    setShowNav(!showNav);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-3 px-4 sm:px-6 lg:px-12 xl:px-24 bg-white shadow-md flex items-center justify-between dark:bg-gray-800 dark:shadow-lg transition-colors duration-300">
      {/* Logo et Nom de l'application */}
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white">
        <img src="/default/logo.png" className="w-5 h-7 object-contain" alt="Kombicar Logo" />
        <span className="leading-none">ombicar</span>
      </Link>

      {/* Navigation Desktop */}
      <nav className="hidden md:flex items-center gap-6 text-kombiblue-500 font-semibold dark:text-blue-300">
        <Link to="/covoiturage" className="flex items-center gap-2 hover:text-kombigreen-500 dark:hover:text-green-400 transition-colors duration-200">
          <FontAwesomeIcon icon={faCar} />
          Covoiturage
        </Link>
     {/*   <Link to="/taxi" className="flex items-center gap-2 hover:text-kombigreen-500 dark:hover:text-green-400 transition-colors duration-200">
          <FontAwesomeIcon icon={faTaxi} />
          Taxi
        </Link>*/}
        {/* Bouton "Publier un Trajet" pour Desktop - visible si l'utilisateur est connecté */}
        {user ? (
          <Link 
            to="/publish-trip" 
            className="px-4 py-2 bg-kombigreen-500 text-white rounded-full font-bold
                       hover:bg-kombigreen-600 transition-colors duration-200 shadow-md
                       flex items-center gap-2 text-sm" // Ajustez la taille du texte si nécessaire
          >
            <FontAwesomeIcon icon={faPlusCircle} />
            <FontAwesomeIcon icon={faRoute} />
            Publier un Trajet
          </Link>
        ):""}
      </nav>

      {/* Actions (Dropdown, Dark Mode Toggle, Burger Menu) */}
      <div className="flex items-center gap-4">
        {/* Lien "Rechercher" pour Desktop et Mobile */}
        <Link 
          to="/results" 
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 
                     hover:text-kombigreen-500 dark:hover:text-green-400 
                     transition-colors duration-200 text-sm md:text-base" // Ajuste la taille du texte
        >
          <FontAwesomeIcon icon={faMagnifyingGlass}/>
          <span className="hidden sm:inline">Rechercher</span> {/* Cache le texte sur très petit écran */}
        </Link>
        
        {/* HeaderDropDown (Assurez-vous qu'il gère le dark mode en interne) */}
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
        className={`fixed top-[64px] left-0 w-full bg-white dark:bg-gray-800 shadow-lg md:hidden flex flex-col items-start px-4 sm:px-6 py-4 gap-4 text-kombiblue-500 font-semibold dark:text-blue-300 transition-transform duration-300 ease-in-out ${
          showNav ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{ overflowY: showNav ? 'auto' : 'hidden', maxHeight: showNav ? 'calc(100vh - 64px)' : '0' }}
      >
        <Link to="/covoiturage" className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200">
          <FontAwesomeIcon icon={faCar} />
          Covoiturage
        </Link>
        {/*<Link to="/taxi" className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200">
          <FontAwesomeIcon icon={faTaxi} />
          Taxi
        </Link>*/}
        <hr className="w-full border-gray-200 dark:border-gray-600 my-2" />

        {/* Bouton "Publier un Trajet" pour Mobile - visible si l'utilisateur est connecté */}
        {user ? (
          <>
            <Link 
              to="/publish-trip" // Assurez-vous d'avoir une route définie pour cela
              className="flex items-center gap-2 w-full p-2 
                         bg-kombigreen-500 text-white rounded-md font-bold
                         hover:bg-kombigreen-600 transition-colors duration-200 shadow-md"
              onClick={toggleResponsiveNav} // Ferme le menu après le clic
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              <FontAwesomeIcon icon={faRoute} />
              Publier un Trajet
            </Link>
            <hr className="w-full border-gray-200 dark:border-gray-600 my-2" />
          </>
        ):""}

        {/* Liens conditionnels pour l'authentification en mobile */}
        {user ? (
          <>
            <Link to="/profile" className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200">
              <FontAwesomeIcon icon={faUserCircle} />
              Mon Profil
            </Link>
            <button className="flex items-center gap-2 w-full p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md transition-colors duration-200">
              <FontAwesomeIcon icon={faRightFromBracket} />
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/auth/signin" className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200">
              <FontAwesomeIcon icon={faSignInAlt} />
              Connexion
            </Link>
            <Link to="/auth/signup" className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200">
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