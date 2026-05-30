// src/components/trips/DriverTripReservationsModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  X, Users, Phone, Loader2, CheckCircle, 
  XCircle, AlertTriangle, User, Mail
} from 'lucide-react';
import toast from 'react-hot-toast';

import { reservationService } from '../../services/reservationService';
import type { DriverReservationListItem } from '../../types/ReservationTypes';

interface DriverTripReservationsModalProps {
  tripId: number;
  isOpen: boolean;
  onClose: () => void;
  // Optionnel : un callback pour rafraichir la liste des trajets si le statut global du trajet change
  onStatusChange?: () => void; 
}

// Mapping des statuts de réservation pour l'affichage (à adapter selon tes constantes exactes)
const getStatusBadge = (status: number) => {
  switch (status) {
    case 0: return { label: 'En attente', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
    case 1: return { label: 'Confirmée', color: 'text-green-600 bg-green-50 border-green-200' };
    case 2: return { label: 'Annulée', color: 'text-red-600 bg-red-50 border-red-200' };
    case 3: return { label: 'Refusée', color: 'text-red-600 bg-red-50 border-red-200' };
    case 4: return { label: 'Terminée (Payée)', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    default: return { label: 'Inconnu', color: 'text-gray-600 bg-gray-50 border-gray-200' };
  }
};

export const DriverTripReservationsModal: React.FC<DriverTripReservationsModalProps> = ({
  tripId,
  isOpen,
  onClose,
  onStatusChange
}) => {
  const [reservations, setReservations] = useState<DriverReservationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({ hasNext: false, hasPrev: false, total: 0 });

  // États pour les actions en cours
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [isConfirmingAll, setIsConfirmingAll] = useState(false);

  // Charger les réservations
  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await reservationService.getDriverReservationsList(tripId, currentPage);
      setReservations(response.items || []);
      setPaginationMeta({
        hasNext: response.hasNextPage,
        hasPrev: response.hasPreviousPage,
        total: response.totalCount
      });
    } catch (error) {
      toast.error("Erreur lors du chargement des passagers.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && tripId) {
      fetchReservations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, tripId, currentPage]);

  // Actions
  const handleConfirmReservation = async (reservationId: number) => {
    if (!window.confirm("Confirmer que ce passager a bien voyagé avec vous ? Les fonds seront transférés sur votre solde.")) return;
    
    setProcessingId(reservationId);
    try {
      await reservationService.confirmReservation(reservationId);
      toast.success("Réservation confirmée avec succès !");
      fetchReservations();
      if (onStatusChange) onStatusChange();
    } catch (error: any) {
      toast.error(error.response?.data?.description || "Erreur lors de la confirmation.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler ce passager ? Il sera intégralement remboursé.")) return;
    
    setProcessingId(reservationId);
    try {
      await reservationService.cancelByDriver(reservationId);
      toast.success("Réservation annulée. Le passager a été remboursé.");
      fetchReservations();
      if (onStatusChange) onStatusChange();
    } catch (error: any) {
      toast.error(error.response?.data?.description || "Erreur lors de l'annulation.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmAll = async () => {
    if (!window.confirm("Confirmer TOUS les passagers de ce trajet d'un seul coup ? Le trajet sera marqué comme terminé.")) return;
    
    setIsConfirmingAll(true);
    try {
      await reservationService.confirmAllReservations(tripId);
      toast.success("Toutes les réservations ont été confirmées !");
      fetchReservations();
      if (onStatusChange) onStatusChange();
    } catch (error: any) {
      toast.error(error.response?.data?.description || "Erreur lors de la confirmation globale.");
    } finally {
      setIsConfirmingAll(false);
    }
  };

  if (!isOpen) return null;

  // Vérifier s'il y a des réservations confirmables (Statut 1 = Confirmée, à passer en 4 = Terminée/Payée)
  // (Cela dépend de ta logique métier, on affiche le bouton "Tout confirmer" s'il y a au moins une résa)
  const canConfirmAll = reservations.length > 0 && reservations.some(r => r.reservation.status !== 2 && r.reservation.status !== 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-surface w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-border-main bg-base/50 shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-text-main flex items-center gap-2">
              <Users className="text-kombi-orange-500" />
              Passagers du trajet
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Gérez vos réservations et confirmez les présences.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface border border-border-main flex items-center justify-center text-text-muted hover:bg-base transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY - SCROLLABLE LIST */}
        <div className="flex-1 overflow-y-auto p-6 bg-base">
          {/* Action globale */}
          {canConfirmAll && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-blue-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-bold text-blue-900 dark:text-blue-100 text-sm">Le trajet est terminé ?</p>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-0.5">Confirmez tous les passagers en une fois pour recevoir vos fonds.</p>
                </div>
              </div>
              <button
                onClick={handleConfirmAll}
                disabled={isConfirmingAll}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isConfirmingAll && <Loader2 size={16} className="animate-spin" />}
                Tout confirmer
              </button>
            </div>
          )}

          {/* Liste des réservations */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={40} className="text-kombi-orange-500 animate-spin" />
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-12 bg-surface rounded-2xl border border-border-main">
              <Users size={40} className="text-text-muted mx-auto mb-3 opacity-50" />
              <h3 className="font-bold text-text-main">Aucune réservation</h3>
              <p className="text-sm text-text-muted mt-1">Personne n'a encore réservé ce trajet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map(({ client, reservation }) => {
                const badge = getStatusBadge(reservation.status);
                const isProcessing = processingId === reservation.id;
                // Exemples de règles métier pour afficher les boutons
                const canConfirm = reservation.status === 0 || reservation.status === 1; 
                const canCancel = reservation.status !== 2 && reservation.status !== 4;

                return (
                  <div key={reservation.id} className="bg-surface border border-border-main rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    
                    {/* Infos Passager */}
                    <div className="flex items-center gap-4">
                      {client.pictureProfileUrl ? (
                        <img src={client.pictureProfileUrl} alt={client.firstName} className="w-12 h-12 rounded-full object-cover border border-border-main" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-kombi-dark-500 text-white flex items-center justify-center font-bold">
                          {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                        </div>
                      )}
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-extrabold text-text-main">{client.firstName} {client.lastName}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md border font-bold uppercase ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                          <span className="flex items-center gap-1"><Phone size={12}/> {client.phoneNumber}</span>
                          <span className="flex items-center gap-1"><User size={12}/> {reservation.numberReservedPlaces} place(s)</span>
                          {client.email && <span className="flex items-center gap-1"><Mail size={12}/> {client.email}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Actions individuelles */}
                    <div className="w-full sm:w-auto flex items-center justify-end gap-2 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-border-main">
                      {canCancel && (
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          disabled={isProcessing}
                          title="Annuler et rembourser"
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <XCircle size={20} />
                        </button>
                      )}
                      {canConfirm && (
                        <button
                          onClick={() => handleConfirmReservation(reservation.id)}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-kombi-green-500 hover:bg-kombi-green-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                          Confirmer
                        </button>
                      )}
                    </div>
                    
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Pagination */}
          {(paginationMeta.hasNext || paginationMeta.hasPrev) && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={!paginationMeta.hasPrev}
                className="px-3 py-1.5 bg-surface border border-border-main rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-base"
              >
                Précédent
              </button>
              <span className="text-sm font-medium">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!paginationMeta.hasNext}
                className="px-3 py-1.5 bg-surface border border-border-main rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-base"
              >
                Suivant
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};