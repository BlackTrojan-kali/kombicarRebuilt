// src/config/api.ts
import axios from 'axios';

// 1. Création de l'instance avec l'URL dynamique
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Tu peux définir un timeout pour éviter que l'appli ne tourne dans le vide si le réseau est lent
  timeout: 10000, 
});

// 2. Intercepteur de requêtes (Request Interceptor)
api.interceptors.request.use(
  (config) => {
    // Récupération dynamique du token (ex: depuis le localStorage ou un store)
    const token = localStorage.getItem('kombicar_token');
    
    // Si un token existe, on l'injecte dans le header Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Intercepteur de réponses (Response Interceptor)
api.interceptors.response.use(
  (response) => {
    // Si la requête réussit, on renvoie directement les données
    return response;
  },
  (error) => {
    // Gestion globale des erreurs
    if (error.response) {
      // Si le backend renvoie une erreur 401 (Non autorisé)
      if (error.response.status === 401) {
        console.error("Session expirée ou non valide. Déconnexion requise.");
        // Ici, tu pourras déclencher une déconnexion de l'utilisateur
        // localStorage.removeItem('kombicar_token');
        // window.location.href = '/login';
      }
      
      // Si le backend renvoie une erreur 403 (Accès refusé)
      if (error.response.status === 403) {
        console.error("Vous n'avez pas les droits pour effectuer cette action.");
      }
    } else if (error.request) {
      // Si la requête a été faite mais aucune réponse n'a été reçue (problème réseau)
      console.error("Impossible de joindre le serveur. Vérifiez votre connexion internet.");
    }
    
    return Promise.reject(error);
  }
);

export default api;