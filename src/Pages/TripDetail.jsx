import { faCalendar, faStar, faClock, faRoad, faInfoCircle, faCar, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'; // Importez useEffect et useState
import { useParams } from 'react-router-dom'; // Importez useParams pour récupérer l'ID du trajet
import Button from '../Components/ui/Button';
import useTrips from '../hooks/useTrips'; // Importez le hook useTrips
import useColorScheme from '../hooks/useColorScheme'; // Importez le hook de thème
import dayjs from 'dayjs'; // Importez dayjs pour le formatage de la date

const TripDetail = () => {
    const { tripId } = useParams(); // Récupère l'ID du trajet depuis l'URL
    const { getTripById, loading, error } = useTrips(); // Accède aux fonctions du contexte des trajets
    const { theme } = useColorScheme(); // Accède au thème
    const [trip, setTrip] = useState(null); // État local pour stocker les détails du trajet

    useEffect(() => {
        const fetchDetails = async () => {
            if (tripId) {
                const fetchedTrip = await getTripById(tripId);
                setTrip(fetchedTrip);
            }
        };
        fetchDetails();
    }, [tripId, getTripById]); // Déclenche la récupération quand l'ID du trajet ou getTripById change

    // Couleurs conditionnelles pour le dark mode
    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

    // Fonction pour calculer la durée estimée
    const calculateEstimatedDuration = (heureDepart, heureArrive) => {
        try {
            const [depHour, depMinute] = heureDepart.split('h').map(Number);
            const [arrHour, arrMinute] = heureArrive.split('h').map(Number);

            const depTimeInMinutes = depHour * 60 + depMinute;
            let arrTimeInMinutes = arrHour * 60 + arrMinute;

            // Gérer le cas où l'arrivée est le lendemain (si heure_arrive est plus petite que heure_depart)
            if (arrTimeInMinutes < depTimeInMinutes) {
                arrTimeInMinutes += 24 * 60; // Ajouter 24 heures en minutes
            }

            const durationInMinutes = arrTimeInMinutes - depTimeInMinutes;
            const hours = Math.floor(durationInMinutes / 60);
            const minutes = durationInMinutes % 60;

            if (hours === 0 && minutes === 0) return "Durée non spécifiée";
            if (hours === 0) return `${minutes} min`;
            if (minutes === 0) return `${hours}h`;
            return `${hours}h ${minutes}min`;
        } catch (e) {
            console.error("Erreur de calcul de durée:", e);
            return "Durée non spécifiée";
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} ${textColorPrimary}`}>
                <p>Chargement des détails du trajet...</p>
            </div>
        );
    }

  

    if (!trip) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} ${textColorPrimary}`}>
                <p>Trajet non trouvé.</p>
            </div>
        );
    }

  return (
    <div className={`min-h-screen pt-20 pb-10 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} ${textColorPrimary} transition-colors duration-300`}>
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {/* Titre du trajet */}
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-8 ${textColorPrimary}`}>
                Trajet {trip.depart} - {trip.arrive}
            </h1>

            <div className='flex flex-col lg:flex-row gap-8 items-start'>
                {/* Colonne Principale des Détails du Trajet */}
                <div className='w-full lg:w-2/3 flex flex-col gap-6'>
                    {/* Carte des Détails du Trajet et Heures */}
                    <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
                        <div className={`flex justify-between items-center mb-4 pb-4 border-b ${borderColor}`}>
                            <h2 className={`text-2xl font-bold ${textColorPrimary}`}>Détails du trajet</h2>
                            <p className={`text-lg font-semibold ${textColorSecondary}`}>
                                <FontAwesomeIcon icon={faCalendar} className='mr-2 text-blue-500' />
                                {trip.date_depart ? dayjs(trip.date_depart).format('DD MMMM YYYY') : 'Date non spécifiée'}
                            </p>
                        </div>
                        <div className='flex items-center space-x-4'>
                            <div className='flex flex-col items-center'>
                                <p className={`font-semibold text-xl ${textColorPrimary}`}>{trip.heure_depart}</p>
                                <p className={`${textColorSecondary}`}>{trip.depart}</p>
                            </div>
                            <div className={`relative flex-1 h-px bg-gray-300 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} mx-4`}>
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    className='absolute -left-2 top-1/2 -translate-y-1/2 text-base text-blue-500'
                                />
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    className='absolute -right-2 top-1/2 -translate-y-1/2 text-base text-green-500'
                                />
                            </div>
                            <div className='flex flex-col items-center'>
                                <p className={`font-semibold text-xl ${textColorPrimary}`}>{trip.heure_arrive}</p>
                                <p className={`${textColorSecondary}`}>{trip.arrive}</p>
                            </div>
                        </div>
                        <p className={`text-sm ${textColorSecondary} text-center mt-4`}>
                            <FontAwesomeIcon icon={faRoad} className='mr-1' /> Distance estimée: {trip.distance} km
                        </p>
                        <p className={`text-sm ${textColorSecondary} text-center`}>
                            <FontAwesomeIcon icon={faClock} className='mr-1' /> Durée estimée: {calculateEstimatedDuration(trip.heure_depart, trip.heure_arrive)}
                        </p>
                    </div>

                    {/* Carte du Chauffeur */}
                    <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
                        <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-4 border-b ${borderColor}`}>
                            À propos du chauffeur
                        </h2>
                        <div className='flex items-center gap-4'>
                            <img
                                src={trip.chauffeur.profile || '/default/placeholder-person.jpg'} 
                                className='w-20 h-20 rounded-full object-cover border-4 border-yellow-500 dark:border-yellow-400 flex-shrink-0'
                                alt={`Profil de ${trip.chauffeur.nom}`}
                            />
                            <div>
                                <p className={`font-bold text-xl ${textColorPrimary}`}>{trip.chauffeur.nom}</p>
                                <p className='text-yellow-500 dark:text-yellow-400 mt-1'>
                                    <FontAwesomeIcon icon={faStar} className='mr-1 text-base' />
                                    {trip.chauffeur.stars} sur 5
                                </p>
                                <p className={`${textColorSecondary} text-sm mt-1`}>
                                    {trip.chauffeur.trajets_effectues} trajets effectués
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* À propos du trajet / Description */}
                    {trip.desc && (
                        <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
                            <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-4 border-b ${borderColor}`}>
                                <FontAwesomeIcon icon={faInfoCircle} className='mr-2 text-gray-500' />
                                À propos du trajet
                            </h2>
                            <p className={`${textColorSecondary} leading-relaxed`}>{trip.desc}</p>
                        </div>
                    )}

                    {/* Options du véhicule (si présentes) */}
                    {trip.options && trip.options.length > 0 && (
                        <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
                            <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-4 border-b ${borderColor}`}>
                                <FontAwesomeIcon icon={faCar} className='mr-2 text-gray-500' />
                                Options du véhicule
                            </h2>
                            <ul className='list-disc list-inside text-gray-700 dark:text-gray-300'>
                                {trip.options.map((option, index) => (
                                    <li key={index} className='mb-1'>{option}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Colonne Latérale (Récapitulatif et Réservation) */}
                <div className='w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-24'>
                    <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
                        <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4`}>Récapitulatif</h2>
                        <div className={`flex justify-between items-center py-2 border-b ${borderColor}`}>
                            <p className={`text-lg ${textColorSecondary}`}>Prix par passager</p>
                            <p className='text-xl font-bold text-green-600 dark:text-green-400'>{trip.prix} XAF</p>
                        </div>
                        <div className='flex justify-between items-center py-2'>
                            <p className={`text-lg ${textColorSecondary}`}>Nombre de places</p>
                            <p className={`text-xl font-bold ${textColorPrimary}`}>{trip.availableSeats || 1}</p> {/* Utilise availableSeats du trip */}
                        </div>
                    </div>

                    {/* Bouton de réservation */}
                    <Button className="w-full py-4 text-xl font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                        <FontAwesomeIcon icon={faCalendar} className='mr-2' /> Demander à réserver
                    </Button>
                     <p className={`text-center text-sm ${textColorSecondary} mt-2`}>
                        Vous ne serez débité qu'après confirmation par le chauffeur.
                    </p>
                </div>
            </div>
        </main>
    </div>
  )
}

export default TripDetail;
