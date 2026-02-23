import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAuth from '../../../hooks/useAuth';

export const useAdminVtc = () => {
    const { API_URL } = useAuth();

    // ==========================================
    // ÉTATS : VÉHICULES (FLOTTE)
    // ==========================================
    const [vehicles, setVehicles] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    const [pagination, setPagination] = useState({
        totalCount: 0,
        page: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    // ==========================================
    // ÉTATS : CATÉGORIES (TYPES DE VÉHICULES)
    // ==========================================
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(false);

    // ==========================================
    // ACTIONS : VÉHICULES
    // ==========================================

    // 1. GET /api/v1/admin/vtc/vehicles
    const fetchVehicles = useCallback(async ({ page = 1, isVerified, vtcVehicleTypeId } = {}) => {
        setLoadingVehicles(true);
        try {
            const url = new URL(`${API_URL}/api/v1/admin/vtc/vehicles`);
            url.searchParams.append('page', page);
            
            if (isVerified !== undefined && isVerified !== null) {
                url.searchParams.append('isVerified', isVerified);
            }
            if (vtcVehicleTypeId !== undefined && vtcVehicleTypeId !== null) {
                url.searchParams.append('vtcVehicleTypeId', vtcVehicleTypeId);
            }

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error("Erreur de récupération des véhicules.");

            const data = await response.json();
            setVehicles(data.items || []);
            setPagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage
            });
        } catch (error) {
            console.error("fetchVehicles:", error);
            toast.error(error.message || "Impossible de charger la flotte.");
        } finally {
            setLoadingVehicles(false);
        }
    }, [API_URL]);

    // 2. PUT /api/v1/admin/vtc/vehicles/{id}/validate
    const validateVehicle = async (id, vtcVehicleTypeId = null) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/admin/vtc/vehicles/${id}/validate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(vtcVehicleTypeId !== null ? { vtcVehicleTypeId } : {})
            });

            if (!response.ok) throw new Error("Erreur de validation.");

            toast.success("Véhicule validé avec succès !");
            
            // Mise à jour locale pour la réactivité de l'UI
            setVehicles(prev => prev.map(v => 
                v.id === id ? { ...v, isVerified: true, vtcVehicleTypeId: vtcVehicleTypeId || v.vtcVehicleTypeId } : v
            ));
            
            // Si on a les catégories chargées, on peut aussi optionnellement rafraîchir leur compte
            fetchVehicleTypes();
            return true;
        } catch (error) {
            console.error("validateVehicle:", error);
            toast.error("Impossible de valider le véhicule.");
            return false;
        }
    };

    // ==========================================
    // ACTIONS : CATÉGORIES (TYPES DE VÉHICULES)
    // ==========================================

    // 3. GET /api/v1/admin/vtc/vehicle-types
    const fetchVehicleTypes = useCallback(async () => {
        setLoadingTypes(true);
        try {
            const response = await fetch(`${API_URL}/api/v1/admin/vtc/vehicle-types`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error("Erreur de récupération des catégories.");
            
            const data = await response.json();
            setVehicleTypes(data || []);
        } catch (error) {
            console.error("fetchVehicleTypes:", error);
            toast.error("Impossible de charger les types de véhicules.");
        } finally {
            setLoadingTypes(false);
        }
    }, [API_URL]);

    // 4. POST /api/v1/admin/vtc/vehicle-types
    const createVehicleType = async (categoryData) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/admin/vtc/vehicle-types`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(categoryData)
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.description || "Erreur de création.");
            }
            
            toast.success("Nouvelle catégorie créée !");
            await fetchVehicleTypes(); // Actualisation de la liste
            return true;
        } catch (error) {
            console.error("createVehicleType:", error);
            toast.error(error.message || "Impossible de créer la catégorie.");
            return false;
        }
    };

    // 5. PUT /api/v1/admin/vtc/vehicle-types/{id}
    const updateVehicleType = async (id, updateData) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/admin/vtc/vehicle-types/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updateData)
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.description || "Erreur de mise à jour.");
            }
            
            toast.success("Catégorie mise à jour !");
            await fetchVehicleTypes(); 
            return true;
        } catch (error) {
            console.error("updateVehicleType:", error);
            toast.error(error.message || "Échec de la mise à jour.");
            return false;
        }
    };

    // 6. DELETE /api/v1/admin/vtc/vehicle-types/{id}
    const deleteVehicleType = async (id, forceDelete = false) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/admin/vtc/vehicle-types/${id}?forceDelete=${forceDelete}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.description || "Action impossible. Des véhicules y sont peut-être liés.");
            }

            toast.success(forceDelete ? "Catégorie supprimée définitivement." : "Catégorie désactivée.");
            await fetchVehicleTypes(); 
            return true;
        } catch (error) {
            console.error("deleteVehicleType:", error);
            toast.error(error.message || "Impossible de supprimer la catégorie.");
            return false;
        }
    };

    // Retourne toutes les propriétés et méthodes pour être utilisées dans les composants
    return {
        // Flotte
        vehicles,
        loadingVehicles,
        pagination,
        fetchVehicles,
        validateVehicle,
        
        // Catégories (Pricing)
        vehicleTypes,
        loadingTypes,
        fetchVehicleTypes,
        createVehicleType,
        updateVehicleType,
        deleteVehicleType
    };
};