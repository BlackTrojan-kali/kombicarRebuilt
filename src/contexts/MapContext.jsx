import { createContext, useState, useEffect } from "react"; // 👈 Ajout de useEffect
import api from '../api/api';
import useAuth from "../hooks/useAuth";

export const MapContext = createContext({});

export function MapContextProvider({ children }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Nouveau state pour stocker le pays de l'utilisateur (objet complet)
  const [userCountry, setUserCountry] = useState(null); 
  // Code numérique du pays, utilisé par défaut pour la recherche
  const [countryCode , setCountryCode] = useState(237); // Par défaut 237 (Cameroun)
  
  // Récupération de l'utilisateur
  const {user} = useAuth();

  // État de chargement spécifique à la récupération du pays
  const [countryLoading, setCountryLoading] = useState(false); 

  /**
   * Effectue une recherche de lieux via une requête POST. (Inchangée)
   */
  const searchPlaces = async (query, country = countryCode) => {
    // ... (Logique searchPlaces)
    if (!query) {
      console.error("Le paramètre 'query' (string) est requis.");
      setError("Le paramètre de recherche est manquant.");
      return;
    }

    setLoading(true); 
    setPlaces([]);
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
   * NOTE: On utilise setCountryLoading ici pour gérer le chargement.
   */
  const getCountryFromCoords = async (latitude, longitude) => {
    if (!latitude || !longitude) {
      console.error("Les paramètres 'latitude' et 'longitude' sont requis.");
      return null;
    }

    setCountryLoading(true);
    setUserCountry(null); 
    // On évite de toucher à 'error' global ici, sauf si c'est une erreur critique
    try {
      const response = await api.post(
        `/api/v1/maps/get-country`,
        { latitude, longitude }
      );
      
      setUserCountry(response.data);
      // Supposons que l'API renvoie le code numérique dans `response.data.code`
      if (response.data && response.data.code) { 
        setCountryCode(response.data.code);
      }
      
      return response.data; 
      
    } catch (err) {
      console.error("Erreur de l'API get-country:", err.response || err);
      return null;
      
    } finally {
      setCountryLoading(false);
    }
  };
  
// --- LOGIQUE DE DÉTERMINATION DU PAYS ---
  useEffect(() => {
    const determineCountry = async () => {
      // 1. Si l'utilisateur est connecté et le pays est dans son profil
      if (user && user.country && user.country) {
        setUserCountry(user.country);
        setCountryCode(user.country); // Utilise le code du pays de l'utilisateur
        return;
      }

      // 2. Si l'utilisateur N'EST PAS connecté, utiliser la géolocalisation
      if (!user) {
        setCountryLoading(true);
        
        const getUserLocation = () => {
          return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
              reject(new Error("La géolocalisation n'est pas supportée."));
              return;
            }
            
            // Récupérer la position avec timeout
            navigator.geolocation.getCurrentPosition(
              (position) => resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }),
              (err) => reject(new Error(`Erreur de géolocalisation: ${err.message}`)),
              { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
            );
          });
        };

        try {
          const coords = await getUserLocation();
          // Appel à getCountryFromCoords qui met à jour userCountry et countryCode
          await getCountryFromCoords(coords.latitude, coords.longitude);
        } catch (err) {
          console.warn(err.message);
          // Si la géolocalisation échoue, les valeurs par défaut (237) sont conservées.
        } finally {
          setCountryLoading(false); // Fait aussi dans getCountryFromCoords, mais pour la sécurité
        }
      }
    };

    determineCountry();
    // Dépendance sur `user` pour réagir à la connexion/déconnexion
  }, [user]); 

  const value = {
    places,
    loading, // Chargement de searchPlaces
    countryLoading, // Chargement de la géolocalisation/API country
    error,
    searchPlaces,
    // Ajout des nouvelles valeurs
    userCountry, 
    countryCode, // Nouveau: code utilisé par défaut dans searchPlaces
    getCountryFromCoords,
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
}