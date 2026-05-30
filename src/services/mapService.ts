// src/services/mapService.ts
import api from '../config/api';
import type { 
  SearchPlacesPayload, 
  PlaceSuggestion, 
  PlaceDetails, 
  GetCountryPayload 
} from '../types/MapTypes';

export const mapService = {
  
  /**
   * Recherche des suggestions de lieux sur Google Maps en fonction d'une requête.
   * Method: POST
   * Endpoint: /v1/maps/search-places
   */
  searchPlaces: async (payload: SearchPlacesPayload): Promise<PlaceSuggestion[]> => {
    const response = await api.post<PlaceSuggestion[]>('/v1/maps/search-places', payload);
    return response.data;
  },

  /**
   * Récupère les coordonnées (lat/lng) et détails d'un lieu à partir de son PlaceId.
   * Method: GET
   * Endpoint: /v1/maps/place-details
   */
  getPlaceDetails: async (placeId: string): Promise<PlaceDetails> => {
    // Le paramètre placeId est envoyé dans la Query String
    const response = await api.get<PlaceDetails>('/v1/maps/place-details', {
      params: { placeId }
    });
    return response.data;
  },

  /**
   * Détermine le pays d'un utilisateur à partir de ses coordonnées GPS.
   * Method: POST
   * Endpoint: /v1/maps/get-country
   * @returns Un nombre correspondant à l'énumération Country du backend (ex: 0, 1, 2...)
   */
  getCountryFromGps: async (payload: GetCountryPayload): Promise<number> => {
    const response = await api.post<number>('/v1/maps/get-country', payload);
    return response.data;
  }
};