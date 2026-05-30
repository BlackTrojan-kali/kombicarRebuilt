// src/types/VehiculesTypes.ts

/**
 * Type générique pour la catégorie VTC du véhicule
 */
export interface VtcVehicleType {
  id: number;
  name: string;
  iconUrl: string;
  baseFare: number;
  pricePerKm: number;
  pricePerMinute: number;
  minFare: number;
  capacity: number;
  isActive: boolean;
  cancellationFee: number;
  freeCancellationMinutes: number;
  isShared: boolean;
  canAcceptAuctions: boolean;
  isSharingMandatory: boolean;
  commissionPercent: number;
  commissionPeakPercent: number;
  commissionSharingPercent: number;
  commissionSharingNewAdditionPercent: number;
}

/**
 * Modèle de données complet d'un véhicule (Renvoi du GET)
 */
export interface Vehicule {
  id: number;
  userId: string;
  brand: string;
  model: string;
  numberPlaces: number;
  color: string;
  isVerified: boolean;
  airConditionned: boolean;
  registrationCode: string;
  vehiculeType: number;
  features: string;
  featureList: string[];
  country: number;
  vtcVehicleTypeId: number;
  vtcVehicleType: VtcVehicleType | null;
}

/**
 * Payload pour l'ajout d'un véhicule (POST)
 */
export interface AddVehiculePayload {
  userId: string; // Le JWT le gère souvent côté serveur, mais ton Swagger le demande ici
  brand: string;
  model: string;
  numberPlaces: number;
  color: string;
  airConditionned: boolean;
  registrationCode: string;
  vehiculeType: number;
}

/**
 * Payload pour la mise à jour d'un véhicule (PUT)
 */
export interface UpdateVehiculePayload {
  id: number;
  brand: string;
  model: string;
  numberPlaces: number;
  color: string;
  airConditionned: boolean;
  registrationCode: string;
  vehiculeType: number;
}

/**
 * Enumération pour les types de documents de véhicule
 * Basée sur: 0=REGISTRATION_CARD, 1=INSURANCE, 2=IDENTITY_DOCUMENT, 3=PHOTO, 4=REGISTRATION_PHOTO, 5=Autre
 */
export enum VehiculeDocumentType {
  REGISTRATION_CARD = 0,
  INSURANCE = 1,
  IDENTITY_DOCUMENT = 2,
  PHOTO = 3,
  REGISTRATION_PHOTO = 4,
  OTHER = 5
}

/**
 * Modèle de données d'un document de véhicule (Renvoi du GET documents)
 */
export interface VehiculeDocument {
  id: number;
  name: string;
  userId: string;
  vehiculeId: number;
  type: VehiculeDocumentType;
  url: string;
  createdAt: string;
  country: number;
}