import { faArrowRight, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import useColorScheme from '../../hooks/useColorScheme';
import { Link } from 'react-router-dom';

const TripCard = ({ trip }) => {
  const { theme } = useColorScheme();

  // Définition des couleurs dynamiques basées sur le thème
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const textColorSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
  const dividerColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const shadowHover = theme === 'dark' ? 'hover:shadow-lg' : 'hover:shadow-xl';

  // Fonction utilitaire pour extraire l'heure d'un string ISO 8601
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Ajout d'une condition de garde pour s'assurer que l'objet trip existe
  if (!trip || !trip.trip || !trip.departureArea || !trip.arrivalArea) {
    return null; // ou un composant de remplacement pour les données manquantes
  }

  return (
    // Le lien est maintenant dynamique pour diriger vers la page de détails du trajet
    <Link to={`/trip-detail/${trip.trip.id}`} className="block">
      <div className={`card ${cardBg} w-full h-auto overflow-hidden rounded-[15px] shadow-lg dark:text-gray-200`}>
        {/* L'image est une illustration par défaut, car la thumbnail n'est pas dans les données du contexte */}
        <img
          src={'/default/city-1.jpg'}
          className='w-full h-[200px] object-cover rounded-t-[15px]'
          alt={`Illustration du trajet depuis ${trip.departureArea?.homeTownName} vers ${trip.arrivalArea?.homeTownName}`}
        />
        <div className='p-6 w-full relative'>
          <div className='flex justify-between items-center text-xl font-bold mb-4'>
            {/* Utilisation des chemins d'accès corrects depuis l'objet du contexte */}
            <p className={textColorPrimary}>{trip.departureArea?.homeTownName || 'Départ'}</p>
            <FontAwesomeIcon icon={faArrowRight} className={textColorSecondary} />
            {/* Utilisation des chemins d'accès corrects depuis l'objet du contexte */}
            <p className={textColorPrimary}>{trip.arrivalArea?.homeTownName || 'Arrivée'}</p>
          </div>
          <div>
            <span className={`font-bold text-sm ${textColorSecondary}`}>Prix à partir de</span>
            <p className='text-2xl font-bold text-green-600 dark:text-green-400'>{trip.trip?.pricePerPlace} XAF</p>
          </div>
          <hr className={`w-full my-4 ${dividerColor}`} />

          <div className='pt-2 pb-4 pr-10'>
            <div className='grid grid-cols-2 gap-4 text-center'>
              <div>
                <h4 className={`text-xs ${textColorSecondary}`}>Départ</h4>
                <p className={`font-bold ${textColorPrimary}`}>{formatTime(trip.trip?.departureDate)}</p>
              </div>
              <div>
                <h4 className={`text-xs ${textColorSecondary}`}>Places restantes</h4>
                <p className={`font-bold ${textColorPrimary}`}>{trip.trip?.placesLeft}</p>
              </div>
            </div>
          </div>
          
          <FontAwesomeIcon
            className='absolute text-4xl top-1/2 -translate-y-1/2 right-4 text-green-500 cursor-pointer'
            icon={faCircleArrowRight}
          />
        </div>
      </div>
    </Link>
  );
};

export default TripCard;