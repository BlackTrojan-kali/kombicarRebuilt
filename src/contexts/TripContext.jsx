import { createContext, useEffect, useState } from "react";
import api from '../api/api'; // Assurez-vous que le chemin vers votre instance Axios est correct
import toast from 'react-hot-toast'; // Pour les notifications

// Crée le contexte. C'est ce que le hook useContext(tripContext) consommera.
export const tripContext = createContext({});

// Données de trajets fictives pour le développement et les tests
const dummyTrips = [
    {
        id: "dummy-1",
        thumbnail: "/default/city-1.jpg",
        depart: "Yaoundé",
        arrive: "Douala",
        prix: 4000,
        chauffeur: { nom: "Simulé A", trajets_effectues: 20, profile: "https://randomuser.me/api/portraits/men/1.jpg", stars: 4.5 },
        distance: 240,
        heure_depart: "08h00",
        heure_arrive: "12h00",
        date_depart: "2025-08-10", // Ajouté pour le filtrage par date
        desc: "Climatisé, pas de surcharge",
        climatise: true, // Ajouté pour le filtre
        luggageAllowed: true, // Déjà existant
        vehicle: { id: 1, type: 'sedan', brand: 'Toyota', model: 'Camry' } // Ajouté pour le filtre
    },
    {
        id: "dummy-2",
        thumbnail: "/default/city-2.jpg",
        depart: "Douala",
        arrive: "Bafoussam",
        prix: 3500,
        chauffeur: { nom: "Simulé B", trajets_effectues: 15, profile: "https://randomuser.me/api/portraits/women/2.jpg", stars: 4.8 },
        distance: 280,
        heure_depart: "09h30",
        heure_arrive: "14h00",
        date_depart: "2025-08-10", // Ajouté pour le filtrage par date
        desc: "Wifi à bord",
        climatise: true,
        luggageAllowed: true,
        vehicle: { id: 2, type: 'suv', brand: 'Mercedes', model: 'GLC' }
    },
    {
        id: "dummy-3",
        thumbnail: "/default/city-3.jpg",
        depart: "Yaoundé",
        arrive: "Kribi",
        prix: 5000,
        chauffeur: { nom: "Simulé C", trajets_effectues: 10, profile: "https://randomuser.me/api/portraits/men/3.jpg", stars: 4.2 },
        distance: 180,
        heure_depart: "14h00",
        heure_arrive: "16h30",
        date_depart: "2025-08-11", // Ajouté pour le filtrage par date
        desc: "Sièges inclinables",
        climatise: false,
        luggageAllowed: true,
        vehicle: { id: 3, type: 'sedan', brand: 'Hyundai', model: 'Elantra' }
    },
    {
        id: "dummy-4",
        thumbnail: "/default/city-4.jpg",
        depart: "Bafoussam",
        arrive: "Douala",
        prix: 3800,
        chauffeur: { nom: "Simulé D", trajets_effectues: 25, profile: "https://randomuser.me/api/portraits/women/4.jpg", stars: 4.7 },
        distance: 280,
        heure_depart: "09h00",
        heure_arrive: "13h00",
        date_depart: "2025-08-12", // Ajouté pour le filtrage par date
        desc: "Musique au choix",
        climatise: true,
        luggageAllowed: false,
        vehicle: { id: 4, type: 'van', brand: 'Ford', model: 'Transit' }
    },
    {
        id: "dummy-5",
        thumbnail: "/default/city-5.jpg",
        depart: "Douala",
        arrive: "Limbe",
        prix: 2000,
        chauffeur: { nom: "Simulé E", trajets_effectues: 8, profile: "https://randomuser.me/api/portraits/men/5.jpg", stars: 4.0 },
        distance: 60,
        heure_depart: "16h00",
        heure_arrive: "17h30",
        date_depart: "2025-08-13", // Ajouté pour le filtrage par date
        desc: "Bagages inclus",
        climatise: true,
        luggageAllowed: true,
        vehicle: { id: 5, type: 'sedan', brand: 'Honda', model: 'Civic' }
    },
    {
        id: "dummy-6",
        thumbnail: "/default/city-6.jpg",
        depart: "Yaoundé",
        arrive: "Ebolowa",
        prix: 3000,
        chauffeur: { nom: "Simulé F", trajets_effectues: 12, profile: "https://randomuser.me/api/portraits/women/6.jpg", stars: 4.3 },
        distance: 160,
        heure_depart: "07h00",
        heure_arrive: "09h30",
        date_depart: "2025-08-10", // Ajouté pour le filtrage par date
        desc: "Départ immédiat",
        climatise: false,
        luggageAllowed: true,
        vehicle: { id: 6, type: 'suv', brand: 'BMW', model: 'X5' }
    },
];

