// src/services/notificationService.ts
import api from '../config/api';
import type { PaginatedResponse } from '../types/TripTypes'; // On réutilise l'interface paginée existante
import type { 
  NotificationItem, 
  NotificationActionPayload 
} from '../types/NotificationTypes';

export const notificationService = {

  /**
   * Récupère la liste paginée des notifications de l'utilisateur connecté.
   * Method: GET
   * Endpoint: /v1/notifications/{page}
   */
  getUserNotifications: async (page: number = 1): Promise<PaginatedResponse<NotificationItem>> => {
    const response = await api.get<PaginatedResponse<NotificationItem>>(`/v1/notifications/${page}`);
    return response.data;
  },

  /**
   * Obtient les détails d'une notification spécifique.
   * Method: GET
   * Endpoint: /v1/notifications/details/{notificationId}
   */
  getNotificationDetails: async (notificationId: number): Promise<NotificationItem> => {
    const response = await api.get<NotificationItem>(`/v1/notifications/details/${notificationId}`);
    return response.data;
  },

  /**
   * Marque une ou plusieurs notifications comme lues.
   * Method: POST
   * Endpoint: /v1/notifications/mark-as-read
   */
  markAsRead: async (notificationIds: number[]): Promise<void> => {
    const payload: NotificationActionPayload = { notificationIds };
    await api.post('/v1/notifications/mark-as-read', payload);
  },

  /**
   * Supprime une ou plusieurs notifications pour l'utilisateur.
   * Method: DELETE
   * Endpoint: /v1/notifications
   */
  deleteNotifications: async (notificationIds: number[]): Promise<void> => {
    const payload: NotificationActionPayload = { notificationIds };
    // Axios nécessite de passer le body d'un DELETE dans la propriété `data` des configurations
    await api.delete('/v1/notifications', { data: payload });
  }
};