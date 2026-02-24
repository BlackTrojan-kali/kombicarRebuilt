import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import api from '../../../api/api'; // Utilisation de votre instance Axios

export const useVtcVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        totalCount: 0,
        page: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    const fetchVtcVehicles = useCallback(async ({ page = 1, isVerified, vtcVehicleTypeId } = {}) => {
        setLoading(true);
        try {
            // Axios gère automatiquement l'échappement et la construction de l'URL
            const params = { page };
            if (isVerified !== undefined) params.isVerified = isVerified;
            if (vtcVehicleTypeId !== undefined) params.vtcVehicleTypeId = vtcVehicleTypeId;

            const response = await api.get('/api/v1/admin/vtc/vehicles', { params });
            const data = response.data;
            
            setVehicles(data.items || []);
            setPagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage
            });

        } catch (error) {
            console.error(error);
            toast.error("Impossible de charger la liste.");
        } finally {
            setLoading(false);
        }
    }, []);

    const validateVtcVehicle = async (id, vtcVehicleTypeId = null) => {
        try {
            // S'il n'y a pas de vtcVehicleTypeId, on envoie un objet vide
            const payload = vtcVehicleTypeId !== null ? { vtcVehicleTypeId } : {};
            
            await api.put(`/api/v1/admin/vtc/vehicles/${id}/validate`, payload);

            toast.success("Véhicule validé !");
            
            // Mise à jour locale pour éviter de recharger toute la liste
            setVehicles(prev => prev.map(v => 
                v.id === id ? { ...v, isVerified: true, vtcVehicleTypeId: vtcVehicleTypeId || v.vtcVehicleTypeId } : v
            ));
            return true;
        } catch (error) {
            toast.error("Impossible de valider le véhicule.");
            return false;
        }
    };

    return { vehicles, loading, pagination, fetchVtcVehicles, validateVtcVehicle };
};