import { faCircle, faStar, faCar, faUsers, faTemperatureHigh, faLuggageCart, faClock } from '@fortawesome/free-solid-svg-icons';
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

    // Définition des couleurs dynamiques basées sur le thème (Style épuré)
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-100';
    const pillBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';

    // Condition de garde
    if (!trip || !trip.trip || !trip.departureArea || !trip.arrivalArea || !trip.driver || !trip.vehicule) {
        return null;
    }

    const { driver, vehicule, trip: tripData } = trip;
    const driverFullName = `${driver.firstName} ${driver.lastName}`;
    const driverPhotoUrl = driver.photoUrl;
    const driverRating = 4; // Placeholder
    const vehicleName = `${vehicule.brand} ${vehicule.model}`;

    // Source de l'image
    const isExternalUrl = driverPhotoUrl && (driverPhotoUrl.startsWith('http://') || driverPhotoUrl.startsWith('https://'));
    const finalDriverPhotoSrc = isExternalUrl 
        ? driverPhotoUrl 
        : driverPhotoUrl 
            ? `${API_URL}${driverPhotoUrl}` 
            : null;

    return (
        <Link to={`/trip-detail/${tripData.id}`} className="block group">
            <div className={`w-full rounded-2xl ${cardBg} border ${borderColor} shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 p-5 sm:p-6`}>
                
                {/* --- HAUT : Itinéraire vertical et Prix --- */}
                <div className="flex justify-between items-start mb-6">
                    
                    {/* Ligne de temps verticale (Time -> Location) */}
                    <div className="flex flex-col">
                        {/* Départ */}
                        <div className="flex items-start gap-4">
                            <span className={`font-bold text-lg w-12 text-right ${textColorPrimary}`}>
                                {formatTime(tripData.departureDate)}
                            </span>
                            <div className="flex flex-col items-center mt-1.5">
                                {/* Cercle vide pour le départ */}
                                <div className={`w-3 h-3 rounded-full border-2 ${theme === 'dark' ? 'border-gray-300' : 'border-gray-800'}`}></div>
                                {/* Ligne connectrice */}
                                <div className={`w-0.5 h-6 my-1 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-bold text-[17px] ${textColorPrimary}`}>{trip.departureArea.homeTownName || 'N/A'}</span>
                                <span className={`text-xs ${textColorSecondary}`}>{dayjs(tripData.departureDate).format('DD MMM YYYY')}</span>
                            </div>
                        </div>

                        {/* Arrivée */}
                        <div className="flex items-start gap-4">
                            <span className={`font-bold text-lg w-12 text-right ${textColorSecondary}`}>
                                --:--
                            </span>
                            <div className="flex flex-col items-center mt-1.5">
                                {/* Cercle plein pour l'arrivée */}
                                <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-gray-300' : 'bg-gray-800'}`}></div>
                            </div>
                            <span className={`font-bold text-[17px] ${textColorPrimary}`}>{trip.arrivalArea.homeTownName || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Prix */}
                    <div className="text-right pl-4">
                        <h2 className={`font-extrabold text-xl sm:text-2xl ${textColorPrimary}`}>
                            {tripData.pricePerPlace} <span className="text-sm font-semibold">XAF</span>
                        </h2>
                    </div>
                </div>

                {/* --- MILIEU : Tags / Caractéristiques (Style Pilules) --- */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${pillBg} ${textColorSecondary}`}>
                        <FontAwesomeIcon icon={faUsers} />
                        {tripData.placesLeft} place{tripData.placesLeft > 1 ? 's' : ''}
                    </span>
                    
                    {vehicule.airConditionned && (
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${pillBg} ${textColorSecondary}`}>
                            <FontAwesomeIcon icon={faTemperatureHigh} className="text-blue-500" />
                            Climatisé
                        </span>
                    )}
                    
                    {tripData.authorizedLuggages && (
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${pillBg} ${textColorSecondary}`}>
                            <FontAwesomeIcon icon={faLuggageCart} className="text-orange-500" />
                            Bagages
                        </span>
                    )}
                    
                    {vehicule.isVerified && (
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${pillBg} ${textColorSecondary}`}>
                            <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                            Véhicule vérifié
                        </span>
                    )}
                </div>

                {/* Ligne de séparation très discrète */}
                <div className={`h-px w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}></div>

                {/* --- BAS : Conducteur & Véhicule --- */}
                <div className="flex justify-between items-center">
                    
                    {/* Profil Conducteur */}
                    <div className="flex items-center gap-3">
                        {finalDriverPhotoSrc ? (
                            <img src={finalDriverPhotoSrc} alt={driverFullName} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                        ) : (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                <FontAwesomeIcon icon={faCar} className="text-gray-400" />
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className={`font-semibold text-[15px] ${textColorPrimary}`}>{driverFullName}</span>
                            <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                                <span>{driverRating}.0</span>
                            </div>
                        </div>
                    </div>

                    {/* Véhicule court */}
                    <div className="text-right">
                        <span className={`text-sm font-medium ${textColorSecondary}`}>
                            {vehicleName}
                        </span>
                    </div>

                </div>

            </div>
        </Link>
    );
};

export default ResultCard;