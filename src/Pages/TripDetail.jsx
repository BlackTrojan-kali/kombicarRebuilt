import { faCalendar, faRoad, faInfoCircle, faCar, faCircle, faCommentDots, faUsers, faMap, faTemperatureHigh, faArrowUp } from '@fortawesome/free-solid-svg-icons';
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
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- CORRECTION BUG LEAFLET (Icônes manquantes) ---
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// L'application de la correction doit se faire ici pour écraser la configuration par défaut
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: iconMarker,
    shadowUrl: iconShadow
});

dayjs.locale('fr');

const TripDetail = () => {
    const { tripId } = useParams();
    const { getTripById, loading, error } = useTrips();
    const { theme } = useColorScheme();
    const [trip, setTrip] = useState(null);
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // État pour le bouton Back to Top
    const [showTopBtn, setShowTopBtn] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (tripId && user) {
                const fetchedTrip = await getTripById(tripId);
                setTrip(fetchedTrip || null);
            }
        };
        fetchDetails();
    }, [tripId, user]); 

    // Écouteur d'événement pour afficher/masquer le bouton Back to Top
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = (isSuccess = false) => {
        setIsModalOpen(false);
        if (isSuccess) {
            toast.success("Votre demande de réservation a été envoyée !");
        }
    };

    // Variables de couleurs
    const pageBg = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'; 
    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
    const floatingCardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';

    // --- ÉTATS DE CHARGEMENT ET ERREURS ---
    if (!user) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center text-center px-4 ${pageBg} ${textColorPrimary}`}>
                <FontAwesomeIcon icon={faInfoCircle} className="text-6xl text-blue-500 mb-6" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                    Connectez-vous pour voir ce trajet
                </h2>
                <p className={`text-base sm:text-lg mb-6 max-w-md ${textColorSecondary}`}>
                    Les détails des itinéraires et les réservations sont réservés à notre communauté.
                </p>
                <Link
                    to="/auth/signin"
                    className="px-8 py-3.5 text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-200"
                >
                    Se connecter
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center ${pageBg} ${textColorPrimary}`}>
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className={textColorSecondary}>Chargement du trajet...</p>
            </div>
        );
    }

    if (!trip || error) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center text-center px-4 ${pageBg} ${textColorPrimary}`}>
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <FontAwesomeIcon icon={faRoad} className="text-4xl text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Trajet introuvable</h2>
                <p className={`${textColorSecondary} mb-6`}>Ce trajet n'existe plus ou a été annulé.</p>
                <Link to="/results">
                    <Button className="rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-3">Chercher un autre trajet</Button>
                </Link>
            </div>
        );
    }

    // --- EXTRACTION DES DONNÉES ---
    const { departureArea, arrivalArea, vehicule, trip: tripData } = trip;
    
    // Formatage Date & Heure
    const dateObj = tripData.departureDate ? dayjs(tripData.departureDate) : null;
    const formattedDate = dateObj ? dateObj.format('dddd D MMMM YYYY') : 'Date non spécifiée';
    const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    
    const departureTime = dateObj ? dateObj.format('HH:mm') : '--:--';
    const departureTown = departureArea?.homeTownName || 'Non spécifié';
    const arrivalTown = arrivalArea?.homeTownName || 'Non spécifié';
    const additionalInfos = tripData.additionalInfos;
    const pricePerPlace = tripData.pricePerPlace;
    const placesLeft = tripData.placesLeft;

    return (
        <div className={`min-h-screen pt-28 pb-20 ${pageBg} ${textColorPrimary} transition-colors duration-300 font-sans relative`}>
            
            <main className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
                
                {/* Grand Titre (Date) */}
                <h1 className={`text-3xl sm:text-4xl font-extrabold mb-10 ${textColorPrimary} text-center md:text-left`}>
                    {displayDate}
                </h1>

                <div className='flex flex-col md:flex-row gap-12 lg:gap-20 items-start'>
                    
                    {/* --- COLONNE GAUCHE (Détails) --- */}
                    <div className='w-full md:w-3/5 flex flex-col'>
                        
                        {/* 1. Itinéraire Vertical */}
                        <div className="mb-10">
                            <div className="flex flex-col relative">
                                {/* Départ */}
                                <div className="flex items-start gap-6 relative z-10">
                                    <span className={`font-bold text-xl w-14 text-right mt-0.5 ${textColorPrimary}`}>
                                        {departureTime}
                                    </span>
                                    <div className="flex flex-col items-center mt-2.5">
                                        <div className={`w-3.5 h-3.5 rounded-full border-2 ${theme === 'dark' ? 'border-gray-400 bg-gray-900' : 'border-gray-900 bg-gray-50'}`}></div>
                                        <div className={`w-1 h-12 my-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded-full`}></div>
                                    </div>
                                    <div className="flex flex-col pb-6">
                                        <span className={`font-bold text-xl ${textColorPrimary}`}>{departureTown}</span>
                                        <span className={`text-sm ${textColorSecondary} mt-1`}>{departureArea?.name || 'Point de rencontre précis à voir après réservation'}</span>
                                    </div>
                                </div>

                                {/* Arrivée */}
                                <div className="flex items-start gap-6 relative z-10">
                                    <span className={`font-bold text-xl w-14 text-right mt-0.5 ${textColorSecondary}`}>
                                        --:--
                                    </span>
                                    <div className="flex flex-col items-center mt-2.5">
                                        <div className={`w-3.5 h-3.5 rounded-full ${theme === 'dark' ? 'bg-gray-300' : 'bg-gray-900'}`}></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-bold text-xl ${textColorPrimary}`}>{arrivalTown}</span>
                                        <span className={`text-sm ${textColorSecondary} mt-1`}>{arrivalArea?.name || 'Point de dépose à définir'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className={`border-t-8 rounded-full mb-10 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`} />

                  {/* 2. Espace Carte (OpenStreetMap) */}
                        <div className="mb-10">
                            <h2 className={`text-xl font-bold mb-4 ${textColorPrimary}`}>Itinéraire</h2>
                            
                            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-inner relative z-0">
                                {(() => {
                                    // Coordonnées de fallback (Yaoundé -> Douala) 
                                    const depLat = departureArea?.latitude || 3.8480;
                                    const depLng = departureArea?.longitude || 11.5021;
                                    const arrLat = arrivalArea?.latitude || 4.0511;
                                    const arrLng = arrivalArea?.longitude || 9.7679;

                                    const positionDepart = [depLat, depLng];
                                    const positionArrivee = [arrLat, arrLng];
                                    const bounds = [positionDepart, positionArrivee];

                                    return (
                                        <MapContainer 
                                            bounds={bounds} 
                                            scrollWheelZoom={false}
                                            className="h-full w-full"
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            
                                            {/* Marqueur de départ */}
                                            <Marker position={positionDepart}>
                                                <Popup>Départ : {departureTown}</Popup>
                                            </Marker>

                                            {/* Marqueur d'arrivée */}
                                            <Marker position={positionArrivee}>
                                                <Popup>Arrivée : {arrivalTown}</Popup>
                                            </Marker>

                                            {/* Tracer une ligne entre le départ et l'arrivée */}
                                            <Polyline positions={[positionDepart, positionArrivee]} color="blue" weight={4} dashArray="5, 10" />
                                        </MapContainer>
                                    );
                                })()}
                            </div>
                        </div>
                        <hr className={`border-t-8 rounded-full mb-10 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`} />

                        {/* 3. Véhicule */}
                        {vehicule && (
                            <div className="mb-10">
                                <div className="flex items-center gap-5 mb-4">
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm text-gray-500 text-xl border border-gray-100 dark:border-gray-700">
                                        <FontAwesomeIcon icon={faCar} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-lg font-bold ${textColorPrimary}`}>{vehicule.brand} {vehicule.model}</span>
                                        <span className={`text-sm ${textColorSecondary}`}>{vehicule.color}</span>
                                    </div>
                                </div>
                                {vehicule.airConditionned && (
                                    <div className="flex items-center gap-3 text-[15px] mt-4 pl-1">
                                        <FontAwesomeIcon icon={faTemperatureHigh} className="text-gray-400 w-5" />
                                        <span className={textColorSecondary}>Véhicule climatisé</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 4. Description / Règles */}
                        {additionalInfos && (
                            <>
                                <hr className={`border-t-8 rounded-full mb-10 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`} />
                                <div className="mb-10">
                                    <h2 className={`text-xl font-bold mb-4 ${textColorPrimary}`}>Mot du conducteur</h2>
                                    <div className="flex gap-4 items-start bg-white dark:bg-gray-800/50 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                        <FontAwesomeIcon icon={faCommentDots} className="text-blue-500 text-xl mt-1" />
                                        <p className={`text-[17px] leading-relaxed ${textColorSecondary} italic`}>
                                            "{additionalInfos}"
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* --- COLONNE DROITE (Sticky Booking) --- */}
                    <div className='w-full md:w-2/5 relative'>
                        <div className={`sticky top-28 ${floatingCardBg} rounded-3xl shadow-lg border ${borderColor} p-6 sm:p-8`}>
                            
                            <div className="flex justify-between items-center mb-6">
                                <span className={`text-lg font-medium ${textColorSecondary}`}>Prix total</span>
                                <h2 className={`text-3xl font-extrabold ${textColorPrimary}`}>
                                    {pricePerPlace} <span className="text-lg font-semibold">XAF</span>
                                </h2>
                            </div>

                            <div className={`flex justify-between items-center py-4 border-y ${borderColor} mb-6`}>
                                <span className={`text-[17px] font-medium flex items-center gap-3 ${textColorSecondary}`}>
                                    <FontAwesomeIcon icon={faUsers} className="text-gray-400" />
                                    Places disponibles
                                </span>
                                <span className={`text-xl font-bold ${placesLeft > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {placesLeft}
                                </span>
                            </div>

                            <Button
                                className="w-full py-4 text-[17px] rounded-full font-bold bg-blue-600 hover:bg-blue-700 shadow-md transition-all duration-200"
                                onClick={handleOpenModal}
                                disabled={placesLeft <= 0}
                            >
                                {placesLeft > 0 ? 'Demander à réserver' : 'Complet'}
                            </Button>
                            
                            <p className={`text-center text-[13px] ${textColorSecondary} mt-4 px-2`}>
                                Vous ne paierez qu'une fois votre demande approuvée par le conducteur.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

          

            {/* Modal de réservation */}
            {isModalOpen && trip && <ReservationModal trip={trip} onClose={handleCloseModal} />}
        </div>
    );
};
 
export default TripDetail;