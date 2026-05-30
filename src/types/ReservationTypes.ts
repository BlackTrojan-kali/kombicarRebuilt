// src/types/ReservationTypes.ts
import type { Area } from './TripTypes';

// ... (Gardez tous vos types précédents)

/**
 * Payload pour la création d'une réservation classique (V1).
 */
export interface AddReservationPayload {
  tripId: number;
  numberReservedPlaces: number;
  operator: number;
  phoneNumber: string;
  promoCode: string;
}

/**
 * Réponse renvoyée après une réservation réussie (V1).
 */
export interface AddReservationResponse {
  id: number;
}

/**
 * Payload pour la création d'une réservation via Cinetpay (V2).
 */
export interface AddReservationV2Payload {
  tripId: number;
  numberReservedPlaces: number;
  returnUrl: string;
  promoCode: string;
}

/**
 * Réponse renvoyée après une réservation réussie via Cinetpay (V2).
 */
export interface AddReservationV2Response {
  id: number;
  paymentProcessor: number;
  cinetpayRedirectUrl: string;
}

/**
 * Structure de la réponse du calcul de prix simulé.
 */
export interface GetPriceResponse {
  price: number;
  currency: number;
}

// ========================================================
// --- TYPES POUR LE LISTING ET L'UI ---
// ========================================================

/**
 * Structure abrégée du trajet liée à une réservation utilisateur.
 */
export interface ReservationTripDetails {
  id: number;
  userId: string;
  vehiculeId: number;
  departureDate: string;
  status: number;
  placesLeft: number;
  pricePerPlace: number;
  authorizedLuggages: boolean;
  luggageSize: number;
  luggageNumberPerPassenger: number;
  country: number;
  publishingDate: string;
}

/**
 * Données pures de la réservation d'un passager.
 */
export interface PassengerReservationData {
  id: number;
  userId: string;
  tripId: number;
  numberReservedPlaces: number;
  status: number;
  reservationDate: string;
  confirmationOrRefusingDate: string;
}

/**
 * Élément composite complet retourné par la liste des réservations (Vue Client).
 */
export interface UserReservationListItem {
  trip: ReservationTripDetails;
  departureArea: Area;
  arrivalArea: Area;
  stopOvers: Area[];
  reservation: PassengerReservationData;
}

// ========================================================
// --- NOUVEAUX TYPES : CHAUFFEUR & FACTURATION ---
// ========================================================

/**
 * Informations de contact du client renvoyées au chauffeur.
 */
export interface ReservationClientInfo {
  id: string;
  firstName: string;
  lastName: string;
  country: number;
  email: string;
  phoneNumber: string;
  pictureProfileUrl: string;
}

/**
 * Élément composite retourné par la liste des réservations d'un trajet (Vue Chauffeur).
 */
export interface DriverReservationListItem {
  client: ReservationClientInfo;
  reservation: PassengerReservationData;
}

/**
 * Réponse contenant l'URL générée (ex: pour la facture PDF).
 */
export interface UrlResponse {
  url: string;
}