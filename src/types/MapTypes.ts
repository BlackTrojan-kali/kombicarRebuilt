// src/types/MapTypes.ts

/**
 * Payload pour la recherche de suggestions de lieux (POST).
 */
export interface SearchPlacesPayload {
  query: string;
  country: number;
  latitude: number;
  longitude: number;
}

/**
 * Modèle de suggestion de lieu retourné par l'API (Autocomplete).
 */
export interface PlaceSuggestion {
  description: string;
  placeId: string;
}

/**
 * Modèle des détails d'un lieu (lat/lng) retournés par l'API (GET).
 */
export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

/**
 * Payload pour obtenir le pays à partir de coordonnées GPS (POST).
 */
export interface GetCountryPayload {
  latitude: number;
  longitude: number;
}