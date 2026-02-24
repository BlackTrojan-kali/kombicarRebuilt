import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import api from '../../../api/api'; // Import de votre instance Axios

export const useAdminVtc = () => {
    // ==========================================
    // ÉTATS GLOBAUX
    // ==========================================
    const [vehicles, setVehicles] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [rides, setRides] = useState([]);
    const [selectedRide, setSelectedRide] = useState(null);
    const [rideTracking, setRideTracking] = useState(null);

    // États de chargement séparés
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    const [loadingTypes, setLoadingTypes] = useState(false);
    const [loadingRides, setLoadingRides] = useState(false);

    // Pagination
    const [pagination, setPagination] = useState({
        totalCount: 0,
        page: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    // ==========================================
    // 1. FLOTTE VTC (VÉHICULES)
    // ==========================================

    const fetchVehicles = useCallback(async ({ page = 1, isVerified, vtcVehicleTypeId } = {}) => {
        setLoadingVehicles(true);
        try {
            const response = await api.get('/api/v1/admin/vtc/vehicles', {
                params: { page, isVerified, vtcVehicleTypeId }
            });
            
            const data = response.data;
            setVehicles(data.items || []);
            setPagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage
            });
        } catch (error) {
            toast.error("Impossible de charger la flotte VTC.");
        } finally {
            setLoadingVehicles(false);
        }
    }, []);

    const validateVehicle = useCallback(async (id, vtcVehicleTypeId = null) => {
        try {
            await api.put(`/api/v1/admin/vtc/vehicles/${id}/validate`, 
                vtcVehicleTypeId !== null ? { vtcVehicleTypeId } : {}
            );
            
            toast.success("Véhicule validé avec succès !");
            setVehicles(prev => prev.map(v => 
                v.id === id ? { ...v, isVerified: true, vtcVehicleTypeId: vtcVehicleTypeId || v.vtcVehicleTypeId } : v
            ));
            return true;
        } catch (error) {
            toast.error("Erreur lors de la validation du véhicule.");
            return false;
        }
    }, []);

    // ==========================================
    // 2. CONFIGURATION (TYPES DE VÉHICULES)
    // ==========================================

    const fetchVehicleTypes = useCallback(async () => {
        setLoadingTypes(true);
        try {
            const response = await api.get('/api/v1/admin/vtc/vehicle-types');
            setVehicleTypes(response.data || []);
        } catch (error) {
            toast.error("Erreur de chargement des catégories.");
        } finally {
            setLoadingTypes(false);
        }
    }, []);

    const createVehicleType = useCallback(async (payload) => {
        try {
            await api.post('/api/v1/admin/vtc/vehicle-types', payload);
            toast.success("Catégorie créée !");
            fetchVehicleTypes(); 
            return true;
        } catch (error) {
            toast.error("Échec de la création.");
            return false;
        }
    }, [fetchVehicleTypes]);

    const updateVehicleType = useCallback(async (id, payload) => {
        try {
            await api.put(`/api/v1/admin/vtc/vehicle-types/${id}`, payload);
            toast.success("Catégorie mise à jour !");
            fetchVehicleTypes(); 
            return true;
        } catch (error) {
            toast.error("Échec de la modification.");
            return false;
        }
    }, [fetchVehicleTypes]);

    const deleteVehicleType = useCallback(async (id, forceDelete = false) => {
        try {
            await api.delete(`/api/v1/admin/vtc/vehicle-types/${id}`, {
                params: { forceDelete }
            });
            toast.success(forceDelete ? "Catégorie supprimée." : "Catégorie désactivée.");
            fetchVehicleTypes(); 
            return true;
        } catch (error) {
            toast.error(error.response?.data?.description || "Impossible d'effectuer l'action.");
            return false;
        }
    }, [fetchVehicleTypes]);

    // ==========================================
    // 3. COURSES & TRACKING (RIDES)
    // ==========================================

    const fetchRides = useCallback(async ({ 
        page = 1, pageSize = 12, status = null, 
        startDate = '', endDate = '', driverId = '', passengerId = '' 
    } = {}) => {
        setLoadingRides(true);
        try {
            // Axios ignore automatiquement les params "undefined", mais pour être propre avec "null" ou chaîne vide, on nettoie :
            const params = { page, pageSize };
            if (status !== null && status !== '') params.status = status;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            if (driverId) params.driverId = driverId;
            if (passengerId) params.passengerId = passengerId;

            const response = await api.get('/api/v1/admin/vtc/rides', { params });
            const data = response.data;
            
            setRides(data.items || []);
            setPagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage
            });
        } catch (error) {
            toast.error("Erreur lors du chargement de l'historique.");
        } finally {
            setLoadingRides(false);
        }
    }, []);

    const fetchRideDetails = useCallback(async (rideId) => {
        setLoadingRides(true);
        try {
            const response = await api.get(`/api/v1/admin/vtc/rides/${rideId}`);
            setSelectedRide(response.data);
            return response.data;
        } catch (error) {
            toast.error("Impossible de récupérer les détails.");
            return null;
        } finally {
            setLoadingRides(false);
        }
    }, []);

    const fetchRideTracking = useCallback(async (rideId) => {
        try {
            const response = await api.get(`/api/v1/admin/vtc/rides/${rideId}/tracking`);
            setRideTracking(response.data);
            return response.data;
        } catch (error) {
            console.error("Erreur de tracking GPS:", error);
            return null;
        }
    }, []);

    const cancelRideAsAdmin = useCallback(async (rideId, reason) => {
        try {
            await api.post(`/api/v1/admin/vtc/rides/${rideId}/cancel`, { 
                cancellationReason: reason 
            });
            toast.success("Course annulée par l'administration.");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Échec de l'annulation.");
            return false;
        }
    }, []);

    // Retourne toutes les méthodes et états exposés
    return {
        vehicles,
        loadingVehicles,
        fetchVehicles,
        validateVehicle,
        
        vehicleTypes,
        loadingTypes,
        fetchVehicleTypes,
        createVehicleType,
        updateVehicleType,
        deleteVehicleType,

        rides,
        selectedRide,
        rideTracking,
        loadingRides,
        pagination,
        fetchRides,
        fetchRideDetails,
        fetchRideTracking,
        cancelRideAsAdmin
    };
};