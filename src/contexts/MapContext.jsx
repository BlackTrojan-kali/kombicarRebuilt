import { createContext, useState } from "react";
import api from '../api/api';

export const MapContext = createContext({});

export function MapContextProvider({ children }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Nouveau state pour stocker le pays de l'utilisateur
  const [userCountry, setUserCountry] = useState(null); 

  /**
   * Effectue une recherche de lieux via une requête POST.
   * @param {string} query - La requête de recherche (ex: "restaurants").
   * @param {number} [country=237] - Le code numérique du pays. Par défaut, 237 (Cameroun).
   */
  const searchPlaces = async (query, country = 237) => {
    if (!query) {
      console.error("Le paramètre 'query' (string) est requis.");
      setError("Le paramètre de recherche est manquant.");
      return;
    }

    setLoading(true); 
    setPlaces([]); // Suggestion: réinitialiser les lieux pour éviter de voir les anciens pendant le chargement
    setError(null);
    try {
      const response = await api.post(
        `/api/v1/maps/search-places`,
        { query, country }
      );
      
      setPlaces(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Erreur du serveur lors de la recherche.");
      } else if (err.request) {
        setError("Problème de connexion. Veuillez vérifier votre réseau.");
      } else {
        setError(err.message || "Une erreur inattendue est survenue.");
      }
      console.error("Erreur de l'API de recherche:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Détermine le pays de l'utilisateur à partir de ses coordonnées GPS.
   * @param {number} latitude - La latitude de l'utilisateur.
   * @param {number} longitude - La longitude de l'utilisateur.
   */
  const getCountryFromCoords = async (latitude, longitude) => {
    if (!latitude || !longitude) {
      console.error("Les paramètres 'latitude' et 'longitude' sont requis.");
      setError("Coordonnées GPS manquantes.");
      return;
    }

    setLoading(true);
    setUserCountry(null); // Réinitialiser l'ancien pays
    setError(null);
    try {
      // Les paramètres sont envoyés dans le corps de la requête POST
      const response = await api.post(
        `/api/v1/maps/get-country`,
        { latitude, longitude }
      );
      
      // Assurez-vous que la réponse contient les données attendues (ex: { countryCode: 'CM', countryName: 'Cameroun' })
      setUserCountry(response.data);
      return response.data; // Renvoyer les données pour une utilisation immédiate si nécessaire
      
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Erreur du serveur lors de la récupération du pays.");
      } else if (err.request) {
        setError("Problème de connexion pour la géolocalisation. Veuillez vérifier votre réseau.");
      } else {
        setError(err.message || "Une erreur inattendue est survenue lors de la géolocalisation.");
      }
      console.error("Erreur de l'API get-country:", err.response || err);
      return null;
      
    } finally {
      setLoading(false);
    }
  };

  const value = {
    places,
    loading,
    error,
    searchPlaces,
    // Ajout des nouvelles valeurs
    userCountry, 
    getCountryFromCoords,
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
}