import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme'; // Assurez-vous que le chemin est correct

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  const { theme } = useColorScheme();
  const modalRef = useRef(null);

  // Gère la fermeture de la modal si l'utilisateur clique en dehors
  const handleOverlayClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  // Gère la fermeture de la modal avec la touche Échap
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Empêche le scroll du body lorsque la modal est ouverte
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleEscapeKey);
      // Rétablit le scroll du body lorsque la modal est fermée
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  // Détermine la largeur de la modal en fonction de la prop 'size'
  let modalWidthClass;
  switch (size) {
    case 'sm':
      modalWidthClass = 'max-w-sm';
      break;
    case 'md':
      modalWidthClass = 'max-w-md';
      break;
    case 'lg':
      modalWidthClass = 'max-w-lg';
      break;
    case 'xl':
      modalWidthClass = 'max-w-xl';
      break;
    case '2xl':
      modalWidthClass = 'max-w-2xl';
      break;
    case 'full':
      modalWidthClass = 'max-w-full w-full';
      break;
    default:
      modalWidthClass = 'max-w-md';
  }

  // Utilisation de createPortal pour rendre la modal directement sous le body
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`relative ${modalWidthClass} w-full rounded-lg shadow-xl transform transition-all sm:my-8 sm:w-full
          ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture lors du clic à l'intérieur de la modal
      >
        {/* En-tête de la modal */}
        <div className={`flex justify-between items-center p-5 border-b
          ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className="text-xl font-semibold">
            {title}
          </h3>
          <button
            type="button"
            className={`text-gray-400 hover:text-gray-600 ${theme === 'dark' ? 'dark:hover:text-gray-300' : ''}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md`}
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          </button>
        </div>

        {/* Corps de la modal */}
        <div className="p-6">
          {children}
        </div>

        {/* Pied de page de la modal (optionnel) */}
        {footer && (
          <div className={`flex justify-end items-center p-4 border-t
            ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body // Rend la modal directement dans le body
  );
};

export default Modal;