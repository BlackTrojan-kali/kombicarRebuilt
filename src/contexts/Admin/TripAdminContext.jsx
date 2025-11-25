import { createContext, useState, useContext } from "react";
import api from '../../api/api';
import useAuth from "../../hooks/useAuth";
import { toast } from "sonner";


// Renommage du contexte
export const TripAdminContext = createContext({});

// Renommage du fournisseur et suppression de toutes les fonctions et logiques d'état spécifiques aux voyages
export function TripAdminContextProvider({ children }) {
    // Récupération des données d'authentification et du pays par défaut
    const { user, loading: authLoading, defaultCountry } = useAuth();
    
    // États de base
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
 
const listAdminTrips = async (searchCriteria = {}) => {
        setLoading(true);
        setError(null);
        
        let criteriaToSend = searchCriteria;
        
        // Déterminer si searchCriteria est "vide" ou sans pays
        const isSearchCriteriaEmpty = Object.keys(searchCriteria).length === 0 || 
                                     (Object.keys(searchCriteria).length === 1 && searchCriteria.pageIndex !== undefined) ||
                                     !searchCriteria.country;
        
        if (isSearchCriteriaEmpty && defaultCountry) {
            criteriaToSend = { 
                ...searchCriteria, 
                country: defaultCountry
            };
            console.log("Utilisation du pays par défaut pour la recherche publique:", defaultCountry);
        }

        try {
            const response = await api.post('/api/v1/trips/list-public', criteriaToSend);
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
            toast.error(err.response?.data?.message || 'Échec de la recherche des trajets publics.');
            throw err;
        } finally {
            setLoading(false);
        }
    };
    // 1. PUT /api/v1/trips/admin/change-status/{tripId}/{status}
    const changeTripStatusAsAdmin = async (tripId, status) => {
        if (authLoading) return;
        setLoading(true);
        setError(null);
        try {
            const url = `/api/v1/trips/admin/change-status/${tripId}/${status}`; 
            const response = await api.put(url);
            toast.success('Le statut du trajet a été mis à jour avec succès par l\'administrateur.');
            return response.data;
        } catch (err) {
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la mise à jour du statut du trajet par l\'administrateur.');
            throw err;
        } finally {
            setLoading(false);
        }
    };
    
    // 2. DELETE /api/v1/trips/admin/{tripId}
    const deleteTripAsAdmin = async (tripId) => {
        if (authLoading) return;
        setLoading(true);
        setError(null);
        
        try {
            await api.delete(`/api/v1/trips/admin/${tripId}`);
            toast.success('Le trajet a été supprimé par l\'administrateur.');
            return true;
        } catch (err) {
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la suppression du trajet par l\'administrateur.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 3. NOUVELLE FONCTION AJOUTÉE : GET /api/v1/trips/admin/list-trips-infos/{tripId}
    const getTripInfosAsAdmin = async (tripId) => {
        if (authLoading) return;
        setLoading(true);
        setError(null);
        try {
            const url = `/api/v1/trips/admin/list-trips-infos/${tripId}`; 
            const response = await api.get(url);
            toast.success('Informations détaillées du trajet chargées.');
            return response.data;
        } catch (err) {
            setError(err);
            toast.error(err.response?.data?.message || 'Échec du chargement des informations détaillées du trajet pour l\'administration.');
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
        listAdminTrips,
        // Fonctions API 
        changeTripStatusAsAdmin,
        deleteTripAsAdmin,
        getTripInfosAsAdmin, // <-- Ajout de la dernière fonction
        
        // Données utilisateur
        userId: user?.id || null,
        authLoading,
        defaultCountry
    };

    return (
        <TripAdminContext.Provider value={contextValue}>
            {children}
        </TripAdminContext.Provider>
    );
}

// NOTE: Le hook d'utilisation est généralement exporté pour la consommation
export const useTripAdmin = () => {
    return useContext(TripAdminContext);
}