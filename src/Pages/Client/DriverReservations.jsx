import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useReservation from '../../hooks/useReservation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faCheckDouble, faTimesCircle, faBan, faCalendarCheck, faCheckCircle, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons'; // Ajout de faCheckCircle et faTimes
import { toast } from 'sonner';

// Définitions de constantes pour les statuts de réservation
const RESERVATION_STATUS = {
    ALL: 'all', 
    CONFIRMED: 1,
    PENDING: 0,
    CANCELED: 3, // Annulée par le client
    REFUSED: 2,  // Refusée par le conducteur
    COMPLETED: 4, // Trajet terminé (post-confirmation globale)
};

// Fonction utilitaire pour convertir le statut numérique en affichage (MISE À JOUR)
const getStatusDisplay = (statusValue) => {
    switch (statusValue) {
        case RESERVATION_STATUS.CONFIRMED:
            return { text: 'Confirmée', className: 'bg-green-100 text-green-800' };
        case RESERVATION_STATUS.PENDING:
            return { text: 'En attente', className: 'bg-yellow-100 text-yellow-800' };
        case RESERVATION_STATUS.CANCELED:
            return { text: 'Annulée', className: 'bg-red-100 text-red-800' };
        case RESERVATION_STATUS.REFUSED:
            return { text: 'Refusée', className: 'bg-pink-100 text-pink-800' };
        case RESERVATION_STATUS.COMPLETED:
            return { text: 'Terminée', className: 'bg-blue-100 text-blue-800' };
        default:
            return { text: 'Statut Inconnu', className: 'bg-gray-100 text-gray-800' };
    }
};

