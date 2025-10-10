import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // 👈 AJOUT DE Link
import useReservation from '../../hooks/useReservation';
// 👈 Importations pour les icônes FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons'; // 👈 AJOUT DE faComments

// Définitions de constantes pour les statuts de réservation (à adapter à votre API)
const RESERVATION_STATUS = {
    ALL: 'all', // Statut pour l'affichage de toutes les réservations (frontend only)
    CONFIRMED: 0,
    PENDING: 1,
    CANCELED: 2,
    REFUSED: 3,
    // Ajoutez d'autres statuts si nécessaire
};

// Fonction utilitaire pour convertir le statut numérique en affichage
const getStatusDisplay = (statusValue) => {
    switch (statusValue) {
        case RESERVATION_STATUS.CONFIRMED:
            return { text: 'Confirmée', className: 'bg-green-100 text-green-800' };
        case RESERVATION_STATUS.PENDING:
            return { text: 'En attente', className: 'bg-yellow-100 text-yellow-800' };
        case RESERVATION_STATUS.CANCELED:
            return { text: 'Annulée', className: 'bg-red-100 text-red-800' };
        case RESERVATION_STATUS.REFUSED:
            return { text: 'Refusée', className: 'bg-red-500 text-white' };
        // Définit 'Confirmée' comme statut par défaut en cas de valeur non mappée
        default:
            return { text: 'Confirmée (défaut)', className: 'bg-green-100 text-green-800' };
    }
};

const DriverReservations = () => {
    const { trip: tripTypeParam, id: tripId } = useParams(); 
    const { getReservationsForDriver, isLoading, error } = useReservation();

    const [apiData, setApiData] = useState(null); 
    const [filteredReservations, setFilteredReservations] = useState(null);
    
    // 🚩 MISE À JOUR : Initialise le filtre sur CONFIRMED (0)
    const [filterStatus, setFilterStatus] = useState(RESERVATION_STATUS.CONFIRMED); 
    
    const [page, setPage] = useState(1); 

    const displayTripType = tripTypeParam === 'covoiturage' ? 'Covoiturage' : 
                           tripTypeParam === 'taxi' ? 'Taxi' : 'Trajet';
    
    // Logique de Filtrage côté client
    useEffect(() => {
        if (apiData && apiData.items) {
            if (filterStatus === RESERVATION_STATUS.ALL) {
                setFilteredReservations(apiData.items);
            } else {
                // Filtre par le statut numérique (RESERVATION_STATUS.CONFIRMED si par défaut)
                const filtered = apiData.items.filter(item => 
                    item.reservation.status === filterStatus
                );
                setFilteredReservations(filtered);
            }
        }
    }, [filterStatus, apiData]);

    // Effet pour charger les réservations depuis l'API
    useEffect(() => {
        if (!tripId) return;

        const fetchReservations = async () => {
            try {
                const data = await getReservationsForDriver(tripId, page);
                setApiData(data); // Stocke les données brutes de l'API (non filtrées)
            } catch (err) {
                console.error("Échec du chargement des réservations du conducteur:", err);
            }
        };

        fetchReservations();
    }, [tripId, page]); 

    const handleFilterChange = (e) => {
        // La valeur est convertie en entier, sauf si c'est 'all'
        const value = e.target.value === 'all' ? e.target.value : parseInt(e.target.value);
        setFilterStatus(value);
    };

    const reservationsToDisplay = filteredReservations || [];
    const totalCount = apiData ? apiData.totalCount : 0;

    return (
        <div className="driver-reservations-container p-6  rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
                Réservations pour mon trajet {displayTripType}
            </h1>
            
            <p className="text-gray-500 mb-6">
                ID du Trajet: <span className="font-mono text-indigo-600">{tripId}</span>
            </p>

            {/* --- SECTION FILTRE ET STATISTIQUES --- */}
            <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 border rounded-md">
                <h2 className="text-xl font-semibold text-gray-800">
                    Passagers ({reservationsToDisplay.length} affichés / {totalCount} total)
                </h2>
                <div className="flex items-center space-x-2">
                    <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
                        Filtrer par statut:
                    </label>
                    <select
                        id="status-filter"
                        value={filterStatus}
                        onChange={handleFilterChange}
                        className="py-1.5 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                        <option value={RESERVATION_STATUS.CONFIRMED}>Confirmée</option>
                        <option value={RESERVATION_STATUS.PENDING}>En attente</option>
                        <option value={RESERVATION_STATUS.ALL}>Tous les statuts</option>
                        <option value={RESERVATION_STATUS.CANCELED}>Annulée</option>
                        <option value={RESERVATION_STATUS.REFUSED}>Refusée</option>
                    </select>
                </div>
            </div>
            {/* ------------------------------------- */}

            {/* Affichage des états */}
            {isLoading ? (
                <div className="text-center py-10 text-lg text-indigo-500">
                    Chargement des réservations...
                </div>
            ) : error ? (
                <div className="text-center py-10 text-lg text-red-500">
                    Erreur de chargement: {error}
                </div>
            ) : reservationsToDisplay.length > 0 ? (
                <div className="reservations-list space-y-4">
                    
                    {reservationsToDisplay.map((item) => {
                        const client = item.client;
                        const reservation = item.reservation;
                        const status = getStatusDisplay(reservation.status);

                        return (
                            <div key={reservation.id} className="p-4 border rounded-lg bg-white flex justify-between items-center hover:shadow-lg transition duration-150">
                                <div className='flex items-center space-x-4'>
                                    <div>
                                        <p className="font-semibold text-lg text-gray-800">
                                            Passager: {client.firstName} {client.lastName}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Places réservées: **{reservation.numberReservedPlaces}**
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Téléphone: {client.phoneNumber || 'Non spécifié'}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex flex-col items-end space-y-2'>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${status.className}`}>
                                        {status.text.replace(' (défaut)', '')}
                                    </span>
                                    
                                    {/* Boutons d'action conditionnels et bouton de Chat */}
                                    <div className='flex space-x-2'>
                                        
                                        {/* 👈 NOUVEAU : BOUTON CHAT */}
                                        <Link 
                                            to={`/chat/${reservation.id}`}
                                            className='text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-150 flex items-center'
                                        >
                                            <FontAwesomeIcon icon={faComments} className="mr-1" />
                                            Chat
                                        </Link>
                                        
                                        {reservation.status === RESERVATION_STATUS.PENDING && (
                                            <> 
                                                <button className='text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600'>Confirmer</button>
                                                <button className='text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600'>Refuser</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Logique de pagination ici */}
                </div>
            ) : (
                <div className="text-center py-10 text-lg text-gray-500 border border-dashed p-8 rounded-lg">
                    {filterStatus === RESERVATION_STATUS.ALL 
                        ? 'Aucune réservation trouvée pour ce trajet.'
                        : `Aucune réservation trouvée avec le statut "${getStatusDisplay(filterStatus).text.replace(' (défaut)', '')}".`
                    }
                </div>
            )}
        </div>
    );
};

export default DriverReservations;