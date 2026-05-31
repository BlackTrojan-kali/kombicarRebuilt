// src/pages/covoiturage/DriverTripsPage.tsx
import  { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Loader2, Calendar, MapPin, 
  ArrowRight, Users, Clock, CheckCircle2, XCircle, Settings, 
} from 'lucide-react';
import toast from 'react-hot-toast';

import { tripService } from '../../services/tripService';
import { DriverTripReservationsModal } from '../../components/trips/DriverTripReservationsModal';
import { type TripListItem } from '../../types/TripTypes';

// Adapte ces valeurs selon l'Enum TripStatus de ton backend
const TRIP_STATUSES = [
  { value: 0, label: 'Publiés', icon: CheckCircle2, color: 'text-kombi-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
  { value: 3, label: 'En validation', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
  { value: 4, label: 'Terminés', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' }, // Assumons 4 pour terminé
  { value: 1, label: 'Annulés', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
];

export const DriverTripsPage = () => {
  const navigate = useNavigate();

  // États pour les filtres et la pagination
  const [activeStatus, setActiveStatus] = useState<number>(0); // 0 = Publiés par défaut
  const [trips, setTrips] = useState<TripListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0
  });

  // État pour la gestion de la Modale des réservations
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);

  // État pour l'annulation d'un trajet
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const response = await tripService.getUserPublishedTrips(currentPage, activeStatus);
      setTrips(response.items || []);
      setPaginationMeta({
        hasNextPage: response.hasNextPage,
        hasPreviousPage: response.hasPreviousPage,
        totalCount: response.totalCount
      });
    } catch (error) {
      toast.error("Erreur lors du chargement de vos trajets.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStatus, currentPage]);

  const handleStatusChange = (statusValue: number) => {
    setActiveStatus(statusValue);
    setCurrentPage(1);
  };

  // --- ACTIONS CHAUFFEUR ---

  const handleOpenReservations = (tripId: number) => {
    setSelectedTripId(tripId);
    setIsReservationsModalOpen(true);
  };

  const handleCancelTrip = async (tripId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler ce trajet ? Tous les passagers actuels seront remboursés et notifiés.")) return;
    
    setProcessingId(tripId);
    try {
      await tripService.cancelTrip(tripId);
      toast.success("Votre trajet a été annulé avec succès.");
      fetchTrips(); // Rafraîchir la liste
    } catch (error: any) {
      toast.error(error.response?.data?.description || "Erreur lors de l'annulation du trajet.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-base pb-24">
      
      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-surface border-b border-border-main shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors shrink-0"
          >
            <ChevronLeft size={20} className="text-text-main" />
          </button>
          <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
            Mes Trajets <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-md uppercase tracking-wider">Conducteur</span>
          </h1>
          <div className="w-10"></div>
        </div>
        
        {/* ONGLETS DE STATUT */}
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {TRIP_STATUSES.map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold shrink-0 transition-all border ${
                  activeStatus === status.value
                    ? 'border-kombi-orange-500 bg-kombi-orange-50 dark:bg-kombi-orange-500/10 text-kombi-orange-600 dark:text-kombi-orange-400'
                    : 'border-border-main bg-surface text-text-muted hover:bg-base'
                }`}
              >
                {activeStatus === status.value && <status.icon size={16} />}
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-4">
        
        {/* CTA NOUVEAU TRAJET */}
        <div className="flex justify-end mb-6">
          <Link 
            to="/publier" 
            className="px-6 py-3 bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            + Publier un trajet
          </Link>
        </div>

        {/* LISTE DES TRAJETS */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 size={40} className="text-kombi-orange-500 animate-spin mb-4" />
            <p className="text-text-muted font-medium">Chargement de vos trajets...</p>
          </div>
        ) : trips.length > 0 ? (
          <>
            <p className="text-sm font-medium text-text-muted mb-4">
              {paginationMeta.totalCount} trajet{paginationMeta.totalCount > 1 ? 's' : ''} trouvé{paginationMeta.totalCount > 1 ? 's' : ''}
            </p>

            {trips.map((item) => {
              const { trip, departureArea, arrivalArea } = item;
              
              const departureDate = new Date(trip.departureDate);
              const dateString = departureDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
              const timeString = departureDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
              
              const StatusInfo = TRIP_STATUSES.find(s => s.value === trip.status) || TRIP_STATUSES[0];
              const isProcessing = processingId === trip.id;
              
              // On suppose que le backend renvoie le nombre de places restantes 
              // et que le véhicule a un "numberPlaces" total pour le calcul, 
              // sinon on affiche juste les places restantes.
              const placesReserved = item.vehicule.numberPlaces - trip.placesLeft;

              return (
                <div key={trip.id} className="bg-surface border border-border-main rounded-[20px] p-5 hover:shadow-md transition-shadow">
                  
                  {/* En-tête de la carte */}
                  <div className="flex items-start justify-between mb-4 border-b border-border-main pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar size={16} className="text-kombi-orange-500" />
                        <span className="font-bold text-text-main capitalize">{dateString} à {timeString}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-muted mt-2">
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-base rounded-md">
                          <Users size={14} className="text-kombi-blue-500" />
                          {placesReserved} passager(s)
                        </span>
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-base rounded-md">
                          Places dispo: <strong className="text-text-main">{trip.placesLeft}</strong>
                        </span>
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

                  {/* Actions Conducteur */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border-main">
                    <div className="flex gap-2 w-full sm:w-auto">
                      {/* Afficher les boutons d'actions uniquement si le trajet est Actif/Publié (0) ou En validation (3) */}
                      {(trip.status === 0 || trip.status === 3) && (
                        <button
                          onClick={() => handleCancelTrip(trip.id)}
                          disabled={isProcessing}
                          className="flex-1 sm:flex-none px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                        >
                          {isProcessing ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Annuler le trajet"}
                        </button>
                      )}
                      
                      <Link 
                        to={`/trajets/${trip.id}`}
                        className="flex-1 sm:flex-none px-4 py-2 bg-base border border-border-main rounded-xl text-sm font-bold text-text-main hover:bg-surface transition-colors text-center"
                      >
                        Aperçu
                      </Link>
                    </div>

                    <button 
                      onClick={() => handleOpenReservations(trip.id)}
                      className="w-full sm:w-auto px-5 py-2 bg-kombi-dark-500 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Settings size={16} /> Gérer les passagers
                    </button>
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
            <h3 className="text-lg font-bold text-text-main mb-2">Aucun trajet trouvé</h3>
            <p className="text-text-muted text-sm max-w-sm mx-auto">
              Vous n'avez aucun trajet dans cette catégorie.
            </p>
            {activeStatus === 0 && (
              <Link 
                to="/covoiturage/publier"
                className="mt-6 inline-block text-kombi-orange-500 font-bold hover:underline"
              >
                Publier votre premier trajet
              </Link>
            )}
          </div>
        )}
      </div>

      {/* LA MODALE DE GESTION DES PASSAGERS */}
      {selectedTripId && (
        <DriverTripReservationsModal
          tripId={selectedTripId}
          isOpen={isReservationsModalOpen}
          onClose={() => setIsReservationsModalOpen(false)}
          onStatusChange={fetchTrips} // Recharge la liste si le trajet est marqué comme terminé depuis la modale
        />
      )}
    </div>
  );
};