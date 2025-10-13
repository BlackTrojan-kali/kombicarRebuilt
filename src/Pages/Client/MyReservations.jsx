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

// Modal réutilisable
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, theme, children, disabled }) => {
  if (!isOpen) return null;

  const modalBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
      <div className={`${modalBg} rounded-xl p-8 shadow-2xl border ${borderColor} max-w-lg w-full`}>
        <h3 className={`text-xl font-bold mb-4 ${textColorPrimary}`}>{title}</h3>
        <p className={`text-sm mb-6 ${textColorPrimary}`}>{message}</p>

        {children}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-500 text-white hover:bg-gray-600 transition"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition 
              ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MyReservations() {
  const { user, loading: loadingUser } = useAuth();
  const {
    getReservationsWithStatus,
    confirmReservationAsDriver,
    cancelReservation,
    confirmAllReservations
  } = useReservation();
  const { theme } = useColorScheme();

  const [reservedTrips, setReservedTrips] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState(1);

  const [isConfirming, setIsConfirming] = useState(null);
  const [isCancelling, setIsCancelling] = useState(null);
  const [isConfirmingAll, setIsConfirmingAll] = useState(false);

  // Modal & remboursement
  const [showModal, setShowModal] = useState(false);
  const [refundInfo, setRefundInfo] = useState({ reservationId: null });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [modalData, setModalData] = useState({ title: '', message: '', confirmText: '', action: () => {} });

  // Charger les réservations
  const loadReservations = async () => {
    if (!user || loadingUser) return;
    setLoadingReservations(true);
    try {
      const response = await getReservationsWithStatus(page, statusFilter);
      const formatted = response.items.map(item => ({
        ...item,
        totalPrice: item.trip.pricePerPlace * item.reservation.numberReservedPlaces,
      }));
      setReservedTrips(formatted);
      setTotalPages(response.totalCount ? Math.ceil(response.totalCount / TRIPS_PER_PAGE) : 1);
    } catch {
      toast.error("Échec du chargement des réservations.");
    } finally {
      setLoadingReservations(false);
    }
  };

  useEffect(() => { loadReservations(); }, [page, statusFilter, user, loadingUser]);

  // Confirmer réservation (chauffeur)
  const handleConfirmReservation = (id, tripDate) => {
    if (dayjs(tripDate).isAfter(dayjs())) {
      return toast.error("La confirmation n’est possible qu’après la date du trajet.");
    }
    setModalData({
      title: "Confirmer la réservation",
      message: "Voulez-vous marquer cette réservation comme complétée ?",
      confirmText: "Confirmer",
      action: async () => {
        setIsConfirming(id);
        try {
          await confirmReservationAsDriver(id);
          toast.success("Réservation confirmée !");
          loadReservations();
        } catch {
          toast.error("Échec de la confirmation.");
        } finally {
          setIsConfirming(null);
          setShowModal(false);
        }
      },
    });
    setShowModal(true);
  };

  // Confirmer toutes les réservations
  const handleConfirmAllReservations = (tripId, date) => {
    if (dayjs(date).isAfter(dayjs())) {
      return toast.error("Vous ne pouvez confirmer qu'après la date du trajet.");
    }
    setModalData({
      title: "Confirmer toutes les réservations",
      message: "Voulez-vous confirmer toutes les réservations de ce trajet ?",
      confirmText: "Tout confirmer",
      action: async () => {
        setIsConfirmingAll(true);
        try {
          await confirmAllReservations(tripId);
          toast.success("Toutes les réservations ont été confirmées !");
          loadReservations();
        } catch {
          toast.error("Erreur lors de la confirmation.");
        } finally {
          setIsConfirmingAll(false);
          setShowModal(false);
        }
      },
    });
    setShowModal(true);
  };

  // Préparer annulation
  const handleCancelReservation = (id) => {
    setRefundInfo({ reservationId: id });
    setPhoneNumber('');
    setOperator('');

    setModalData({
      title: "Annulation (client)",
      message: "Veuillez renseigner les informations pour le remboursement.",
      confirmText: "Confirmer",
      action: performCancelReservation,
    });

    setShowModal(true);
  };

  // Exécuter annulation
  const performCancelReservation = async () => {
    const { reservationId } = refundInfo;
    console.log(reservationId)
    if (!reservationId) return;

    if (!phoneNumber || !operator) {
      toast.error("Veuillez renseigner le numéro et l’opérateur.");
      return;
    }

    setIsCancelling(reservationId);

    try {
      await cancelReservation(reservationId, phoneNumber, operator);
      toast.success("Réservation annulée, remboursement initié.");
      loadReservations();
      setShowModal(false);
    } catch {
      toast.error("Erreur lors de l’annulation.");
    } finally {
      setIsCancelling(null);
      setRefundInfo({ reservationId: null });
    }
  };

  const getStatusText = (status) => ({
    0: "En attente",
    1: "Confirmé",
    2: "Refusé",
    3: "Annulé",
    4: "Complété",
  }[status] || "Inconnu");

  const pageBgColor = theme === 'dark' ? 'bg-gray-900' : "";
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  // Formulaire de remboursement
  const RefundForm = () => (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium ${textColorPrimary}`}>Numéro Mobile Money</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg ${borderColor} ${cardBg} ${textColorPrimary}`}
          placeholder="Ex: 699123456"
          required
        />
      </div>
      <div>
        <label className={`block text-sm font-medium ${textColorPrimary}`}>Opérateur</label>
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg ${borderColor} ${cardBg} ${textColorPrimary}`}
          required
        >
          <option value="">Sélectionnez un opérateur</option>
          <option value={1}>MTN Mobile Money</option>
          <option value={2}>Orange Money</option>
        </select>
      </div>
    </div>
  );

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

  return (
    <div className={`min-h-screen pt-20 pb-10 ${pageBgColor} ${textColorPrimary}`}>
      <main className="max-w-4xl mx-auto px-4">
        <div className={`${cardBg} rounded-2xl shadow-xl p-8 border ${borderColor}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              <FontAwesomeIcon icon={faBookmark} className="mr-2 text-blue-500" />
              Mes Réservations
            </h2>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(parseInt(e.target.value)); setPage(1); }}
              className={`py-1 px-2 text-sm rounded-md border ${borderColor} ${cardBg}`}
            >
              <option value="1">Confirmé</option>
              <option value="0">En attente</option>
              <option value="2">Refusé</option>
              <option value="3">Annulé</option>
              <option value="4">Complété</option>
            </select>
          </div>

          {reservedTrips.length === 0 ? (
            <p className="text-center text-gray-400 py-6">Aucune réservation à afficher.</p>
          ) : (
            reservedTrips.map((r) => (
              <div key={r.reservation.id} className={`${cardBg} rounded-xl p-6 border ${borderColor} mb-4`}>
                <div className="flex justify-between flex-col sm:flex-row">
                  <div>
                    <h3 className="font-semibold text-lg">
                      <FontAwesomeIcon icon={faRoute} className="mr-2 text-blue-500" />
                      {r.departureArea.homeTownName} - {r.arrivalArea.homeTownName}
                    </h3>
                    <p className={textColorSecondary}>
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                      {dayjs(r.trip.departureDate).format('DD MMM YYYY HH:mm')}
                    </p>
                    <p className={textColorSecondary}>
                      <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                      {r.totalPrice} XAF
                    </p>
                    <p className={textColorSecondary}>
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                      Statut : <strong>{getStatusText(r.reservation.status)}</strong>
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    {r.reservation.status === 1 && dayjs(r.trip.departureDate).isBefore(dayjs()) && (
                      <button
                        onClick={() => handleConfirmReservation(r.reservation.id, r.trip.departureDate)}
                        disabled={isConfirming === r.reservation.id}
                        className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                      >
                        {isConfirming === r.reservation.id ? <FontAwesomeIcon icon={faSpinner} spin /> : "Marquer comme complétée"}
                      </button>
                    )}

                    {(r.reservation.status === 0 || r.reservation.status === 1) &&
                      dayjs(r.trip.departureDate).isAfter(dayjs()) && (
                        <button
                          onClick={() => handleCancelReservation(r.reservation.id)}
                          disabled={isCancelling === r.reservation.id}
                          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          {isCancelling === r.reservation.id ? <FontAwesomeIcon icon={faSpinner} spin /> : "Annuler"}
                        </button>
                      )}

                    {r.reservation.status === 4 && (
                      <Link
                        to={`/reviews/create/${r.trip.id}`}
                        className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 flex items-center"
                      >
                        <FontAwesomeIcon icon={faStar} className="mr-2" /> Avis
                      </Link>
                    )}

                    <Link
                      to={`/chat/${r.reservation.id}`}
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center"
                    >
                      <FontAwesomeIcon icon={faComments} className="mr-2" /> Chat
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={modalData.action}
        title={modalData.title}
        message={modalData.message}
        confirmText={modalData.confirmText}
        theme={theme}
        disabled={!phoneNumber || !operator}
      >
        <RefundForm />
      </ConfirmationModal>
    </div>
  );
}
