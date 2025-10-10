import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faArrowRight, faCalendarAlt, faMoneyBillWave,
    faRoute, faUserCircle, faSpinner, faBookmark, faInfoCircle,
    faCheckDouble, faBan, faCheckCircle, faComments, faStar
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import useAuth from '../../hooks/useAuth';
import useColorScheme from '../../hooks/useColorScheme';
import useReservation from '../../hooks/useReservation';
import { toast } from "sonner";

dayjs.locale('fr');

const TRIPS_PER_PAGE = 6;

// Composant de modal de confirmation réutilisable (MIS À JOUR pour CHILDREN)
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, theme, children }) => {
    if (!isOpen) return null;
    
    const modalBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/10 bg-opacity-50">
            <div className={`${modalBg} rounded-xl p-8 shadow-2xl border ${borderColor} max-w-lg w-full transition-all duration-300 transform scale-95`}>
                <h3 className={`text-xl font-bold mb-4 ${textColorPrimary}`}>{title}</h3>
                <p className={`text-sm mb-6 ${textColorPrimary}`}>{message}</p>
                
                {/* Espace pour les champs de formulaire (Children) */}
                {children}

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ===================================
// COMPOSANT PRINCIPAL
// ===================================

const MyReservations = () => {
    const { user, loading: loadingUser } = useAuth();
    const { getReservationsWithStatus, confirmReservationAsDriver, cancelReservation, cancelReservationByDriver, confirmAllReservations } = useReservation();
    const { theme } = useColorScheme();
    const [reservedTrips, setReservedTrips] = useState([]);
    const [loadingReservations, setLoadingReservations] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [statusFilter, setStatusFilter] = useState(1); // 1 = Confirmé par défaut
    const [isConfirming, setIsConfirming] = useState(null);
    const [isCancelling, setIsCancelling] = useState(null);
    const [isConfirmingAll, setIsConfirmingAll] = useState(false);
    
    // NOUVEAUX ÉTATS POUR LE REMBOURSEMENT
    const [refundInfo, setRefundInfo] = useState({
        reservationId: null,
        isDriverCancellation: false,
    });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [operator, setOperator] = useState('');

    // États pour le modal de confirmation
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({
        title: '',
        message: '',
        confirmText: '',
        action: () => {},
    });

    const pageBgColor = theme === 'dark' ? 'bg-gray-900' : '';
    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

    const loadReservations = async () => {
        if (!user || loadingUser) return;

        setLoadingReservations(true);
        try {
            const response = await getReservationsWithStatus(page, statusFilter);
            
            const formattedReservations = response.items.map(item => ({
                ...item,
                totalPrice: item.trip.pricePerPlace * item.reservation.numberReservedPlaces
            }));

            setReservedTrips(formattedReservations || []);
            setTotalPages(response.totalCount > 0 ? Math.ceil(response.totalCount / TRIPS_PER_PAGE) : 1);

        } catch (err) {
            console.error("Échec du chargement des réservations :", err);
            toast.error("Échec du chargement des réservations.");
        } finally {
            setLoadingReservations(false);
        }
    };

    // Nouvelle fonction pour l'action de confirmation simple du chauffeur
    const handleConfirmReservation = async (reservationId, tripDate) => {
        if (dayjs(tripDate).isAfter(dayjs())) {
            toast.error("La confirmation ne peut être faite qu'après la date du trajet.");
            return;
        }
        
        setModalData({
            title: 'Confirmer la réservation',
            message: 'Êtes-vous sûr de vouloir marquer cette réservation comme complétée ?',
            confirmText: 'Confirmer',
            action: async () => {
                setIsConfirming(reservationId);
                try {
                    await confirmReservationAsDriver(reservationId);
                    toast.success("Réservation complétée avec succès !");
                    loadReservations();
                } catch (err) {
                    console.error("Échec de la confirmation :", err);
                    toast.error("Échec de la confirmation de la réservation.");
                } finally {
                    setIsConfirming(null);
                    setShowModal(false);
                }
            }
        });
        setShowModal(true);
    };

    // Fonction qui prépare le modal d'annulation (client ou chauffeur)
    const handleCancelReservation = (reservationId, isDriver = false) => {
        const title = isDriver ? 'Annuler la réservation (Chauffeur)' : 'Annuler la réservation (Client)';
        let message = 'Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.';

        if (!isDriver) {
            message = 'Pour initier le remboursement, veuillez renseigner le numéro de téléphone et l\'opérateur Mobile Money où vous souhaitez recevoir les fonds.';
            setPhoneNumber(''); // Réinitialisation
            setOperator('');    // Réinitialisation
        }
        
        setRefundInfo({
            reservationId,
            isDriverCancellation: isDriver,
        });

        setModalData({
            title: title,
            message: message,
            confirmText: 'Annuler',
            action: performCancelReservation, // L'action renvoie vers la nouvelle fonction
        });
        setShowModal(true);
    };

    // NOUVELLE FONCTION : Exécute l'annulation après confirmation
    const performCancelReservation = async () => {
        const { reservationId, isDriverCancellation } = refundInfo;
        
        if (!reservationId) return;

        // Validation pour l'annulation client
        if (!isDriverCancellation) {
            if (!phoneNumber || !operator) {
                toast.error("Veuillez renseigner le numéro et l'opérateur pour le remboursement.");
                return;
            }
        }
        
        setIsCancelling(reservationId);
        setShowModal(false); // Ferme le modal immédiatement pour afficher le loader

        try {
            if (isDriverCancellation) {
                await cancelReservationByDriver(reservationId);
                toast.success("Réservation annulée par le chauffeur avec succès. Remboursement en cours.");
            } else {
                // Utilisation des états phoneNumber et operator
                await cancelReservation(reservationId, phoneNumber, operator);
                toast.success("Réservation annulée avec succès. Remboursement initié.");
            }
            loadReservations();
        } catch (err) {
            console.error("Échec de l'annulation :", err);
            toast.error("Échec de l'annulation de la réservation.");
        } finally {
            setIsCancelling(null);
            // Réinitialisation des infos de remboursement après l'action
            setRefundInfo({ reservationId: null, isDriverCancellation: false });
        }
    }


    const handleConfirmAllReservations = async (tripId, tripDate) => {
        // ... (Logique identique, pas de changement majeur)
        if (dayjs(tripDate).isAfter(dayjs())) {
            toast.error("La confirmation ne peut être faite qu'après la date du trajet.");
            return;
        }

        setModalData({
            title: 'Confirmer toutes les réservations',
            message: 'Êtes-vous sûr de vouloir confirmer toutes les réservations de ce trajet ?',
            confirmText: 'Confirmer tout',
            action: async () => {
                setIsConfirmingAll(true);
                try {
                    await confirmAllReservations(tripId);
                    toast.success("Toutes les réservations de ce trajet ont été confirmées.");
                    loadReservations();
                } catch (err) {
                    console.error("Échec de la confirmation de toutes les réservations :", err);
                    toast.error("Échec de la confirmation de toutes les réservations.");
                } finally {
                    setIsConfirmingAll(false);
                    setShowModal(false);
                }
            }
        });
        setShowModal(true);
    };

    useEffect(() => {
        loadReservations();
    }, [page, statusFilter, user, loadingUser]);


    // ... (Reste des fonctions getStatusText, affichage de loading et non-connecté inchangé)
    if (loadingUser || loadingReservations) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${pageBgColor}`}>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" className={textColorPrimary} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${pageBgColor} ${textColorPrimary}`}>
                <p className="text-xl">Veuillez vous connecter pour voir vos réservations.</p>
            </div>
        );
    }

    const getStatusText = (status) => {
        const statuses = {
            0: 'En attente',
            1: 'Confirmé',
            2: 'Refusé',
            3: 'Annulé',
            4: 'Complété'
        };
        return statuses[status] || 'Inconnu';
    };

    // Composant de formulaire de remboursement
    const RefundForm = () => (
        <div className="space-y-4">
            <div>
                <label htmlFor="phone" className={`block text-sm font-medium ${textColorPrimary} mb-1`}>
                    Numéro de téléphone pour le remboursement
                </label>
                <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${borderColor} ${cardBg} ${textColorPrimary} focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Ex: 699123456"
                    required
                />
            </div>
            <div>
                <label htmlFor="operator" className={`block text-sm font-medium ${textColorPrimary} mb-1`}>
                    Opérateur Mobile Money (FAI)
                </label>
                <select
                    id="operator"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${borderColor} ${cardBg} ${textColorPrimary} focus:ring-blue-500 focus:border-blue-500`}
                    required
                >
                    <option value="" disabled>Sélectionnez un opérateur</option>
                    <option value={1}>MTN Mobile Money</option>
                    <option value={2}>Orange Money</option>
                    {/* Ajoutez d'autres opérateurs si nécessaire */}
                </select>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen pt-20 pb-10 ${pageBgColor} ${textColorPrimary} transition-colors duration-300`}>
            <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className={`${cardBg} rounded-2xl shadow-xl p-8 border ${borderColor}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-3 border-b">
                        <h2 className={`text-2xl font-bold ${textColorPrimary}`}>
                            <FontAwesomeIcon icon={faBookmark} className='mr-2 text-blue-500' />
                            Mes Réservations
                        </h2>
                        <div className='flex items-center gap-2 mt-4 sm:mt-0'>
                            <label htmlFor="reservation-status-filter" className={`text-sm font-medium`}>Statut :</label>
                            <select
                                id="reservation-status-filter"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(parseInt(e.target.value));
                                    setPage(1);
                                }}
                                className={`py-1 px-2 text-sm rounded-md border ${borderColor} ${cardBg} ${textColorPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="1">Confirmé</option>
                                <option value="0">En attente</option>
                                <option value="2">Refusé</option>
                                <option value="3">Annulé</option>
                                <option value="4">Complété</option>
                            </select>
                        </div>
                    </div>

                    {user  && reservedTrips.length > 0 && reservedTrips[0].trip && reservedTrips[0].reservation.status === 1 && dayjs(reservedTrips[0].trip.departureDate).isBefore(dayjs()) && (
                        <div className="mb-6 text-center">
                            <button
                                onClick={() => handleConfirmAllReservations(reservedTrips[0].trip.id, reservedTrips[0].trip.departureDate)}
                                disabled={isConfirmingAll}
                                className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {isConfirmingAll ? (
                                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                ) : (
                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                )}
                                Confirmer toutes les réservations du trajet
                            </button>
                        </div>
                    )}
                    {reservedTrips.length > 0 ? (
                        <div className='flex flex-col gap-6'>
                            {reservedTrips.map((reservationData) => (
                                <div key={reservationData.reservation.id} className={`${cardBg} rounded-xl p-6 shadow-sm border ${borderColor} flex flex-col md:flex-row justify-between items-center transition-transform transform hover:scale-[1.01] duration-200`}>
                                    <div className="flex-1">
                                        <h3 className={`text-lg font-bold ${textColorPrimary}`}>
                                            <FontAwesomeIcon icon={faRoute} className='mr-2 text-blue-500' />
                                            {reservationData.departureArea.homeTownName} - {reservationData.arrivalArea.homeTownName}
                                        </h3>
                                        <div className={`text-sm ${textColorSecondary} mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2`}>
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faCalendarAlt} className='mr-2' /> Date du trajet: {dayjs(reservationData.trip.departureDate).format('DD MMMM YYYY à HH:mm')}
                                            </div>
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faMoneyBillWave} className='mr-2' /> Prix total: {reservationData.totalPrice} XAF
                                            </div>
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faUserCircle} className='mr-2' /> Places réservées: {reservationData.reservation.numberReservedPlaces}
                                            </div>
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faInfoCircle} className='mr-2' /> Statut: <span className="ml-1 font-semibold">{getStatusText(reservationData.reservation.status)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 md:ml-4 flex flex-col sm:flex-row gap-2">
                                        {/* Bouton de confirmation pour les chauffeurs (Réservation Complétée) */}
                                        {user  && reservationData.reservation.status === 1 && dayjs(reservationData.trip.departureDate).isBefore(dayjs()) && (
                                            <button
                                                onClick={() => handleConfirmReservation(reservationData.reservation.id, reservationData.trip.departureDate)}
                                                disabled={isConfirming === reservationData.reservation.id || isCancelling === reservationData.reservation.id}
                                                className="px-4 py-2 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                {isConfirming === reservationData.reservation.id ? (
                                                    <FontAwesomeIcon icon={faSpinner} spin />
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faCheckDouble} className="mr-2" />
                                                        Marquer comme complétée
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        {/* Bouton d'annulation pour les utilisateurs passagers (AVANT le départ) */}
                                        {user && (reservationData.reservation.status === 0 || reservationData.reservation.status === 1) && dayjs(reservationData.trip.departureDate).isAfter(dayjs()) && (
                                            <button
                                                onClick={() => handleCancelReservation(reservationData.reservation.id, false)} // isDriver = false
                                                disabled={isCancelling === reservationData.reservation.id || isConfirming === reservationData.reservation.id}
                                                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                {isCancelling === reservationData.reservation.id ? (
                                                    <FontAwesomeIcon icon={faSpinner} spin />
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faBan} className="mr-2" />
                                                        Annuler
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        {/* Bouton d'annulation pour les chauffeurs (AVANT le départ) */}
                                        
                                        {/* Bouton pour publier un avis (pour les passagers sur les réservations complétées) */}
                                        {user  && reservationData.reservation.status === 4 && (
                                            <Link
                                                to={`/reviews/create/${reservationData.trip.id}`}
                                                className="px-4 py-2 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center transition-colors duration-200"
                                            >
                                                <FontAwesomeIcon icon={faStar} className="mr-2" />
                                                Écrire un avis
                                            </Link>
                                        )}
                                        {/* Bouton de Chat */}
                                        <Link 
                                            to={`/chat/${reservationData.reservation.id}`}
                                            className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center transition-colors duration-200"
                                        >
                                            <FontAwesomeIcon icon={faComments} className="mr-2" />
                                            Chat
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 py-4">
                            Aucune réservation de ce statut à afficher.
                        </p>
                    )}

                    {totalPages > 1 && (
                        <div className={`flex justify-center items-center gap-4 mt-6 text-sm`}>
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} /> Précédent
                            </button>
                            <span className={`px-3 py-1 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                Page {page} sur {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page >= totalPages}
                                className={`px-4 py-2 rounded-lg ${page >= totalPages ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            >
                                Suivant <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </div>
                    )}
                </div>
            </main>
            {/* Modal de Confirmation MIS À JOUR */}
            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                // Désactivation du bouton de confirmation si c'est une annulation client et les champs sont vides
                onConfirm={
                    refundInfo.isDriverCancellation || (phoneNumber && operator) 
                    ? () => modalData.action() 
                    : () => toast.error("Veuillez remplir tous les champs de remboursement.")
                }
                title={modalData.title}
                message={modalData.message}
                confirmText={modalData.confirmText}
                theme={theme}
            >
                {/* Affichage conditionnel du formulaire dans le modal */}
                {showModal && !refundInfo.isDriverCancellation && modalData.title.includes('Annuler la réservation') && (
                    <RefundForm />
                )}
            </ConfirmationModal>
        </div>
    );
};

export default MyReservations;