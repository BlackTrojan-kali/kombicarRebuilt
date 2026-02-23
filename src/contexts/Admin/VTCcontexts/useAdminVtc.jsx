import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAuth from '../../../hooks/useAuth';

export const useAdminVtc = () => {
    const { API_URL } = useAuth();

    // ==========================================
    // ÉTATS GLOBAUX
    // ==========================================
    const [vehicles, setVehicles] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [rides, setRides] = useState([]);
    const [selectedRide, setSelectedRide] = useState(null);
    const [rideTracking, setRideTracking] = useState(null);

    // États de chargement séparés pour une meilleure UX
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    const [loadingTypes, setLoadingTypes] = useState(false);
    const [loadingRides, setLoadingRides] = useState(false);

    // Pagination générique (peut être divisée si vous affichez plusieurs tableaux en même temps)
    const [pagination, setPagination] = useState({
        totalCount: 0,
        page: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    // Utilitaire pour les en-têtes
    const getHeaders = useCallback(() => ({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }), []);

    // ==========================================
    // 1. FLOTTE VTC (VÉHICULES)
    // ==========================================

    const fetchVehicles = useCallback(async ({ page = 1, isVerified, vtcVehicleTypeId } = {}) => {
        setLoadingVehicles(true);
        try {
            const url = new URL(`${API_URL}/api/v1/admin/vtc/vehicles`);
            url.searchParams.append('page', page);
            if (isVerified !== undefined) url.searchParams.append('isVerified', isVerified);
            if (vtcVehicleTypeId !== undefined) url.searchParams.append('vtcVehicleTypeId', vtcVehicleTypeId);

            const response = await fetch(url.toString(), { headers: getHeaders() });
            if (!response.ok) throw new Error();

            const data = await response.json();
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
    }, [API_URL, getHeaders]);

    const validateVehicle = useCallback(async (id, vtcVehicleTypeId = null) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/admin/vtc/vehicles/${id}/validate`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(vtcVehicleTypeId !== null ? { vtcVehicleTypeId } : {})
            });

            if (!response.ok) throw new Error();
            
            toast.success("Véhicule validé avec succès !");
            setVehicles(prev => prev.map(v => 
                v.id === id ? { ...v, isVerified: true, vtcVehicleTypeId: vtcVehicleTypeId || v.vtcVehicleTypeId } : v
            ));
            return true;
        } catch (error) {
            toast.error("Erreur lors de la validation du véhicule.");
            return false;
        }
    }, [API_URL, getHeaders]);

    // ==========================================
    // 2. CONFIGURATION (TYPES DE VÉHICULES)
    // ==========================================

    const fetchVehicleTypes = useCallback(async () => {
        setLoadingTypes(true);
        try {
            const response = await fetch(`${API_URL}/api/v1/admin/vtc/vehicle-types`, { headers: getHeaders() });
            if (!response.ok) throw new Error();
            
            const data = await response.json();
            setVehicleTypes(data || []);
        } catch (error) {
            toast.error("Erreur de chargement des catégories.");
        } finally {
            setLoadingTypes(false);
        }
    }, [API_URL, getHeaders]);

    const createVehicleType = useCallback(async (payload) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/admin/vtc/vehicle-types`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error();
            
            toast.success("Catégorie créée !");
            fetchVehicleTypes(); 
            return true;
        } catch (error) {
            toast.error("Échec de la création.");
            return false;
        }
    }, [API_URL, getHeaders, fetchVehicleTypes]);

    const updateVehicleType = useCallback(async (id, payload) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/admin/vtc/vehicle-types/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error();
            
            toast.success("Catégorie mise à jour !");
            fetchVehicleTypes(); 
            return true;
        } catch (error) {
            toast.error("Échec de la modification.");
            return false;
        }
    }, [API_URL, getHeaders, fetchVehicleTypes]);

    const deleteVehicleType = useCallback(async (id, forceDelete = false) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/admin/vtc/vehicle-types/${id}?forceDelete=${forceDelete}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.description || "Impossible d'effectuer l'action.");
            }

            toast.success(forceDelete ? "Catégorie supprimée." : "Catégorie désactivée.");
            fetchVehicleTypes(); 
            return true;
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    }, [API_URL, getHeaders, fetchVehicleTypes]);

    // ==========================================
    // 3. COURSES & TRACKING (RIDES)
    // ==========================================

    const fetchRides = useCallback(async ({ 
        page = 1, pageSize = 12, status = null, 
        startDate = '', endDate = '', driverId = '', passengerId = '' 
    } = {}) => {
        setLoadingRides(true);
        try {
            const url = new URL(`${API_URL}/api/v1/admin/vtc/rides`);
            url.searchParams.append('page', page);
            url.searchParams.append('pageSize', pageSize);
            
            if (status !== null) url.searchParams.append('status', status);
            if (startDate) url.searchParams.append('startDate', startDate);
            if (endDate) url.searchParams.append('endDate', endDate);
            if (driverId) url.searchParams.append('driverId', driverId);
            if (passengerId) url.searchParams.append('passengerId', passengerId);

            const response = await fetch(url.toString(), { headers: getHeaders() });
            if (!response.ok) throw new Error();

            const data = await response.json();
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
    }, [API_URL, getHeaders]);

    const fetchRideDetails = useCallback(async (rideId) => {
        setLoadingRides(true);
        try {
            const response = await fetch(`${API_URL}/api/v1/admin/vtc/rides/${rideId}`, { headers: getHeaders() });
            if (!response.ok) throw new Error();
            
            const data = await response.json();
            setSelectedRide(data);
            return data;
        } catch (error) {
            toast.error("Impossible de récupérer les détails.");
            return null;
        } finally {
            setLoadingRides(false);
        }
    }, [API_URL, getHeaders]);

    const fetchRideTracking = useCallback(async (rideId) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/admin/vtc/rides/${rideId}/tracking`, { headers: getHeaders() });
            if (!response.ok) throw new Error();
            
            const data = await response.json();
            setRideTracking(data);
            return data;
        } catch (error) {
            console.error("Erreur de tracking GPS:", error);
            return null;
        }
    }, [API_URL, getHeaders]);

    const cancelRideAsAdmin = useCallback(async (rideId, reason) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/admin/vtc/rides/${rideId}/cancel`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ cancellationReason: reason })
            });

            if (response.ok) {
                toast.success("Course annulée par l'administration.");
                return true;
            } else {
                const err = await response.json();
                toast.error(err.message || "Échec de l'annulation.");
                return false;
            }
        } catch (error) {
            toast.error("Erreur réseau lors de l'annulation.");
            return false;
        }
    }, [API_URL, getHeaders]);

    // Retourne toutes les méthodes et états exposés
    return {
        // Flotte
        vehicles,
        loadingVehicles,
        fetchVehicles,
        validateVehicle,
        
        // Catégories (Pricing)
        vehicleTypes,
        loadingTypes,
        fetchVehicleTypes,
        createVehicleType,
        updateVehicleType,
        deleteVehicleType,

        // Courses & Tracking
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