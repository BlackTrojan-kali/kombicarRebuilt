// src/types/LicenceTypes.ts

/**
 * Enumération pour représenter l'état de vérification du permis.
 * (Les valeurs numériques sont généralement 0 = En attente, 1 = Vérifié, 2 = Rejeté).
 */
export enum VerificationState {
  PENDING = 0,
  VERIFIED = 1,
  REJECTED = 2,
}

/**
 * Enumération pour la catégorie de permis (A, B, C, D, E).
 * À adapter selon les correspondances numériques exactes de ton backend.
 */
export enum LicenceCategory {
  A = 0,
  B = 1,
  C = 2,
  D = 3,
  E = 4,
}

/**
 * Payload pour la mise à jour ou la création des informations du permis (PUT).
 */
export interface UpdateLicencePayload {
  licenseNumber: string;
  dateOfBirth: string; // Format attendu : ISO 8601 (ex: "2026-05-30T10:16:06.849Z")
  issueDate: string;   // Format attendu : ISO 8601
  expirationDate: string; // Format attendu : ISO 8601
  category: number | LicenceCategory;
}

/**
 * Modèle de retour des détails du permis (GET).
 */
export interface LicenceDetails {
  id: number;
  userId: string;
  url: string;
  createdAt: string;
  licenseNumber: string;
  dateOfBirth: string;
  issueDate: string;
  expirationDate: string;
  category: number | LicenceCategory;
  verificationState: number | VerificationState;
}