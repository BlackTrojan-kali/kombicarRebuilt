import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAuth from '../../../hooks/useAuth';

export const useVtcVehicles = () => {
    const { API_URL } = useAuth();
    
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
            const url = new URL(`${API_URL}/api/v1/admin/vtc/vehicles`);
            url.searchParams.append('page', page);
            
            if (isVerified !== undefined) url.searchParams.append('isVerified', isVerified);
            if (vtcVehicleTypeId !== undefined) url.searchParams.append('vtcVehicleTypeId', vtcVehicleTypeId);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error("Erreur de récupération.");

            const data = await response.json();
            
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
    }, [API_URL]);

    const validateVtcVehicle = async (id, vtcVehicleTypeId = null) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/admin/vtc/vehicles/${id}/validate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(vtcVehicleTypeId !== null ? { vtcVehicleTypeId } : {})
            });

            if (!response.ok) throw new Error("Erreur de validation.");

            toast.success("Véhicule validé !");
            
            // Mise à jour locale
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