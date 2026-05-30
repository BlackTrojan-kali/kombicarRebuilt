// src/types/TripTypes.ts

/**
 * Énumération des statuts d'un trajet.
 * 0 = OnValidating, etc.
 */
export enum TripStatus {
  PUBLISHED = 0,
  CANCELLED = 1,
  FINISHED = 2,
  ON_VALIDATING = 3,
  PREVU = 4,
}

/**
 * Énumération des statuts d'une réservation.
 */
export enum ReservationStatus {
  PENDING = 0,
  CONFIRMED = 1,
  REJECTED = 2,
  CANCELLED = 3,
  COMPLETED = 4,
}

/**
 * Type de vue utilisateur pour filtrer l'historique des réservations.
 */
export enum UserView {
  CLIENT = 0,
  DRIVER = 1,
}

/**
 * Représente une zone géographique (Départ, Arrivée ou Escale).
 */
export interface Area {
  id?: number; 
  homeTownName: string;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
  type: number;
}

/**
 * Données requises pour publier un nouveau trajet (POST).
 */
export interface CreateTripPayload {
  startArea: Area;
  arivalArea: Area;
  departureDate: string; // Format ISO 8601
  vehicleId: number;
  placesLeft: number;
  pricePerPlace: number;
  isLuggageAllowed: boolean;
  luggageSize: number;
  luggageNumberPerPassenger: number;
  aditionalInfo: string;
  stopovers: Area[];
}

/**
 * Données requises pour modifier un trajet existant (PUT).
 */
export interface UpdateTripPayload {
  tripId: number;
  startArea: Area;
  arivalArea: Area;
  departureDate: string;
  vehicleId: number;
  placesLeft: number;
  pricePerPlace: number;
  isLuggageAllowed: boolean;
  luggageSize: number;
  luggageNumberPerPassenger: number;
  aditionalInfo: string;
  stopovers: Area[];
}

// ========================================================
// --- NOUVEAUX TYPES AJOUTÉS POUR LA RECHERCHE DE TRAJETS ---
// ========================================================

/**
 * DTO pour gérer la plage horaire lors d'une recherche.
 */
export interface TripDepartureHourFilter {
  acceptAllHour: boolean;
  startHour: number;
  endHour: number;
}

/**
 * Payload pour la recherche publique de trajets (Filtres).
 */
export interface PublicTripSearchFilter {
  page: number;
  tripStatus: TripStatus | number; // 1 (Active) la plupart du temps
  maxPrice?: number; // Optionnel
  tripDepartureHour?: TripDepartureHourFilter;
  airConditionned?: boolean;
  luggageAllowed?: boolean;
  vehiculeType?: number;
  notationOfCondutor?: number;
  startAreaCity?: string;
  endAreaCity?: string;
  departureDate?: string; // Format: "YYYY-MM-DD"
  country?: number;
}

// ========================================================
// --- TYPES DE RETOURS (RÉPONSES API) ---
// ========================================================

/**
 * Informations pures du trajet retournées par l'API.
 */
export interface TripDetails {
  id: number;
  userId: string;
  vehiculeId: number;
  departureDate: string;
  status: TripStatus | number;
  placesLeft: number;
  pricePerPlace: number;
  authorizedLuggages: boolean;
  luggageSize: number;
  luggageNumberPerPassenger: number;
  country: number;
  publishingDate: string;
}

/**
 * Informations simplifiées du véhicule lié au trajet.
 */
export interface TripVehicle {
  id: number;
  userId: string;
  brand: string;
  model: string;
  numberPlaces: number;
  color: string;
  isVerified: boolean;
  airConditionned: boolean;
  registrationCode: string;
  type: number;
  country: number;
}

/**
 * Informations simplifiées sur le conducteur du trajet.
 */
export interface TripDriver {
  userId: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  rating: number;
}

/**
 * Structure d'une réservation liée à un trajet.
 */
export interface TripReservation {
  id: number;
  userId: string;
  tripId: number;
  numberReservedPlaces: number;
  status: ReservationStatus | number;
  reservationDate: string;
  confirmationOrRefusingDate: string;
}

/**
 * Élément complet d'une liste de trajets (Objet composite renvoyé par l'API).
 */
export interface TripListItem {
  trip: TripDetails;
  vehicule: TripVehicle;
  departureArea: Area;
  arrivalArea: Area;
  stopOvers: Area[];
  driver: TripDriver;
  reservations?: TripReservation[];
}

/**
 * Structure de réponse paginée globale de l'API.
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}