const DriverReservations = () => {
    const { trip: tripTypeParam, id: tripId } = useParams();
    const { 
        getReservationsForDriver, 
        confirmReservationAsDriver, 
        refuseReservationAsDriver, // Supposé exister dans useReservation
        confirmAllReservations,
        isLoading, 
        error 
    } = useReservation();

    const [apiData, setApiData] = useState(null);
    const [filteredReservations, setFilteredReservations] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(null); 
    const [isAllConfirming, setIsAllConfirming] = useState(false); 
    const [actionError, setActionError] = useState(null); 
    
    // Initialiser le filtre sur PENDING pour les actions immédiates
    const [filterStatus, setFilterStatus] = useState(RESERVATION_STATUS.PENDING); 
    const [page, setPage] = useState(1); // Non utilisé dans l'affichage, mais conservé pour l'API
    
    // Libellé du type de trajet
    const displayTripType = tripTypeParam === 'covoiturage' ? 'Covoiturage' : 
                             tripTypeParam === 'taxi' ? 'Taxi' : 'Trajet';
    
    /**
     * Logique de Filtrage côté client
     * S'exécute quand le filtre change ou que les données de l'API sont mises à jour.
     */
    useEffect(() => {
        if (apiData && apiData.items) {
            if (filterStatus === RESERVATION_STATUS.ALL) {
                setFilteredReservations(apiData.items);
            } else {
                const filtered = apiData.items.filter(item => 
                    item.reservation.status === filterStatus
                );
                setFilteredReservations(filtered);
            }
        }
    }, [filterStatus, apiData]);

    /**
     * Effet pour charger les réservations depuis l'API
     */
    useEffect(() => {
        if (!tripId) return;

        const fetchReservations = async () => {
            setActionError(null); 
            try {
                const data = await getReservationsForDriver(tripId, page);
                setApiData(data);
            } catch (err) {
                console.error("Échec du chargement des réservations du conducteur:", err);
                // Le hook useReservation est censé gérer le toast de l'erreur
            }
        };

        fetchReservations();
    }, [tripId, page]); 

    // Fonction utilitaire pour rafraîchir les données
    const refreshData = async () => {
        const data = await getReservationsForDriver(tripId, page);
        setApiData(data);
    };


    // FONCTION DE CONFIRMATION INDIVIDUELLE
    const handleConfirm = async (reservationId) => {
        setIsActionLoading(reservationId);
        console.log(reservationId)
        setActionError(null); 
        try {
            await confirmReservationAsDriver(reservationId);
            
            await refreshData();
            toast.success(`La réservation ${reservationId} a été confirmée.`);

        } catch (err) {
            console.error("Erreur de confirmation individuelle:", err);
            // Laissez le hook useReservation gérer l'affichage du toast d'erreur
        } finally {
            setIsActionLoading(null);
        }
    };
    
    // NOUVELLE FONCTION DE REFUS INDIVIDUEL
    const handleRefuse = async (reservationId) => {
        if (!window.confirm("Voulez-vous vraiment refuser cette réservation ?")) {
            return;
        }

        setIsActionLoading(reservationId);
        setActionError(null); 
        try {
            // Supposons que refuseReservationAsDriver existe et gère l'appel API
            // Note: Si cette fonction n'existe pas dans votre hook, elle doit être ajoutée.
            await refuseReservationAsDriver(reservationId); 
            
            await refreshData();
            toast.info(`La réservation ${reservationId} a été refusée.`);

        } catch (err) {
            console.error("Erreur de refus individuelle:", err);
        } finally {
            setIsActionLoading(null);
        }
    };

    // FONCTION DE CONFIRMATION GLOBALE
    const handleConfirmAll = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir confirmer toutes les réservations en attente de ce trajet et de **terminer le trajet** ? Cette action est irréversible.")) {
            return;
        }

        setIsAllConfirming(true);
        setActionError(null);
        try {
            await confirmAllReservations(tripId);
            
            await refreshData();
            toast.success(`Toutes les réservations du trajet ${tripId} ont été confirmées et le trajet est Terminé.`);

        } catch (err) {
            console.error("Erreur de confirmation globale:", err);
            
            // Logique pour extraire le message d'erreur d'Axios (ex: code 406)
            const errorDescription = err?.response?.data?.description;
            
            if (errorDescription) {
                toast.error(`Erreur: ${errorDescription}`);
                setActionError(errorDescription); 
            } else {
                toast.error("Échec de la confirmation globale. Veuillez réessayer.");
            }
            
        } finally {
            setIsAllConfirming(false);
        }
    };


    const handleFilterChange = (e) => {
        const value = e.target.value === 'all' ? e.target.value : parseInt(e.target.value);
        setFilterStatus(value);
    };

    const reservationsToDisplay = filteredReservations || [];
    const totalCount = apiData ? apiData.totalCount : 0;
    
    // Vérifie s'il y a au moins une réservation PENDING
    const hasPendingReservations = apiData?.items.some(item => 
        item.reservation.status === RESERVATION_STATUS.PENDING
    ) || false;

    // Le bouton 'Confirmer tout' est désactivé si:
    // 1. Une action globale est en cours
    // 2. Le chargement initial est en cours
    // 3. Il n'y a aucune réservation en attente à confirmer
    // 4. Une erreur d'action bloquante est présente (ex: véhicule non vérifié)
    const isDisabled = isAllConfirming || isLoading || !hasPendingReservations || actionError;

    return (
        <div className="driver-reservations-container p-6 rounded-lg">
            <br /><br />
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
                Réservations pour mon  <span className="font-extrabold text-indigo-700">{displayTripType}</span>
            </h1>
            
            {/* AFFICHAGE DE L'ERREUR D'ACTION SPÉCIFIQUE (ex: Vehicle Not Verified) */}
            {actionError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Action impossible</p>
                    <p>{actionError}</p>
                </div>
            )}
            
            <p className="text-gray-500 mb-6 flex justify-between items-center">
                <span>
                    ID du Trajet: <span className="font-mono text-indigo-600">{tripId}</span>
                </span>
                
                {/* BOUTON DE CONFIRMATION GLOBALE */}
                <button 
                    onClick={handleConfirmAll}
                    title={isDisabled && !actionError ? "Aucune réservation en attente à confirmer" : (actionError ? actionError : "Confirmer toutes les réservations en attente et clôturer le trajet")}
                    className={`text-sm px-4 py-2 font-semibold rounded-md flex items-center transition-colors duration-200 
                        ${isDisabled
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                            : 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                        }`}
                >
                    <FontAwesomeIcon 
                        icon={faCheckDouble} 
                        className={`mr-2 ${isAllConfirming ? 'animate-spin' : ''}`} 
                    />
                    {isAllConfirming ? 'Finalisation en cours...' : 'Confirmer tout et Terminer le trajet'}
                </button>
            </p>

            {/* --- SECTION FILTRE ET STATISTIQUES --- */}
            <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 border rounded-md">
                <h2 className="text-xl font-semibold text-gray-800">
                    Passagers (<span className="font-extrabold text-indigo-600">{reservationsToDisplay.length}</span> affichés / <span className="font-extrabold text-indigo-600">{totalCount}</span> total)
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
                        <option value={RESERVATION_STATUS.PENDING}>En attente</option>
                        <option value={RESERVATION_STATUS.CONFIRMED}>Confirmée</option>
                        <option value={RESERVATION_STATUS.COMPLETED}>Terminée</option>
                        <option value={RESERVATION_STATUS.ALL}>Tous les statuts</option>
                        <option value={RESERVATION_STATUS.CANCELED}>Annulée (Client)</option>
                        <option value={RESERVATION_STATUS.REFUSED}>Refusée (Moi)</option>
                    </select>
                </div>
            </div>
            {/* ------------------------------------- */}

            {/* Affichage des états de chargement/erreur */}
            {(isLoading && !apiData) ? (
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
                        const isCurrentActionLoading = isActionLoading === reservation.id;
                        const isActionDisabled = isCurrentActionLoading || isAllConfirming || actionError;
                        
                        // Condition pour afficher les boutons d'action (uniquement pour PENDING)
                        const showActionButtons = reservation.status === RESERVATION_STATUS.PENDING;

                        return (
                            <div key={reservation.id} className="p-4 border rounded-lg bg-white flex justify-between items-center hover:shadow-lg transition duration-150">
                                <div className='flex items-center space-x-4'>
                                    {/* Placeholder pour un avatar si vous en avez un */}
                                    {/* <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold'>
                                        {client.firstName[0]}
                                    </div> */}
                                    <div>
                                        <p className="font-semibold text-lg text-gray-800">
                                            Passager: <span className="font-bold text-gray-900">{client.firstName} {client.lastName}</span>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Places réservées: <span className="font-medium text-gray-700">{reservation.numberReservedPlaces}</span>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Téléphone: {client.phoneNumber || 'Non spécifié'}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex flex-col items-end space-y-2'>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${status.className}`}>
                                        {status.text}
                                    </span>
                                    
                                    <div className='flex space-x-2'>
                                        
                                        <Link 
                                            to={`/chat/${reservation.id}`}
                                            className='text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-150 flex items-center'
                                        >
                                            <FontAwesomeIcon icon={faComments} className="mr-1" />
                                            Chat
                                        </Link>
                                        
                                        {/* Boutons d'action visibles uniquement pour le statut EN ATTENTE */}
                                        {showActionButtons && (
                                            <> 
                                                <button 
                                                    onClick={() => handleConfirm(reservation.id)}
                                                    className={`text-xs px-2 py-1 text-white rounded transition-colors duration-150 flex items-center 
                                                        ${isActionDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                                                    disabled={isActionDisabled}
                                                >
                                                    <FontAwesomeIcon 
                                                        icon={isCurrentActionLoading ? faSpinner : faCheckCircle} 
                                                        className={`mr-1 ${isCurrentActionLoading ? 'animate-spin' : ''}`} 
                                                    />
                                                    {isCurrentActionLoading ? 'Confirma...' : 'Confirmer'}
                                                </button>
                                                <button 
                                                    onClick={() => handleRefuse(reservation.id)}
                                                    className={`text-xs px-2 py-1 text-white rounded transition-colors duration-150 flex items-center 
                                                        ${isActionDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                                                    disabled={isActionDisabled}
                                                >
                                                    <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                                    Refuser
                                                </button>
                                            </>
                                        )}
                                        
                                        {/* Bouton pour les trajets terminés/confirmés si nécessaire, mais non demandé */}
                                        {reservation.status === RESERVATION_STATUS.COMPLETED && (
                                            <span className='text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded flex items-center font-medium'>
                                                <FontAwesomeIcon icon={faCalendarCheck} className="mr-1" />
                                                Archivée
                                            </span>
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
                        : `Aucune réservation trouvée avec le statut "${getStatusDisplay(filterStatus).text}".`
                    }
                </div>
            )}
        </div>
    );
};

export default DriverReservations;