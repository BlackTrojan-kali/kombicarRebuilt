import React, { createContext, useState, useMemo, useCallback, useEffect } from "react";
import api from '../api/api'; 
import { toast } from "sonner"; 

// 1. Définition du Contexte
export const NotificationsListContext = createContext({
    // --- États Utilisateur ---
    notifications: [],
    unreadCount: 0, 
    loading: false,
    error: null,
    pagination: { /* ... */ },
    selectedNotificationDetails: null, 
    isDetailsLoading: false, 

    // --- États Globaux (Admin) ---
    allNotifications: [],
    isLoadingAllNotifications: false,
    allPagination: { /* ... */ },
    selectedAllNotificationDetails: null, //  Détails Admin
    isAllDetailsLoading: false,           //  État de chargement Admin

    // --- Fonctions API ---
    fetchNotifications: () => Promise.resolve(),
    fetchNotificationDetails: () => Promise.resolve(),
    fetchAllPlatformNotifications: () => Promise.resolve(), 
    fetchAllNotificationDetails: () => Promise.resolve(), //  Détails Admin
    publishNotification: () => Promise.resolve(),
    markNotificationsAsRead: () => Promise.resolve(), 
    deleteNotifications: () => Promise.resolve(),
    deleteAllPlatformNotifications: () => Promise.resolve(), //  Suppression Admin

    // ... (Reste) ...
    setCurrentPage: () => {}, 
    setCurrentAllPage: () => {},
});

