import { createContext, useState } from "react";
import api from '../api/api';

export const MapContext = createContext({});

export function MapContextProvider({ children }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Effectue une recherche de lieux via une requête POST.
   * @param {string} query - La requête de recherche (ex: "restaurants").
   * @param {number} [country=237] - Le code numérique du pays. Par défaut, 237 (Cameroun).
   */
  const searchPlaces = async (query, country = 237) => {
    // Vérification de base pour s'assurer que le paramètre 'query' est valide
    if (!query) {
      console.error("Le paramètre 'query' (string) est requis.");
      setError("Le paramètre de recherche est manquant.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Les paramètres sont envoyés dans le corps de la requête POST
      const response = await api.post(
        `/api/v1/maps/search-places`,
        {
          query,
          country,
        }
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

  const value = {
    places,
    loading,
    error,
    searchPlaces,
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
}