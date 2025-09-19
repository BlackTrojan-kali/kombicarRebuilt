import axios from 'axios';
import { API_URL } from './api-settings';

// URL de base de votre API C#
// Assurez-vous que cette URL est correcte pour votre backend
const API_BASE_URL = `${API_URL}/`; // Exemple: ajustez le port et le chemin

// Crée une instance Axios personnalisée
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Variable pour suivre si une requête de rafraîchissement est déjà en cours
let isRefreshing = false;
// Tableau pour stocker les requêtes en attente pendant le rafraîchissement du token
let failedQueue = [];

// Fonction pour traiter les requêtes en attente
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// --- Intercepteur de Requête ---
// Ajoute le token JWT à l'en-tête 'Authorization' de chaque requête sortante
api.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem('accessToken'); // Récupère le token d'accès
    
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
         
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// --- Intercepteur de Réponse ---
// Gère les erreurs de token expiré (401) et tente de rafraîchir le token
api.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        // Si l'erreur est 401 (Non autorisé) et que ce n'est pas une tentative de rafraîchissement
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Marque la requête comme ayant déjà été retentée

            // Si aucune requête de rafraîchissement n'est en cours, lancez-en une
            if (!isRefreshing) {
                isRefreshing = true;
                const refreshToken = localStorage.getItem('refreshToken'); // Récupère le refresh token

                if (!refreshToken) {
                    // Pas de refresh token, redirige vers la page de connexion
                    console.error("Refresh token non trouvé, redirection vers la connexion.");
                    // window.location.href = '/login'; // Ajustez votre route de connexion
                    return Promise.reject(error);
                }

                try {
                    // Appel à l'API de rafraîchissement du token
                    // Assurez-vous que votre backend C# a un endpoint pour cela (ex: /api/v1/users/refresh-token)
                    const response = await axios.post(`${API_BASE_URL}/v1/users/refresh-token`, { refreshToken });
                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    // Met à jour les tokens dans le localStorage
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    // Met à jour l'en-tête de la requête originale avec le nouveau token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    // Traite toutes les requêtes en attente avec le nouveau token
                    processQueue(null, accessToken);

                    return api(originalRequest); // Ré-exécute la requête originale
                } catch (refreshError) {
                    // Échec du rafraîchissement du token, redirige vers la page de connexion
                    console.error("Échec du rafraîchissement du token:", refreshError);
                    processQueue(refreshError, null); // Rejette toutes les requêtes en attente
                    // window.location.href = '/login'; // Ajustez votre route de connexion
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // Si une requête de rafraîchissement est déjà en cours, mettez la requête originale en file d'attente
            return new Promise(function(resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
            .then(token => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            })
            .catch(err => {
                return Promise.reject(err);
            });
        }

        // Pour toute autre erreur (y compris 401 si le rafraîchissement a échoué ou n'est pas applicable)
        return Promise.reject(error);
    }
);

export default api;
