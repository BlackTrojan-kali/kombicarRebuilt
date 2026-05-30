// src/services/reviewService.ts
import api from '../config/api';
import type { PaginatedResponse } from '../types/TripTypes';
import type { 
  ReviewDto, 
  CreateReviewPayload, 
  UpdateReviewPayload 
} from '../types/ReviewTypes';

export const reviewService = {

  // ==========================================================
  // --- CONSULTATION (LECTURE) ---
  // ==========================================================

  /**
   * Récupère une liste paginée d'avis pour un trajet spécifique.
   * Method: GET
   * Endpoint: /v1/reviews/{tripId}/{page}
   */
  getTripReviews: async (tripId: number, page: number = 1): Promise<PaginatedResponse<ReviewDto>> => {
    const response = await api.get<PaginatedResponse<ReviewDto>>(`/v1/reviews/${tripId}/${page}`);
    return response.data;
  },

  /**
   * Récupère une liste paginée d'avis pour un conducteur spécifique.
   * Method: GET
   * Endpoint: /v1/reviews/{driverId}/{page}
   */
  getDriverReviews: async (driverId: string, page: number = 1): Promise<PaginatedResponse<ReviewDto>> => {
    const response = await api.get<PaginatedResponse<ReviewDto>>(`/v1/reviews/${driverId}/${page}`);
    return response.data;
  },

  /**
   * Récupère les détails d'un avis spécifique.
   * Method: GET
   * Endpoint: /v1/reviews/{reviewId}
   */
  getReviewDetails: async (reviewId: number): Promise<ReviewDto> => {
    const response = await api.get<ReviewDto>(`/v1/reviews/${reviewId}`);
    return response.data;
  },

  // ==========================================================
  // --- ACTIONS (ÉCRITURE / MODIFICATION) ---
  // ==========================================================

  /**
   * Crée et soumet un nouvel avis pour un trajet.
   * L'utilisateur doit avoir une réservation pour ce trajet et le trajet doit être passé.
   * Method: POST
   * Endpoint: /v1/reviews
   */
  createReview: async (payload: CreateReviewPayload): Promise<void> => {
    const response = await api.post('/v1/reviews', payload);
    return response.data;
  },

  /**
   * Met à jour un avis existant par son identifiant.
   * Method: PUT
   * Endpoint: /v1/reviews/{reviewId}
   */
  updateReview: async (reviewId: number, payload: UpdateReviewPayload): Promise<void> => {
    const response = await api.put(`/v1/reviews/${reviewId}`, payload);
    return response.data;
  },

  /**
   * Supprime un avis existant par son identifiant.
   * Method: DELETE
   * Endpoint: /v1/reviews/{reviewId}
   */
  deleteReview: async (reviewId: number): Promise<void> => {
    const response = await api.delete(`/v1/reviews/${reviewId}`);
    return response.data;
  }

};