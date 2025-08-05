import { faArrowRight, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import useColorScheme from '../../hooks/useColorScheme'; // Importez le hook de thème

const TripCard = ({ trip }) => {
  const { theme } = useColorScheme(); // Utilisez le hook pour accéder au thème

  // Définition des couleurs dynamiques basées sur le thème
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const textColorSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
  const dividerColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-200';

  return (
    // Utilisez `w-full` pour que la carte prenne la largeur disponible dans la slide du slider.
    // Ajustez le padding global de la carte pour s'assurer que l'icône ne chevauche pas.
    <div className='card bg-white w-full h-auto overflow-hidden rounded-[15px] shadow-lg dark:bg-gray-700 dark:text-gray-200'>
      <img src={trip.thumbnail} className='w-full h-[200px] object-cover' alt={`Thumbnail for trip from ${trip.depart} to ${trip.arrive}`} />
      <div className='p-6 w-full relative'> {/* Utilisation de p-6 (24px) pour un espacement cohérent */}
        <div className='flex justify-between items-center text-xl font-bold mb-4'>
          <p className={textColorPrimary}>{trip.depart}</p>
          <FontAwesomeIcon icon={faArrowRight} className={textColorSecondary} />
          <p className={textColorPrimary}>{trip.arrive}</p>
        </div>
        <div>
          <span className={`font-bold pt-4 ${textColorSecondary}`}>Prix à partir de</span>
          <p className='text-2xl font-bold text-kombigreen-500'>{trip.prix} XAF</p>
        </div>
        <hr className={`w-full mt-4 ${dividerColor}`} />

        <div className='pt-6 pb-4 pr-10'> {/* Ajout de pr-10 pour laisser de la place à l'icône */}
          <div className='grid grid-cols-2 gap-4 text-center'>
            <div>
              <h4 className={`text-xs ${textColorSecondary}`}>Chauffeur</h4>
              <p className={`font-bold ${textColorPrimary}`}>{trip.chauffeur.nom}</p>
            </div>
            <div>
              <h4 className={`text-xs ${textColorSecondary}`}>Distance</h4>
              <p className={`font-bold ${textColorPrimary}`}>{trip.distance}km</p>
            </div>
          </div>
          <div className='text-center mt-4'>
            <h4 className={`text-xs ${textColorSecondary}`}>Trajets effectués</h4>
            <p className={`font-bold ${textColorPrimary}`}>{trip.chauffeur.trajets_effectues}</p>
          </div>
          {/* L'icône est positionnée absolument, mais le padding droit du parent `pr-10`
              s'assure qu'elle ne chevauche pas le texte. */}
          <FontAwesomeIcon
            className='absolute text-4xl top-1/2 -translate-y-1/2 right-4 text-kombigreen-500 cursor-pointer' // right-4 pour un petit espacement
            icon={faCircleArrowRight}
          />
        </div>
      </div>
    </div>
  );
};

export default TripCard;
