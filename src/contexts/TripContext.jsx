import { createContext, useState, useContext } from "react";
import api from '../api/api';
import toast from 'react-hot-toast';
import useAuth from "../hooks/useAuth";

export const tripContext = createContext({});
export function TripContextProvider({ children }) {
    const { user, loading: authLoading } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTrips = async ({pageIndex, status}) => {
        if (authLoading) return;
        setLoading(true);
        setError(null);
        const url = `/api/v1/trips/${pageIndex}/${status}`;
        
        try {
            const response = await api.get(url);
            const data = response.data;
            if (data && Array.isArray(data.items) && data.items.length > 0) {
                setTrips(data.items);
            } else {
                setTrips([]);
            }
            return data;
        } catch (err) {
            setError(err);
            setTrips([]);
            toast.error(err.response?.data?.message || 'Échec du chargement des trajets.');
            throw err;
        } finally {
            setLoading(false);
        }
    };
    
    const listPublicTrips = async (searchCriteria) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/v1/trips/list-public', searchCriteria);
            const data = response.data;
            if (data && Array.isArray(data.items) && data.items.length > 0) {
                setTrips(data.items);
            } else {
                setTrips([]);
                toast.error('Aucun trajet public ne correspond à vos critères.');
            }
            return data;
        } catch (err) {
            setError(err);
            setTrips([]);
            toast.error(err.response?.data?.message || 'Échec de la recherche des trajets publics.');
            throw err;
        } finally {
            setLoading(false);
        }
    };
    
    const createTrip = async (tripData) => {
        if (authLoading) return;
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour publier un trajet.");
            return null;
        }

        setLoading(true);
        setError(null);
        
        const newTripData = { ...tripData, userId: user.id };

        try {
            const response = await api.post('/api/v1/trips', newTripData);
            toast.success('Trajet publié avec succès!');
            return response.data;
        } catch (err) {
            setError(err);
            toast.error(err.response?.data?.description || 'Échec de la publication du trajet.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getTripById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/v1/trips/${id}`);
            return response.data;
        } catch (err) {
            setError(err);
            //the toaster the toaster
            toast.error(err.response?.data?.message || `Échec de la récupération du trajet ${id}.`);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteTrip = async (id) => {
        if (authLoading) return;
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour supprimer un trajet.");
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.delete(`/api/v1/trips/${id}`);
            toast.success('Trajet supprimé avec succès!');
            return response.data;
        } catch (err) {
            setError(err);
            toast.error(err.response?.data?.description || 'Échec de la suppression du trajet.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteTripAsAdmin = async (tripId) => {
        if (authLoading) return;
        setLoading(true);
        setError(null);
        
        try {
            await api.delete(`/api/v1/trips/admin/${tripId}`);
            toast.success('Le trajet a été supprimé par l\'administrateur.');
            fetchTrips(); 
            return true;
        } catch (err) {
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la suppression du trajet par l\'administrateur.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const changeTripStatusAsAdmin = async (tripId, status) => {
        if (authLoading) return;
        setLoading(true);
        setError(null);
        try {
            await api.put(`/api/v1/trips/admin/change-status/${tripId}/${status}`);
            toast.success('Le statut du trajet a été mis à jour avec succès.');
            return true;
        } catch (err) {
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la mise à jour du statut du trajet.');
            return false;
        } finally {
            setLoading(false);
        }
    };
    
    const updateTrip = async (updatedTripData) => {
        if (authLoading) return;
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/api/v1/trips`, updatedTripData);
            toast.success('Trajet mis à jour avec succès !');
            return response.data;
        } catch (err) {
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la mise à jour du trajet.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelTrip = async (tripId) => {
        if (authLoading) return;
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/api/v1/trips/cancel/${tripId}`);
            toast.success('Trajet annulé avec succès !');
            return response.data;
        } catch (err) {
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de l\'annulation du trajet.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const listReservedTrips = async ({ pageIndex, status, reservationStatus }) => {
        if (authLoading) return;
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/v1/trips/list-by-reservation/${pageIndex}/${status}/${reservationStatus}`);
            const data = response.data;
            if (data && Array.isArray(data.items) && data.items.length > 0) {
                // Note : Vous pouvez choisir de ne pas mettre à jour l'état 'trips' ici
                // pour éviter de mélanger les trajets publiés et réservés.
                // Vous pouvez plutôt retourner les données pour un usage direct.
                toast.success('Trajets réservés chargés avec succès !');
            } else {
                toast.error('Aucun trajet réservé trouvé.');
            }
            return data;
        } catch (err) {
            setError(err);
            toast.error(err.response?.data?.message || 'Échec du chargement des trajets réservés.');
            throw err;
        } finally {
            setLoading(false);
        }
    };


    const contextValue = {
        trips,
        setTrips,
        loading,
        error,
        fetchTrips,
        getTripById,
        createTrip,
        listPublicTrips, 
        deleteTrip,
        deleteTripAsAdmin,
        changeTripStatusAsAdmin, 
        updateTrip,
        cancelTrip,
        listReservedTrips,
        userId: user?.id || null
    };

    return (
        <tripContext.Provider value={contextValue}>
            {children}
        </tripContext.Provider>
    );
}