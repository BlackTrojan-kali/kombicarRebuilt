import { createContext, useEffect, useState } from "react";
import api from '../api/api'; // Assurez-vous que le chemin vers votre instance Axios est correct
import toast from 'react-hot-toast'; // Pour les notifications

// Crée le contexte. C'est ce que le hook useContext(carContext) consommera.
export const carContext = createContext({});

// Le fournisseur de contexte qui enveloppera les composants nécessitant les données de véhicules.
export function CarContextProvider({ children }) {
    const [cars, setCars] = useState([]); // État pour stocker la liste des véhicules
    const [loading, setLoading] = useState(false); // Indique si une opération est en cours de chargement
    const [error, setError] = useState(null); // Stocke les erreurs éventuelles des opérations

    // Données de véhicules fictives pour le cas où la requête API échoue ou est vide.
    const mockCars = [
        {
            id: 1,
            marque: "Toyota",
            modele: "Corolla",
            annee: 2020,
            couleur: "Gris",
            disponible: true
        },
        {
            id: 2,
            marque: "Honda",
            modele: "Civic",
            annee: 2021,
            couleur: "Noir",
            disponible: false
        },
        {
            id: 3,
            marque: "Ford",
            modele: "Focus",
            annee: 2019,
            couleur: "Bleu",
            disponible: true
        }
    ];

    // Fonction pour récupérer tous les véhicules.
    // Elle peut accepter des paramètres pour la pagination, le filtrage, etc.
    // Endpoint: GET /api/vehicules
    const fetchCars = async (params = {}) => {
        setLoading(true);
        setError(null); // Réinitialise l'erreur avant une nouvelle tentative
        try {
            // Appel API pour récupérer les véhicules
            const response = await api.get('/api/vehicules', { params });
            
            // Vérifie si la réponse contient des données. Sinon, utilise les données fictives.
            if (response.data && response.data.length > 0) {
                setCars(response.data); // Met à jour l'état avec les données reçues
                toast.success('Véhicules chargés avec succès !'); // Notification de succès
            } else {
                setCars(mockCars); // Utilisation des données fictives
                toast.warn('La réponse du serveur est vide. Utilisation de données fictives.');
            }
            
            return response.data; // Retourne les données pour une utilisation directe si nécessaire
        } catch (err) {
            console.error("Erreur lors de la récupération des véhicules:", err);
            setError(err); // Stocke l'objet d'erreur
            // En cas d'échec de la requête, utilise les données fictives
            setCars(mockCars);
            // Affiche un message d'erreur à l'utilisateur
            toast.error(err.response?.data?.message || 'Échec du chargement des véhicules. Utilisation de données fictives.');
            return null; // Indique un échec
        } finally {
            setLoading(false); // Termine le chargement, que ce soit un succès ou un échec
        }
    };

    // Fonction pour récupérer un véhicule spécifique par son ID
    // Endpoint: GET /api/vehicules/{id}
    const getCarById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/vehicules/${id}`); // <-- Endpoint mis à jour
            toast.success('Véhicule trouvé !');
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la récupération du véhicule ${id}:`, err);
            setError(err);
            // En cas d'échec, essaie de trouver le véhicule dans les données fictives
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
    // Endpoint: POST /api/vehicules
    const createCar = async (carData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/vehicules', carData); // <-- Endpoint mis à jour
            // Si l'API renvoie le nouveau véhicule créé, l'ajoute à la liste locale
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
    // Endpoint: PUT /api/vehicules/{id}
    const updateCar = async (id, carData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/api/vehicules/${id}`, carData); // <-- Endpoint mis à jour
            // Met à jour le véhicule dans la liste locale
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
    // Endpoint: DELETE /api/vehicules/{id}
    const deleteCar = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/api/vehicules/${id}`); // C'est ici que la requête DELETE est effectuée
            // Supprime le véhicule de la liste locale
            setCars(prevCars => prevCars.filter(car => car.id !== id));
            toast.success('Véhicule supprimé avec succès !');
            return true; // Indique le succès
        } catch (err) {
            console.error(`Erreur lors de la suppression du véhicule ${id}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la suppression du véhicule.');
            return false; // Indique l'échec
        } finally {
            setLoading(false);
        }
    };

    // Nouvelle fonction pour téléverser un document pour un véhicule
    // Endpoint: POST /api/vehicules/upload/{documentType}/{vehiculeId}
    const uploadVehicleDocument = async (documentType, vehiculeId, file) => {
        setLoading(true);
        setError(null);
        try {
            // Crée un objet FormData pour envoyer le fichier
            const formData = new FormData();
            formData.append('file', file); // 'file' doit correspondre au nom attendu par votre backend

            // En-têtes spécifiques pour l'upload de fichier
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important pour l'upload de fichiers
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

    // Le `useEffect` ci-dessous est commenté pour donner plus de flexibilité.
    // Si vous voulez que les véhicules soient chargés automatiquement au montage du fournisseur,
    // décommentez-le. Sinon, appelez `fetchCars()` manuellement dans les composants.
    /*
    useEffect(() => {
        fetchCars();
    }, []);
    */

    // Les valeurs fournies par le contexte à tous ses consommateurs
    const contextValue = { 
        cars, 
        loading, 
        error, 
        fetchCars, 
        getCarById, 
        createCar, 
        updateCar, 
        deleteCar,
        uploadVehicleDocument // Ajout de la nouvelle fonction au contexte
    };

    return (
        <carContext.Provider value={contextValue}>
            {children}
        </carContext.Provider>
    );
}
