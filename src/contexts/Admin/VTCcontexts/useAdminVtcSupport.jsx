import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import api from '../../../api/api'; // Ajustez le chemin vers votre instance Axios

export const useAdminVtcSupport = () => {
    // ==========================================
    // ÉTATS : LITIGES (DISPUTES)
    // ==========================================
    const [disputes, setDisputes] = useState([]);
    const [disputeDetails, setDisputeDetails] = useState(null);
    const [disputesPagination, setDisputesPagination] = useState({ page: 1, totalCount: 0, hasNextPage: false, hasPreviousPage: false });
    const [isLoadingDisputes, setIsLoadingDisputes] = useState(false);

    // ==========================================
    // ÉTATS : AVIS (REVIEWS)
    // ==========================================
    const [reviews, setReviews] = useState([]);
    const [reviewsPagination, setReviewsPagination] = useState({ page: 1, totalCount: 0, hasNextPage: false, hasPreviousPage: false });
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);

    // ==========================================
    // ACTIONS : LITIGES
    // ==========================================

    // 1. Lister les litiges
    const fetchDisputes = useCallback(async (params = {}) => {
        setIsLoadingDisputes(true);
        try {
            const { page = 1, pageSize = 12, status } = params;
            const queryParams = { page, pageSize };
            if (status !== undefined && status !== '') queryParams.status = status;

            const response = await api.get('/api/v1/admin/vtc/support/disputes', { params: queryParams });
            
            setDisputes(response.data.items || []);
            setDisputesPagination({
                page: response.data.page,
                totalCount: response.data.totalCount,
                hasNextPage: response.data.hasNextPage,
                hasPreviousPage: response.data.hasPreviousPage
            });
        } catch (error) {
            const msg = error.response?.data?.message || "Erreur lors de la récupération des litiges.";
            toast.error(msg);
        } finally {
            setIsLoadingDisputes(false);
        }
    }, []);

    // 2. Lire les détails d'un litige
    const fetchDisputeById = useCallback(async (id) => {
        setIsLoadingDisputes(true);
        try {
            const response = await api.get(`/api/v1/admin/vtc/support/disputes/${id}`);
            setDisputeDetails(response.data);
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.message || "Erreur lors de la récupération des détails du litige.";
            toast.error(msg);
            return null;
        } finally {
            setIsLoadingDisputes(false);
        }
    }, []);

    // 3. Résoudre un litige
    const resolveDispute = useCallback(async (id, adminNote = "") => {
        setIsLoadingDisputes(true);
        try {
            await api.put(`/api/v1/admin/vtc/support/disputes/${id}/resolve`, { adminNote });
            toast.success("Le litige a été marqué comme résolu.");
            
            // Mise à jour optimiste du détail si on est sur la page du litige
            setDisputeDetails(prev => prev && prev.id === id ? { ...prev, status: 2 } : prev); // Supposons que 2 = Résolu
            
            return true;
        } catch (error) {
            const msg = error.response?.data?.message || "Erreur lors de la résolution du litige.";
            toast.error(msg);
            return false;
        } finally {
            setIsLoadingDisputes(false);
        }
    }, []);

    // ==========================================
    // ACTIONS : AVIS (REVIEWS)
    // ==========================================

    // 4. Lister les avis pour modération
    const fetchReviews = useCallback(async (params = {}) => {
        setIsLoadingReviews(true);
        try {
            const { page = 1, pageSize = 12, minRating, maxRating } = params;
            const queryParams = { page, pageSize };
            if (minRating) queryParams.minRating = minRating;
            if (maxRating) queryParams.maxRating = maxRating;

            const response = await api.get('/api/v1/admin/vtc/support/reviews', { params: queryParams });
            
            setReviews(response.data.items || []);
            setReviewsPagination({
                page: response.data.page,
                totalCount: response.data.totalCount,
                hasNextPage: response.data.hasNextPage,
                hasPreviousPage: response.data.hasPreviousPage
            });
        } catch (error) {
            const msg = error.response?.data?.message || "Erreur lors de la récupération des avis.";
            toast.error(msg);
        } finally {
            setIsLoadingReviews(false);
        }
    }, []);

    return {
        // État et méthodes des Litiges
        disputes,
        disputeDetails,
        disputesPagination,
        isLoadingDisputes,
        fetchDisputes,
        fetchDisputeById,
        resolveDispute,

        // État et méthodes des Avis
        reviews,
        reviewsPagination,
        isLoadingReviews,
        fetchReviews
    };
};