import { createContext, useEffect, useState } from "react";
import api from '../api/api'; 
import toast from 'react-hot-toast'; 

export const authContext = createContext({});

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 

    const logout = async (showToast = true) => { 
        setLoading(true);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setLoading(false);
    };

    const fetchUserInfo = async () => {
        try {
            const response = await api.get('/api/v1/users/infos');
            const fullUserInfo = response.data;
    
            const roleName = fullUserInfo.role === 0 ? 'Admin' : fullUserInfo.role === 1 ? 'Client' : 'Admin';
            
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
                note: fullUserInfo.note
            });
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
                    const response = await api.post('/api/users/refresh-token', { refreshToken });
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                    await fetchUserInfo(); 
                } catch (error) {
                    console.error("Échec du rafraîchissement des tokens:", error);
                    logout(false); 
                }
            }
        }
        setLoading(false);
    };

    const register = async ({ email, password, firstName, lastName, phoneNumber, country }) => {
        setLoading(true);
        try {
            const response = await api.post('/api/v1/users/register', { email, password, firstName, lastName, phoneNumber, country });
            const { accessToken, refreshToken } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            
            const loginSuccess = await fetchUserInfo();
            if (loginSuccess) {
                toast.success('Inscription réussie et connexion automatique !');
                return true;
            } else {
                logout(false);
                return false;
            }
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
            return true;
        } catch (error) {
            console.error("Échec de la connexion:", error);
            toast.error(error.response?.data || 'Identifiants invalides.');
            return false;
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
    
    // Modification pour accepter userId et token dans l'URL
    const confirmEmail = async (userId, token) => {
        setLoading(true);
        try {
            // Requête POST vers la nouvelle URL avec les paramètres de chemin
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
            toast.error(error.response?.data?.message || 'Échec de la réinitialisation. Le lien est peut-être invalide ou expiré.');
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

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const value = {
        user, 
        loading, 
        login, 
        loginAdmin, 
        loginAdminConfirmCode, 
        register, 
        logout, 
        confirmEmail, 
        resendConfirmationEmail, 
        forgotPassword, 
        resetPassword, 
        externalLoginGoogle 
    };

    return (
        <authContext.Provider value={value}>
            {children}
        </authContext.Provider>
    );
}