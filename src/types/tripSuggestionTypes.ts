// src/types/tripSuggestionTypes.ts

/**
 * Payload pour la création d'une nouvelle suggestion (planification) de trajet.
 */
export interface CreateTripSuggestionPayload {
  departureArea: string;
  arrivalArea: string;
  departureDateTime: string; // Format ISO 8601 (ex: "2026-05-30T20:06:02.194Z")
}

/**
 * Payload pour la mise à jour d'une suggestion existante.
 */
export interface UpdateTripSuggestionPayload {
  id: number;
  departureArea: string;
  arrivalArea: string;
  departureDateTime: string;
}

/**
 * Structure complète d'une suggestion de trajet renvoyée par le backend.
 */
export interface TripSuggestionDto {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  userEmail: string;
  userPhoneNumber: string;
  departureArea: string;
  arrivalArea: string;
  departureDateTime: string;
  createdAt: string;
}