// Le fournisseur de contexte qui enveloppera les composants nécessitant les données de trajets.
export function TripContextProvider({ children }) {
    const [trips, setTrips] = useState([]); // État pour stocker la liste des trajets
    const [searchResults, setSearchResults] = useState([]); // Nouvel état pour stocker les résultats de la recherche
    const [loading, setLoading] = useState(false); // Indique si une opération est en cours de chargement
    const [error, setError] = useState(null); // Stocke les erreurs éventuelles des opérations

    // Fonction pour récupérer tous les trajets.
    // Elle peut accepter des paramètres pour la pagination, le filtrage, etc.
    // Endpoint: /api/trips (listes les trajets d'un utilisateur)
    const fetchTrips = async (params = {}) => {
        setLoading(true);
        setError(null); // Réinitialise l'erreur avant une nouvelle tentative
        try {
            // Appel API pour récupérer les trajets
            const response = await api.get('/api/trips', { params });
            
            // Vérifie si les données réelles sont vides ou si la réponse est vide
            if (response.data && response.data.length > 0) {
                setTrips(response.data); // Met à jour l'état avec les données réelles
                toast.success('Trajets chargés avec succès !'); // Notification de succès
                return response.data;
            } else {
                // Si les données réelles sont vides, utilise les données fictives
                setTrips(dummyTrips);
                toast.success('Aucun trajet réel trouvé. Affichage des trajets de test.', { duration: 3000 });
                return dummyTrips;
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des trajets:", err);
            setError(err); // Stocke l'objet d'erreur
            // Affiche un message d'erreur à l'utilisateur
            toast.error(err.response?.data?.message || 'Échec du chargement des trajets. Affichage des trajets de test.');
            
            // En cas d'erreur de l'API, affiche également les données fictives pour le développement
            setTrips(dummyTrips);
            return dummyTrips;
        } finally {
            setLoading(false); // Termine le chargement, que ce soit un succès ou un échec
        }
    };

    // Fonction pour récupérer un trajet spécifique par son ID
    // Endpoint: /api/trips/{id}
    const getTripById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/trips/${id}`);
            toast.success('Trajet trouvé !');
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la récupération du trajet ${id}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la récupération du trajet.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour créer un nouveau trajet
    // Endpoint: POST /api/trips
    const createTrip = async (tripData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/trips', tripData);
            // Si l'API renvoie le nouveau trajet créé, l'ajoute à la liste locale
            setTrips(prevTrips => [...prevTrips, response.data]);
            toast.success('Trajet créé avec succès !');
            return response.data;
        } catch (err) {
            console.error("Erreur lors de la création du trajet:", err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la création du trajet.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour mettre à jour un trajet existant
    // Endpoint: PUT /api/trips/{id}
    const updateTrip = async (id, tripData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/api/trips/${id}`, tripData);
            // Met à jour le trajet dans la liste locale
            setTrips(prevTrips => prevTrips.map(trip => 
                trip.id === id ? response.data : trip
            ));
            toast.success('Trajet mis à jour avec succès !');
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la mise à jour du trajet ${id}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la mise à jour du trajet.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour supprimer un trajet
    // Endpoint: DELETE /api/trips/{id}
    const deleteTrip = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/api/trips/${id}`);
            // Supprime le trajet de la liste locale
            setTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
            toast.success('Trajet supprimé avec succès !');
            return true; // Indique le succès
        } catch (err) {
            console.error(`Erreur lors de la suppression du trajet ${id}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la suppression du trajet.');
            return false; // Indique l'échec
        } finally {
            setLoading(false);
        }
    };

    // Nouvelle fonction pour annuler un trajet
    // Endpoint: PUT /api/trips/cancel/{id}
    const cancelTrip = async (id) => {
        setLoading(true);
        setError(null);
        try {
            // L'API PUT /api/trips/cancel/{id} est censée annuler le trajet.
            // Nous supposons qu'elle renvoie le trajet mis à jour avec un statut "Annulé".
            const response = await api.put(`/api/trips/cancel/${id}`);
            // Mettre à jour le trajet dans la liste locale avec les données renvoyées par l'API
            setTrips(prevTrips => prevTrips.map(trip => 
                trip.id === id ? response.data : trip
            ));
            toast.success('Trajet annulé avec succès !');
            return response.data; // Retourne le trajet annulé
        } catch (err) {
            console.error(`Erreur lors de l'annulation du trajet ${id}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de l\'annulation du trajet.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Le `useEffect` ci-dessous est commenté pour donner plus de flexibilité.
    // Si vous voulez que les trajets soient chargés automatiquement au montage du fournisseur,
    // décommentez-le. Sinon, appelez `fetchTrips()` manuellement dans les composants.
    /*
    useEffect(() => {
        fetchTrips();
    }, []);
    */

    // Les valeurs fournies par le contexte à tous ses consommateurs
    const contextValue = { 
        trips, 
        searchResults, // Ajout des résultats de la recherche au contexte
        loading, 
        error, 
        fetchTrips, 
        getTripById, 
        createTrip, 
        updateTrip, 
        deleteTrip,
        cancelTrip, // Ajout de la nouvelle fonction au contexte
        setSearchResults // Ajout de la fonction pour mettre à jour les résultats
    };

    return (
        <tripContext.Provider value={contextValue}>
            {children}
        </tripContext.Provider>
    );
}
