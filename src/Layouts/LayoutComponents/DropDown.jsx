import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const DropDown = ({ icon, link, title, sublinks = [] }) => {
   const [active, setActive] = useState(false);

   const handleToggle = () => {
    setActive(!active);
   };

  return (
    <div className=''> {/* Le conteneur parent n'a plus besoin d'être 'relative' car les sous-menus ne sont plus 'absolute' */}
      {/* Élément cliquable principal du menu déroulant */}
      <div
        onClick={handleToggle}
        className='flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors duration-200 mb-1' // Ajout de padding, rounded et mb-1
      >
        <FontAwesomeIcon icon={icon} className='p-2 rounded-full bg-gray-300 dark:bg-gray-700 dark:text-gray-100' />
        <p className='text-lg sm:text-xl font-medium flex-grow'>{title}</p> {/* flex-grow pour pousser l'icône à droite */}
        {/* Affiche l'icône de chevron seulement s'il y a des sous-liens */}
        {sublinks.length > 0 && (
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`transition-transform duration-300 ${active ? "rotate-180" : ""}`}
          />
        )}
      </div>

      {/* Contenu du menu déroulant (sous-liens) */}
      {active && sublinks.length > 0 && (
        <div
          // Retiré 'absolute', 'left-0', 'mt-2', 'w-48', 'shadow-lg', 'z-20'
          className='flex flex-col pl-6 pr-2 py-1 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 mx-2 mb-2' // Ajusté les paddings et ajout de marges latérales et inférieures
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          {sublinks.map((sublink, index) => (
            <Link
              key={index}
              to={sublink.link}
              className='flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                         hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-md' // Ajout de rounded-md
              role="menuitem"
              onClick={() => setActive(false)} // Ferme le dropdown après le clic
            >
              {sublink.icon && <FontAwesomeIcon icon={sublink.icon} className="w-4 h-4" />} {/* Taille d'icône plus petite */}
              {sublink.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;