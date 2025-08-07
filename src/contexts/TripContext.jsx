import { createContext, useState, useContext } from "react";
import api from '../api/api'; // Importez l'instance Axios configurée
import toast from 'react-hot-toast'; // Pour les notifications
import useAuth from "../hooks/useAuth"; // Importation de votre hook d'authentification

// Crée le contexte. C'est ce que le hook useContext(tripContext) consommera.
export const tripContext = createContext({});

// Le fournisseur de contexte qui enveloppera les composants nécessitant les données de trajets.
export function TripContextProvider({ children }) {
    const [trips, setTrips] = useState([]); // État pour stocker la liste des trajets
    const [loading, setLoading] = useState(false); // Indique si une opération est en cours de chargement
    const [error, setError] = useState(null); // Stocke les erreurs éventuelles des opérations

    // Utilisation de votre hook d'authentification pour obtenir les informations de l'utilisateur
    const { user, loading: authLoading } = useAuth();

    // Données de trajets fictives mises à jour pour correspondre au Trip Dto.
    const mockTrips = [
        {
            id: 1,
            userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            vehiculeId: 1,
            departureDate: "2024-08-08T08:00:00Z",
            status: 4,
            placesLeft: 3,
            pricePerPlace: 5000,
            pusblishingDate: "2024-08-07T10:00:00Z",
            aditionalInfos: "Trajet avec une pause de 30 minutes à mi-chemin.",
            startAreaPointCreateDto: {
                homeTownName: "Yaoundé",
                name: "Carrefour Obili",
                latitude: 3.866667,
                longitude: 11.516667,
                order: 0,
                type: 0 // PointType.Departure
            },
            arivalAreaPointCreateDto: {
                homeTownName: "Douala",
                name: "Lycée de Bonabéri",
                latitude: 4.05,
                longitude: 9.7,
                order: 999, // Un grand nombre pour le point final
                type: 1 // PointType.Arrival
            },
            stopovers: [
                {
                    homeTownName: "Edéa",
                    name: "Centre-ville",
                    latitude: 3.8,
                    longitude: 10.13333,
                    order: 1,
                    type: 2 // PointType.Stopover
                }
            ]
        },
        {
            id: 2,
            userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            vehiculeId: 2,
            departureDate: "2024-08-09T14:30:00Z",
            status: 4,
            placesLeft: 1,
            pricePerPlace: 7500,
            pusblishingDate: "2024-08-07T11:00:00Z",
            aditionalInfos: "Départ matinal, parfait pour les lève-tôt.",
            startAreaPointCreateDto: {
                homeTownName: "Bafoussam",
                name: "Marché Central",
                latitude: 5.47,
                longitude: 10.42,
                order: 0,
                type: 0
            },
            arivalAreaPointCreateDto: {
                homeTownName: "Yaoundé",
                name: "Campus Universitaire",
                latitude: 3.85,
                longitude: 11.53,
                order: 999,
                type: 1
            },
            stopovers: []
        },
        {
            id: 3,
            userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            vehiculeId: 3,
            departureDate: "2024-08-10T18:00:00Z",
            status: 4,
            placesLeft: 5,
            pricePerPlace: 6000,
            pusblishingDate: "2024-08-07T12:00:00Z",
            aditionalInfos: "Trajet sans escale, arrivée prévue à l'heure.",
            startAreaPointCreateDto: {
                homeTownName: "Douala",
                name: "Aéroport International",
                latitude: 4.01,
                longitude: 9.77,
                order: 0,
                type: 0
            },
            arivalAreaPointCreateDto: {
                homeTownName: "Kribi",
                name: "Plage",
                latitude: 2.95,
                longitude: 9.9,
                order: 999,
                type: 1
            },
            stopovers: []
        }
    ];

    // Fonction pour récupérer tous les trajets.
    const fetchTrips = async (params = {}) => {
        if (authLoading) return; // Attendre que l'authentification soit prête

        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/trips', { params });
            
            if (response.data && response.data.length > 0) {
                setTrips(response.data);
                toast.success('Trajets chargés avec succès !');
            } else {
                setTrips(mockTrips);
                toast.warn('La réponse du serveur est vide. Utilisation de données fictives.');
            }
            return response.data;
        } catch (err) {
            console.error("Erreur lors de la récupération des trajets:", err);
            setError(err);
            setTrips(mockTrips);
            toast.error(err.response?.data?.message || 'Échec du chargement des trajets. Utilisation de données fictives.');
            return null;
        } finally {
            setLoading(false);
        }
    }; 

    // Fonction pour récupérer un trajet spécifique par son ID
    const getTripById = async (id) => {
        if (authLoading) return;
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/trips/${id}`);
            toast.success('Trajet trouvé !');
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la récupération du trajet ${id}:`, err);
            setError(err);
            // Repli sur les données fictives
            const trip = mockTrips.find(t => t.id === parseInt(id));
            if (trip) {
                toast.warning('Trajet non trouvé sur le serveur, mais trouvé dans les données fictives.');
            
                return trip;
            }
            toast.error(err.response?.data?.message || 'Échec de la récupération du trajet.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const createTrip = async (tripData) => {
        if (!user) {
            toast.error("Veuillez vous connecter pour créer un trajet.");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            // Le DTO TripCreateDto contient déjà toutes les informations.
            // On ajoute simplement l'ID de l'utilisateur avant d'envoyer la requête.
            const newTripData = { ...tripData, userId: user.id };
            const response = await api.post('/api/trips', newTripData);
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
    const updateTrip = async (id, tripData) => {
        if (!user) {
            toast.error("Veuillez vous connecter pour modifier un trajet.");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/api/trips/${id}`, tripData);
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
    const deleteTrip = async (id) => {
        if (!user) {
            toast.error("Veuillez vous connecter pour supprimer un trajet.");
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            await api.delete(`/api/trips/${id}`);
            setTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
            toast.success('Trajet supprimé avec succès !');
            return true;
        } catch (err) {
            console.error(`Erreur lors de la suppression du trajet ${id}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la suppression du trajet.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Les valeurs fournies par le contexte à tous ses consommateurs
    const contextValue = { 
        trips, 
        loading, 
        error, 
        fetchTrips, 
        getTripById, 
        createTrip, 
        updateTrip, 
        deleteTrip,
        userId: user?.id || null // Expose l'ID de l'utilisateur du contexte d'authentification
    };

    return (
        <tripContext.Provider value={contextValue}>
            {children}
        </tripContext.Provider>
    );
}