// 2. Le Fournisseur de Contexte
export function NotificationsListContextProvider({ children }) {
    // --- États Utilisateur ---
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ /* ... */ });
    const [selectedNotificationDetails, setSelectedNotificationDetails] = useState(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    
    // --- États Globaux (Admin) ---
    const [allNotifications, setAllNotifications] = useState([]);
    const [isLoadingAllNotifications, setIsLoadingAllNotifications] = useState(false);
    const [currentAllPage, setCurrentAllPage] = useState(1);
    const [allPagination, setAllPagination] = useState({ /* ... */ });
    
    //  Nouveaux États pour les détails Admin
    const [selectedAllNotificationDetails, setSelectedAllNotificationDetails] = useState(null);
    const [isAllDetailsLoading, setIsAllDetailsLoading] = useState(false);
    
    const unreadCount = useMemo(() => {
        return notifications.filter(n => !n.isRead).length;
    }, [notifications]);


    //  [GET /api/v1/notifications/{page}] Récupérer la liste utilisateur
    const fetchNotifications = useCallback(async (page = currentPage) => {
        setLoading(true); setError(null);
        try {
            const response = await api.get(`/api/v1/notifications/${page}`);
            const data = response.data;
            setNotifications(data.items || []);
            setPagination({
                totalCount: data.totalCount || 0, page: data.page || 1,
                hasNextPage: data.hasNextPage || false, hasPreviousPage: data.hasPreviousPage || false,
            });
            setCurrentPage(data.page || 1);
            return data;
        } catch (err) {
            console.error("Erreur lors du chargement des notifications:", err);
            toast.error('Échec du chargement de vos notifications.'); return null;
        } finally { setLoading(false); }
    }, [currentPage]);
    
    useEffect(() => {
        fetchNotifications(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]); 

    
    //  [GET /api/v1/notifications/all/{page}] Liser toutes les notifications (Global)
    const fetchAllPlatformNotifications = useCallback(async (page = currentAllPage) => {
        setIsLoadingAllNotifications(true);
        try {
            const response = await api.get(`/api/v1/notifications/all/${page}`);
            const data = response.data;
            setAllNotifications(data.items || []);
            setAllPagination({
                totalCount: data.totalCount || 0, page: data.page || 1,
                hasNextPage: data.hasNextPage || false, hasPreviousPage: data.hasPreviousPage || false,
            });
            setCurrentAllPage(data.page || 1);
            return data;
        } catch (err) {
            console.error("Erreur lors du chargement des notifications globales:", err);
            toast.error('Échec du chargement des notifications globales.');
            setAllNotifications([]);
            return null;
        } finally { setIsLoadingAllNotifications(false); }
    }, [currentAllPage]);
    
    useEffect(() => {
        fetchAllPlatformNotifications(currentAllPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAllPage]);
    
    
    //  [GET /api/v1/notifications/{notificationId}] Obtenir les détails (Utilisateur)
    const fetchNotificationDetails = useCallback(async (notificationId) => {
        setIsDetailsLoading(true); setSelectedNotificationDetails(null);
        try {
            const response = await api.get(`/api/v1/notifications/${notificationId}`);
            const data = response.data;
            setSelectedNotificationDetails(data);
            return data;
        } catch (err) {
             console.error(`Erreur lors du chargement des détails de la notification ${notificationId}:`, err);
             toast.error(`Échec du chargement des détails.`);
             setSelectedNotificationDetails(null);
            return null;
        } finally { setIsDetailsLoading(false); }
    }, []);

    //  [GET /api/v1/notifications/details/{notificationId}] Obtenir les détails (Admin)
    const fetchAllNotificationDetails = useCallback(async (notificationId) => {
        setIsAllDetailsLoading(true); setSelectedAllNotificationDetails(null);
        try {
            const response = await api.get(`/api/v1/notifications/details/${notificationId}`);
            const data = response.data;
            setSelectedAllNotificationDetails(data);
            return data;
        } catch (err) {
             console.error(`Erreur lors du chargement des détails admin pour la notification ${notificationId}:`, err);
             toast.error(`Échec du chargement des détails administrateur.`);
             setSelectedAllNotificationDetails(null);
            return null;
        } finally { setIsAllDetailsLoading(false); }
    }, []);

    //  [POST /api/v1/notifications/publish] Crée et publie
    const publishNotification = useCallback(async (notificationData) => {
        setLoading(true); setError(null);
        try {
            const response = await api.post(`/api/v1/notifications/publish`, notificationData);
            const newNotification = response.data;
            if (currentPage === 1) { setNotifications(prev => [newNotification, ...prev]); }
            toast.success('Notification publiée avec succès !');
            return newNotification;
        } catch (err) {
            console.error("Erreur lors de la publication de la notification:", err);
            toast.error('Échec de la publication de la notification.');
            return null;
        } finally { setLoading(false); }
    }, [currentPage]);


    // [POST /api/v1/notifications/mark-as-read] Marquer une ou plusieurs comme lues
    const markNotificationsAsRead = useCallback(async (notificationIds) => {
        if (!notificationIds || notificationIds.length === 0) return;
        try {
            await api.post(`/api/v1/notifications/mark-as-read`, { ids: notificationIds });
            setNotifications(prev => 
                prev.map(n => notificationIds.includes(n.id) ? { ...n, isRead: true } : n)
            );
            if (notificationIds.length === 1) { toast.success('Message marqué comme lu.'); }
        } catch (err) {
            console.error("Erreur lors du marquage comme lu:", err);
            toast.error('Échec du marquage comme lu.');
        }
    }, []);
    
    // ... (markAsRead et markAllAsRead restent les mêmes) ...

    // [PUT /api/v1/notifications/{notificationId}] Modifier le contenu
    const updateNotificationContent = useCallback(async (notificationId, updatedData) => {
        setLoading(true);
        try {
            const response = await api.put(`/api/v1/notifications/${notificationId}`, updatedData);
            const updatedNotification = response.data;

            setNotifications(prev => 
                prev.map(n => n.id === notificationId ? { ...n, ...updatedNotification } : n)
            );
            if (selectedNotificationDetails?.id === notificationId) { setSelectedNotificationDetails(prev => ({ ...prev, ...updatedNotification })); }
            
            toast.success(`Notification ${notificationId} mise à jour avec succès !`);
            return updatedNotification;
        } catch (err) {
            console.error(`Erreur lors de la mise à jour de la notification ${notificationId}:`, err);
            toast.error(`Échec de la modification de la notification.`);
            return null;
        } finally { setLoading(false); }
    }, [selectedNotificationDetails]); 
    
    //  [DELETE /api/v1/notifications] Supprimer (Utilisateur)
    const deleteNotifications = useCallback(async (notificationIds) => {
        if (!notificationIds || notificationIds.length === 0) return true;
        setLoading(true);
        try {
            await api.delete(`/api/v1/notifications`, { data: { ids: notificationIds } });
            setNotifications(prev => 
                prev.filter(n => !notificationIds.includes(n.id))
            );
            if (notifications.filter(n => notificationIds.includes(n.id)).length === notifications.length) { fetchNotifications(currentPage); } 
            else { toast.success(`${notificationIds.length} message(s) supprimé(s).`); }
            if (selectedNotificationDetails && notificationIds.includes(selectedNotificationDetails.id)) { setSelectedNotificationDetails(null); }
            return true;
        } catch (err) {
            console.error("Erreur lors de la suppression des notifications:", err);
            toast.error(`Échec de la suppression des messages.`);
            return false;
        } finally { setLoading(false); }
    }, [notifications, selectedNotificationDetails, currentPage, fetchNotifications]);

    //  [DELETE /api/v1/notifications/all] Supprimer (Admin)
    const deleteAllPlatformNotifications = useCallback(async (notificationIds) => {
        if (!notificationIds || notificationIds.length === 0) return true;
        setIsLoadingAllNotifications(true);
        
        try {
            await api.delete(`/api/v1/notifications/all`, { data: { ids: notificationIds } });
            setAllNotifications(prev => 
                prev.filter(n => !notificationIds.includes(n.id))
            );
            
            if (allNotifications.filter(n => notificationIds.includes(n.id)).length === allNotifications.length) { 
                fetchAllPlatformNotifications(currentAllPage); 
            } else { 
                toast.success(`${notificationIds.length} message(s) de la plateforme supprimé(s).`); 
            }
            
            if (selectedAllNotificationDetails && notificationIds.includes(selectedAllNotificationDetails.id)) {
                setSelectedAllNotificationDetails(null);
            }
            return true;
        } catch (err) {
            console.error("Erreur lors de la suppression des notifications de la plateforme:", err);
            toast.error(`Échec de la suppression des messages de la plateforme.`);
            return false;
        } finally {
            setIsLoadingAllNotifications(false);
        }
    }, [allNotifications, selectedAllNotificationDetails, currentAllPage, fetchAllPlatformNotifications]);


    // La Valeur exposée par le Provider
    const contextValue = useMemo(() => ({
        // Utilisateur
        notifications, loading, error, pagination, currentPage, setCurrentPage,
        selectedNotificationDetails, isDetailsLoading,
        
        // Global (Admin)
        allNotifications, isLoadingAllNotifications, allPagination, setCurrentAllPage,
        selectedAllNotificationDetails, isAllDetailsLoading, // 🆕 Détails Admin
        
        // Fonctions
        fetchNotifications,
        fetchAllPlatformNotifications, 
        fetchNotificationDetails,
        fetchAllNotificationDetails,      // 🆕 Détails Admin
        publishNotification,
        markNotificationsAsRead, 
        markAsRead: (id) => markNotificationsAsRead([id]), // Commodité
        markAllAsRead: async () => { /* implémentation simple omise pour concision */ },
        updateNotificationContent,
        deleteNotifications,
        deleteAllPlatformNotifications,   // 🆕 Suppression Admin
        
    }), [
        notifications, loading, error, pagination, currentPage, selectedNotificationDetails, isDetailsLoading,
        allNotifications, isLoadingAllNotifications, allPagination, 
        selectedAllNotificationDetails, isAllDetailsLoading, // 🆕 Détails Admin
        fetchNotifications, fetchAllPlatformNotifications, fetchNotificationDetails, 
        fetchAllNotificationDetails, publishNotification, markNotificationsAsRead, 
        updateNotificationContent, deleteNotifications, deleteAllPlatformNotifications
    ]);

    return (
        <NotificationsListContext.Provider value={contextValue}>
            {children}
        </NotificationsListContext.Provider>
    );
}
