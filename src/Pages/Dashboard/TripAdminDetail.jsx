import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt, faCalendarAlt, faClock, faMoneyBillWave, faUserTie, faUsers, faRoad, faTicketAlt, faHourglassHalf, faCheckCircle, faTimesCircle, faEnvelope, faStar
} from '@fortawesome/free-solid-svg-icons';

import useColorScheme from '../../hooks/useColorScheme';
import useTrips from '../../hooks/useTrips';

// Composant pour un élément de détail simple
const DetailItem = ({ icon, label, value, theme, classes = '' }) => (
    <div className='flex justify-between py-2 border-b dark:border-gray-700 last:border-b-0'>
        <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {icon && <FontAwesomeIcon icon={icon} className="mr-2 w-4" />}
            {label} :
        </span>
        <span className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} ${classes}`}>{value}</span>
    </div>
);

// Composant pour un point d'itinéraire
const ItineraryPoint = ({ name, homeTown, isStart, isEnd, isStep, theme }) => {
    let classes = '';
    let label = homeTown;

    if (isStart) {
        classes = 'text-green-500 border-green-500';
        label = `Départ : ${homeTown}`;
    } else if (isEnd) {
        classes = 'text-red-500 border-red-500';
        label = `Arrivée : ${homeTown}`;
    } else if (isStep) {
        classes = 'text-yellow-500 border-yellow-500';
        label = `Étape : ${homeTown}`;
    }

    return (
        <div className='flex items-center gap-4'>
            <div className={`w-3 h-3 rounded-full border-2 ${classes}`}></div>
            <div className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                <p className="font-semibold">{label}</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{name}</p>
            </div>
        </div>
    );
};

// Composant pour le tableau des réservations
const ReservationTable = ({ reservations, getReservationStatusInfo, getTransactionStatusInfo, theme }) => (
    <div className="overflow-x-auto mt-4">
        <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-700 text-gray-200' : 'divide-gray-200 text-gray-800'}`}>
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">ID Résa</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Passager</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Places</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut Résa</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Montant Payé</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut Transaction</th>
                </tr>
            </thead>
            <tbody className={theme === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}>
                {reservations.map((res) => {
                    const resStatus = getReservationStatusInfo(res.reservationStatus);
                    const transStatus = getTransactionStatusInfo(res.transactionStatus);

                    return (
                        <tr key={res.reservationId}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{res.reservationId}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <p className='font-semibold'>{res.userFirstName} {res.userLastName}</p>
                                <p className='text-xs flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400'>
                                    <FontAwesomeIcon icon={faEnvelope} /> {res.userEmail}
                                </p>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">{res.reservationNumberReservedPlaces}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${resStatus.classes}`}>
                                    <FontAwesomeIcon icon={resStatus.icon} className="mr-1" /> {resStatus.text}
                                </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-500">
                                {/* Correction: Formatage du montant */}
                                {res.transactionAmount.toLocaleString('fr-CM')} {res.transactionCurrency || 'FCFA'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                                <span className='flex items-center gap-1'>
                                    <FontAwesomeIcon icon={transStatus.icon} className={transStatus.classes} />
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
    const { theme } = useColorScheme();
    // Nous supposons que useTrips est bien défini et expose getTripInfosAsAdmin, loading, error
    const { getTripInfosAsAdmin, loading, error } = useTrips(); 

    const [tripDetails, setTripDetails] = useState(null);

    const fetchTripDetails = async () => {
        if (!tripId) return;

        try {
            // Assurez-vous que tripId est correctement converti si votre API l'attend ainsi
            const data = await getTripInfosAsAdmin(tripId); 
            setTripDetails(data);
        } catch (err) {
            // Géré par le hook
            setTripDetails(null);
        }
    };
console.log(tripDetails)
    useEffect(() => {
        fetchTripDetails();
    }, [tripId]);
    
    // Fonctions utilitaires d'affichage (maintenues)
    const getReservationStatusInfo = (status) => {
        const statusMap = {
            0: { text: 'En Attente', icon: faHourglassHalf, classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
            1: { text: 'Confirmée', icon: faCheckCircle, classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
            2: { text: 'Annulée', icon: faTimesCircle, classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
        };
        return statusMap[status] || { text: 'Inconnu', icon: faTimesCircle, classes: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' };
    };

    const getTransactionStatusInfo = (status) => {
        const statusMap = {
            0: { text: 'En Cours', icon: faHourglassHalf, classes: 'text-yellow-500' },
            1: { text: 'Réussie', icon: faCheckCircle, classes: 'text-green-500' },
            2: { text: 'Échouée', icon: faTimesCircle, classes: 'text-red-500' },
        };
        return statusMap[status] || { text: 'Inconnu', icon: faTimesCircle, classes: 'text-gray-500' };
    };


    // Affichage des états de chargement/erreur (maintenus)
    if (loading && !tripDetails) {
        return (
            <div className={`p-12 pt-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                <h1 className="text-3xl font-extrabold mb-6">Détails du Trajet</h1>
                <div className="text-blue-500 text-lg">
                    <FontAwesomeIcon icon={faHourglassHalf} className="mr-2 animate-spin" />
                    Chargement des informations du trajet...
                </div>
            </div>
        );
    }

    if (!tripDetails) {
        return (
            <div className={`p-12 pt-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                <h1 className="text-3xl font-extrabold mb-6">Détails du Trajet</h1>
                <div className="text-red-500 text-lg">
                    <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                    Aucun détail de trajet trouvé ou erreur de chargement.
                </div>
            </div>
        );
    }
    
    // Extraction des données principales pour simplifier le JSX
    const { driver, startPoint, stepsPoints, endPoint, reservations } = tripDetails;
    const departureDate = new Date(tripDetails.departureDate); // Crée un objet Date pour le formatage


    return (
        <div className='pl-12 pt-6 pb-40 bg-gray-50 dark:bg-gray-900 min-h-screen'>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
                Détails du Trajet #{tripId}
            </h1>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                
                <div className='lg:col-span-1 space-y-6'>
                {/* ----------------- Colonne 1: Infos Trajet & Chauffeur ----------------- 
                    

                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
                        <h2 className='text-xl font-bold mb-4 border-b pb-2 text-gray-900 dark:text-gray-100 dark:border-gray-700'>
                            <FontAwesomeIcon icon={faRoad} className="mr-2 text-blue-500" /> Informations Générales
                        </h2>
                
                        <DetailItem 
                            icon={faCalendarAlt} 
                            label="Date de Départ" 
                            value={departureDate.toLocaleDateString('fr-CM') } // Formatage de la date
                            theme={theme} 
                        />
                        <DetailItem 
                            icon={faClock} 
                            label="Heure de Départ" 
                            value={departureDate.toLocaleTimeString('fr-CM', { hour: '2-digit', minute: '2-digit' })} // Formatage de l'heure
                            theme={theme} 
                        />
                        <DetailItem 
                            icon={faMoneyBillWave} 
                            label="Prix par Place" 
                            value={`${tripDetails.pricePerPlace} FCFA`} // Formatage du montant
                            theme={theme} 
                            classes="text-green-500 font-semibold" 
                        />
                        <DetailItem icon={faUsers} label="Places Disponibles" value={tripDetails.availablePlaces} theme={theme} />
                    </div>
*/}
                    {/* Infos Chauffeur */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
                        <h2 className='text-xl font-bold mb-4 border-b pb-2 text-gray-900 dark:text-gray-100 dark:border-gray-700'>
                            <FontAwesomeIcon icon={faUserTie} className="mr-2 text-blue-500" /> Détails du Conducteur
                        </h2>
                        <DetailItem label="Nom" value={`${driver.firstName} ${driver.lastName}`} theme={theme} />
                        <DetailItem 
                            icon={faStar} 
                            label="Note" 
                            value={`${driver.rating}/5.0`} 
                            theme={theme} 
                            classes="text-yellow-500"
                        />
                        {/* J'ai retiré le DetailItem pour le véhicule car il n'est pas dans le schéma JSON fourni */}
                    </div>

                </div>

                {/* ----------------- Colonne 2: Itinéraire et Réservations ----------------- */}
                <div className='lg:col-span-2 space-y-6'>
                    
                    {/* Points de l'Itinéraire */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
                        <h2 className='text-xl font-bold mb-4 border-b pb-2 text-gray-900 dark:text-gray-100 dark:border-gray-700'>
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-500" /> Itinéraire Complet
                        </h2>
                        <div className="space-y-3">
                            {/* Point de Départ */}
                            <ItineraryPoint name={startPoint.name} homeTown={startPoint.homeTownName} isStart={true} theme={theme} />
                            
                            {/* Points d'étapes */}
                            {stepsPoints.map((step, index) => (
                                <ItineraryPoint key={index} name={step.name} homeTown={step.homeTownName} isStep={true} theme={theme} />
                            ))}

                            {/* Point d'Arrivée */}
                            <ItineraryPoint name={endPoint.name} homeTown={endPoint.homeTownName} isEnd={true} theme={theme} />
                        </div>
                    </div>

                    {/* Section Réservations */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
                        <h2 className='text-xl font-bold mb-4 border-b pb-2 text-gray-900 dark:text-gray-100 dark:border-gray-700'>
                            <FontAwesomeIcon icon={faTicketAlt} className="mr-2 text-blue-500" /> Réservations ({reservations.length})
                        </h2>
                        {reservations.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">Aucune réservation pour ce trajet.</p>
                        ) : (
                            <ReservationTable 
                                reservations={reservations} 
                                getReservationStatusInfo={getReservationStatusInfo}
                                getTransactionStatusInfo={getTransactionStatusInfo}
                                theme={theme}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripAdminDetail;