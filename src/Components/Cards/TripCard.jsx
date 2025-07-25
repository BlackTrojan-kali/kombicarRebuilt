import { faArrowRight, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const TripCard = ({ trip }) => {
  return (
    // Supprimez le `m-4` du div principal ici, l'espacement sera géré par le `px-2` dans le Slider
    // Utilisez `w-full` pour que la carte prenne la largeur disponible dans la slide du slider
    <div className='card bg-white w-full h-auto overflow-hidden rounded-[15px] shadow-lg dark:bg-gray-700 dark:text-gray-200'>
      <img src={trip.thumbnail} className='w-full h-[200px] object-cover' alt={`Thumbnail for trip from ${trip.depart} to ${trip.arrive}`} />
      <div className='p-[25px] w-full'>
        <div className='flex justify-between items-center text-xl font-bold mb-4'> {/* Added mb-4 for spacing */}
          <p className="text-gray-800 dark:text-gray-100">{trip.depart}</p>
          <FontAwesomeIcon icon={faArrowRight} className="text-gray-500 dark:text-gray-400" />
          <p className="text-gray-800 dark:text-gray-100">{trip.arrive}</p>
        </div>
        <div>
          <span className='font-bold text-gray-400 pt-4 dark:text-gray-300'>Prix à partir de</span>
          <p className='text-2xl font-bold text-kombigreen-500'>{trip.prix} XAF</p>
        </div>
        <hr className='w-full border-gray-200 mt-4 dark:border-gray-600' />

        {/* Simplification du layout pour mieux gérer l'espace et le texte */}
        <div className='pt-6 pb-4 relative'> {/* Adjusted padding */}
          <div className='grid grid-cols-2 gap-4 text-center'> {/* Use grid for driver/distance layout */}
            <div>
              <h4 className='text-xs text-gray-500 dark:text-gray-400'>Chauffeur</h4>
              <p className='font-bold text-gray-800 dark:text-gray-100'>{trip.chauffeur.nom}</p>
            </div>
            <div>
              <h4 className='text-xs text-gray-500 dark:text-gray-400'>Distance</h4>
              <p className='font-bold text-gray-800 dark:text-gray-100'>{trip.distance}km</p>
            </div>
          </div>
          <div className='text-center mt-4'> {/* Centralized "Trajets effectués" */}
            <h4 className='text-xs text-gray-500 dark:text-gray-400'>Trajets effectués</h4>
            <p className='font-bold text-gray-800 dark:text-gray-100'>{trip.chauffeur.trajets_effectues}</p>
          </div>
          {/* L'icône peut être positionnée absolument si vous le souhaitez, mais assurez-vous qu'elle ne chevauche pas le texte */}
          <FontAwesomeIcon
            className='absolute text-4xl top-1/2 -translate-y-1/2 right-0 text-kombigreen-500 cursor-pointer'
            icon={faCircleArrowRight}
          />
        </div>
      </div>
    </div>
  );
};

export default TripCard;