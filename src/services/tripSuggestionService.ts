// src/services/tripSuggestionService.ts
import api from '../config/api';
import type { PaginatedResponse } from '../types/TripTypes';
import type { 
  CreateTripSuggestionPayload, 
  UpdateTripSuggestionPayload, 
  TripSuggestionDto 
} from '../types/tripSuggestionTypes';

export const tripSuggestionService = {

  /**
   * Ajoute une nouvelle suggestion (planification) de trajet pour l'utilisateur connecté.
   * Method: POST
   * Endpoint: /v1/trip-suggestions
   */
  createTripSuggestion: async (payload: CreateTripSuggestionPayload): Promise<void> => {
    const response = await api.post('/v1/trip-suggestions', payload);
    return response.data;
  },

  /**
   * Modifie une suggestion de trajet existante.
   * Method: PUT
   * Endpoint: /v1/trip-suggestions
   */
  updateTripSuggestion: async (payload: UpdateTripSuggestionPayload): Promise<void> => {
    const response = await api.put('/v1/trip-suggestions', payload);
    return response.data;
  },

  /**
   * Supprime une suggestion de trajet existante.
   * L'utilisateur ne peut supprimer que ses propres suggestions.
   * Method: DELETE
   * Endpoint: /v1/trip-suggestions/{tripSuggestionId}
   */
  deleteTripSuggestion: async (tripSuggestionId: number): Promise<void> => {
    const response = await api.delete(`/v1/trip-suggestions/${tripSuggestionId}`);
    return response.data;
  },

  /**
   * Récupère les détails d'une suggestion spécifique de l'utilisateur.
   * Method: GET
   * Endpoint: /v1/trip-suggestions/details/{tripSuggestionId}
   */
  getTripSuggestionDetails: async (tripSuggestionId: number): Promise<TripSuggestionDto> => {
    const response = await api.get<TripSuggestionDto>(`/v1/trip-suggestions/details/${tripSuggestionId}`);
    return response.data;
  },

  /**
   * Récupère une liste paginée des suggestions de l'utilisateur connecté.
   * Method: GET
   * Endpoint: /v1/trip-suggestions/list/{page}
   */
  getUserTripSuggestions: async (page: number = 1): Promise<PaginatedResponse<TripSuggestionDto>> => {
    const response = await api.get<PaginatedResponse<TripSuggestionDto>>(`/v1/trip-suggestions/list/${page}`);
    return response.data;
  }

};
