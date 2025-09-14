import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';

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
      {/* Élément cliquable principal du menu déroulant */}
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

      {/* Contenu du menu déroulant (sous-liens) */}
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

export default DropDown;