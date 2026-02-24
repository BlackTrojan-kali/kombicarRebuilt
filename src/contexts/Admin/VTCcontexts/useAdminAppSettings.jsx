import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import api from '../../../api/api'; // Import de votre instance Axios centralisée

export const useAdminAppSettings = () => {
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // ==========================================
    // LECTURE : Récupérer la configuration globale
    // ==========================================
    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/v1/app-settings/admin-settings');
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
            // Envoi de la requête PUT (accepte un objet partiel)
            await api.put('/api/v1/app-settings/admin-settings', payload);
            
            // Mise à jour optimiste : on fusionne l'ancien état avec les champs modifiés
            // puisque l'API ignore les champs null ou manquants.
            setSettings(prev => ({
                ...prev,
                ...payload
            }));
            
            toast.success("Paramètres mis à jour avec succès !");
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