// src/types/ReviewTypes.ts

/**
 * Structure d'un avis tel que renvoyé par l'API (Lecture).
 */
export interface ReviewDto {
  id: number;
  userId: string;
  userName: string;
  conductorUserId: string;
  tripId: number;
  note: number; // Correspond à la note (ex: de 1 à 5)
  comment: string;
  createdAt: string;
  rideId: string;
}

/**
 * Payload pour la création d'un nouvel avis (Écriture).
 */
export interface CreateReviewPayload {
  rating: number; // Attention: l'API attend 'rating' ici
  comment: string;
  tripId: number;
}

/**
 * Payload pour la modification d'un avis existant.
 * Le backend accepte qu'un seul des deux champs soit fourni (Rating OU Comment).
 */
export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}