import { createContext, useState } from "react";
import api from "../api/api";
import { API_URL } from "../api/api-settings";

export const NotificationContext = createContext({})

export function NotificationContextProvider ({children}){
    // État pour stocker les notifications (utilisé principalement pour les mises à jour locales après action)
    const [notification, setNotification] = useState([]);
    
    // 💡 NOUVEL ÉTAT : Pour stocker le nombre de notifications non lues
    const [unreadCount, setUnreadCount] = useState(0); 

    // 💡 NOUVELLE FONCTION API : Récupérer le décompte des notifications non lues (souvent un endpoint dédié)
    // Nous allons supposer qu'il existe un endpoint dédié pour le décompte non lu.
    // GET /api/v1/notifications/unread-count
    const getUnreadCount = async() => {
        try {
            // Remplacez 'mock-unread-count' par votre endpoint réel si différent
            const res = await api.get(`${API_URL}/api/v1/notifications/unread-count`);
            
            if (res.data && typeof res.data.count === 'number') {
                setUnreadCount(res.data.count);
            } else {
                // Simuler une valeur par défaut si la réponse est inattendue
                // setUnreadCount(res.data.count || 0);
            }
            return res;
        } catch (err) {
            console.error("Erreur de récupération du nombre de notifications non lues: ", err);
            // Retourner une erreur ou un décompte de 0 en cas d'échec
            // setUnreadCount(0);
            throw err;
        }
    };
    
    // API Call Functions
    
    // GET /api/v1/notifications/{page} : Liste des notifications de l'utilisateur
    const getNotification = async(page = 1) => {
        try {
            const res = await api.get(`${API_URL}/api/v1/notifications/${page}`);
            
            // Note: Pour une API paginée, nous ne mettons pas à jour 'notification' ici
            // car 'notification' est censé être l'état global du décompte/des plus récentes.
            return res;
        } catch (err) {
            console.error("Erreur de récupération des notifications utilisateur: ", err);
            throw err;
        }
    };

    // ... (autres fonctions d'API inchangées : getAllPlatformNotifications, getNotificationById, getAdminNotificationDetails, updateNotification)

    // GET /api/v1/notifications/all/{page} : Liste de TOUTES les notifications de la plateforme (Admin)
    const getAllPlatformNotifications = async(page = 1) => {
        try {
            const res = await api.get(`${API_URL}/api/v1/notifications/all/${page}`);
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
            const res = await api.get(`${API_URL}/api/v1/notifications/details/${id}`);
            return res;
        } catch (err) {
            console.error("Erreur lors de la récupération des détails (Admin) de la notification: ", err);
            throw err;
        }
    };

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
            
            // Met à jour le state local (au cas où il contiendrait les notifs non lues récentes)
            setNotification(prev => 
                prev.map(n => 
                    notificationIds.includes(n.id) ? { ...n, is_read: true } : n
                )
            );
            
            // 💡 MISE À JOUR DU COMPTEUR: Réduire le décompte localement.
            // S'assurer de ne pas passer en dessous de zéro
            setUnreadCount(prevCount => Math.max(0, prevCount - notificationIds.length));
            
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
            const deletedUnreadCount = notification.filter(n => !n.is_read && notificationIds.includes(n.id)).length;
            
            setNotification(prev => 
                prev.filter(n => !notificationIds.includes(n.id))
            );
            
            // 💡 MISE À JOUR DU COMPTEUR: Réduire le décompte si des non-lues ont été supprimées
            setUnreadCount(prevCount => Math.max(0, prevCount - deletedUnreadCount));
            
            return res;
        } catch (err) {
            console.error("Erreur lors de la suppression des notifications utilisateur: ", err);
            throw err;
        }
    }
    
    // DELETE /api/v1/notifications/all : Supprime une ou plusieurs notifications (Plateforme/Admin)
    const deletePlatformNotifications = async(notificationIds) => { 
        try {
            const res = await api.delete(`${API_URL}/api/v1/notifications/all`, {
                data: { notificationIds } 
            });
            
            // La même logique de décompte s'applique si le state 'notification' contenait ces items
            const deletedUnreadCount = notification.filter(n => !n.is_read && notificationIds.includes(n.id)).length;

            setNotification(prev => 
                prev.filter(n => !notificationIds.includes(n.id))
            );
            
            // 💡 MISE À JOUR DU COMPTEUR
            setUnreadCount(prevCount => Math.max(0, prevCount - deletedUnreadCount));
            
            return res;
        } catch (err) {
            console.error("Erreur lors de la suppression des notifications de la plateforme: ", err);
            throw err;
        }
    }
    
    // POST /api/v1/notifications/publish : Crée et publie une notification
    const publishNotification = async({ title, message, userId }) => { 
        try {
            const data = { title, message, userId };
            const res = await api.post(`${API_URL}/api/v1/notifications/publish`, data);
            
            // 💡 AUGMENTER LE COMPTEUR (si la notification est pour l'utilisateur actuel)
            // Dans une vraie application, cela serait géré par un WebSocket ou un autre mécanisme de re-vérification
            // getUnreadCount(); // Recharger le décompte après publication
            
            return res;
        } catch (err) {
            console.error("Erreur lors de la publication de la notification: ", err);
            throw err;
        }
    }

    // Exportation des valeurs
    const ExportValues = {
        notification, 
        setNotification, 
        // 💡 NOUVEAU: Exposer le décompte et la fonction de chargement
        unreadCount, 
        getUnreadCount,
        
        getNotification, 
        getAllPlatformNotifications, 
        getNotificationById,
        getAdminNotificationDetails, 
        updateNotification,
        markNotificationsAsRead,
        deleteNotifications,
        deletePlatformNotifications, 
        publishNotification 
    }
    
    return(
        <NotificationContext.Provider value={ExportValues}>
            {children}
        </NotificationContext.Provider>
    )
}