// src/types/SOSTypes.ts

/**
 * Payload envoyé lors du déclenchement d'une alerte SOS.
 */
export interface TriggerSOSPayload {
  rideId: string; // L'identifiant de la course, du trajet ou de la réservation
  latitude: number;
  longitude: number;
}