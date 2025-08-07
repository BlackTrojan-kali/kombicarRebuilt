import { faCalendar, faStar, faRoad, faInfoCircle, faCar, faCircle, faUser, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../Components/ui/Button';
import useTrips from '../hooks/useTrips'; // Import mis à jour
import useColorScheme from '../hooks/useColorScheme';
import dayjs from 'dayjs';
import 'dayjs/locale/fr'; // Import de la locale française
dayjs.locale('fr');

const TripDetail = () => {
    const { tripId } = useParams();
    const { getTripById, loading,test, error } = useTrips(); // Utilisation du hook useTrip
    const { theme } = useColorScheme();
    const [trip, setTrip] = useState(null);
    useEffect(() => {
        const fetchDetails = async () => {
            if (tripId) {
                const fetchedTrip = await getTripById(tripId);
                setTrip(fetchedTrip);
            }
        };
        fetchDetails();
    }, [tripId]);

    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

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
    
    // Extraction de la date et de l'heure de départ
    const departureDate = trip.departureDate ? dayjs(trip.departureDate).format('DD MMMM YYYY') : 'Date non spécifiée';
    const departureTime = trip.departureDate ? dayjs(trip.departureDate).format('HH:mm') : 'Heure non spécifiée';
    
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FontAwesomeIcon key={`star-${i}`} icon={faStar} className='text-yellow-400' />);
        }
        return stars;
    };

    return (
        <div className={`min-h-screen pt-20 pb-10 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} ${textColorPrimary} transition-colors duration-300`}>
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-8 ${textColorPrimary}`}>
                    Trajet {trip.startAreaPointCreateDto.homeTownName} - {trip.arivalAreaPointCreateDto.homeTownName}
                </h1>

                <div className='flex flex-col lg:flex-row gap-8 items-start'>
                    <div className='w-full lg:w-2/3 flex flex-col gap-6'>
                        {/* Carte des Détails du Trajet et Heures */}
                        <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
                            <div className={`flex justify-between items-center mb-4 pb-4 border-b ${borderColor}`}>
                                <h2 className={`text-2xl font-bold ${textColorPrimary}`}>Détails du trajet</h2>
                                <p className={`text-lg font-semibold ${textColorSecondary}`}>
                                    <FontAwesomeIcon icon={faCalendar} className='mr-2 text-blue-500' />
                                    {departureDate}
                                </p>
                            </div>
                            <div className='flex items-center justify-center space-x-4'>
                                <div className='flex flex-col items-center'>
                                    <p className={`font-semibold text-xl ${textColorPrimary}`}>{departureTime}</p>
                                    <p className={`${textColorSecondary}`}>{trip.startAreaPointCreateDto.homeTownName}</p>
                                </div>
                                <div className={`relative flex-1 h-px bg-gray-300 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} mx-4`}>
                                    <FontAwesomeIcon
                                        icon={faCircle}
                                        className='absolute -left-2 top-1/2 -translate-y-1/2 text-base text-blue-500'
                                    />
                                    <FontAwesomeIcon
                                        icon={faRoad}
                                        className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl text-gray-500'
                                    />
                                    <FontAwesomeIcon
                                        icon={faCircle}
                                        className='absolute -right-2 top-1/2 -translate-y-1/2 text-base text-green-500'
                                    />
                                </div>
                                <div className='flex flex-col items-center'>
                                    <p className={`font-semibold text-xl ${textColorPrimary}`}>--:--</p>
                                    <p className={`${textColorSecondary}`}>{trip.arivalAreaPointCreateDto.homeTownName}</p>
                                </div>
                            </div>
                            <p className={`text-sm ${textColorSecondary} text-center mt-4`}>
                                <FontAwesomeIcon icon={faInfoCircle} className='mr-1' /> Heure d'arrivée et durée non spécifiées
                            </p>
                        </div>
                        
                        {/* Carte du Chauffeur - Réactivée */}
                        {trip.driver && (
                            <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
                                <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4`}>
                                    <FontAwesomeIcon icon={faUser} className='mr-2 text-gray-500' /> À propos du chauffeur
                                </h2>
                                <div className='flex items-center space-x-4'>
                                    <img src={trip.driver.profileImage} alt={`Profil de ${trip.driver.name}`} className='w-16 h-16 rounded-full object-cover' />
                                    <div>
                                        <p className={`text-xl font-bold ${textColorPrimary}`}>{trip.driver.name}</p>
                                        <div className='flex items-center space-x-1 text-sm text-yellow-400'>
                                            {renderStars(trip.driver.rating)}
                                            <span className={`ml-2 text-sm font-semibold ${textColorSecondary}`}>{trip.driver.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Carte de la Description du Trajet - Réactivée */}
                        {trip.aditionalInfos && (
                            <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
                                <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4`}>
                                    <FontAwesomeIcon icon={faCommentDots} className='mr-2 text-gray-500' /> Description du trajet
                                </h2>
                                <p className={`${textColorSecondary} leading-relaxed`}>
                                    {trip.aditionalInfos}
                                </p>
                            </div>
                        )}
                        
                        {/* Carte des Options du véhicule - Réactivée */}
                        {trip.driver && trip.driver.vehicle && (
                            <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
                                <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4`}>
                                    <FontAwesomeIcon icon={faCar} className='mr-2 text-gray-500' /> Options du véhicule
                                </h2>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div className='flex items-center'>
                                        <p className={`text-lg ${textColorSecondary}`}>Marque:</p>
                                        <p className={`ml-2 font-semibold ${textColorPrimary}`}>{trip.driver.vehicle.brand}</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <p className={`text-lg ${textColorSecondary}`}>Modèle:</p>
                                        <p className={`ml-2 font-semibold ${textColorPrimary}`}>{trip.driver.vehicle.model}</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <p className={`text-lg ${textColorSecondary}`}>Couleur:</p>
                                        <p className={`ml-2 font-semibold ${textColorPrimary}`}>{trip.driver.vehicle.color}</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <p className={`text-lg ${textColorSecondary}`}>Année:</p>
                                        <p className={`ml-2 font-semibold ${textColorPrimary}`}>{trip.driver.vehicle.year}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Colonne Latérale (Récapitulatif et Réservation) */}
                    <div className='w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-24'>
                        <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
                            <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4`}>Récapitulatif</h2>
                            <div className={`flex justify-between items-center py-2 border-b ${borderColor}`}>
                                <p className={`text-lg ${textColorSecondary}`}>Prix par passager</p>
                                <p className='text-xl font-bold text-green-600 dark:text-green-400'>{trip.pricePerPlace} XAF</p>
                            </div>
                            <div className='flex justify-between items-center py-2'>
                                <p className={`text-lg ${textColorSecondary}`}>Places restantes</p>
                                <p className={`text-xl font-bold ${textColorPrimary}`}>{trip.placesLeft}</p>
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
    );
};

export default TripDetail;
