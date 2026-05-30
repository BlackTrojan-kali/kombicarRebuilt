// src/types/NotificationTypes.ts

/**
 * Structure d'une notification individuelle.
 */
export interface NotificationItem {
  id: number;
  content: string;
  title: string;
  isGlobal: boolean;
  userId: string;
  isRead: boolean;
  pusblishAt: string; // Typo de ton backend ("pusblishAt" au lieu de "publishAt"), on respecte l'API
  country: number;
}

/**
 * Payload pour marquer comme lues ou supprimer des notifications en lot.
 */
export interface NotificationActionPayload {
  notificationIds: number[];
}