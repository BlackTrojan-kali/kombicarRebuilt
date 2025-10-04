import { createContext, useEffect, useState } from "react";
import api from '../api/api';
import { toast } from "sonner";
import { Toaster } from "../Components/ui/sonner"
import "../App.css"
// L'import de API_URL depuis '../api/api-settings' a été commenté/retiré 
// et défini localement pour correspondre à votre code précédent.

export const authContext = createContext({});

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // NOUVEL ÉTAT : Pays détecté pour les utilisateurs non authentifiés
    const [defaultCountry, setDefaultCountry] = useState(null); 
    
    // Utilisation de l'URL que vous avez définie localement
    const API_URL = "https://test.kombicar.api"

    const logout = async (showToast = true) => {
        setLoading(true);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setLoading(false);
        // Tenter de redéterminer le pays par défaut après la déconnexion
        fetchDefaultCountry(); 
        if (showToast) {
            toast.success('Déconnexion réussie');
        }
    };

    /**
     * Tente d'obtenir la géolocalisation de l'utilisateur et d'appeler l'API
     * pour déterminer le pays par défaut (pour les utilisateurs non connectés).
     */
    const fetchDefaultCountry = async () => {
        // Si un utilisateur est déjà connecté (vérification du token), on ne fait rien.
        if (localStorage.getItem('accessToken')) {
            return;
        }

        const getCoords = new Promise((resolve, reject) => {
            if (!("geolocation" in navigator)) {
                reject(new Error("Géolocalisation non supportée."));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => reject(err),
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
            );
        });

        try {
            // 1. Obtenir les coordonnées GPS
            const coords = await getCoords;
            
            // 2. Appeler l'API /get-country
            const response = await api.post('/api/v1/maps/get-country', {
                latitude: coords.lat,
                longitude: coords.lng
            });
            
            // 3. Stocker le pays par défaut
            setDefaultCountry(response.data);
            toast.info(`Pays détecté : ${response.data.countryName || 'Inconnu'}`, { duration: 1500 });

        } catch (err) {
            // En cas d'échec (refus de permission, timeout, ou erreur API), utiliser le pays par défaut
            console.warn("Échec de la géolocalisation ou de l'API get-country:", err.message || err);
            setDefaultCountry({ countryCode: 237, countryName: "Cameroun (Par défaut)" }); 
        }
    };

    const fetchUserInfo = async () => {
        try {
            const response = await api.get('/api/v1/users/infos');
            const fullUserInfo = response.data;
            // Logique de rôle corrigée : 'User' par défaut si ce n'est pas 1 ou 2
            const roleName = fullUserInfo.role === 1 || fullUserInfo.role === 2 ? 'Admin' : 'User';
         
            setUser({
                id: fullUserInfo.id,
                email: fullUserInfo.email,
                username: fullUserInfo.email,
                firstName: fullUserInfo.firstName,
                lastName: fullUserInfo.lastName,
                country: fullUserInfo.country, // Pays de l'utilisateur AUTHENTIFIÉ
                role: roleName,
                phoneNumber: fullUserInfo.phoneNumber,
                pictureProfileUrl: fullUserInfo.pictureProfileUrl,
                balance: fullUserInfo.balance,
                note: fullUserInfo.note,
                createdAt: fullUserInfo.createdAt
            });
            // Si un utilisateur se connecte, effacer le pays par défaut temporaire
            setDefaultCountry(null); 
            return true;
        } catch (error) {
            console.error("Échec de la récupération des informations utilisateur:", error);
            if (error.response && error.response.status === 401) {
                logout(false);
            }
            return false;
        }
    };

    const checkAuthStatus = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken) {
            const userInfoSuccess = await fetchUserInfo();
            if (!userInfoSuccess && refreshToken) {
                try {
                    const response = await api.post('/api/v1/users/refresh-token', { refreshToken });
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                    await fetchUserInfo();
                } catch (error) {
                    console.error("Échec du rafraîchissement des tokens:", error);
                    logout(false);
                }
            }
        } else {
            // Si pas connecté, tente de trouver le pays par défaut
            await fetchDefaultCountry();
        }
        setLoading(false);
    };

    const register = async ({ email, password, firstName, lastName, phoneNumber, country }) => {
        setLoading(true);
        try {
            await api.post('/api/v1/users/register', { email, password, firstName, lastName, phoneNumber, country });
            toast.success('Inscription réussie !');
            toast('Veuillez vérifier votre email pour confirmer votre compte.', { icon: '📧' });
            return true;
        } catch (error) {
            console.error("Échec de l'inscription:", error);
            toast.error(error.response?.data?.message || 'Échec de l\'inscription.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const login = async ({ email, password }) => {
        setLoading(true);
        try {
            const response = await api.post('/api/v1/users/login', { email, password });
            const { token, refreshToken } = response.data;
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refreshToken);
            await fetchUserInfo();
            toast.success('Connexion réussie !');
           
        } catch (error) {
            console.error("Échec de la connexion:", error);
            toast.error(error.response?.data || 'Identifiants invalides.');
           
        } finally {
            setLoading(false);
        }
    };

    const loginAdmin = async ({ email, password }) => {
        setLoading(true);
        try {
            const response = await api.post('/api/v1/users/login-admin', { email, password });
            toast.success(response.data || 'Code de confirmation envoyé. Veuillez vérifier votre email.');
            return { success: true, twoFactorRequired: true };
        } catch (error) {
            console.error("Échec de la connexion Administrateur:", error);
            toast.error(error.response?.data || 'Accès refusé ou identifiants invalides.');
            return { success: false, twoFactorRequired: false };
        } finally {
            setLoading(false);
        }
    };
    
    const loginAdminConfirmCode = async ({ email, password, code, rememberMe = false }) => {
        setLoading(true);
        try {
            const response = await api.post('/api/v1/users/login-admin-confirm-code', { email, password, code, rememberMe });
            const { token, refreshToken } = response.data;
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refreshToken);
            await fetchUserInfo();
            toast.success('Code confirmé. Connexion Administrateur réussie !');
            return true;
        } catch (error) {
            console.error("Échec de la confirmation du code Admin:", error);
            toast.error(error.response?.data?.message || 'Code invalide ou expiré.');
            return false;
        } finally {
            setLoading(false);
        }
    };
    
    const confirmEmail = async (userId, token) => {
        setLoading(true);
        try {
            const response = await api.post(`/api/v1/users/confirm-email/${userId}/${token}`);
            toast.success(response.data.message || 'Votre adresse e-mail a été confirmée avec succès !');
            return true;
        } catch (error) {
            console.error("Échec de la confirmation d'e-mail:", error);
            toast.error(error.response?.data?.message || 'Le lien est peut-être invalide ou a expiré.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resendConfirmationEmail = async (email) => {
        setLoading(true);
        try {
            const response = await api.post('/api/v1/users/resend-confirmation-email', { email });
            toast.success(response.data.message || 'Un nouvel e-mail de confirmation a été envoyé.');
            return true;
        } catch (error) {
            console.error("Échec du renvoi d'e-mail:", error);
            toast.error(error.response?.data?.message || 'Échec du renvoi. Veuillez vérifier votre adresse.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        setLoading(true);
        try {
            const response = await api.post('/api/users/forgot-password', { email });
            toast.success(response.data.message || 'Un lien de réinitialisation de mot de passe a été envoyé.');
            return true;
        } catch (error) {
            console.error("Échec de la demande de réinitialisation:", error);
            toast.error(error.response?.data?.message || 'Échec de la demande. Veuillez vérifier votre adresse e-mail.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (token, newPassword) => {
        setLoading(true);
        try {
            const response = await api.post('/api/users/reset-password', { token, newPassword });
            toast.success(response.data.message || 'Votre mot de passe a été réinitialisé avec succès !');
            return true;
        } catch (error) {
            console.error("Échec de la réinitialisation du mot de passe:", error);
            toast.error(error.response?.data?.message || 'Échec de la réinitialisation. Le lien est peut-être invalide ou a expiré.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const externalLoginGoogle = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/users/external-login/google');
            if (response.data && response.data.redirectUrl) {
                window.location.href = response.data.redirectUrl;
            } else {
                toast('Redirection vers Google en cours...');
            }
            return true;
        } catch (error) {
            console.error("Échec de la connexion externe Google:", error);
            toast.error(error.response?.data?.message || 'Échec de la connexion via Google.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const loginGoogle = async (tokeninfo) => {
        setLoading(true);
        try {
            const response = await api.post('/api/v1/users/login-google', {token:tokeninfo} );
            const { token, refreshToken } = response.data;
            if (token && refreshToken) {
                localStorage.setItem('accessToken', token);
                localStorage.setItem('refreshToken', refreshToken);
                await fetchUserInfo();
                toast.success('Connexion Google réussie !');
                return true;
            }
        } catch (error) {
            console.error("Échec de la connexion/inscription via Google:", error);
            toast.error(error.response?.data?.message || 'Échec de la connexion/inscription via Google.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const uploadProfilePicture = async (file) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('pictureProfile', file);

            const response = await api.post('/api/v1/users/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newPictureUrl = response.data.pictureProfileUrl;
            setUser(prevUser => ({
                ...prevUser,
                pictureProfileUrl: newPictureUrl
            }));

            toast.success('Photo de profil mise à jour !');
            return true;
        } catch (error) {
            console.error("Échec du téléchargement de l'image:", error);
            toast.error(error.response?.data?.message || "Échec de l'importation de la photo.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const value = {
        user,
        setUser,
        loading,
        // Pays par défaut pour les utilisateurs non authentifiés
        defaultCountry, 
        fetchDefaultCountry,
        // Fonctions d'authentification
        fetchUserInfo,
        login,
        loginAdmin,
        loginAdminConfirmCode,
        register,
        logout,
        confirmEmail,
        resendConfirmationEmail,
        forgotPassword,
        resetPassword,
        externalLoginGoogle,
        loginGoogle,
        uploadProfilePicture,
        API_URL
    };

    return (
        <authContext.Provider value={value}>
           <Toaster/>
            {children}
        </authContext.Provider>
    );
}