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

  createTrip: async (payload: CreateTripPayload): Promise<{ id: number }> => {
    const response = await api.post<{ id: number }>('/v1/trips', payload);
    return response.data;
  },

  updateTrip: async (payload: UpdateTripPayload): Promise<void> => {
    const response = await api.put('/v1/trips', payload);
    return response.data;
  },

  cancelTrip: async (tripId: number): Promise<void> => {
    const response = await api.put(`/v1/trips/cancel/${tripId}`);
    return response.data;
  },

  deleteTrip: async (tripId: number): Promise<void> => {
    const response = await api.delete(`/v1/trips/${tripId}`);
    return response.data;
  },

  // ==========================================================
  // --- LECTURE ET RECHERCHE ---
  // ==========================================================

  getTripById: async (tripId: number): Promise<TripListItem> => {
    const response = await api.get<TripListItem>(`/v1/trips/${tripId}`);
    return response.data;
  },

  /**
   * Récupère une liste de trajets publics et disponibles avec pagination et filtres.
   */
  listPublicTrips: async (
    filters: Partial<PublicTripSearchFilter>
  ): Promise<PaginatedResponse<TripListItem>> => {
    
    // 1. Le payload minimal STRICTEMENT REQUIS (basé sur l'Admin)
    const payload: any = {
      page: filters.page || 1,
      tripDepartureHour: filters.tripDepartureHour || {
        acceptAllHour: true,
        startHour: 0,
        endHour: 0
      }
    };

    // 2. Injection CONDITIONNELLE des filtres uniquement s'ils sont définis et pertinents
    // Cela évite d'envoyer des champs à 0, null ou vides qui bloqueraient la recherche côté backend

    if (filters.tripStatus !== undefined && filters.tripStatus !== null) {
      payload.tripStatus = filters.tripStatus;
    }

    if (filters.country && filters.country > 0) {
      payload.country = filters.country;
    }

    if (filters.maxPrice && filters.maxPrice > 0) {
      payload.maxPrice = filters.maxPrice;
    }

    if (filters.vehiculeType && filters.vehiculeType > 0) {
      payload.vehiculeType = filters.vehiculeType;
    }

    if (filters.notationOfCondutor && filters.notationOfCondutor > 0) {
      payload.notationOfCondutor = filters.notationOfCondutor;
    }

    if (filters.startAreaCity && filters.startAreaCity.trim() !== '') {
      payload.startAreaCity = filters.startAreaCity;
    }

    if (filters.endAreaCity && filters.endAreaCity.trim() !== '') {
      payload.endAreaCity = filters.endAreaCity;
    }

    if (filters.departureDate && filters.departureDate.trim() !== '') {
      payload.departureDate = filters.departureDate;
    }

    if (filters.airConditionned === true) {
      payload.airConditionned = true;
    }

    if (filters.luggageAllowed === true) {
      payload.luggageAllowed = true;
    }

    // Appel API
    const response = await api.post<PaginatedResponse<TripListItem>>(
      '/v1/trips/list-public', 
      payload
    );
    
    return response.data;
  },

  getUserPublishedTrips: async (
    pageIndex: number, 
    status: TripStatus | number
  ): Promise<PaginatedResponse<TripListItem>> => {
    const response = await api.get<PaginatedResponse<TripListItem>>(
      `/v1/trips/${pageIndex}/${status}`
    );
    return response.data;
  },

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