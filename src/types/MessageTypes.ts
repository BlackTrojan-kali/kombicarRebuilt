// src/types/MessageTypes.ts

/**
 * Structure d'un message tel que renvoyé par l'API.
 */
export interface MessageItem {
  id?: number; // L'ID du message (souvent requis pour mark-as-seen)
  reservationId: number;
  userId?: string; // L'ID de l'auteur du message
  content: string;
  sendedAt: string; // Date d'envoi
  seen: boolean;
  country: number;
}

/**
 * Payload pour l'envoi d'un nouveau message.
 */
export interface SendMessagePayload {
  content: string;
}