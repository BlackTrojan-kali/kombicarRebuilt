import { createContext, useEffect, useState } from "react";
import api from '../api/api'; 
import toast from 'react-hot-toast'; 

export const authContext = createContext({});

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 

    // Fonction de déconnexion
    const logout = async (showToast = true) => { 
        setLoading(true);
        try {
            // Tentative de déconnexion côté serveur
            await api.post('/auth/logout'); 
            if (showToast) toast.success('Déconnexion réussie !');
        } catch (error) {
            console.error("Erreur lors de la déconnexion côté serveur (ignorée pour la déconnexion locale):", error);
            if (showToast) toast.error('Erreur lors de la déconnexion. Veuillez réessayer.');
        } finally {
            // Nettoyage local (essentiel)
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            console.log("Utilisateur déconnecté.");
            setLoading(false);
        }
    };

    // Nouvelle fonction pour récupérer les informations complètes de l'utilisateur
    const fetchUserInfo = async () => {
        try {
            const response = await api.get('/api/v1/users/infos');
            
            const fullUserInfo = response.data;
            console.log(fullUserInfo)
            // Logique pour déterminer le rôle à partir du numéro (0: Admin, 1: Client, autre: Chauffeur)
            const roleName = fullUserInfo.role === 0 ? 'Admin' : fullUserInfo.role === 1 ? 'Client' : 'Chauffeur';
            
            setUser({
                id: fullUserInfo.id,
                email: fullUserInfo.email,
                username: fullUserInfo.email, // Utilisation de l'email comme nom d'utilisateur par défaut
                firstName: fullUserInfo.firstName,
                lastName: fullUserInfo.lastName,
                country: fullUserInfo.country,
                role: roleName, 
                phoneNumber: fullUserInfo.phoneNumber,
                pictureProfileUrl: fullUserInfo.pictureProfileUrl,
                balance: fullUserInfo.balance,
                note: fullUserInfo.note
            });
            console.log("Informations utilisateur récupérées:", fullUserInfo);
            return true;
        } catch (error) {
            console.error("Échec de la récupération des informations utilisateur:", error);
            // Si l'API renvoie 401 (Non Autorisé), cela signifie que le token est invalide ou expiré.
            if (error.response && error.response.status === 401) {
                logout(false);
            }
            return false;
        }
    };

    // Vérifie l'état d'authentification (restauration de session)
    const checkAuthStatus = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken) {
            // 1. Tenter de récupérer les infos directement avec l'Access Token existant
            const userInfoSuccess = await fetchUserInfo();

            if (userInfoSuccess) {
                console.log("Utilisateur restauré via Access Token.");
            } else if (refreshToken) {
                // 2. Si l'Access Token a échoué (401), tenter le rafraîchissement via Refresh Token
                try {
                    const response = await api.post('/api/users/refresh-token', { refreshToken });
                    const { accessToken: token, refreshToken: newRefreshToken } = response.data;
                    
                    localStorage.setItem('accessToken', newAccessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);
                    
                    // Après avoir rafraîchi, réessayer de récupérer les infos complètes
                    await fetchUserInfo(); 
                    console.log("Tokens rafraîchis et utilisateur restauré.");
                } catch (error) {
                    console.error("Échec du rafraîchissement des tokens au démarrage:", error);
                    logout(false); 
                }
            } else {
                // 3. Aucun token valide ou rafraîchissement possible
                logout(false); 
            }
        }
        setLoading(false);
    };

    // Fonction de connexion utilisateur standard (inchangée)
    const login = async ({ email, password }) => {
        setLoading(true);
        try {
            const response = await api.post('/api/users/login', { email, password });
            const { accessToken, refreshToken } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            const loginSuccess = await fetchUserInfo();
            if (loginSuccess) {
                toast.success('Connexion réussie !');
                return true;
            } else {
                logout(false);
                return false;
            }
        } catch (error) {
            console.error("Échec de la connexion:", error);
            toast.error(error.response?.data?.message || 'Identifiants invalides.');
            setUser(null); 
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Connexion Administrateur (Étape 1 : Envoi des identifiants) (inchangée)
    const loginAdmin = async ({ email, password }) => {
        setLoading(true);
        try {
            const response = await api.post('/api/v1/users/login-admin', { email, password });

            const serverMessage = response.data || 'Code de confirmation envoyé. Veuillez vérifier votre email.';
            toast.success(serverMessage);

            return { success: true, twoFactorRequired: true };
            
        } catch (error) {
            console.error("Échec de la connexion Administrateur:", error);
            toast.error(error.response?.data || 'Accès refusé ou identifiants invalides.');
            setUser(null);
            return { success: false, twoFactorRequired: false };
        } finally {
            setLoading(false);
        }
    };
    
    // Connexion Administrateur (Étape 2 : Confirmation du code 2FA) (inchangée)
    const loginAdminConfirmCode = async ({ email, password, code, rememberMe = false }) => {
        setLoading(true);
        try {
            const response = await api.post('/api/v1/users/login-admin-confirm-code', { email, password, code, rememberMe });
           
            const {token, refreshToken } = response.data;
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refreshToken);

            const loginSuccess = await fetchUserInfo();
            if (loginSuccess) {
                toast.success('Code confirmé. Connexion Administrateur réussie !');
                return true;
            } else {
                logout(false);
                return false;
            }
        } catch (error) {
            console.error("Échec de la confirmation du code Admin:", error);
            toast.error(error.response?.data?.message || 'Code invalide ou expiré.');
            setUser(null);
            return false;
        } finally {
            setLoading(false);
        }
    };


    // Fonction d'inscription (inchangée)
    const register = async ({ email, password, firstName, lastName, country }) => {
        setLoading(true);
        try {
            const response = await api.post('/api/users/register', { email, password, firstName, lastName, country });
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
            setUser(null);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Fonctions de gestion de l'e-mail et du mot de passe (inchangées)
    const confirmEmail = async (token) => {
        setLoading(true);
        try {
            const response = await api.post('/api/users/confirm-email', { token });
            toast.success(response.data.message || 'Votre adresse e-mail a été confirmée avec succès !');
            return true;
        } catch (error) {
            console.error("Échec de la confirmation d'e-mail:", error);
            toast.error(error.response?.data?.message || 'Échec de la confirmation de l\'e-mail. Le lien est peut-être invalide ou expiré.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resendConfirmationEmail = async (email) => {
        setLoading(true);
        try {
            const response = await api.post('/api/users/resend-confirmation-email', { email });
            toast.success(response.data.message || 'Un nouvel e-mail de confirmation a été envoyé à votre adresse.');
            return true;
        } catch (error) {
            console.error("Échec du renvoi de l'e-mail de confirmation:", error);
            toast.error(error.response?.data?.message || 'Échec du renvoi de l\'e-mail de confirmation. Veuillez vérifier votre adresse ou réessayer plus tard.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        setLoading(true);
        try {
            const response = await api.post('/api/users/forgot-password', { email });
            toast.success(response.data.message || 'Un lien de réinitialisation de mot de passe a été envoyé à votre adresse e-mail.');
            return true;
        } catch (error) {
            console.error("Échec de la demande de réinitialisation de mot de passe:", error);
            toast.error(error.response?.data?.message || 'Échec de la demande de réinitialisation de mot de passe. Veuillez vérifier votre adresse e-mail.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (token, newPassword) => {
        setLoading(true);
        try {
            const response = await api.post('/api/users/reset-password', { token, newPassword });
            toast.success(response.data.message || 'Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.');
            return true;
        } catch (error) {
            console.error("Échec de la réinitialisation du mot de passe:", error);
            toast.error(error.response?.data?.message || 'Échec de la réinitialisation du mot de passe. Le lien est peut-être invalide ou expiré.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Connexion externe via Google (inchangée)
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

    // Appelle checkAuthStatus au montage du composant
    useEffect(() => {
        checkAuthStatus();
    }, []);
    // Le contexte fournit l'utilisateur et les fonctions
    return (
        <authContext.Provider 
            value={{ 
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
            }}
        >
            {children}
        </authContext.Provider>
    );
}