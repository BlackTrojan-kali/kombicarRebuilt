// src/services/messageService.ts
import api from '../config/api';
import type { MessageItem, SendMessagePayload } from '../types/MessageTypes';

export const messageService = {

  /**
   * Récupère l'historique paginé des messages d'un fil de discussion lié à une réservation.
   * Method: GET
   * Endpoint supposé: /v1/messages/{reservationId}/{page}
   * @param reservationId L'ID de la réservation servant de fil de discussion.
   * @param page Le numéro de la page.
   */
  getMessages: async (reservationId: number, page: number = 1): Promise<MessageItem[]> => {
    // Si l'endpoint renvoie un objet paginé { items: [], totalCount: ... }, ajuste le type de retour vers PaginatedResponse<MessageItem>
    const response = await api.get<MessageItem[]>(`/v1/messages/${reservationId}/${page}`);
    return response.data;
  },

  /**
   * Envoie un nouveau message dans un fil de discussion.
   * Method: POST
   * Endpoint: /v1/messages/{reservationId}
   */
  sendMessage: async (reservationId: number, content: string): Promise<MessageItem> => {
    const payload: SendMessagePayload = { content };
    const response = await api.post<MessageItem>(`/v1/messages/${reservationId}`, payload);
    return response.data;
  },

  /**
   * Marque un message spécifique comme lu.
   * Method: PUT
   * Endpoint: /v1/messages/mark-as-seen/{messageId}
   */
  markAsSeen: async (messageId: number): Promise<void> => {
    await api.put(`/v1/messages/mark-as-seen/${messageId}`);
  },

  /**
   * Marque tous les messages non lus d'un fil de discussion comme lus.
   * Method: PUT
   * Endpoint: /v1/messages/mark-all-as-seen/{reservationId}
   */
  markAllAsSeen: async (reservationId: number): Promise<void> => {
    await api.put(`/v1/messages/mark-all-as-seen/${reservationId}`);
  }

};