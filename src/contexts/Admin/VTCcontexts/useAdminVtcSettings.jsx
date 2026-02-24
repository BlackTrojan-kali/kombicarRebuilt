import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import api from '../../../api/api'; // Import de votre instance Axios

export const useAdminVtcSettings = () => {
    // État pour stocker la configuration globale
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // ==========================================
    // LECTURE : Récupérer la configuration actuelle
    // ==========================================
    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/v1/admin/vtc/settings');
            setSettings(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Impossible de charger les paramètres.";
            setError(errorMessage);
            toast.error("Erreur lors du chargement de la configuration.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ==========================================
    // MISE À JOUR : Sauvegarder la nouvelle configuration
    // ==========================================
    const updateSettings = useCallback(async (payload) => {
        setIsLoading(true);
        setError(null);
        try {
            // L'API attend l'objet complet en corps de requête
            await api.put('/api/v1/admin/vtc/settings', payload);
            
            // Mise à jour locale pour éviter un rechargement réseau inutile
            setSettings(payload);
            toast.success("Configuration VTC mise à jour avec succès !");
            
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Échec de la sauvegarde.";
            setError(errorMessage);
            toast.error("Impossible de mettre à jour les paramètres.");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        settings,
        isLoading,
        error,
        fetchSettings,
        updateSettings
    };
};