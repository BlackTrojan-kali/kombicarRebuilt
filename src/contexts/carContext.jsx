import { createContext, useState } from "react";
import api from '../api/api'; // Assurez-vous que le chemin vers votre instance Axios est correct
import toast from 'react-hot-toast'; // Pour les notifications
import useAuth from "../hooks/useAuth"; // Importation de votre hook d'authentification

// Crée le contexte. C'est ce que le hook useContext(carContext) consommera.
export const carContext = createContext({});

// Le fournisseur de contexte qui enveloppera les composants nécessitant les données de véhicules.
export function CarContextProvider({ children }) {
    const [cars, setCars] = useState([]); // État pour stocker la liste des véhicules
    const [loading, setLoading] = useState(false); // Indique si une opération est en cours de chargement
    const [error, setError] = useState(null); // Stocke les erreurs éventuelles des opérations

    // Utilisation de votre hook d'authentification pour obtenir les informations de l'utilisateur
    const { user, loading: authLoading } = useAuth();

    // Données de véhicules fictives mises à jour pour correspondre au DTO.
    const mockCars = [
        {
            id: 1,
            userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            brand: "Toyota",
            model: "Corolla",
            numberPlaces: 5,
            color: "Gris",
            registrationCode: "AB-123-CD"
        },
        {
            id: 2,
            userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            brand: "Honda",
            model: "Civic",
            numberPlaces: 4,
            color: "Noir",
            registrationCode: "EF-456-GH"
        },
        {
            id: 3,
            userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            brand: "Ford",
            model: "Focus",
            numberPlaces: 5,
            color: "Bleu",
            registrationCode: "IJ-789-KL"
        }
    ];

    // Fonction pour récupérer tous les véhicules.
    const fetchCars = async (params = {}) => {
        if (authLoading) return; // Attendre que l'authentification soit prête

        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/vehicules', { params });
            
            if (response.data && response.data.length > 0) {
                setCars(response.data);
                toast.success('Véhicules chargés avec succès !');
            } else {
                setCars(mockCars);
                toast.warn('La réponse du serveur est vide. Utilisation de données fictives.');
            }
            
            return response.data;
        } catch (err) {
            console.error("Erreur lors de la récupération des véhicules:", err);
            setError(err);
            setCars(mockCars);
            toast.error(err.response?.data?.message || 'Échec du chargement des véhicules. Utilisation de données fictives.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour récupérer un véhicule spécifique par son ID
    const getCarById = async (id) => {
        if (authLoading) return;

        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/vehicules/${id}`);
            toast.success('Véhicule trouvé !');
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la récupération du véhicule ${id}:`, err);
            setError(err);
            const car = mockCars.find(c => c.id === parseInt(id));
            if (car) {
                toast.warn('Véhicule non trouvé sur le serveur, mais trouvé dans les données fictives.');
                return car;
            }
            toast.error(err.response?.data?.message || 'Échec de la récupération du véhicule.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour créer un nouveau véhicule
    const createCar = async (carData) => {
        if (!user) {
            toast.error("Veuillez vous connecter pour créer un véhicule.");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const newCarData = { ...carData, userId: user.id };
            const response = await api.post('/api/vehicules', newCarData);
            setCars(prevCars => [...prevCars, response.data]);
            toast.success('Véhicule créé avec succès !');
            return response.data;
        } catch (err) {
            console.error("Erreur lors de la création du véhicule:", err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la création du véhicule.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour mettre à jour un véhicule existant
    const updateCar = async (id, carData) => {
        if (!user) {
            toast.error("Veuillez vous connecter pour modifier un véhicule.");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/api/vehicules/${id}`, carData);
            setCars(prevCars => prevCars.map(car => 
                car.id === id ? response.data : car
            ));
            toast.success('Véhicule mis à jour avec succès !');
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la mise à jour du véhicule ${id}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la mise à jour du véhicule.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour supprimer un véhicule
    const deleteCar = async (id) => {
        if (!user) {
            toast.error("Veuillez vous connecter pour supprimer un véhicule.");
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            await api.delete(`/api/vehicules/${id}`);
            setCars(prevCars => prevCars.filter(car => car.id !== id));
            toast.success('Véhicule supprimé avec succès !');
            return true;
        } catch (err) {
            console.error(`Erreur lors de la suppression du véhicule ${id}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la suppression du véhicule.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Nouvelle fonction pour téléverser un document pour un véhicule
    const uploadVehicleDocument = async (documentType, vehiculeId, file) => {
        if (!user) {
            toast.error("Veuillez vous connecter pour téléverser un document.");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const response = await api.post(`/api/vehicules/upload/${documentType}/${vehiculeId}`, formData, config);
            toast.success(response.data.message || `Document "${documentType}" téléversé avec succès pour le véhicule ${vehiculeId} !`);
            return response.data;
        } catch (err) {
            console.error(`Erreur lors du téléversement du document pour le véhicule ${vehiculeId}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || `Échec du téléversement du document "${documentType}".`);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const contextValue = { 
        cars, 
        loading, 
        error, 
        fetchCars, 
        getCarById, 
        createCar, 
        updateCar, 
        deleteCar,
        uploadVehicleDocument,
        userId: user?.id || null
    };

    return (
        <carContext.Provider value={contextValue}>
            {children}
        </carContext.Provider>
    );
}
