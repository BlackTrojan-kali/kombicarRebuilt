import { createContext, useState } from "react";
import api from "../../api/api";
import { toast } from "sonner";

export const StatsContext = createContext({});

export function StatsContextProvider({ children }) {
    // Seul l'état 'carpoolingStats' est conservé

    const [carpoolingStats, setCarpoolingStats] = useState({ 
        totalsTripsCount: 0, 
        todayTripsCount: 0, 
        totalRevenues: 0 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // La fonction pour récupérer les statistiques mensuelles du covoiturage est conservée
    const getCarpoolingMonthlyStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/v1/carpooling-stats/monthly-info');
            console.log(response)
            setCarpoolingStats(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Échec de la récupération des statistiques mensuelles de covoiturage.';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error("Erreur lors de la récupération des statistiques de covoiturage:", err);
        } finally {
            setLoading(false);
        }
    };

    const contextValue = {
        carpoolingStats,
        loading,
        error,
        getCarpoolingMonthlyStats,
    };

    return (
        <StatsContext.Provider value={contextValue}>
            {children}
        </StatsContext.Provider>
    );
}