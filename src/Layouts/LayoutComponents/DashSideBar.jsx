import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faUsers,
    faUserTie,
    faCar,
    faUserShield,
    faRoad,
    faHourglassHalf,
    faCalendarDay,
    faCheckCircle,
    faTruck,
    faTags,
    faTicket,
    faChevronDown,
    faIdCard,
    faTimesCircle,
    faHandHoldingUsd,
    faGlobeAfrica,
} from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../hooks/useAuth';
import useColorScheme from '../../hooks/useColorScheme';
import useUser from '../../hooks/useUser'; 
import { toast } from 'sonner';

// ###################################################
// Énumération des pays
// ###################################################
const COUNTRIES = {
    OTHERS: { code: 0, name: 'International' },
    CM: { code: 237, name: 'Cameroun' },
    CI: { code: 225, name: "Côte d'Ivoire" },
    SN: { code: 221, name: 'Sénégal' },
    CD: { code: 243, name: 'RDC' },
    ML: { code: 223, name: 'Mali' },
    BJ: { code: 229, name: 'Bénin' },
    TG: { code: 228, name: 'Togo' },
    GN: { code: 224, name: 'Guinée' },
    BF: { code: 226, name: 'Burkina Faso' },
};


// Fonction utilitaire pour générer les initiales SVG
const generateInitialsSvg = (firstName, lastName, theme) => {
    const initials = `${firstName?.charAt(0) || '?'}${lastName?.charAt(0) || '?'}`.toUpperCase();
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


// Composant DropDown (Aucune modification nécessaire)
const DropDown = ({ icon, title, sublinks = [] }) => {
    const [active, setActive] = useState(false);
    
    const location = useLocation();

    const handleToggle = () => {
      setActive(!active);
    };

    // Détermine si un des sous-liens est actif pour garder le menu ouvert
    const isSublinkActive = sublinks.some(sublink => location.pathname === sublink.link);

    return (
      <div>
        <div
          onClick={handleToggle}
          className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors duration-200 mb-1'
        >
          <div className='w-8 h-8 flex items-center justify-center text-lg text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200'>
            <FontAwesomeIcon icon={icon} />
          </div>
          <p className='text-md font-medium flex-grow'>{title}</p>
          {sublinks.length > 0 && (
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`text-xs transition-transform duration-300 ${active || isSublinkActive ? "rotate-180" : ""}`}
            />
          )}
        </div>

        {(active || isSublinkActive) && sublinks.length > 0 && (
          <div
            className='flex flex-col pl-6 border-l-2 border-gray-200 dark:border-gray-700 mx-5 mb-2'
            role="menu"
            aria-orientation="vertical"
          >
            {sublinks.map((sublink, index) => (
              <Link
                key={index}
                to={sublink.link}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors duration-200 my-1
                            ${location.pathname === sublink.link ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                role="menuitem"
                onClick={() => setActive(false)}
              >
                {sublink.icon && <FontAwesomeIcon icon={sublink.icon} className="w-4 h-4" />}
                {sublink.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
};

// ----------------------------------------------------------------------

// Composant CountrySwitcher (MODIFIÉ)
const CountrySwitcher = () => {
    // MODIFICATION 1: Ajout de refreshAdminToken et logout
    const { user, setUser, refreshAdminToken, logout } = useAuth(); 
    const { updateAdminCountryAccess } = useUser(); 

    const [active, setActive] = useState(false);

    // Le pays actuellement sélectionné, en utilisant adminAccesCountry
    // Note: Correction de adminCountryAccess à adminAccesCountry pour cohérence avec le code précédent.
    const currentCountryCode = user?.adminAccesCountry || COUNTRIES.OTHERS.code; 
    
    const currentCountryObject = Object.values(COUNTRIES).find(c => c.code === currentCountryCode);
    const currentCountryName = currentCountryObject?.name || 'Inconnu';


    /** Gère l'appel API pour changer le pays d'accès ET force le rafraîchissement du token Admin */
    const handleCountryChange = async (newCountryCode) => {
        if (!user || !user.id || !user.role.includes('Admin')) {
            toast.error("Action non autorisée. Vous devez être administrateur.");
            return;
        }

        setActive(false); // Fermer le sélecteur immédiatement

        try {
            // 1. Appel API pour mettre à jour la BDD
            await updateAdminCountryAccess(user.id, newCountryCode);
            
            // 2. Mise à jour locale du contexte (pour feedback immédiat avant le refresh)
            if (setUser) {
                // Assurez-vous que la clé est correcte
                setUser(prevUser => ({
                    ...prevUser,
                    adminAccesCountry: newCountryCode 
                }));
            }
            
            // 3. Rafraîchissement du Access Token 
            const refreshToken = localStorage.getItem('accessToken');
          
            if (refreshToken) {
                const refreshSuccess = await refreshAdminToken(refreshToken);
                
                if (refreshSuccess) {
                    const newCountry = Object.values(COUNTRIES).find(c => c.code === newCountryCode);
                    toast.success(`Pays d'accès mis à jour à ${newCountry?.name || 'Inconnu'} et token rafraîchi.`, { duration: 3000 });
                } else {
                    // Si le refresh échoue, le token est expiré, on force la déconnexion
                    toast.warning("Changement de pays enregistré, mais la session a expiré. Veuillez vous reconnecter.");
                    logout(false); // Utiliser logout du contexte pour effacer les tokens
                }
            } else {
                 const newCountry = Object.values(COUNTRIES).find(c => c.code === newCountryCode);
                 toast.success(`Pays d'accès mis à jour à : ${newCountry?.name || 'Inconnu'}`);
            }

        } catch (error) {
            // Les erreurs de updateAdminCountryAccess sont gérées par le hook useUser/AuthContext
            console.error("Échec du processus de changement de pays:", error);
        }
    };

    return (
        <div className='mb-4'>
            <div
                onClick={() => setActive(!active)}
                className='flex items-center gap-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200'
            >
                <div className='w-8 h-8 flex items-center justify-center text-lg text-blue-600 dark:text-blue-400'>
                    <FontAwesomeIcon icon={faGlobeAfrica} />
                </div>
                {/* Affichage conditionnel pour le pays non sélectionné (code 0) */}
                <p className='text-sm font-semibold flex-grow truncate'>
                    Pays: 
                    {currentCountryCode === COUNTRIES.OTHERS.code && user?.role !== 'NONE' ? 
                        <span className='text-red-500 font-bold ml-1'>⚠️ Aucun pays sélectionné</span> : 
                        <span className='ml-1'>{currentCountryName}</span>
                    }
                </p>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs transition-transform duration-300 ${active ? "rotate-180" : ""}`}
                />
            </div>

            {active && (
                <div
                    className='flex flex-col pl-3 pr-3 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-inner mt-1 max-h-60 overflow-y-auto'
                    role="menu"
                >
                    {Object.values(COUNTRIES).map((country) => (
                        <button
                            key={country.code}
                            onClick={() => handleCountryChange(country.code)}
                            className={`flex justify-between items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 my-0.5 text-left
                                ${country.code === currentCountryCode ? 
                                    'bg-blue-50 dark:bg-blue-800 text-blue-600 dark:text-blue-300 font-semibold' : 
                                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`
                                }
                        >
                            {country.name}
                            {country.code === currentCountryCode && <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------

// Composant principal DashSideBar (Aucune modification nécessaire ici, car le CountrySwitcher est déjà appelé)
const DashSideBar = () => {
    const { user, API_URL } = useAuth();
    const location = useLocation();

    const { theme } = useColorScheme();
    const activeLinkClass = "flex items-center gap-4 p-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold mb-2 transition-colors duration-200";
    const defaultLinkClass = "flex items-center gap-4 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 mb-2";

    return (
        <div className='flex flex-col w-[280px] py-4 px-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 fixed h-full shadow-lg transition-all duration-300 z-20 overflow-y-auto'>
            <div className='flex items-center justify-start h-16 mb-8'>
                <h1 className='text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500'>
                    KombiCar-Admin
                </h1>
            </div>

            {user && (
                <div className='flex items-center gap-4 p-4 mb-6 rounded-xl bg-gray-100 dark:bg-gray-700'>
                    <img
                        src={user.pictureProfileUrl ? `${API_URL}` + user.pictureProfileUrl : generateInitialsSvg(user.firstName, user.lastName, theme)}
                        alt="User Profile"
                        className='w-12 h-12 rounded-full object-cover border-2 border-blue-500'
                    />
                    <div className='flex flex-col'>
                        <span className='font-bold text-gray-900 dark:text-gray-100 truncate'>
                            {user.firstName}
                        </span>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                            {user.role}
                        </span>
                    </div>
                </div>
            )}
            
            {/* SÉLECTEUR DE PAYS (affiché pour les rôles admin) */}
            {(user?.role === 'SUPER_ADMIN' || user?.role === 'Admin') && <CountrySwitcher />} 
            
            <nav className='flex flex-col flex-grow space-y-2'>
                
                {/* Tableau de bord */}
                <Link
                    to="/admin/dashboard"
                    className={location.pathname === "/admin/dashboard" ? activeLinkClass : defaultLinkClass}
                >
                    <div className='w-8 h-8 flex items-center justify-center text-lg text-gray-600 dark:text-gray-400'>
                        <FontAwesomeIcon icon={faTachometerAlt} />
                    </div>
                    <span className='text-md font-medium'>Tableau de bord</span>
                </Link>

                {/* Utilisateurs */}
                <DropDown
                    icon={faUsers}
                    title="Utilisateurs"
                    sublinks={[
                        { icon: faUserTie, title: "Clients", link: "/admin/users" },
                        { icon: faCar, title: "Chauffeurs", link: "/admin/drivers" },
                        { icon: faUserShield, title: "Administrateurs", link: "/admin/admins" },
                    ]}
                />

                {/* Trajets */}
                <DropDown
                    icon={faRoad}
                    title="Trajets"
                    sublinks={[
                        { icon: faHourglassHalf, title: "Publiés", link: `/admin/trajets/0` },
                        { icon: faCalendarDay, title: "Terminé", link: `/admin/trajets/2` },
                        { icon: faCheckCircle, title: "Non Verifie", link: `/admin/trajets/3` },
                    ]}
                />

                {/* Véhicules */}
                <DropDown
                    icon={faTruck}
                    title="Véhicules"
                    sublinks={[
                        { icon: faTags, title: "Vehicules", link: "/admin/cars" },
                    ]}
                />

                {/* Codes Promo */}
                <DropDown
                    icon={faTicket}
                    title="Codes Promo"
                    sublinks={[
                        { icon: faCheckCircle, title: "Codes Actifs", link: `/admin/promocodes/list/active` },
                        { icon: faHourglassHalf, title: "Codes Expirés", link: `/admin/promocodes/list/expired` },
                        { icon: faTicket, title: "Tous les Codes", link: `/admin/promocodes/list/all` },
                    ]}
                />

                {/* Retraits */}
                <DropDown
                    icon={faHandHoldingUsd}
                    title="Retraits"
                    sublinks={[
                        { icon: faHourglassHalf, title: "Demandes en attente", link: "/admin/withdrawals/pending" },
                        { icon: faCalendarDay, title: "Historique complet", link: "/admin/withdrawals/history" },
                    ]}
                />

                {/* Permis de Conduire */}
                <DropDown
                    icon={faIdCard}
                    title="Permis de Conduire"
                    sublinks={[
                        { icon: faHourglassHalf, title: "En attente", link: `/admin/licences/0/1` },
                        { icon: faCheckCircle, title: "Vérifiés", link: `/admin/licences/1/1` },
                        { icon: faTimesCircle, title: "Rejetés", link: `/admin/licences/2/1` },
                    ]}
                />

            </nav>
        </div>
    );
};

export default DashSideBar;