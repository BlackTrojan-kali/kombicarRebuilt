import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const DropDown = ({ icon, title, sublinks = [], isCollapsed }) => {
    const location = useLocation();

    // Détermine si un sous-lien est actif
    const isSublinkActive = useMemo(
        () => sublinks.some((s) => location.pathname === s.link),
        [location.pathname, sublinks]
    );

    // Initialise l'état ouvert si un sous-lien est actif au chargement
    const [isOpen, setIsOpen] = useState(isSublinkActive);

    // Maintient le dropdown ouvert si l'utilisateur navigue depuis ailleurs
    useEffect(() => {
        if (isSublinkActive) {
            setIsOpen(true);
        }
    }, [isSublinkActive]);

    const handleToggle = () => {
        if (!isCollapsed) setIsOpen((prev) => !prev);
    };

    // Rendu en mode 'réduit' (Sidebar repliée)
    if (isCollapsed) {
        return (
            <Link
                to={sublinks[0]?.link || '#'}
                title={title}
                className="flex items-center justify-center w-full h-12 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 mb-1"
            >
                <FontAwesomeIcon icon={icon} className="text-xl" />
            </Link>
        );
    }

    return (
        <div className="mb-1 w-full">
            {/* Élément cliquable principal */}
            <button
                onClick={handleToggle}
                aria-expanded={isOpen}
                className={`group flex items-center w-full gap-3 p-3 rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isSublinkActive && !isOpen
                        ? 'bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
            >
                <div className="flex items-center justify-center w-6 transition-transform group-hover:scale-110">
                    <FontAwesomeIcon icon={icon} className="text-lg" />
                </div>
                <span className="text-sm font-semibold flex-grow text-left truncate">
                    {title}
                </span>
                {sublinks.length > 0 && (
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`text-xs opacity-70 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                        }`}
                    />
                )}
            </button>

            {/* Contenu du menu déroulant (sous-liens) avec animation CSS Grid */}
            <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="flex flex-col pl-4 ml-6 border-l border-gray-200 dark:border-gray-700 py-1 mt-1 space-y-1">
                        {sublinks.map((sublink, index) => {
                            const isActive = location.pathname === sublink.link;
                            return (
                                <Link
                                    key={index}
                                    to={sublink.link}
                                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                        isActive
                                            ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-medium'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100'
                                    }`}
                                >
                                    {sublink.icon && (
                                        <FontAwesomeIcon
                                            icon={sublink.icon}
                                            className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}
                                        />
                                    )}
                                    <span className="truncate">{sublink.title}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropDown;