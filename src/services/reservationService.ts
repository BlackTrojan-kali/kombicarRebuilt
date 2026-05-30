// src/services/reservationService.ts
import api from '../config/api';
import type { PaginatedResponse } from '../types/TripTypes';
import type {
  AddReservationPayload,
  AddReservationResponse,
  AddReservationV2Payload,
  AddReservationV2Response,
  GetPriceResponse,
  UserReservationListItem,
  DriverReservationListItem,
  UrlResponse
} from '../types/ReservationTypes';

export const reservationService = {

  // ==========================================================
  // --- EXPÉDITIONS ET CRÉATIONS ---
  // ==========================================================

  addReservation: async (payload: AddReservationPayload): Promise<AddReservationResponse> => {
    const response = await api.post<AddReservationResponse>('/v1/reservations/add-reservation', payload);
    return response.data;
  },

  addReservationV2: async (payload: AddReservationV2Payload): Promise<AddReservationV2Response> => {
    const response = await api.post<AddReservationV2Response>('/v1/reservations/add-reservation-v2', payload);
    return response.data;
  },

  getPriceSimulation: async (
    tripId: number,
    numberPlaceWanted: number,
    promoCode: string
  ): Promise<GetPriceResponse> => {
    const code = promoCode.trim() !== '' ? encodeURIComponent(promoCode) : 'none';
    const response = await api.get<GetPriceResponse>(
      `/v1/reservations/get-price/${tripId}/${numberPlaceWanted}/${code}`
    );
    return response.data;
  },

  // ==========================================================
  // --- ACTIONS CHAUFFEUR & ANNULATIONS ---
  // ==========================================================

  cancelReservation: async (
    reservationId: number,
    phoneNumberRefund: string,
    operatorFai: number
  ): Promise<void> => {
    const response = await api.put(
      `/v1/reservations/cancel-reservation/${reservationId}/${encodeURIComponent(phoneNumberRefund)}/${operatorFai}`
    );
    return response.data;
  },

  cancelByDriver: async (reservationId: number): Promise<void> => {
    const response = await api.delete(`/v1/reservations/cancel-by-driver/${reservationId}`);
    return response.data;
  },

  confirmReservation: async (reservationId: number): Promise<void> => {
    const response = await api.post(`/v1/reservations/confirm/${reservationId}`);
    return response.data;
  },

  confirmAllReservations: async (tripId: number): Promise<void> => {
    const response = await api.post(`/v1/reservations/confirm-all-reservations/${tripId}`);
    return response.data;
  },

  // ==========================================================
  // --- CONSULTATIONS ET HISTORIQUES ---
  // ==========================================================

  getUserReservationsList: async (
    pageIndex: number,
    reservationStatus: number
  ): Promise<PaginatedResponse<UserReservationListItem>> => {
    const response = await api.get<PaginatedResponse<UserReservationListItem>>(
      `/v1/reservations/list/${pageIndex}/${reservationStatus}`
    );
    return response.data;
  },

  /**
   * Récupère la liste paginée des réservations effectuées pour un trajet spécifique.
   * STRICTEMENT RÉSERVÉ AU CHAUFFEUR DU TRAJET.
   * Method: GET
   * Endpoint: /v1/reservations/list-for-driver/{tripId}/{page}
   */
  getDriverReservationsList: async (
    tripId: number,
    page: number
  ): Promise<PaginatedResponse<DriverReservationListItem>> => {
    const response = await api.get<PaginatedResponse<DriverReservationListItem>>(
      `/v1/reservations/list-for-driver/${tripId}/${page}`
    );
    return response.data;
  },

  /**
   * Génère et retourne l'URL de téléchargement d'une facture PDF pour une réservation.
   * Method: GET
   * Endpoint: /v1/reservations/generate-bill
   * Attention: reservationId est un QUERY parameter.
   */
  generateBill: async (reservationId: number): Promise<UrlResponse> => {
    // Utilisation de la configuration 'params' d'Axios pour injecter le ?reservationId=...
    const response = await api.get<UrlResponse>(`/v1/reservations/generate-bill`, {
      params: { reservationId }
    });
    return response.data;
  }
};