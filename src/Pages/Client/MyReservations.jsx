import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faArrowRight, faCalendarAlt, faMoneyBillWave,
    faRoute, faUserCircle, faSpinner, faBookmark, faInfoCircle,
    faCheckDouble, faBan, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import useTrips from '../../hooks/useTrips';
import useColorScheme from '../../hooks/useColorScheme';
import useReservation from '../../hooks/useReservation';

dayjs.locale('fr');

const TRIPS_PER_PAGE = 6;

const MyReservations = () => {
    const { user, loading: loadingUser } = useAuth();
    const { listReservedTrips } = useTrips();
    const { theme } = useColorScheme();
    const { confirmReservationAsDriver, cancelReservation, cancelReservationByDriver, confirmAllReservations } = useReservation();

    const [reservedTrips, setReservedTrips] = useState([]);
    const [loadingReservations, setLoadingReservations] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [statusFilter, setStatusFilter] = useState(1); // 1 = Confirmé par défaut
    const [isConfirming, setIsConfirming] = useState(null);
    const [isCancelling, setIsCancelling] = useState(null);
    const [isConfirmingAll, setIsConfirmingAll] = useState(false);

    // Styles dynamiques
    const pageBgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

    // Fonction pour charger les réservations
    const loadReservations = async () => {
        if (!user || loadingUser) return;

        setLoadingReservations(true);
        try {
            const response = await listReservedTrips({
                pageIndex: page,
                status: 0,
                reservationStatus: statusFilter,
                perPage: TRIPS_PER_PAGE,
            });

            const allReservations = response.items.flatMap(tripItem =>
                tripItem.reservations.map(reservation => ({
                    ...reservation,
                    trip: tripItem.trip,
                    departureArea: tripItem.departureArea,
                    arrivalArea: tripItem.arrivalArea,
                    driver: tripItem.driver
                }))
            );

            setReservedTrips(allReservations || []);
            setTotalPages(response.totalCount > 0 ? Math.ceil(response.totalCount / TRIPS_PER_PAGE) : 1);

        } catch (err) {
            console.error("Échec du chargement des réservations :", err);
        } finally {
            setLoadingReservations(false);
        }
    };

    // Gestion de la confirmation de réservation par le chauffeur
    const handleConfirmReservation = async (reservationId, tripDate) => {
        if (dayjs(tripDate).isAfter(dayjs())) {
            toast.error("La confirmation ne peut être faite qu'après la date du trajet.");
            return;
        }

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
        }
    };

    // Gestion de l'annulation d'une réservation (par l'utilisateur ou le chauffeur)
    const handleCancelReservation = async (reservationId, isDriver = false) => {
        if (!window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.")) {
            return;
        }

        setIsCancelling(reservationId);
        try {
            if (isDriver) {
                await cancelReservationByDriver(reservationId);
                toast.success("Réservation annulée par le chauffeur avec succès.");
            } else {
                await cancelReservation(reservationId, "phoneNumberRefund", "operatorFai"); // Assurez-vous d'avoir ces valeurs
                toast.success("Réservation annulée avec succès. Remboursement initié.");
            }
            loadReservations();
        } catch (err) {
            console.error("Échec de l'annulation :", err);
            toast.error("Échec de l'annulation de la réservation.");
        } finally {
            setIsCancelling(null);
        }
    };

    // Gestion de la confirmation de toutes les réservations d'un trajet
    const handleConfirmAllReservations = async (tripId, tripDate) => {
        if (dayjs(tripDate).isAfter(dayjs())) {
            toast.error("La confirmation ne peut être faite qu'après la date du trajet.");
            return;
        }

        if (!window.confirm("Êtes-vous sûr de vouloir confirmer toutes les réservations de ce trajet ?")) {
            return;
        }

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
        }
    };

    // Effet pour recharger les réservations
    useEffect(() => {
        loadReservations();
    }, [page, statusFilter, user, loadingUser]);

    // Rendu du composant
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
                    {/* Bouton de confirmation de toutes les réservations pour les chauffeurs */}
                    {user && user.isDriver && reservedTrips.length > 0 && reservedTrips[0].trip && reservedTrips[0].status === 1 && dayjs(reservedTrips[0].trip.departureDate).isBefore(dayjs()) && (
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
                                <div key={reservationData.id} className={`${cardBg} rounded-xl p-6 shadow-sm border ${borderColor} flex flex-col md:flex-row justify-between items-center transition-transform transform hover:scale-[1.01] duration-200`}>
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
                                                <FontAwesomeIcon icon={faUserCircle} className='mr-2' /> Places réservées: {reservationData.numberReservedPlaces}
                                            </div>
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faInfoCircle} className='mr-2' /> Statut: <span className="ml-1 font-semibold">{getStatusText(reservationData.status)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Boutons d'action conditionnels */}
                                    <div className="mt-4 md:mt-0 md:ml-4 flex flex-col sm:flex-row gap-2">
                                        {/* Bouton de confirmation pour les chauffeurs */}
                                        {user && user.isDriver && reservationData.status === 1 && dayjs(reservationData.trip.departureDate).isBefore(dayjs()) && (
                                            <button
                                                onClick={() => handleConfirmReservation(reservationData.id, reservationData.trip.departureDate)}
                                                disabled={isConfirming === reservationData.id}
                                                className="px-4 py-2 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                {isConfirming === reservationData.id ? (
                                                    <FontAwesomeIcon icon={faSpinner} spin />
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faCheckDouble} className="mr-2" />
                                                        Marquer comme complétée
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        {/* Bouton d'annulation pour les utilisateurs passagers */}
                                        {user && !user.isDriver && reservationData.status === 1 && dayjs(reservationData.trip.departureDate).isAfter(dayjs()) && (
                                            <button
                                                onClick={() => handleCancelReservation(reservationData.id)}
                                                disabled={isCancelling === reservationData.id}
                                                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                {isCancelling === reservationData.id ? (
                                                    <FontAwesomeIcon icon={faSpinner} spin />
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faBan} className="mr-2" />
                                                        Annuler
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        {/* Bouton d'annulation pour les chauffeurs */}
                                        {user && user.isDriver && reservationData.status === 1 && dayjs(reservationData.trip.departureDate).isAfter(dayjs()) && (
                                            <button
                                                onClick={() => handleCancelReservation(reservationData.id, true)}
                                                disabled={isCancelling === reservationData.id}
                                                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                {isCancelling === reservationData.id ? (
                                                    <FontAwesomeIcon icon={faSpinner} spin />
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faBan} className="mr-2" />
                                                        Annuler la réservation
                                                    </>
                                                )}
                                            </button>
                                        )}
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
        </div>
    );
};

export default MyReservations;