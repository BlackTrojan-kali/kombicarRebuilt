import { createContext, useContext, useMemo } from "react";
import api from "../api/api";

export const SuggestTripContext = createContext(null);

export function SuggestTripContextProvider({ children }) {
    
    const postSuggestion = async (payload) => {
        try {
            const res = await api.post(`/api/v1/trip-suggestions`, payload);
            return res;
        } catch (err) {
            console.error("Erreur lors de l'ajout:", err);
            throw err; // Permet au composant de gérer l'erreur (ex: afficher une alerte)
        }
    };

    const updateSuggestion = async (payload) => {
        try {
            const res = await api.put(`/api/v1/trip-suggestions`, payload);
            return res.data;
        } catch (err) {
            console.error("Erreur lors de la modification:", err);
            throw err;
        }
    };

    const deleteSuggestion = async (idSug) => {
        try {
            // Correction ici : ajout du $ pour l'interpolation de variable
            const res = await api.delete(`/api/v1/trip-suggestions/${idSug}`);
            return res.data;
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
            throw err;
        }
    };

    const getSugById = async (idSug) => {
        try {
            const res = await api.get(`/api/v1/trip-suggestions/details/${idSug}`);
            return res.data;
        } catch (err) {
            console.error("Erreur lors de la récupération du détail:", err);
        }
    };

    const getSuggestions = async (page = 0) => {
        try {
            const res = await api.get(`/api/v1/trip-suggestions/list/${page}`);
            return res.data;
        } catch (err) {
            console.error("Erreur lors de la récupération de la liste:", err);
        }
    };

    // Utilisation de useMemo pour éviter des re-rendus inutiles des composants consommateurs
    const value = useMemo(() => ({
        getSugById,
        getSuggestions,
        postSuggestion,
        updateSuggestion,
        deleteSuggestion
    }), []);

    return (
        <SuggestTripContext.Provider value={value}>
            {children}
        </SuggestTripContext.Provider>
    );
}

export function useSuggestTrip() {
    const context = useContext(SuggestTripContext);
    if (!context) {
        throw new Error("useSuggestTrip doit être utilisé à l'intérieur de SuggestTripContextProvider");
    }
    return context;
}