import { faCircle, faStar, faCar, faUsers, faWifi, faTemperatureHigh, faLuggageCart, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import useColorScheme from '../../hooks/useColorScheme';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/fr';
import { API_URL } from '../../api/api-settings';

dayjs.extend(localizedFormat);
dayjs.locale('fr');

const ResultCard = ({ trip }) => {
  const { theme } = useColorScheme();
  // Fonction utilitaire pour formater l'heure
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

  // Condition de garde pour s'assurer que les données nécessaires existent
  if (!trip || !trip.trip || !trip.departureArea || !trip.arrivalArea || !trip.driver || !trip.vehicule) {
    return null;
  }

  const { driver, vehicule, trip: tripData } = trip;
  const driverFullName = `${driver.firstName} ${driver.lastName}`;
  const driverPhotoUrl = driver.photoUrl;
  const driverRating = 4; // La notation n'est pas dans le modèle fourni, on utilise un placeholder
  const vehicleName = `${vehicule.brand} ${vehicule.model}`;

  // 🛑 LOGIQUE MODIFIÉE ICI : Déterminer la source de l'image
  const isExternalUrl = driverPhotoUrl && (driverPhotoUrl.startsWith('http://') || driverPhotoUrl.startsWith('https://'));
  const finalDriverPhotoSrc = isExternalUrl 
    ? driverPhotoUrl 
    : driverPhotoUrl 
      ? `${API_URL}${driverPhotoUrl}` 
      : null;


  return (
    <Link to={`/trip-detail/${tripData.id}`} className="block">
      <div className={`relative w-full rounded-xl ${cardBg} ${shadowHover} border ${borderColor}
                      ${hoverBorderColor} transition-all duration-300`}>

        {/* Section 1: Itinéraire et prix */}
        <div className='p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6'>
          <div className='flex items-center w-full sm:w-2/3'>
            <div className='flex flex-col items-center mr-4'>
              <p className={`font-semibold text-lg ${textColorPrimary}`}>{formatTime(tripData.departureDate)}</p>
              {tripData.departureDate && (
                <p className={`text-sm ${textColorSecondary}`}>{dayjs(tripData.departureDate).format('DD MMMM YYYY')}</p>
              )}
              <p className={`text-sm ${textColorSecondary}`}>{trip.departureArea.homeTownName || 'N/A'}</p>
            </div>
            <div className='relative flex-1 h-px bg-gray-300 mx-2 dark:bg-gray-600'>
              <FontAwesomeIcon icon={faCircle} className='absolute -left-1.5 top-1/2 -translate-y-1/2 text-sm text-green-500 dark:text-green-400' />
              <FontAwesomeIcon icon={faCircle} className='absolute -right-1.5 top-1/2 -translate-y-1/2 text-sm text-red-500 dark:text-red-400' />
            </div>
            <div className='flex flex-col items-center ml-4'>
              <p className={`font-semibold text-lg ${textColorPrimary}`}>{'--:--'}</p>
              <p className={`text-sm ${textColorSecondary}`}>{trip.arrivalArea.homeTownName || 'N/A'}</p>
            </div>
          </div>
          <div className='flex-shrink-0 ml-auto'>
            <h2 className='font-extrabold text-3xl text-green-600 dark:text-green-400'>
              {tripData.pricePerPlace} XAF
            </h2>
          </div>
        </div>

        <hr className={`w-full ${hrColor}`} />

        {/* Section 2: Infos du conducteur et du véhicule */}
        <div className='p-6 flex justify-between items-center flex-wrap gap-4'>
            {/* Infos du conducteur */}
            <div className='flex items-center gap-4'>
                {finalDriverPhotoSrc ? (
                    <img src={finalDriverPhotoSrc} alt={driverFullName} className='w-12 h-12 rounded-full object-cover' />
                ) : (
                    <div className='w-12 h-12 rounded-full flex items-center justify-center bg-gray-300 dark:bg-gray-700'>
                        <FontAwesomeIcon icon={faCar} className='text-gray-500 text-xl' />
                    </div>
                )}
                <div className='flex flex-col'>
                    <p className={`font-semibold ${textColorPrimary}`}>{driverFullName}</p>
                    <div className='flex items-center text-yellow-500 text-xs'>
                        {/* Rating du conducteur */}
                        {Array.from({ length: 5 }, (_, i) => (
                            <FontAwesomeIcon key={i} icon={faStar} className={i < driverRating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Détails du véhicule et places */}
            <div className='flex items-center gap-4 text-sm'>
                <div className='flex items-center gap-2'>
                    <FontAwesomeIcon icon={faCar} className={textColorSecondary} />
                    <span className={textColorSecondary}>{vehicleName}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <FontAwesomeIcon icon={faUsers} className={textColorSecondary} />
                    <span className={`font-semibold ${textColorPrimary}`}>{tripData.placesLeft} <span className={textColorSecondary}>places</span></span>
                </div>
            </div>
        </div>

        <hr className={`w-full ${hrColor}`} />

        {/* Section 3: Caractéristiques du trajet */}
        <div className='p-6 flex flex-wrap justify-between items-center gap-4'>
          {vehicule.airConditionned && (
            <div className='flex items-center gap-2 text-sm'>
              <FontAwesomeIcon icon={faTemperatureHigh} className={`text-blue-500`} />
              <span className={textColorSecondary}>Climatisé</span>
            </div>
          )}
          {tripData.authorizedLuggages && (
            <div className='flex items-center gap-2 text-sm'>
              <FontAwesomeIcon icon={faLuggageCart} className={`text-brown-500`} />
              <span className={textColorSecondary}>Bagages autorisés</span>
            </div>
          )}
          <div className='flex items-center gap-2 text-sm'>
            <FontAwesomeIcon icon={faClock} className={`text-purple-500`} />
            <span className={textColorSecondary}>
              Publié le {dayjs(tripData.publishingDate).format('L')}
            </span>
          </div>
          {/* Si vous avez une notation ou d'autres infos sur le véhicule, ajoutez-les ici */}
          {vehicule.isVerified && (
            <div className='flex items-center gap-2 text-sm'>
              <FontAwesomeIcon icon={faStar} className={`text-yellow-500`} />
              <span className={textColorSecondary}>Véhicule vérifié</span>
            </div>
          )}
        </div>

      </div>
    </Link>
  );
};

export default ResultCard;