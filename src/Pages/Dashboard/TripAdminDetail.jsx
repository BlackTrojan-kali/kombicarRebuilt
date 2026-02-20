// src/pages/admin/TripAdminDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt, faCalendarAlt, faClock, faMoneyBillWave, faUserTie, faUsers, faRoad, 
    faTicketAlt, faHourglassHalf, faCheckCircle, faTimesCircle, faEnvelope, faStar, faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

import useColorScheme from '../../hooks/useColorScheme';
import { useTripAdmin } from '../../contexts/Admin/TripAdminContext';

// Composant pour un élément de détail simple
const DetailItem = ({ icon, label, value, isDark, classes = '' }) => (
    <div className='flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700/60 last:border-b-0'>
        <span className={`font-medium flex items-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {icon && <FontAwesomeIcon icon={icon} className="mr-2.5 w-4 opacity-70" />}
            {label}
        </span>
        <span className={`font-semibold text-right ${isDark ? 'text-slate-200' : 'text-slate-800'} ${classes}`}>
            {value}
        </span>
    </div>
);

// Composant pour un point d'itinéraire
const ItineraryPoint = ({ name, homeTown, isStart, isEnd, isStep, isDark }) => {
    let dotClasses = '';
    let label = homeTown;

    if (isStart) {
        dotClasses = 'bg-emerald-500 ring-4 ring-emerald-500/20';
        label = `Départ : ${homeTown}`;
    } else if (isEnd) {
        dotClasses = 'bg-blue-500 ring-4 ring-blue-500/20';
        label = `Arrivée : ${homeTown}`;
    } else if (isStep) {
        dotClasses = 'bg-amber-500 ring-4 ring-amber-500/20';
        label = `Étape : ${homeTown}`;
    }

    return (
        <div className='flex items-start gap-4 relative py-2'>
            <div className="mt-1.5 shrink-0">
                <div className={`w-3 h-3 rounded-full ${dotClasses}`}></div>
            </div>
            <div className={`${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <p className="font-bold text-sm">{label}</p>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{name}</p>
            </div>
        </div>
    );
};

// Composant pour le tableau des réservations
const ReservationTable = ({ reservations, getReservationStatusInfo, getTransactionStatusInfo, isDark }) => (
    <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700 mt-2">
        <table className="min-w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Passager</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Places</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Statut Résa</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Montant</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Paiement</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {reservations.map((res) => {
                    const resStatus = getReservationStatusInfo(res.reservationStatus);
                    const transStatus = getTransactionStatusInfo(res.transactionStatus);
                    const displayId = String(res.reservationId);

                    return (
                        <tr key={res.reservationId} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors duration-150">
                            <td className="py-4 px-4 font-mono text-xs text-slate-400 dark:text-slate-500">
                                {displayId.length > 8 ? `${displayId.substring(0, 8)}...` : displayId}
                            </td>
                            <td className="py-4 px-4">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">
                                    {res.userFirstName} {res.userLastName}
                                </p>
                                <p className="text-xs flex items-center gap-1.5 mt-1 text-slate-500 dark:text-slate-400">
                                    <FontAwesomeIcon icon={faEnvelope} className="opacity-70" /> {res.userEmail}
                                </p>
                            </td>
                            <td className="py-4 px-4 text-center font-medium text-slate-700 dark:text-slate-300">
                                {res.reservationNumberReservedPlaces}
                            </td>
                            <td className="py-4 px-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${resStatus.classes}`}>
                                    <FontAwesomeIcon icon={resStatus.icon} /> {resStatus.text}
                                </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-bold bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
                                    {res.transactionAmount.toLocaleString('fr-CM')} {res.transactionCurrency || 'FCFA'}
                                </span>
                            </td>
                            <td className="py-4 px-4">
                                <span className={`flex items-center gap-1.5 text-sm font-semibold ${transStatus.classes}`}>
                                    <FontAwesomeIcon icon={transStatus.icon} />
                                    {transStatus.text}
                                </span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
);


const TripAdminDetail = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const { theme } = useColorScheme();
    const isDark = theme === 'dark';
    
    // Nous supposons que useTripAdmin est bien défini et expose getTripInfosAsAdmin, loading, error
    const { getTripInfosAsAdmin, loading, error } = useTripAdmin(); 
 
    const [tripDetails, setTripDetails] = useState(null);

    const fetchTripDetails = async () => {
        if (!tripId) return;

        try {
            const data = await getTripInfosAsAdmin(tripId); 
            setTripDetails(data);
        } catch (err) {
            setTripDetails(null);
        }
    };

    useEffect(() => {
        fetchTripDetails();
    }, [tripId]);
    
    // Fonctions utilitaires d'affichage
    const getReservationStatusInfo = (status) => {
        const statusMap = {
            0: { text: 'En Attente', icon: faHourglassHalf, classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 border border-amber-200 dark:border-amber-800' },
            1: { text: 'Confirmée', icon: faCheckCircle, classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-800' },
            2: { text: 'Annulée', icon: faTimesCircle, classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500 border border-red-200 dark:border-red-800' },
        };
        return statusMap[status] || { text: 'Inconnu', icon: faTimesCircle, classes: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700' };
    };

    const getTransactionStatusInfo = (status) => {
        const statusMap = {
            0: { text: 'En Cours', icon: faHourglassHalf, classes: 'text-amber-500 dark:text-amber-400' },
            1: { text: 'Réussie', icon: faCheckCircle, classes: 'text-emerald-500 dark:text-emerald-400' },
            2: { text: 'Échouée', icon: faTimesCircle, classes: 'text-red-500 dark:text-red-400' },
        };
        return statusMap[status] || { text: 'Inconnu', icon: faTimesCircle, classes: 'text-slate-500 dark:text-slate-400' };
    };


    // Affichage des états de chargement/erreur
    if (loading && !tripDetails) {
        return (
            <div className="pl-12 pt-8 pb-40 bg-slate-50 dark:bg-slate-900 min-h-screen text-center">
                <div className="py-32">
                    <FontAwesomeIcon icon={faHourglassHalf} className="text-4xl text-blue-500 animate-spin mb-4 opacity-80" />
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Chargement des détails...</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Veuillez patienter pendant la récupération des informations du trajet #{tripId}.</p>
                </div>
            </div>
        );
    }

    if (!tripDetails) {
        return (
            <div className="pl-12 pt-8 pb-40 bg-slate-50 dark:bg-slate-900 min-h-screen">
                <div className="py-20 text-center max-w-lg mx-auto">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl p-8 shadow-sm">
                        <FontAwesomeIcon icon={faTimesCircle} className="text-5xl text-red-500 mb-4" />
                        <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Trajet introuvable</h2>
                        <p className="text-red-600/80 dark:text-red-400/80 mb-6">
                            Impossible de charger les détails du trajet. Il a peut-être été supprimé ou l'identifiant est incorrect.
                        </p>
                        <button 
                            onClick={() => navigate('/admin/trajets')}
                            className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-2.5 px-6 rounded-xl transition-all"
                        >
                            Retour à la liste
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Extraction des données principales
    const { driver, startPoint, stepsPoints, endPoint, reservations } = tripDetails;
    const departureDate = new Date(tripDetails.departureDate); 


    return (
        <div className="pl-12 pt-8 pb-40 bg-slate-50 dark:bg-slate-900 min-h-screen pr-6">
            
            {/* EN-TÊTE AVEC BOUTON RETOUR */}
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate('/admin/trajets')}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Détails du Trajet <span className="text-blue-600 dark:text-blue-400">#{tripId}</span>
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Consultez l'itinéraire complet, les informations du conducteur et les réservations.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* ----------------- Colonne 1: Infos Chauffeur ----------------- */}
                <div className="xl:col-span-1 space-y-6">
                
                    {/* (BLOC COMMENTÉ - MIS À JOUR STYLISTIQUEMENT SI BESOIN) */}
                    {/* <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 p-6">
                        <h2 className="text-lg font-bold mb-4 border-b border-slate-100 dark:border-slate-700/60 pb-3 text-slate-900 dark:text-slate-100">
                            <FontAwesomeIcon icon={faRoad} className="mr-2 text-blue-500" /> Informations Générales
                        </h2>
                        <DetailItem icon={faCalendarAlt} label="Date de Départ" value={departureDate.toLocaleDateString('fr-CM')} isDark={isDark} />
                        <DetailItem icon={faClock} label="Heure" value={departureDate.toLocaleTimeString('fr-CM', { hour: '2-digit', minute: '2-digit' })} isDark={isDark} />
                        <DetailItem icon={faMoneyBillWave} label="Prix" value={`${tripDetails.pricePerPlace} FCFA`} isDark={isDark} classes="text-emerald-500 font-bold" />
                        <DetailItem icon={faUsers} label="Places" value={tripDetails.availablePlaces} isDark={isDark} />
                    </div>
                    */}

                    {/* Infos Chauffeur */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 p-6">
                        <h2 className="text-lg font-bold mb-4 border-b border-slate-100 dark:border-slate-700/60 pb-3 text-slate-900 dark:text-slate-100 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                <FontAwesomeIcon icon={faUserTie} size="sm" />
                            </div>
                            Détails du Conducteur
                        </h2>
                        <DetailItem label="Nom complet" value={`${driver.firstName} ${driver.lastName}`} isDark={isDark} />
                        <DetailItem 
                            icon={faStar} 
                            label="Note moyenne" 
                            value={`${driver.rating}/5.0`} 
                            isDark={isDark} 
                            classes="text-amber-500 font-bold"
                        />
                    </div>
                </div>

                {/* ----------------- Colonne 2: Itinéraire et Réservations ----------------- */}
                <div className="xl:col-span-2 space-y-6">
                    
                    {/* Points de l'Itinéraire */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 p-6">
                        <h2 className="text-lg font-bold mb-5 border-b border-slate-100 dark:border-slate-700/60 pb-3 text-slate-900 dark:text-slate-100 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3">
                                <FontAwesomeIcon icon={faMapMarkerAlt} size="sm" />
                            </div>
                            Itinéraire Complet
                        </h2>
                        
                        <div className="relative pl-2 py-2">
                            {/* Ligne verticale de connexion */}
                            <div className="absolute top-4 bottom-4 left-3.5 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                            
                            <div className="space-y-6">
                                {/* Point de Départ */}
                                <ItineraryPoint name={startPoint.name} homeTown={startPoint.homeTownName} isStart={true} isDark={isDark} />
                                
                                {/* Points d'étapes */}
                                {stepsPoints.map((step, index) => (
                                    <ItineraryPoint key={index} name={step.name} homeTown={step.homeTownName} isStep={true} isDark={isDark} />
                                ))}

                                {/* Point d'Arrivée */}
                                <ItineraryPoint name={endPoint.name} homeTown={endPoint.homeTownName} isEnd={true} isDark={isDark} />
                            </div>
                        </div>
                    </div>

                    {/* Section Réservations */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 p-6">
                        <h2 className="text-lg font-bold mb-4 border-b border-slate-100 dark:border-slate-700/60 pb-3 text-slate-900 dark:text-slate-100 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-3">
                                    <FontAwesomeIcon icon={faTicketAlt} size="sm" />
                                </div>
                                Passagers et Réservations
                            </div>
                            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm py-1 px-3 rounded-full">
                                {reservations.length} total
                            </span>
                        </h2>
                        
                        {reservations.length === 0 ? (
                            <div className="py-12 text-center text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                <FontAwesomeIcon icon={faTicketAlt} className="text-3xl mb-3 opacity-40" />
                                <p>Aucune réservation pour ce trajet pour le moment.</p>
                            </div>
                        ) : (
                            <ReservationTable 
                                reservations={reservations} 
                                getReservationStatusInfo={getReservationStatusInfo}
                                getTransactionStatusInfo={getTransactionStatusInfo}
                                isDark={isDark}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripAdminDetail;