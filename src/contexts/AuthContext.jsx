import { createContext, useEffect, useState } from "react";
import api from '../api/api';
import { toast } from "sonner";
import { Toaster } from "../Components/ui/sonner"
import "../App.css"
import { API_URL } from "../api/api-settings"; 

// ###################################################
// MAPING DES CODES PAYS (AJOUTÉ)
// ###################################################

const COUNTRY_CODE_TO_NAME = {
    237: 'Cameroun', 
    225: "Côte d'Ivoire", 
    221: 'Sénégal', 
    243: 'République Démocratique du Congo', 
    223: 'Mali', 
    229: 'Bénin', 
    228: 'Togo', 
    224: 'Guinée', 
    226: 'Burkina Faso', 
    0: 'Autres / International',
};

/** Convertit un code de pays numérique en nom. */
const getCountryName = (countryCode) => {
    return COUNTRY_CODE_TO_NAME[countryCode] || 'Pays Inconnu';
};

export const authContext = createContext({});

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [defaultCountry, setDefaultCountry] = useState(); 

    // ###################################################
    // FONCTIONS UTILITAIRES
    // ###################################################
    
    /** Détermine le nom du rôle à partir du code numérique. */
    const getRoleName = (roleCode) => {
        if (roleCode === 3) return 'Admin';
        if (roleCode === 2) return 'Admin';
        if (roleCode === 1) return 'DRIVER'; 
        return 'USER';
    };

    /**
     * Tente de rafraîchir le token en utilisant le endpoint ADMIN.
     * POST /api/v1/users/refresh-token-admin
     */
    const refreshAdminToken = async (refreshToken) => {
        try {
            // Le corps de la requête est { refreshToken: "..." }
            const response = await api.post('/api/v1/users/refresh-token-admin', { refreshToken });
            localStorage.setItem('accessToken', response.data.token);
        
            localStorage.setItem('refreshToken', response.data.refreshToken);
            return true;
        } catch (error) {
            console.error("Échec du rafraîchissement des tokens Admin:", error);
            return false;
        }
    };
    
    /**
     * Tente de rafraîchir le token en utilisant le endpoint standard.
     * POST /api/v1/users/refresh-token
     */
    const refreshUserToken = async (refreshToken) => {
        try {
            const response = await api.post('/api/v1/users/refresh-token', { refreshToken });
            localStorage.setItem('accessToken', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            return true;
        } catch (error) {
            console.error("Échec du rafraîchissement des tokens User:", error);
            return false;
        }
    };

    // ###################################################
    // LOGIQUE DE GÉOLOCALISATION ET PAYS PAR DÉFAUT (CORRIGÉE)
    // ###################################################

    const fetchDefaultCountry = async () => {
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
            const coords = await getCoords;
            const response = await api.post('/api/v1/maps/get-country', {
                latitude: coords.lat,
                longitude: coords.lng
            });
            
            // 🚨 CORRECTION : response.data contient uniquement le code (nombre)
            const countryCode = response.data; 
            const countryName = getCountryName(countryCode); // Utilisation du mapping
            
            const detectedCountry = {
                countryCode: countryCode,
                countryName: countryName 
            };
            
            setDefaultCountry(detectedCountry);
            toast.info(`Pays détecté : ${countryName}`, { duration: 1500 });

        } catch (err) {
            console.warn("Échec de la géolocalisation ou de l'API get-country:", err.message || err);
            
            // Pays par défaut : Cameroun (237)
            const defaultCountryValue = { countryCode: 237, countryName: getCountryName(237) }; 
            
            setDefaultCountry(defaultCountryValue); 
            toast.info(`Pays par défaut : ${defaultCountryValue.countryName}`, { duration: 1500 });
        }
    };

    // ###################################################
    // LOGIQUE DE DÉCONNEXION ET INFORMATIONS UTILISATEUR
    // ###################################################

    const logout = async (showToast = true) => {
        setLoading(true);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setLoading(false);
        fetchDefaultCountry(); 
        if (showToast) {
            toast.success('Déconnexion réussie');
        }
    };

    const fetchUserInfo = async () => {
        try {
            const response = await api.get('/api/v1/users/infos');
            const fullUserInfo = response.data;
            
            const roleName = getRoleName(fullUserInfo.role);
        
            setUser({
                id: fullUserInfo.id,
                email: fullUserInfo.email,
                username: fullUserInfo.email,
                firstName: fullUserInfo.firstName,
                lastName: fullUserInfo.lastName,
                country: fullUserInfo.country, 
                role: roleName,
                phoneNumber: fullUserInfo.phoneNumber,
                pictureProfileUrl: fullUserInfo.pictureProfileUrl,
                balance: fullUserInfo.balance,
                note: fullUserInfo.note,
                createdAt: fullUserInfo.createdAt,
                // Utilisation de la propriété adminAccesCountry pour la sidebar
                adminAccesCountry:fullUserInfo.adminAccessCounrty, 
            });
            
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
            let userInfoSuccess = await fetchUserInfo();
            
            if (!userInfoSuccess && refreshToken) {
                let refreshSuccess = false;

                // 1. Tenter de rafraîchir en tant qu'administrateur
                refreshSuccess = await refreshAdminToken(refreshToken);

                // 2. Si échec, tenter de rafraîchir en tant qu'utilisateur standard
                if (!refreshSuccess) {
                    refreshSuccess = await refreshUserToken(refreshToken);
                }

                if (refreshSuccess) {
                    // Si le rafraîchissement a réussi, on re-fetch les infos
                    await fetchUserInfo();
                } else {
                    // Si les deux tentatives échouent, on déconnecte
                    logout(false);
                }
            }
        } else {
            // Si pas connecté, tente de trouver le pays par défaut
            await fetchDefaultCountry();
        }
        setLoading(false);
    };

    // ###################################################
    // FONCTIONS D'AUTHENTIFICATION STANDARDS
    // ###################################################

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

    // ###################################################
    // EFFET INITIAL
    // ###################################################

    useEffect(() => {
        checkAuthStatus();
    }, []);

    // ###################################################
    // VALEUR DU CONTEXTE EXPORTÉE
    // ###################################################

    const value = {
        user,
        setUser,
        loading,
        defaultCountry, 
        fetchDefaultCountry,
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
        refreshAdminToken,
        refreshUserToken,
        API_URL
    };

    return (
        <authContext.Provider value={value}>
           <Toaster/>
            {children}
        </authContext.Provider>
    );
}