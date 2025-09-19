import { createContext, useState } from "react";
import api from '../api/api';
import { toast } from "sonner";

export const withdrawContext = createContext({});

export function WithdrawContextProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [withdrawals, setWithdrawals] = useState([]);

    const [userWithdrawalHistory, setUserWithdrawalHistory] = useState([]);
    const [userWithdrawalPagination, setUserWithdrawalPagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isLoadingUserHistory, setIsLoadingUserHistory] = useState(false);
    const [userHistoryError, setUserHistoryError] = useState(null);

    const [withdrawalDetails, setWithdrawalDetails] = useState(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState(null);

    const [pendingRequests, setPendingRequests] = useState([]);
    const [pendingRequestsPagination, setPendingRequestsPagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isLoadingPendingRequests, setIsLoadingPendingRequests] = useState(false);
    const [pendingRequestsError, setPendingRequestsError] = useState(null);

    const [adminDetails, setAdminDetails] = useState(null);
    const [isAdminDetailsLoading, setIsAdminDetailsLoading] = useState(false);
    const [adminDetailsError, setAdminDetailsError] = useState(null);

    const [adminUserHistory, setAdminUserHistory] = useState([]);
    const [adminUserHistoryPagination, setAdminUserHistoryPagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isAdminHistoryLoading, setIsAdminHistoryLoading] = useState(false);
    const [adminHistoryError, setAdminHistoryError] = useState(null);

    // NOUVEAUX ÉTATS pour l'historique complet de la plateforme (Admin)
    const [allHistory, setAllHistory] = useState([]);
    const [allHistoryPagination, setAllHistoryPagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isLoadingAllHistory, setIsLoadingAllHistory] = useState(false);
    const [allHistoryError, setAllHistoryError] = useState(null);


    // Fonction pour initier une demande de retrait
    const requestWithdrawal = async (amount, userId) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post(`/api/v1/payment/withdraw`, { amount, userId });
            toast.success("Demande de retrait soumise avec succès !");
            return response.data;
        } catch (err) {
            console.error("Erreur lors de la demande de retrait:", err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la demande de retrait.');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour soumettre une demande de retrait (avec le nouvel endpoint)
    const submitWithdrawalRequest = async (amount, phoneNumber, operator) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post(`/api/v1/withdraws`, { amount, phoneNumber, operator });
            toast.success("Demande de retrait soumise avec succès !");
            return response.status === 200;
        } catch (err) {

            if(err.response && err.response.status === 400) {
                if(err.response.data && err.response.data.code === "WithdrawErrors.InsufficientBalance") {
                    setError("Solde insuffisant pour effectuer ce retrait.");
                    toast.error("Solde insuffisant pour effectuer ce retrait.");
                    return null;
                }

                //WithdrawErrors.AmountTooLow
                if(err.response.data && err.response.data.code === "WithdrawErrors.AmountTooLow") {
                    setError("Le montant du retrait est trop faible.");
                    toast.error("Le montant du retrait est trop faible.");
                    return null;
                }

                //GlobalErrors.InvalidPhoneNumber
                if(err.response.data && err.response.data.code === "GlobalErrors.InvalidPhoneNumber") {
                    setError("Le numéro de téléphone fourni est invalide.");
                    toast.error("Le numéro de téléphone fourni est invalide.");
                    return null;
                }

                const errorMessage = err.response.data.message || 'Données invalides pour la demande de retrait.';
                setError(errorMessage);
                toast.error(errorMessage);
                return null;
            }
            console.error("Erreur lors de la soumission de la demande de retrait:", err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la soumission de la demande de retrait.');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour récupérer l'historique des retraits de l'utilisateur
    const fetchUserWithdrawalHistory = async (page = 1) => {
        setIsLoadingUserHistory(true);
        setUserHistoryError(null);
        try {
            const response = await api.get(`/api/v1/withdraws/my-requests/${page}`);
            if (response.status !== 200) {
                throw new Error("Échec de la récupération de l'historique de retraits.");
            }
            const data = response.data;
            setUserWithdrawalHistory(data.items);
            setUserWithdrawalPagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage,
            });
            return data;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'historique de retraits:", error);
            const errorMessage = error.message || "Une erreur inattendue est survenue.";
            setUserHistoryError(errorMessage);
            toast.error(errorMessage);
            setUserWithdrawalHistory([]);
            throw error;
        } finally {
            setIsLoadingUserHistory(false);
        }
    };

    // Fonction pour récupérer les détails d'une demande de retrait
    const fetchWithdrawalDetails = async (requestId) => {
        setIsDetailsLoading(true);
        setDetailsError(null);
        try {
            const response = await api.get(`/api/v1/withdraws/${requestId}`);
            if (response.status !== 200) {
                throw new Error("Échec de la récupération des détails de la demande de retrait.");
            }
            const data = response.data;
            setWithdrawalDetails(data);
            return data;
        } catch (error) {
            console.error("Erreur lors de la récupération des détails du retrait:", error);
            const errorMessage = error.response?.data?.message || "Une erreur inattendue est survenue.";
            setDetailsError(errorMessage);
            toast.error(errorMessage);
            setWithdrawalDetails(null);
            throw error;
        } finally {
            setIsDetailsLoading(false);
        }
    };

    

    // Fonction pour récupérer les demandes de retrait en attente (Admin)
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

    // Fonction : Met à jour le statut d'une demande de retrait (Admin)
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

    // Fonction : Récupère les détails d'une demande de retrait en tant qu'administrateur
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
    
    // Fonction : Récupère l'historique de retrait d'un utilisateur spécifique (Admin)
    const fetchAdminUserWithdrawalHistory = async (userId, page = 1) => {
        setIsAdminHistoryLoading(true);
        setAdminHistoryError(null);
        try {
            const response = await api.get(`/api/v1/withdraws/admin/user-history/${userId}/${page}`);
            if (response.status !== 200) {
                throw new Error("Échec de la récupération de l'historique de retraits de l'utilisateur.");
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

    // NOUVELLE FONCTION : Récupère l'historique complet des retraits de la plateforme (Admin)
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

    // Recupération des détails des paramètres de l'application, emplacement temporaire
    // À déplacer plus tard 
    
    const [appSettings, setAppSettings] = useState(null);
    const [isAppSettingsLoading, setIsAppSettingsLoading] = useState(false);
    const fetchApplicationsSettingsDetails = async () => {
        setIsDetailsLoading(true);
        setDetailsError(null);
        try {
            const response = await api.get(`/api/v1/app-settings/public-app-settings`);
            if (response.status !== 200) {
                throw new Error("Oops quelque choses s'est mal passé.");
            }
            const data = response.data;
            setAppSettings(data);
            return data;
        } catch (error) {
            console.error("Oops quelque choses s'est mal passé.", error);
            //const errorMessage = error.response?.data?.message || "Une erreur inattendue est survenue.";
            toast.error("Oops quelque choses s'est mal passé.");
            setIsAppSettingsLoading(null);
            throw error;
        } finally {
            setIsDetailsLoading(false);
        }
    };




    const contextValue = {
        isLoading,
        error,
        withdrawals,
        requestWithdrawal,
        submitWithdrawalRequest,
        // Valeurs pour l'historique utilisateur
        userWithdrawalHistory,
        userWithdrawalPagination,
        isLoadingUserHistory,
        userHistoryError,
        fetchUserWithdrawalHistory,
        // Valeurs pour les détails d'une demande
        withdrawalDetails,
        isDetailsLoading,
        detailsError,
        fetchWithdrawalDetails,
        // Valeurs pour les demandes en attente (Admin)
        pendingRequests,
        pendingRequestsPagination,
        isLoadingPendingRequests,
        pendingRequestsError,
        fetchPendingWithdrawalRequests,
        // Nouvelle fonction
        updateWithdrawalStatus,
        // Valeurs pour les détails d'une demande (Admin)
        adminDetails,
        isAdminDetailsLoading,
        adminDetailsError,
        fetchAdminWithdrawalDetails,
        // Nouvelles valeurs pour l'historique utilisateur (Admin)
        adminUserHistory,
        adminUserHistoryPagination,
        isAdminHistoryLoading,
        adminHistoryError,
        fetchAdminUserWithdrawalHistory,
        // Nouvelles valeurs pour l'historique complet (Admin)
        allHistory,
        allHistoryPagination,
        isLoadingAllHistory,
        allHistoryError,
        fetchAllWithdrawalHistory,
        // Détails des paramètres de l'application
        appSettings,
        isAppSettingsLoading,
        fetchApplicationsSettingsDetails
    };

    return (
        <withdrawContext.Provider value={contextValue}>
            {children}
        </withdrawContext.Provider>
    );
}