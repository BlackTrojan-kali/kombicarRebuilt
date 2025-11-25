import { createContext, useContext, useState } from "react";
import api from '../../api/api'; 
import { toast } from "sonner"; 

export const WithdrawalAdminContext = createContext({});

export function WithdrawalAdminContextProvider({ children }) {
    // États pour les requêtes de retrait globales (Admin)
    const [isLoading, setIsLoading] = useState(false); // Global loading for admin actions
    const [error, setError] = useState(null); // Global error for admin actions

    // 1. Demandes en attente (Admin)
    const [pendingRequests, setPendingRequests] = useState([]);
    const [pendingRequestsPagination, setPendingRequestsPagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isLoadingPendingRequests, setIsLoadingPendingRequests] = useState(false);
    const [pendingRequestsError, setPendingRequestsError] = useState(null);

    // 2. Détails d'une demande spécifique (Admin)
    const [adminDetails, setAdminDetails] = useState(null);
    const [isAdminDetailsLoading, setIsAdminDetailsLoading] = useState(false);
    const [adminDetailsError, setAdminDetailsError] = useState(null);

    // 3. Historique d'un utilisateur spécifique (Admin)
    const [adminUserHistory, setAdminUserHistory] = useState([]);
    const [adminUserHistoryPagination, setAdminUserHistoryPagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isAdminHistoryLoading, setIsAdminHistoryLoading] = useState(false);
    const [adminHistoryError, setAdminHistoryError] = useState(null);

    // 4. Historique complet de la plateforme (Admin)
    const [allHistory, setAllHistory] = useState([]);
    const [allHistoryPagination, setAllHistoryPagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isLoadingAllHistory, setIsLoadingAllHistory] = useState(false);
    const [allHistoryError, setAllHistoryError] = useState(null);

    // --- Fonctions (Implémentation des appels API) ---

    // 1. Fonction pour récupérer les demandes de retrait en attente (Admin)
    const fetchPendingWithdrawalRequests = async (page = 1) => {
        setIsLoadingPendingRequests(true);
        setPendingRequestsError(null);
        try {
            const response = await api.get(`/api/v1/withdraws/admin/pending-requests/${page}`);
            if (response.status !== 200) {
                throw new Error("Échec de la récupération des demandes de retrait en attente.");
            }
            const data = response.data;
            setPendingRequests(data.items);
            setPendingRequestsPagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage,
            });
            return data;
        } catch (error) {
            console.error("Erreur lors de la récupération des demandes en attente:", error);
            const errorMessage = error.message || "Une erreur inattendue est survenue.";
            setPendingRequestsError(errorMessage);
            toast.error(errorMessage);
            setPendingRequests([]);
            throw error;
        } finally {
            setIsLoadingPendingRequests(false);
        }
    };
    
    // 2. Fonction : Met à jour le statut d'une demande de retrait (Admin)
    const updateWithdrawalStatus = async (requestId, newStatus) => {
        setIsLoading(true); 
        setError(null);
        try {
            const response = await api.put(`/api/v1/withdraws/admin/update-status/${requestId}`, { status: newStatus });
            toast.success("Statut de la demande mis à jour avec succès !");
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut de la demande:", error);
            const errorMessage = error.response?.data?.message || "Échec de la mise à jour du statut.";
            setError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Fonction : Récupère les détails d'une demande de retrait en tant qu'administrateur
    const fetchAdminWithdrawalDetails = async (requestId) => {
        setIsAdminDetailsLoading(true);
        setAdminDetailsError(null);
        try {
            const response = await api.get(`/api/v1/withdraws/admin/${requestId}`);
            if (response.status !== 200) {
                throw new Error("Échec de la récupération des détails de la demande de retrait (Admin).");
            }
            const data = response.data;
            setAdminDetails(data);
            return data;
        } catch (error) {
            console.error("Erreur lors de la récupération des détails du retrait (Admin):", error);
            const errorMessage = error.response?.data?.message || "Une erreur inattendue est survenue.";
            setAdminDetailsError(errorMessage);
            toast.error(errorMessage);
            setAdminDetails(null);
            throw error;
        } finally {
            setIsAdminDetailsLoading(false);
        }
    };
    
    // 4. Fonction : Récupère l'historique de retrait d'un utilisateur spécifique (Admin)
    const fetchAdminUserWithdrawalHistory = async (userId, page = 1) => {
        setIsAdminHistoryLoading(true);
        setAdminHistoryError(null);
        try {
            const response = await api.get(`/api/v1/withdraws/admin/user-history/${userId}/${page}`);
            if (response.status !== 200) {
                throw new Error("Échec de la récupération de l'historique de retraits de l'utilisateur (Admin).");
            }
            const data = response.data;
            setAdminUserHistory(data.items);
            setAdminUserHistoryPagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage,
            });
            return data;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'historique utilisateur (Admin):", error);
            const errorMessage = error.message || "Une erreur inattendue est survenue.";
            setAdminHistoryError(errorMessage);
            toast.error(errorMessage);
            setAdminUserHistory([]);
            throw error;
        } finally {
            setIsAdminHistoryLoading(false);
        }
    };

    // 5. NOUVELLE FONCTION : Récupère l'historique complet des retraits de la plateforme (Admin) - Implémentée
    const fetchAllWithdrawalHistory = async (page = 1) => {
        setIsLoadingAllHistory(true);
        setAllHistoryError(null);
        try {
            const response = await api.get(`/api/v1/withdraws/admin/history/${page}`);
            if (response.status !== 200) {
                throw new Error("Échec de la récupération de l'historique complet des retraits.");
            }
            const data = response.data;
            setAllHistory(data.items);
            setAllHistoryPagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage,
            });
            return data;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'historique complet:", error);
            const errorMessage = error.message || "Une erreur inattendue est survenue.";
            setAllHistoryError(errorMessage);
            toast.error(errorMessage);
            setAllHistory([]);
            throw error;
        } finally {
            setIsLoadingAllHistory(false);
        }
    };


    const contextValue = {
        // Global
        isLoading,
        error,
        
        // 1. Demandes en attente
        pendingRequests,
        pendingRequestsPagination,
        isLoadingPendingRequests,
        pendingRequestsError,
        fetchPendingWithdrawalRequests,
        
        // 2. Détails d'une demande spécifique
        adminDetails,
        isAdminDetailsLoading,
        adminDetailsError,
        fetchAdminWithdrawalDetails,
        
        // 3. Historique d'un utilisateur spécifique
        adminUserHistory,
        adminUserHistoryPagination,
        isAdminHistoryLoading,
        adminHistoryError,
        fetchAdminUserWithdrawalHistory,
        
        // 4. Historique complet
        allHistory,
        allHistoryPagination,
        isLoadingAllHistory,
        allHistoryError,
        fetchAllWithdrawalHistory, // Fonction implémentée

        // Actions
        updateWithdrawalStatus,
    };

    return (
        <WithdrawalAdminContext.Provider value={contextValue}>
            {children}
        </WithdrawalAdminContext.Provider>
    );
}

export const useWithdrawAdminContext = () => useContext(WithdrawalAdminContext);