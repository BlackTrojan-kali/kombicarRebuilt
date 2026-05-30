// src/pages/covoiturage/MyReservationsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Loader2, Calendar, MapPin, 
  ArrowRight, Users, Clock, CheckCircle2, XCircle, AlertCircle, Star
} from 'lucide-react';
import toast from 'react-hot-toast';

import { reservationService } from '../../services/reservationService';
import { reviewService } from '../../services/reviewService'; // <-- IMPORT DU SERVICE DES AVIS
import type { UserReservationListItem } from '../../types/ReservationTypes';

// Mapping des statuts de réservation (0 à 4 selon ton backend)
const RESERVATION_STATUSES = [
  { value: 0, label: 'En attente', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
  { value: 1, label: 'Confirmées', icon: CheckCircle2, color: 'text-kombi-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
  { value: 4, label: 'Terminées', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  { value: 2, label: 'Annulées', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
  { value: 3, label: 'Refusées', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
];

export const MyReservationsPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<number>(1); // 1 = Confirmées par défaut
  const [reservations, setReservations] = useState<UserReservationListItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0
  });

  // États pour la modale d'évaluation
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedTripIdForReview, setSelectedTripIdForReview] = useState<number | null>(null);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await reservationService.getUserReservationsList(currentPage, activeTab);
      setReservations(response.items || []);
      setPaginationMeta({
        hasNextPage: response.hasNextPage,
        hasPreviousPage: response.hasPreviousPage,
        totalCount: response.totalCount
      });
    } catch (error) {
      toast.error("Erreur lors du chargement de vos réservations.");
    } finally {
      setIsLoading(false);
    }
  };

  // Recharger lors du changement d'onglet ou de page
  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage]);

  const handleTabChange = (statusValue: number) => {
    setActiveTab(statusValue);
    setCurrentPage(1); // Retour à la page 1 quand on change de filtre
  };

  const openReviewModal = (tripId: number) => {
    setSelectedTripIdForReview(tripId);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-base pb-24">
      
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-surface border-b border-border-main shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors shrink-0"
          >
            <ChevronLeft size={20} className="text-text-main" />
          </button>
          <h1 className="text-lg font-bold text-text-main">Mes Réservations</h1>
          <div className="w-10"></div> {/* Spacer pour centrer le titre */}
        </div>
        
        {/* ONGLETS DE STATUT */}
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {RESERVATION_STATUSES.map((status) => (
              <button
                key={status.value}
                onClick={() => handleTabChange(status.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold shrink-0 transition-all border ${
                  activeTab === status.value
                    ? 'border-kombi-orange-500 bg-kombi-orange-50 dark:bg-kombi-orange-500/10 text-kombi-orange-600 dark:text-kombi-orange-400'
                    : 'border-border-main bg-surface text-text-muted hover:bg-base'
                }`}
              >
                {activeTab === status.value && <status.icon size={16} />}
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-4">
        {/* LISTE DES RÉSERVATIONS */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 size={40} className="text-kombi-orange-500 animate-spin mb-4" />
            <p className="text-text-muted font-medium">Chargement de vos réservations...</p>
          </div>
        ) : reservations.length > 0 ? (
          <>
            <p className="text-sm font-medium text-text-muted mb-4">
              {paginationMeta.totalCount} réservation{paginationMeta.totalCount > 1 ? 's' : ''} trouvée{paginationMeta.totalCount > 1 ? 's' : ''}
            </p>

            {reservations.map((item) => {
              const { trip, departureArea, arrivalArea, reservation } = item;
              
              const departureDate = new Date(trip.departureDate);
              const dateString = departureDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
              const timeString = departureDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
              const totalPrice = trip.pricePerPlace * reservation.numberReservedPlaces;

              const StatusInfo = RESERVATION_STATUSES.find(s => s.value === reservation.status) || RESERVATION_STATUSES[0];

              return (
                <div key={reservation.id} className="bg-surface border border-border-main rounded-[20px] p-5 hover:shadow-md transition-shadow">
                  {/* En-tête de la carte */}
                  <div className="flex items-start justify-between mb-4 border-b border-border-main pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar size={16} className="text-kombi-orange-500" />
                        <span className="font-bold text-text-main capitalize">{dateString} à {timeString}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-text-muted">
                        <Users size={14} />
                        <span>{reservation.numberReservedPlaces} place{reservation.numberReservedPlaces > 1 ? 's' : ''} réservée{reservation.numberReservedPlaces > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${StatusInfo.bg} ${StatusInfo.color}`}>
                        <StatusInfo.icon size={12} />
                        {StatusInfo.label}
                      </div>
                    </div>
                  </div>

                  {/* Itinéraire */}
                  <div className="flex items-center gap-3 text-base text-text-main font-bold mb-5">
                    <p className="truncate flex-1">{departureArea.homeTownName}</p>
                    <ArrowRight size={16} className="text-text-muted shrink-0" />
                    <p className="truncate flex-1 text-right">{arrivalArea.homeTownName}</p>
                  </div>

                  {/* Bas de carte */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-lg font-black text-text-main">
                      {totalPrice.toLocaleString('fr-FR')} <span className="text-xs font-bold text-text-muted uppercase">XAF</span>
                    </p>
                    <div className="flex gap-2">
                      {/* BOUTON D'ÉVALUATION (Uniquement si Terminée) */}
                      {reservation.status === 4 && (
                        <button 
                          onClick={() => openReviewModal(trip.id)}
                          className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-900/50 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded-xl text-sm font-bold transition-colors flex items-center gap-1"
                        >
                          <Star size={16} /> Évaluer
                        </button>
                      )}
                      <Link 
                        to={`/trajets/${trip.id}`}
                        className="px-4 py-2 bg-base border border-border-main rounded-xl text-sm font-bold text-text-main hover:bg-surface transition-colors"
                      >
                        Voir le trajet
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* PAGINATION */}
            {(paginationMeta.hasNextPage || paginationMeta.hasPreviousPage) && (
              <div className="flex items-center justify-center gap-4 pt-6 pb-4">
                <button
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={!paginationMeta.hasPreviousPage}
                  className="px-4 py-2 bg-surface border border-border-main rounded-xl text-sm font-bold text-text-main disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base"
                >
                  Précédent
                </button>
                <span className="text-sm font-medium text-text-muted">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!paginationMeta.hasNextPage}
                  className="px-4 py-2 bg-surface border border-border-main rounded-xl text-sm font-bold text-text-main disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-surface border border-border-main rounded-[20px] p-8 text-center mt-4">
            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/10 text-kombi-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} />
            </div>
            <h3 className="text-lg font-bold text-text-main mb-2">Aucune réservation</h3>
            <p className="text-text-muted text-sm max-w-sm mx-auto">
              Vous n'avez aucune réservation dans cette catégorie pour le moment.
            </p>
            <Link 
              to="/recherche"
              className="mt-6 inline-block text-kombi-orange-500 font-bold hover:underline"
            >
              Rechercher un trajet
            </Link>
          </div>
        )}
      </div>

      {/* MODALE D'ÉVALUATION */}
      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        tripId={selectedTripIdForReview} 
      />

    </div>
  );
};

// ==========================================
// --- COMPOSANT : MODALE D'ÉVALUATION ---
// ==========================================
const ReviewModal = ({ isOpen, onClose, tripId }: { isOpen: boolean, onClose: () => void, tripId: number | null }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Réinitialiser la modale à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setComment('');
    }
  }, [isOpen]);

  if (!isOpen || !tripId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) return toast.error("La note doit être comprise entre 1 et 5.");

    setIsSubmitting(true);
    try {
      await reviewService.createReview({
        rating,
        comment,
        tripId
      });
      toast.success("Votre avis a été soumis avec succès !");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.description || "Vous avez probablement déjà évalué ce trajet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-surface w-full max-w-md rounded-3xl p-6 shadow-2xl animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-text-main">
            <Star className="text-yellow-500 fill-yellow-500" /> Évaluer ce trajet
          </h3>
          <button onClick={onClose} className="p-2 bg-base hover:bg-border-main rounded-full transition-colors">
             <XCircle size={20} className="text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SÉLECTEUR D'ÉTOILES */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-bold text-text-muted mb-2">Quelle note donnez-vous ?</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => setRating(starValue)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    size={36} 
                    className={`${starValue <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-border-main fill-transparent'} transition-colors`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* CHAMP COMMENTAIRE */}
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">
              Votre commentaire (Optionnel)
            </label>
            <textarea 
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comment s'est passé votre voyage ? Le conducteur était-il ponctuel et agréable ?"
              className="w-full p-3 border border-border-main rounded-xl bg-base text-text-main focus:border-kombi-orange-500 focus:ring-1 focus:ring-kombi-orange-500 transition-all outline-none resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
            {isSubmitting ? "Envoi en cours..." : "Soumettre mon avis"}
          </button>
        </form>
      </div>
    </div>
  );
};