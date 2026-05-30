// src/services/tripService.ts
import api from '../config/api';
import type { 
  CreateTripPayload, 
  UpdateTripPayload, 
  TripListItem, 
  PaginatedResponse, 
  TripStatus, 
  ReservationStatus, 
  UserView,
  PublicTripSearchFilter
} from '../types/TripTypes';

export const tripService = {

  // ==========================================================
  // --- GESTION DU CYCLE DE VIE DU TRAJET ---
  // ==========================================================

  /**
   * Crée un nouveau trajet en tant que conducteur.
   */
  createTrip: async (payload: CreateTripPayload): Promise<{ id: number }> => {
    const response = await api.post<{ id: number }>('/v1/trips', payload);
    return response.data;
  },

  /**
   * Met à jour les détails d'un trajet existant.
   */
  updateTrip: async (payload: UpdateTripPayload): Promise<void> => {
    const response = await api.put('/v1/trips', payload);
    return response.data;
  },

  /**
   * Annule un trajet (passe son statut à CANCELLED).
   * L'API attend un paramètre d'URL (tripId) mais rien dans le body.
   */
  cancelTrip: async (tripId: number): Promise<void> => {
    const response = await api.put(`/v1/trips/cancel/${tripId}`);
    return response.data;
  },

  /**
   * Supprime définitivement un trajet (Hard Delete ou Soft Delete côté serveur).
   */
  deleteTrip: async (tripId: number): Promise<void> => {
    const response = await api.delete(`/v1/trips/${tripId}`);
    return response.data;
  },

  // ==========================================================
  // --- LECTURE ET RECHERCHE ---
  // ==========================================================

  /**
   * Récupère les détails complets d'un trajet par son ID (Vue publique/détail).
   */
  getTripById: async (tripId: number): Promise<TripListItem> => {
    const response = await api.get<TripListItem>(`/v1/trips/${tripId}`);
    return response.data;
  },

  /**
   * Endpoint de recherche public pour les passagers.
   * Accepte une grande variété de filtres via le corps de la requête.
   * Peut être appelé même sans être connecté (token optionnel).
   */
  listPublicTrips: async (
    filters: PublicTripSearchFilter
  ): Promise<PaginatedResponse<TripListItem>> => {
    const response = await api.post<PaginatedResponse<TripListItem>>(
      '/v1/trips/list-public', 
      filters
    );
    return response.data;
  },

  /**
   * Liste les trajets publiés par l'utilisateur connecté (Vue Conducteur).
   */
  getUserPublishedTrips: async (
    pageIndex: number, 
    status: TripStatus | number
  ): Promise<PaginatedResponse<TripListItem>> => {
    const response = await api.get<PaginatedResponse<TripListItem>>(
      `/v1/trips/${pageIndex}/${status}`
    );
    return response.data;
  },

  /**
   * Liste globale des trajets réservés par un utilisateur (Mélange Conducteur et Client).
   */
  getGeneralReservedTrips: async (
    pageIndex: number,
    status: TripStatus | number,
    reservationStatus: ReservationStatus | number
  ): Promise<PaginatedResponse<TripListItem>> => {
    const response = await api.get<PaginatedResponse<TripListItem>>(
      `/v1/trips/list-by-reservation/${pageIndex}/${status}/${reservationStatus}`
    );
    return response.data;
  },

  /**
   * Liste filtrée des trajets réservés selon une perspective précise (Client OU Chauffeur).
   */
  getReservedTripsByView: async (
    pageIndex: number,
    status: TripStatus | number,
    reservationStatus: ReservationStatus | number,
    userView: UserView | number
  ): Promise<PaginatedResponse<TripListItem>> => {
    const response = await api.get<PaginatedResponse<TripListItem>>(
      `/v1/trips/list-by-reservation/${pageIndex}/${status}/${reservationStatus}/${userView}`
    );
    return response.data;
  }
};