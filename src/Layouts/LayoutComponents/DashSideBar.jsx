import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt, faUsers, faUserTie, faCar, faUserShield,
    faRoad, faHourglassHalf, faCalendarDay, faCheckCircle,
    faTruck, faTags, faTicket, faChevronDown, faIdCard,
    faTimesCircle, faHandHoldingUsd, faGlobeAfrica,
    faBell, faBellConcierge, faRuler, faScaleBalanced,
} from '@fortawesome/free-solid-svg-icons';

import useAuth from '../../hooks/useAuth';
import useColorScheme from '../../hooks/useColorScheme';
import { toast } from 'sonner';
import { useRole } from '../../contexts/Admin/RoleContext';
import { useSidebarContext } from '../../contexts/Admin/SidebarContext';
import { useUserAdminContext } from '../../contexts/Admin/UsersAdminContext';
import DropDown from './DropDown'; // Assurez-vous du bon chemin d'import

// Configuration externe
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
    FR: { code: 33, name: 'France' },
};

const PERMISSIONS = {
    USERS_LIST: ["UsersCanListAdmin", "UsersCanListDrivers", "UsersCanListUsers"],
    TRIPS_LIST: ["TripsCanChangeStatus", "TripsCanDelete"],
    VEHICULES_LIST: ["VehiculeCanList", "VehiculeCanReadDetails", "VehiculeCanUpdateVerificationState"],
    PROMO_CODE_LIST: ["PromoCodeCanList", "PromoCodeCanReadDetails", "PromoCodeCanUpdate", "PromoCodeCanDelete"],
    WITHDRAWALS_LIST: ["WithdrawRequestsCanList", "WithdrawRequestsCanReadPending", "WithdrawRequestsCanUpdateStatus"],
    LICENCES_LIST: ["LicenceCanDrivingList", "LicenceDrivingCanReadDetails", "LicenceDrivingCanChangeVerificationState"],
    NOTIFICATIONS_LIST: ["NotificationsCanList", "NotificationsCanPublish", "NotificationsCanUpdate", "NotificationsCanDelete"],
    ROLES_LIST: ["UsersCanChangeRole", "RolesCanList"]
};

