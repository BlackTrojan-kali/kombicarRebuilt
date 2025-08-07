import { faCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import useColorScheme from '../../hooks/useColorScheme';

const ResultCard = ({ trip }) => {
  const { theme } = useColorScheme();

  // Fonction utilitaire pour extraire l'heure d'un string ISO 8601
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Définition des couleurs dynamiques basées sur le thème
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const hrColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const shadowHover = theme === 'dark' ? 'hover:shadow-lg' : 'hover:shadow-xl';
  const hoverBorderColor = theme === 'dark' ? 'hover:border-green-400' : 'hover:border-green-500';

  return (
    // Utilise un lien dynamique pour naviguer vers la page de détails du trajet
    <Link to={`/trip-detail/${trip.id}`} className="block">
      <div className={`relative w-full rounded-xl ${cardBg} ${shadowHover} border ${borderColor}
                      ${hoverBorderColor} transition-all duration-300`}>

        {/* Section Trajet et Heures */}
        <div className='p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6'>
          <div className='flex items-center w-full sm:w-2/3'>
            {/* Heure de départ et ville */}
            <div className='flex flex-col items-center mr-4'>
              <p className={`font-semibold text-lg ${textColorPrimary}`}>
                {formatTime(trip.departureDate)}
              </p>
              <p className={`text-sm ${textColorSecondary}`}>
                {/* On suppose que le hook useTrips ou la logique parente a simplifié l'objet de trajet */}
                {trip.startAreaPointCreateDto?.homeTownName || 'N/A'}
              </p>
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

            {/* Heure d'arrivée et ville */}
            <div className='flex flex-col items-center ml-4'>
              <p className={`font-semibold text-lg ${textColorPrimary}`}>
                {/* L'heure d'arrivée n'est pas dans les données, on affiche un placeholder */}
                {'Heure arrivée'}
              </p>
              <p className={`text-sm ${textColorSecondary}`}>
                {trip.arivalAreaPointCreateDto?.homeTownName || 'N/A'}
              </p>
            </div>
          </div>

          {/* Prix par place */}
          <div className='flex-shrink-0 ml-auto'>
            <h2 className='font-extrabold text-3xl text-green-600 dark:text-green-400'>
              {trip.pricePerPlace} XAF
            </h2>
          </div>
        </div>

        <hr className={`w-full ${hrColor}`} />

        {/* Section Infos supplémentaires */}
        {trip.aditionalInfos && (
          <div className='p-6'>
            <p className={`text-sm italic ${textColorSecondary}`}>
              {trip.aditionalInfos}
            </p>
          </div>
        )}

      </div>
    </Link>
  );
};

export default ResultCard;
