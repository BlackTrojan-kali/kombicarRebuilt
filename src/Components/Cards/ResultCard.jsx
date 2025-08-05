import { faCircle, faStar, faArrowRight } from '@fortawesome/free-solid-svg-icons'; // Ajout de faArrowRight pour cohérence
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import useColorScheme from '../../hooks/useColorScheme'; // Importez le hook de thème

const ResultCard = ({ trip }) => {
  const { theme } = useColorScheme(); // Utilisez le hook pour accéder au thème

  // Définition des couleurs dynamiques basées sur le thème
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const hrColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const shadowHover = theme === 'dark' ? 'hover:shadow-lg' : 'hover:shadow-xl'; // Garde la nuance de shadow
  const hoverBorderColor = theme === 'dark' ? 'hover:border-green-400' : 'hover:border-green-500';

  return (
    <Link to="/trip-detail" className="block"> {/* Utilisation de 'block' pour que le lien englobe toute la carte */}
      <div className={`relative w-full rounded-xl ${cardBg} ${shadowHover} border ${borderColor}
                      ${hoverBorderColor} transition-all duration-300`}>

        {/* Description / Étiquette */}
        {trip.desc && (
          <span className='absolute bottom-4 right-4 z-10 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full
                           dark:bg-blue-700'>
            {trip.desc}
          </span>
        )}

        <div className='p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6'>
          {/* Section Trajet et Heures */}
          <div className='flex items-center w-full sm:w-2/3'>
            <div className='flex flex-col items-center mr-4'>
              <p className={`font-semibold text-lg ${textColorPrimary}`}>{trip.heure_depart}</p>
              <p className={`text-sm ${textColorSecondary}`}>{trip.depart}</p>
            </div>

            {/* Ligne de progression avec cercles */}
            <div className='relative flex-1 h-px bg-gray-300 mx-2 dark:bg-gray-600'>
              <FontAwesomeIcon
                icon={faCircle}
                className='absolute -left-1.5 top-1/2 -translate-y-1/2 text-sm text-green-500 dark:text-green-400'
              />
              <FontAwesomeIcon
                icon={faCircle}
                className='absolute -right-1.5 top-1/2 -translate-y-1/2 text-sm text-red-500 dark:text-red-400'
              />
            </div>

            <div className='flex flex-col items-center ml-4'>
              <p className={`font-semibold text-lg ${textColorPrimary}`}>{trip.heure_arrive}</p>
              <p className={`text-sm ${textColorSecondary}`}>{trip.arrive}</p>
            </div>
          </div>

          {/* Prix */}
          <div className='flex-shrink-0 ml-auto'>
            <h2 className='font-extrabold text-3xl text-green-600 dark:text-green-400'>
              {trip.prix} XAF
            </h2>
          </div>
        </div>

        <hr className={`w-full ${hrColor}`} />

        {/* Section Chauffeur */}
        <div className='p-6 flex items-center gap-4'>
          <img
            src={trip.chauffeur.profile}
            className='w-14 h-14 rounded-full object-cover border-4 border-yellow-500 dark:border-yellow-400 flex-shrink-0'
            alt={`Profil de ${trip.chauffeur.nom}`}
          />
          <div>
            <p className={`font-semibold text-lg ${textColorPrimary}`}>
              {trip.chauffeur.nom}
            </p>
            <p className='text-yellow-500 dark:text-yellow-400'>
              <FontAwesomeIcon icon={faStar} className='mr-1 text-sm' />
              {trip.chauffeur.stars}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ResultCard;
