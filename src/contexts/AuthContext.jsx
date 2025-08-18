import { createContext, useEffect, useState } from "react";
import api from '../api/api'; // Importez l'instance Axios configurée
import toast from 'react-hot-toast'; // Pour les notifications

export const authContext = createContext({});

// Utilisateur fictif pour les tests et le développement
const dummyUser = {
    id: "dummy-user-123",
    email: "test@example.com",
    username: "UtilisateurTest",
    firstName: "Utilisateur",
    lastName: "Fictif",
    country: "Cameroun",
    profilePicture: "https://randomuser.me/api/portraits/men/7.jpg", // Ajouté
    memberSince: "Janvier 2023", // Ajouté
    bio: "Passionné de voyages et de nouvelles rencontres. Toujours prêt pour une aventure sur les routes du Cameroun. La sécurité et la convivialité sont mes priorités !", // Ajouté
    tripsCompleted: 35, // Ajouté
    rating: 4.9, // Ajouté
    phone: "+237 677 123 456" // Ajouté
};

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null); // L'utilisateur connecté, null si non connecté
    const [loading, setLoading] = useState(true); // État de chargement initial de l'authentification

    // Fonction pour décoder un JWT (simple, pour l'exemple)
    // En production, utilisez une bibliothèque comme 'jwt-decode' ou vérifiez côté serveur
    const decodeJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Erreur de décodage JWT:", error);
            return null;
        }
    };

    // Fonction pour vérifier l'état d'authentification au chargement de l'application
    const checkAuthStatus = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken) {
            const decodedToken = decodeJwt(accessToken);
            if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
                setUser({
                    id: decodedToken.sub,
                    email: decodedToken.email,
                    username: decodedToken.username || decodedToken.email,
                    // Assurez-vous que ces champs sont présents dans votre JWT ou ajustez
                    firstName: decodedToken.firstName,
                    lastName: decodedToken.lastName,
                    country: decodedToken.country,
                });
                console.log("Utilisateur restauré via Access Token.");
            } else if (refreshToken) {
                try {
                    const response = await api.post('/api/users/refresh-token', { refreshToken });
                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
                    localStorage.setItem('accessToken', newAccessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);
                    const newDecodedToken = decodeJwt(newAccessToken);
                    setUser({
                        id: newDecodedToken.sub,
                        email: newDecodedToken.email,
                        username: newDecodedToken.username || newDecodedToken.email,
                        firstName: newDecodedToken.firstName,
                        lastName: newDecodedToken.lastName,
                        country: newDecodedToken.country,
                    });
                    console.log("Tokens rafraîchis et utilisateur restauré.");
                } catch (error) {
                    console.error("Échec du rafraîchissement des tokens au démarrage:", error);
                    logout(false); // Déconnecte l'utilisateur si le rafraîchissement échoue, sans toast
                }
            } else {
                logout(false); // Pas de tokens valides, déconnecte sans toast
            }
        } else {
            // Si aucun token n'est trouvé, utilise l'utilisateur fictif pour le développement
            // Commenter cette ligne en production si vous ne voulez pas d'utilisateur par défaut
            setUser(dummyUser);
            console.log("Aucun token trouvé. Utilisateur fictif chargé pour le développement.");
        }
        setLoading(false);
    };

    // Appelle checkAuthStatus au montage du composant
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Fonction de connexion
    const login = async ({ email, password }) => {
        setLoading(true);
        try {
            const response = await api.post('/api/users/login', { email, password });
            const { accessToken, refreshToken } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            const decodedToken = decodeJwt(accessToken);
            setUser({
                id: decodedToken.sub,
                email: decodedToken.email,
                username: decodedToken.username || decodedToken.email,
                firstName: decodedToken.firstName,
                lastName: decodedToken.lastName,
                country: decodedToken.country,
            });
            toast.success('Connexion réussie !');
            console.log("Utilisateur connecté:", decodedToken.email);
            return true;
        } catch (error) {
            console.error("Échec de la connexion:", error);
            toast.error(error.response?.data?.message || 'Identifiants invalides.');
            setUser(null); // Assurez-vous que l'utilisateur est null en cas d'échec
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Fonction d'inscription
    const register = async ({ email, password, firstName, lastName, country }) => {
        setLoading(true);
        try {
            const response = await api.post('/api/users/register', { email, password, firstName, lastName, country });
            const { accessToken, refreshToken } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            const decodedToken = decodeJwt(accessToken);
            setUser({
                id: decodedToken.sub,
                email: decodedToken.email,
                username: decodedToken.username || decodedToken.email,
                firstName: decodedToken.firstName,
                lastName: decodedToken.lastName,
                country: decodedToken.country,
            });
            toast.success('Inscription réussie et connexion automatique !');
            console.log("Utilisateur enregistré et connecté:", decodedToken.email);
            return true;
        } catch (error) {
            console.error("Échec de l'inscription:", error);
            toast.error(error.response?.data?.message || 'Échec de l\'inscription.');
            setUser(null);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Fonction de confirmation d'e-mail
    const confirmEmail = async (token) => {
        setLoading(true);
        try {
            const response = await api.post('/api/users/confirm-email', { token });
            toast.success(response.data.message || 'Votre adresse e-mail a été confirmée avec succès !');
            console.log("Confirmation d'e-mail réussie:", response.data);
            return true;
        } catch (error) {
            console.error("Échec de la confirmation d'e-mail:", error);
            toast.error(error.response?.data?.message || 'Échec de la confirmation de l\'e-mail. Le lien est peut-être invalide ou expiré.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Fonction de renvoi d'e-mail de confirmation
    const resendConfirmationEmail = async (email) => {
        setLoading(true);
        try {
            const response = await api.post('/api/users/resend-confirmation-email', { email });
            toast.success(response.data.message || 'Un nouvel e-mail de confirmation a été envoyé à votre adresse.');
            console.log("E-mail de confirmation renvoyé:", response.data);
            return true;
        } catch (error) {
            console.error("Échec du renvoi de l'e-mail de confirmation:", error);
            toast.error(error.response?.data?.message || 'Échec du renvoi de l\'e-mail de confirmation. Veuillez vérifier votre adresse ou réessayer plus tard.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Fonction de réinitialisation de mot de passe (demande)
    const forgotPassword = async (email) => {
        setLoading(true);
        try {
            const response = await api.post('/api/users/forgot-password', { email });
            toast.success(response.data.message || 'Un lien de réinitialisation de mot de passe a été envoyé à votre adresse e-mail.');
            console.log("Demande de réinitialisation de mot de passe envoyée:", response.data);
            return true;
        } catch (error) {
            console.error("Échec de la demande de réinitialisation de mot de passe:", error);
            toast.error(error.response?.data?.message || 'Échec de la demande de réinitialisation de mot de passe. Veuillez vérifier votre adresse e-mail.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Fonction de réinitialisation du mot de passe (confirmation)
    const resetPassword = async (token, newPassword) => {
        setLoading(true);
        try {
            const response = await api.post('/api/users/reset-password', { token, newPassword });
            toast.success(response.data.message || 'Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.');
            console.log("Réinitialisation du mot de passe réussie:", response.data);
            return true;
        } catch (error) {
            console.error("Échec de la réinitialisation du mot de passe:", error);
            toast.error(error.response?.data?.message || 'Échec de la réinitialisation du mot de passe. Le lien est peut-être invalide ou expiré.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Fonction de connexion externe via Google
    const externalLoginGoogle = async () => {
        setLoading(true);
        try {
            // Votre backend C# devrait rediriger vers l'URL d'authentification de Google
            // et ensuite gérer le callback.
            // La réponse de cette requête GET sera une redirection.
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

    // Fonction de déconnexion
    const logout = async (showToast = true) => { // Ajout d'un paramètre pour contrôler le toast
        setLoading(true);
        try {
            await api.post('/auth/logout');
            if (showToast) toast.success('Déconnexion réussie !');
        } catch (error) {
            console.error("Erreur lors de la déconnexion côté serveur:", error);
            if (showToast) toast.error('Erreur lors de la déconnexion. Veuillez réessayer.');
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            console.log("Utilisateur déconnecté.");
            setLoading(false);
        }
    };

    // Le contexte fournit l'utilisateur, les fonctions d'authentification et l'état de chargement
    return (
        <authContext.Provider value={{ user, loading, login, register, logout, confirmEmail, resendConfirmationEmail, forgotPassword, resetPassword, externalLoginGoogle }}>
            {children}
        </authContext.Provider>
    );
}
