import { createContext, useState } from "react";
import api from "../api/api";
import { API_URL } from "../api/api-settings";

export const AdminNotificationContext = createContext({})

export function AdminNotificationContextProvider ({children}){
    // État minimal pour stocker les notifications
    const [notification, setNotification] = useState([]);
    
    // 1. POST /api/v1/notifications/admin/publish
    const publishNotification = async({ title, message, userId }) => { 
        try {
            const data = { title, message, userId };
            const res = await api.post(`${API_URL}/api/v1/notifications/admin/publish`, data);
            return res;
        } catch (err) {
            console.error("Erreur lors de la publication de la notification: ", err);
            throw err;
        }
    }

    // 2. POST /api/v1/notifications/admin/publish-selected-user
    const publishNotificationToSelectedUsers = async({ title, message, userIds }) => { 
        try {
            const data = { title, message, userIds };
            const res = await api.post(`${API_URL}/api/v1/notifications/admin/publish-selected-user`, data);
            return res;
        } catch (err) {
            console.error("Erreur lors de la publication de la notification aux utilisateurs sélectionnés: ", err);
            throw err;
        }
    }
    
    // 3. GET /api/v1/notifications/admin/all/{page}
    const getAllPlatformNotifications = async(page = 1) => {
        try {
            const res = await api.get(`${API_URL}/api/v1/notifications/admin/all/${page}`);
            return res;
        } catch (err) {
            console.error("Erreur de récupération de toutes les notifications de la plateforme: ", err);
            throw err;
        }
    };
    
    // 4. GET /api/v1/notifications/admin/details/{notificationId}
    const getAdminNotificationDetails = async(id) => {    
        try {
            const res = await api.get(`${API_URL}/api/v1/notifications/admin/details/${id}`);
            return res;
        } catch (err) {
            console.error("Erreur lors de la récupération des détails (Admin) de la notification: ", err);
            throw err;
        }
    };

    // 5. PUT /api/v1/notifications/admin/{notificationId}
    const updateAdminNotification = async(id, data) => { 
        try {
            const res = await api.put(`${API_URL}/api/v1/notifications/admin/${id}`, data);
            return res;
        } catch (err) {
            console.error(`Erreur lors de la mise à jour de la notification ${id}: `, err);
            throw err;
        }
    }
    
    // 6. NOUVELLE FONCTION AJOUTÉE : DELETE /api/v1/notifications/admin/all
    const deletePlatformNotifications = async(notificationIds) => { 
        try {
            const res = await api.delete(`${API_URL}/api/v1/notifications/admin/all`, {
                data: { notificationIds } // Axios exige que le body d'un DELETE soit dans 'data'
            });
            
            // Mise à jour du state 'notification' si ces éléments y étaient présents
            setNotification(prev => 
                prev.filter(n => !notificationIds.includes(n.id))
            );
            
            return res;
        } catch (err) {
            console.error("Erreur lors de la suppression des notifications de la plateforme: ", err);
            throw err;
        }
    }


    // Exportation des valeurs
    const ExportValues = {
        notification, 
        setNotification, 
        publishNotification,
        publishNotificationToSelectedUsers,
        getAllPlatformNotifications,
        getAdminNotificationDetails,
        updateAdminNotification,
        deletePlatformNotifications // <-- Ajout de la nouvelle fonction
    }
    
    return(
        <AdminNotificationContext.Provider value={ExportValues}>
            {children}
        </AdminNotificationContext.Provider>
    )
}