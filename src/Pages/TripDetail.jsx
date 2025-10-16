import { faCalendar, faStar, faRoad, faInfoCircle, faCar, faCircle, faUser, faCommentDots, faUsers, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast'; 
import Button from '../Components/ui/Button';
import useTrips from '../hooks/useTrips';
import useColorScheme from '../hooks/useColorScheme';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import useAuth from '../hooks/useAuth';
import ReservationModal from '../Components/Modals/ReservationModal';

dayjs.locale('fr');

const TripDetail = () => {
    const { tripId } = useParams();
    const { getTripById, loading, error } = useTrips();
    const { theme } = useColorScheme();
    const [trip, setTrip] = useState(null);
    const { user, API_URL } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (tripId && user) {
                const fetchedTrip = await getTripById(tripId);
                setTrip(fetchedTrip || null);
            }
        };
        fetchDetails();
    }, [tripId, user]); 

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = (isSuccess = false) => {
        setIsModalOpen(false);
        if (isSuccess) {
            toast.success("Votre demande de réservation a été envoyée !");
        }
    };

    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

    if (!user) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center text-center px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} ${textColorPrimary}`}>
                <FontAwesomeIcon icon={faInfoCircle} className="text-6xl text-blue-500 mb-6" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                    Veuillez vous connecter pour voir les détails de ce trajet.
                </h2>
                <p className={`text-base sm:text-lg mb-6 ${textColorSecondary}`}>
                    Les informations du trajet sont disponibles uniquement pour les utilisateurs connectés.
                </p>
                <Link
                    to="/auth/signin"
                    className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-white bg-kombigreen-500 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-md transition-colors duration-200"
                >
                    Se connecter
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} ${textColorPrimary}`}>
                <p>Chargement des détails du trajet...</p>
            </div>
        );
    }

    if (!trip || error) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} ${textColorPrimary}`}>
                <p>Trajet non trouvé ou erreur de chargement.</p>
            </div>
        );
    }

    const { departureArea, arrivalArea, driver, vehicule, trip: tripData } = trip;
    const departureDate = tripData.departureDate ? dayjs(tripData.departureDate).format('DD MMMM YYYY') : 'Date non spécifiée';
    const departureTime = tripData.departureDate ? dayjs(tripData.departureDate).format('HH:mm') : 'Heure non spécifiée';
    const departureTown = departureArea?.homeTownName || 'Non spécifié';
    const arrivalTown = arrivalArea?.homeTownName || 'Non spécifié';
    const additionalInfos = tripData.additionalInfos;
    const pricePerPlace = tripData.pricePerPlace;
    const placesLeft = tripData.placesLeft;

    // LOGIQUE DE TRONCATURE DU TITRE (slice)
    const fullTitle = `Trajet ${departureTown} - ${arrivalTown}`;
    const maxTitleLength = 45; 
    const truncatedTitle = fullTitle.length > maxTitleLength 
        ? fullTitle.slice(0, maxTitleLength) + '...'
        : fullTitle;

    // 🛑 NOUVELLE LOGIQUE POUR LA SOURCE DE L'IMAGE DU CHAUFFEUR
    const driverPhotoUrl = driver?.photoUrl;
    const isExternalUrl = driverPhotoUrl && (driverPhotoUrl.startsWith('http://') || driverPhotoUrl.startsWith('https://'));
    const finalDriverPhotoSrc = isExternalUrl 
        ? driverPhotoUrl 
        : driverPhotoUrl 
          ? `${API_URL}${driverPhotoUrl}` 
          : null;


    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        // Note: Half-star logic from original code was removed as it wasn't fully implemented, 
        // focusing only on full stars for simplicity as per common use cases.
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FontAwesomeIcon key={`star-${i}`} icon={faStar} className='text-yellow-400' />);
        }
        return stars;
    };

    return (
        <div className={`min-h-screen pt-20 pb-10 ${theme === 'dark' ? 'bg-gray-900' : ''} ${textColorPrimary} transition-colors duration-300`}>
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-8 ${textColorPrimary}`}>
                    {truncatedTitle}
                </h1>

                <div className='flex flex-col lg:flex-row gap-8 items-start'>
                    <div className='w-full lg:w-2/3 flex flex-col gap-6'>
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
                                    <p className={`${textColorSecondary}`}>{departureTown}</p>
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
                                    <p className={`${textColorSecondary}`}>{arrivalTown}</p>
                                </div>
                            </div>
                        </div>

                        {driver && (
                            <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
                                <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4`}>
                                    <FontAwesomeIcon icon={faUser} className='mr-2 text-gray-500' /> À propos du chauffeur
                                </h2>
                                <div className='flex items-center space-x-4'>
                                    {/* UTILISATION DE LA NOUVELLE SOURCE D'IMAGE */}
                                    <img 
                                        src={finalDriverPhotoSrc} 
                                        alt={`Profil de ${driver.firstName}`} 
                                        className='w-16 h-16 rounded-full object-cover' 
                                    />
                                    <div>
                                        <p className={`text-xl font-bold ${textColorPrimary}`}>{driver.firstName} {driver.lastName}</p>
                                        <div className='flex items-center space-x-1 text-sm text-yellow-400'>
                                            {driver.rating > 0 ? (
                                                <>
                                                    {renderStars(driver.rating)}
                                                    <span className={`ml-2 text-sm font-semibold ${textColorSecondary}`}>{driver.rating.toFixed(1)}</span>
                                                </>
                                            ) : (
                                                <span className={`ml-2 text-sm font-semibold ${textColorSecondary}`}>Note non disponible</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {vehicule && (
                            <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
                                <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4`}>
                                    <FontAwesomeIcon icon={faCar} className='mr-2 text-gray-500' /> Options du véhicule
                                </h2>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div className='flex items-center'>
                                        <p className={`text-lg ${textColorSecondary}`}>Marque:</p>
                                        <p className={`ml-2 font-semibold ${textColorPrimary}`}>{vehicule.brand}</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <p className={`text-lg ${textColorSecondary}`}>Modèle:</p>
                                        <p className={`ml-2 font-semibold ${textColorPrimary}`}>{vehicule.model}</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <p className={`text-lg ${textColorSecondary}`}>Couleur:</p>
                                        <p className={`ml-2 font-semibold ${textColorPrimary}`}>{vehicule.color}</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <p className={`text-lg ${textColorSecondary}`}>Climatisation:</p>
                                        <p className={`ml-2 font-semibold ${textColorPrimary}`}>{vehicule.airConditionned ? "Oui" : "Non"}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {additionalInfos && (
                            <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
                                <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4`}>
                                    <FontAwesomeIcon icon={faCommentDots} className='mr-2 text-gray-500' /> Description du trajet
                                </h2>
                                <p className={`${textColorSecondary} leading-relaxed`}>
                                    {additionalInfos}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className='w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-24'>
                        <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
                            <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4`}>Récapitulatif</h2>
                            <div className={`flex justify-between items-center py-2 border-b ${borderColor}`}>
                                <p className={`text-lg ${textColorSecondary}`}>Prix par passager</p>
                                <p className='text-xl font-bold text-green-600 dark:text-green-400'>{pricePerPlace} XAF</p>
                            </div>
                            <div className='flex justify-between items-center py-2'>
                                <p className={`text-lg ${textColorSecondary}`}>Places restantes</p>
                                <p className={`text-xl font-bold ${textColorPrimary}`}>{placesLeft}</p>
                            </div>
                        </div>

                        <Button
                            className="w-full py-4 text-xl font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                            onClick={handleOpenModal}
                        >
                            <FontAwesomeIcon icon={faCalendar} className='mr-2' /> Demander à réserver
                        </Button>
                        <p className={`text-center text-sm ${textColorSecondary} mt-2`}>
                            Vous ne serez débité qu'après confirmation par le chauffeur.
                        </p>
                    </div>
                </div>
            </main>

            {isModalOpen && trip && <ReservationModal trip={trip} onClose={handleCloseModal} />}
        </div>
    );
};

export default TripDetail;