import { createContext, useState } from "react";
import api from "../api/api";
import { API_URL } from "../api/api-settings";

export const NotificationContext = createContext({})

export function NotificationContextProvider ({children}){
    // État pour stocker les notifications (contient les notifications récentes ou celles de la vue actuelle)
    const [notification, setNotification] = useState([]);
    
    // 💡 REMOVED: unreadCount state was removed as per request.
    // 💡 REMOVED: getUnreadCount function was removed as per request.

    
    // API Call Functions
    
    // GET /api/v1/notifications/{page} : Liste des notifications de l'utilisateur
    const getNotification = async(page = 1) => {
        try {
            const res = await api.get(`${API_URL}/api/v1/notifications/${page}`);
            
            // Si c'est la première page, nous pouvons mettre à jour le state 'notification'
            if (page === 1 && res.data && res.data.data) {
                setNotification(res.data.data);
            }
            return res;
        } catch (err) {
            console.error("Erreur de récupération des notifications utilisateur: ", err);
            throw err;
        }
    };

    // GET /api/v1/notifications/all/{page} : Liste de TOUTES les notifications de la plateforme (Admin)
    const getAllPlatformNotifications = async(page = 1) => {
        try {
            const res = await api.get(`${API_URL}/api/v1/notifications/admin/all/${page}`);
            return res;
        } catch (err) {
            console.error("Erreur de récupération de toutes les notifications de la plateforme: ", err);
            throw err;
        }
    };

    // GET /api/v1/notifications/{notificationId} : Détails d'une notification (Utilisateur)
    const getNotificationById = async(id) => { 	
        try {
            const res = await api.get(`${API_URL}/api/v1/notifications/${id}`);
            return res;
        } catch (err) {
            console.error("Erreur lors de la récupération des détails de la notification: ", err);
            throw err;
        }
    };
    
    // GET /api/v1/notifications/details/{notificationId} : Détails d'une notification (Admin)
    const getAdminNotificationDetails = async(id) => { 	
        try {
            const res = await api.get(`${API_URL}/api/v1/notifications/admin/details/${id}`);
            return res;
        } catch (err) {
            console.error("Erreur lors de la récupération des détails (Admin) de la notification: ", err);
            throw err;
        }      };

    // PUT /api/v1/notifications/{notificationId} : Modifier le contenu d'une notification
    const updateNotification = async(id, data) => { 
        try {
            const res = await api.put(`${API_URL}/api/v1/notifications/${id}`, data);
            return res;
        } catch (err) {
            console.error("Erreur lors de la mise à jour de la notification: ", err);
            throw err;
        }
    }

    // POST /api/v1/notifications/mark-as-read : Marquer les notifications comme lues
    const markNotificationsAsRead = async(notificationIds) => { 
        try {
            const data = { notificationIds }; 
            const res = await api.post(`${API_URL}/api/v1/notifications/mark-as-read`, data);
            
            // Met à jour le state local (Marque les notifications comme lues dans le state 'notification')
            setNotification(prev => 
                prev.map(n => 
                    notificationIds.includes(n.id) ? { ...n, is_read: true } : n
                )
            );
            
            // 💡 REMOVED: No more setUnreadCount call here.
            
            return res;
        } catch (err) {
            console.error("Erreur lors du marquage des notifications comme lues: ", err);
            throw err;
        }
    }
    
    // DELETE /api/v1/notifications : Supprimer une ou plusieurs notifications (Utilisateur)
    const deleteNotifications = async(notificationIds) => { 
        try {
            const res = await api.delete(`${API_URL}/api/v1/notifications`, {
                data: { notificationIds } 
            });
            
            // Filtrer les IDs supprimés du state local
            setNotification(prev => 
                prev.filter(n => !notificationIds.includes(n.id))
            );
            
            // 💡 REMOVED: No more setUnreadCount call here.
            
            return res;
        } catch (err) {
            console.error("Erreur lors de la suppression des notifications utilisateur: ", err);
            throw err;
        }
    }
    
    // DELETE /api/v1/notifications/all : Supprime une ou plusieurs notifications (Plateforme/Admin)
    const deletePlatformNotifications = async(notificationIds) => { 
        try {
            const res = await api.delete(`${API_URL}/api/v1/notifications/admin/all`, {
                data: { notificationIds } 
            });
            
            // Mise à jour du state 'notification' si ces éléments y étaient présents
            setNotification(prev => 
                prev.filter(n => !notificationIds.includes(n.id))
            );
            
            // 💡 REMOVED: No more setUnreadCount call here.
            
            return res;
        } catch (err) {
            console.error("Erreur lors de la suppression des notifications de la plateforme: ", err);
            throw err;
        }
    }
    
    // POST /api/v1/notifications/admin/publish : Crée et publie une notification à un seul utilisateur
    const publishNotification = async({ title, message, userId }) => { 
        try {
            const data = { title, message, userId };
            const res = await api.post(`${API_URL}/api/v1/notifications/admin/publish`, data);
            
            // 💡 REMOVED: No more getUnreadCount call here.
            
            return res;
        } catch (err) {
            console.error("Erreur lors de la publication de la notification: ", err);
            throw err;
        }
    }

    // POST /api/v1/notifications/admin/publish-selected-user : Crée et publie une notification à plusieurs utilisateurs (Admin)
    const publishToSelectedUsers = async({ title, message, userIds }) => { 
        try {
            const data = { title, message, userIds };
            const res = await api.post(`${API_URL}/api/v1/notifications/admin/publish-selected-user`, data);
            
            // Pas de mise à jour du state local 'notification' car il s'agit d'une action Admin
            
            return res;
        } catch (err) {
            console.error("Erreur lors de la publication de la notification à des utilisateurs sélectionnés: ", err);
            throw err;
        }
    }

    // Exportation des valeurs
    const ExportValues = {
        notification, 
        setNotification, 
         
        // 💡 REMOVED: unreadCount and getUnreadCount are no longer exported.
        
        getNotification, 
        getAllPlatformNotifications, 
        getNotificationById,
        getAdminNotificationDetails, 
        updateNotification,
        markNotificationsAsRead,
        deleteNotifications,
        deletePlatformNotifications, 
        publishNotification,
        // NOUVELLE FONCTION EXPORTÉE
        publishToSelectedUsers 
    }
    
    return(
        <NotificationContext.Provider value={ExportValues}>
            {children}
        </NotificationContext.Provider>
    )
}