// Utilitaire d'avatar memoïsé hors du composant pour la performance
const generateInitialsSvg = (firstName, lastName, theme) => {
    const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || '?';
    const bgColor = theme === 'dark' ? '#374151' : '#E5E7EB';
    const textColor = theme === 'dark' ? '#F9FAFB' : '#1F2937';
    const svg = `<svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="150" height="150" rx="75" fill="${bgColor}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="60" font-weight="bold" fill="${textColor}">${initials}</text></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Sélecteur de pays
const CountrySwitcher = ({ isCollapsed }) => {
    const { user, setUser, refreshAdminToken } = useAuth();
    const { updateAdminCountryAccess } = useUserAdminContext();
    const [active, setActive] = useState(false);
    
    const currentCode = user?.adminAccesCountry || COUNTRIES.OTHERS.code;
    const currentCountry = useMemo(() => Object.values(COUNTRIES).find(c => c.code === currentCode), [currentCode]);

    const handleChange = useCallback(async (newCode) => {
        if (!user || (!user.role.includes('ADMIN') && !user.role.includes("SUPER_ADMIN"))) return;
        setActive(false);
        
        const newCountryName = Object.values(COUNTRIES).find(c => c.code === newCode)?.name || 'Inconnu';

        try {
            await updateAdminCountryAccess(user.id, newCode);
            setUser(prev => ({ ...prev, adminAccesCountry: newCode }));
            await refreshAdminToken(localStorage.getItem('refreshToken'));
            toast.success(`Accès basculé sur : ${newCountryName}`);
        } catch (err) {
            console.error("Erreur de changement de pays", err);
            toast.error('Échec lors du changement de zone géographique.');
        }
    }, [user, setUser, updateAdminCountryAccess, refreshAdminToken]);

    if (isCollapsed) {
        return (
            <div className="flex justify-center items-center h-12 mb-4 text-blue-600 dark:text-blue-400">
                <FontAwesomeIcon icon={faGlobeAfrica} className="text-2xl drop-shadow-sm" />
            </div>
        );
    }

    return (
        <div className="mb-6 px-4 relative">
            <button
                onClick={() => setActive(!active)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 border border-gray-200 dark:border-gray-600"
            >
                <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faGlobeAfrica} className="text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {currentCountry?.name || 'International'}
                    </span>
                </div>
                <FontAwesomeIcon icon={faChevronDown} className={`text-xs text-gray-400 transition-transform duration-300 ${active ? 'rotate-180' : ''}`} />
            </button>

            {active && (
                <div className="absolute z-10 left-4 right-4 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 max-h-56 overflow-y-auto custom-scrollbar">
                    {Object.values(COUNTRIES).map((c) => (
                        <button
                            key={c.code}
                            onClick={() => handleChange(c.code)}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                c.code === currentCode
                                    ? 'bg-blue-50/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Composant Principal
const DashSideBar = () => {
    const { user, API_URL } = useAuth();
    const { theme } = useColorScheme();
    const location = useLocation();
    const { isCollapsed, setIsCollapsed } = useSidebarContext();
    const { getRoleById } = useRole();
    
    const [perms, setPerms] = useState([]);

    useEffect(() => {
        if (user?.roleId) {
            getRoleById(user.roleId)
                .then(res => setPerms(Array.isArray(res?.permissions) ? res.permissions : []))
                .catch(() => {
                    toast.error("Impossible de charger les permissions.");
                    setPerms([]);
                });
        }
    }, [user, getRoleById]);

    const isAdmin = user?.role?.includes('Admin') || user?.role?.includes('SUPER_ADMIN');
    const toggleSidebar = useCallback(() => setIsCollapsed(prev => !prev), [setIsCollapsed]);

    const hasPermission = useCallback((requiredPermissions) => {
        if (!requiredPermissions || requiredPermissions.length === 0) return true;
        return requiredPermissions.some(perm => perms.includes(perm));
    }, [perms]);

    const SidebarLink = ({ to, icon, title }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                title={title}
                className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 mb-1 ${
                    isCollapsed ? 'justify-center w-full' : 'w-full'
                } ${
                    isActive
                        ? 'bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
            >
                <div className="flex items-center justify-center w-6 transition-transform group-hover:scale-110">
                    <FontAwesomeIcon icon={icon} className={`${isCollapsed ? 'text-xl' : 'text-lg'}`} />
                </div>
                {!isCollapsed && <span className="text-sm flex-grow truncate">{title}</span>}
            </Link>
        );
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 flex flex-col z-50 ${
                isCollapsed ? 'w-[80px]' : 'w-[280px]'
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between h-20 px-5 flex-shrink-0">
                {!isCollapsed && (
                    <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                        KombiCar
                    </h1>
                )}
                <button
                    onClick={toggleSidebar}
                    aria-label={isCollapsed ? "Ouvrir le menu" : "Réduire le menu"}
                    className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors mx-auto"
                >
                    <FontAwesomeIcon icon={faChevronDown} className={`text-sm transition-transform duration-300 ${isCollapsed ? '-rotate-90' : 'rotate-90'}`} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                {/* User Info */}
                {user && (
                    <div className={`flex items-center gap-3 mx-4 mb-6 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
                        <img
                            src={user.pictureProfileUrl ? `${API_URL}${user.pictureProfileUrl}` : generateInitialsSvg(user.firstName, user.lastName, theme)}
                            alt="Profil"
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-sm"
                        />
                        {!isCollapsed && (
                            <div className="flex flex-col flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.firstName}</p>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate tracking-wide uppercase">{user.role}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Sélecteur de pays */}
                {isAdmin && <CountrySwitcher isCollapsed={isCollapsed} />}

                {/* Navigation */}
                <nav className="flex flex-col px-3 pb-8 space-y-1">
                    <div className="px-3 mb-2">
                        {!isCollapsed && <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Menu Principal</p>}
                    </div>

                    <SidebarLink to="/admin/dashboard" icon={faTachometerAlt} title="Tableau de bord" />

                    {hasPermission(PERMISSIONS.USERS_LIST) && (
                        <DropDown icon={faUsers} title="Utilisateurs" isCollapsed={isCollapsed} sublinks={[
                            { icon: faUserTie, title: 'Clients', link: '/admin/users' },
                            { icon: faCar, title: 'Chauffeurs', link: '/admin/drivers' },
                            { icon: faUserShield, title: 'Administrateurs', link: '/admin/admins' },
                        ]} />
                    )}

                    {hasPermission(PERMISSIONS.TRIPS_LIST) && (
                        <DropDown icon={faRoad} title="Trajets" isCollapsed={isCollapsed} sublinks={[
                            { icon: faHourglassHalf, title: 'Publiés', link: '/admin/trajets/0' },
                            { icon: faCalendarDay, title: 'Terminés', link: '/admin/trajets/2' },
                            { icon: faCheckCircle, title: 'Non vérifiés', link: '/admin/trajets/3' },
                        ]} />
                    )}

                    {hasPermission(PERMISSIONS.VEHICULES_LIST) && (
                        <DropDown icon={faTruck} title="Véhicules" isCollapsed={isCollapsed} sublinks={[
                            { icon: faTags, title: 'Véhicules', link: '/admin/cars' }
                        ]} />
                    )}

                    {hasPermission(PERMISSIONS.PROMO_CODE_LIST) && (
                        <DropDown icon={faTicket} title="Codes Promo" isCollapsed={isCollapsed} sublinks={[
                            { icon: faCheckCircle, title: 'Actifs', link: '/admin/promocodes/list/active' },
                            { icon: faHourglassHalf, title: 'Expirés', link: '/admin/promocodes/list/expired' },
                            { icon: faTicket, title: 'Tous', link: '/admin/promocodes/list/all' },
                        ]} />
                    )}

                    {!isCollapsed && <div className="mt-4 mb-2 px-3 border-t border-gray-100 dark:border-gray-800 pt-4"><p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Administration</p></div>}

                    {hasPermission(PERMISSIONS.WITHDRAWALS_LIST) && (
                        <DropDown icon={faHandHoldingUsd} title="Retraits" isCollapsed={isCollapsed} sublinks={[
                            { icon: faHourglassHalf, title: 'En attente', link: '/admin/withdrawals/pending' },
                            { icon: faCalendarDay, title: 'Historique', link: '/admin/withdrawals/history' },
                        ]} />
                    )}

                    {hasPermission(PERMISSIONS.LICENCES_LIST) && (
                        <DropDown icon={faIdCard} title="Permis" isCollapsed={isCollapsed} sublinks={[
                            { icon: faHourglassHalf, title: 'En attente', link: '/admin/licences/0/1' },
                            { icon: faCheckCircle, title: 'Vérifiés', link: '/admin/licences/1/1' },
                            { icon: faTimesCircle, title: 'Rejetés', link: '/admin/licences/2/1' },
                        ]} />
                    )}

                    {hasPermission(PERMISSIONS.NOTIFICATIONS_LIST) && (
                        <DropDown icon={faBell} title="Notifications" isCollapsed={isCollapsed} sublinks={[
                            { icon: faBellConcierge, title: 'Liste & Publier', link: '/admin/notifications' }
                        ]} />
                    )}
                    
                    {hasPermission(PERMISSIONS.ROLES_LIST) && (
                        <DropDown icon={faRuler} title="Roles" isCollapsed={isCollapsed} sublinks={[
                            { icon: faUserShield, title: 'Gestion des rôles', link: '/admin/roles' }
                        ]} />
                    )}

                    <DropDown icon={faScaleBalanced} title="Suggestions" isCollapsed={isCollapsed} sublinks={[
                        { icon: faBellConcierge, title: 'Boîte à idées', link: '/admin/suggestions' }
                    ]} />
                </nav>
            </div>
        </aside>
    );
};

export default DashSideBar;