// src/pages/covoiturage/MyReservationsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Loader2, Calendar, MapPin, 
  ArrowRight, Users, Clock, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import { reservationService } from '../../services/reservationService';
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
                    <Link 
                      to={`/trajets/${trip.id}`}
                      className="px-4 py-2 bg-base border border-border-main rounded-xl text-sm font-bold text-text-main hover:bg-surface transition-colors"
                    >
                      Voir le trajet
                    </Link>
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

    </div>
  );
};