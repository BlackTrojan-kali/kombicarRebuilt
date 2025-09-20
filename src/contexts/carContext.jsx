import { createContext, useState } from "react";
import api from '../api/api';
import { toast } from "sonner";
import useAuth from "../hooks/useAuth";

export const carContext = createContext({});

// Ce fournisseur de contexte gère toutes les opérations liées aux véhicules
export function CarContextProvider({ children }) {
    // État local pour stocker les véhicules de l'utilisateur
    const [cars, setCars] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Nouveaux états pour la gestion des véhicules par l'administrateur
    const [adminCars, setAdminCars] = useState([]);
    const [adminCarPagination, setAdminCarPagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isLoadingAdminCars, setIsLoadingAdminCars] = useState(false);
    const [adminCarListError, setAdminCarListError] = useState(null);
    const [carDetails, setCarDetails] = useState(null);
    const [isCarDetailsLoading, setIsCarDetailsLoading] = useState(false);
    const [carDocuments, setCarDocuments] = useState([]);

    // Nouveaux états pour les permis de conduire de l'administrateur
    const [adminLicences, setAdminLicences] = useState([]);
    const [adminLicencePagination, setAdminLicencePagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isLoadingAdminLicences, setIsLoadingAdminLicences] = useState(false);
    const [adminLicenceListError, setAdminLicenceListError] = useState(null);
    
    // Nouvel état pour les documents d'un véhicule spécifique pour l'admin
    const [adminVehicleDocuments, setAdminVehicleDocuments] = useState([]);
    const [isLoadingAdminVehicleDocuments, setIsLoadingAdminVehicleDocuments] = useState(false);
    const [adminVehicleDocumentsError, setAdminVehicleDocumentsError] = useState(null);

    // 🌐 Récupère la liste de tous les véhicules (pour les admins)
    const fetchCars = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/vehicules', { params });
            setCars(response.data);
            return response.data;
        } catch (err) {
            console.error("Erreur lors de la récupération de tous les véhicules:", err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec du chargement des véhicules.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 🆕 Fonction pour lister les véhicules pour les administrateurs
    const fetchAdminCars = async (page = 1, isVerified) => {
        setIsLoadingAdminCars(true);
        setAdminCarListError(null);
        console.log(isVerified)
        try {
            const response = await api.get(`/api/v1/vehicules/admin/list/${page}/${isVerified}`);

            if (response.status !== 200) {
                throw new Error("Échec de la récupération de la liste des véhicules.");
            }

            const data = response.data;
            setAdminCars(data.items);
            setAdminCarPagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage,
            });
            return data;
        } catch (error) {
            console.error("Erreur lors de la liste des véhicules pour l'admin:", error);
            const errorMessage = error.response?.data?.message || "Une erreur inattendue est survenue.";
            setAdminCarListError(errorMessage);
            toast.error(errorMessage);
            setAdminCars([]);
            throw error;
        } finally {
            setIsLoadingAdminCars(false);
        }
    };
    
    // 🆕 Fonction pour lister les permis de conduire pour les administrateurs
    const fetchAdminDrivingLicences = async (page = 1, verificationState = 0) => {
        setIsLoadingAdminLicences(true);
        setAdminLicenceListError(null);
        try {
            const response = await api.get(`/api/v1/licence-driving/admin/list-licences-driving/${page}/${verificationState}`);
            
            if (response.status !== 200) {
                throw new Error("Échec de la récupération de la liste des permis de conduire.");
            }
            
            const data = response.data;
            setAdminLicences(data.items);
            setAdminLicencePagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage,
            });
            return data;
        } catch (error) {
            console.error("Erreur lors de la liste des permis de conduire pour l'admin:", error);
            const errorMessage = error.response?.data?.message || "Une erreur inattendue est survenue.";
            setAdminLicenceListError(errorMessage);
            toast.error(errorMessage);
            setAdminLicences([]);
            throw error;
        } finally {
            setIsLoadingAdminLicences(false);
        }
    };

    // 🆕 Fonction pour lister les documents d'un véhicule spécifique (pour les admins)
    const fetchAdminVehicleDocuments = async (vehiculeId) => {
        setIsLoadingAdminVehicleDocuments(true);
        setAdminVehicleDocumentsError(null);
        try {
            if (!user || user.role !== "Admin") {
                throw new Error("Accès refusé. Cette action est réservée aux administrateurs.");
            }
            const response = await api.get(`/api/v1/vehicules/admin/${vehiculeId}/documents`);
            if (response.status !== 200) {
                throw new Error("Échec de la récupération des documents du véhicule.");
            }
            setAdminVehicleDocuments(response.data);
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la récupération des documents pour le véhicule ${vehiculeId}:`, err);
            setAdminVehicleDocumentsError(err.response?.data?.message || "Une erreur inattendue est survenue.");
            toast.error(err.response?.data?.message || 'Échec du chargement des documents du véhicule.');
            setAdminVehicleDocuments([]);
            throw err;
        } finally {
            setIsLoadingAdminVehicleDocuments(false);
        }
    };


    // 👤 Récupère les véhicules de l'utilisateur authentifié
    const fetchUserCars = async () => {
        if (!user || !user.id) {
            toast.error('Non connecté. Pas de données à afficher.');
            setCars([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/v1/vehicules');
            if (response.data && response.data.length > 0) {
                setCars(response.data);
               // toast.success('Vos véhicules ont été chargés avec succès !');
            } else {
                setCars([]);
              //  toast.error('Vous n\'avez pas encore de véhicule enregistré.');
            }
            return response.data;
        } catch (err) {
            console.error("Erreur lors de la récupération des véhicules de l'utilisateur:", err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec du chargement de vos véhicules.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 🔎 Récupère un véhicule par son ID
    const getCarById = async (id) => {
        setIsCarDetailsLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/v1/vehicules/${id}`);
            setCarDetails(response.data);
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la récupération du véhicule ${id}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || `Échec du chargement du véhicule ${id}.`);
            return null;
        } finally {
            setIsCarDetailsLoading(false);
        }
    };

    // ➕ Crée un nouveau véhicule
    const createCar = async (carData) => {
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour créer un véhicule.");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const newCarData = { ...carData, userId: user.id, isVerified: carData.isVerified ?? false };
            const response = await api.post('/api/v1/vehicules', newCarData);

            setCars([response.data]);
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

    // 📝 Met à jour un véhicule existant
    const updateCar = async (id, carData) => {
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour modifier un véhicule.");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/api/v1/vehicules`, carData);
            setCars(prev => prev.map(car => car.id === id ? response.data : car));
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

    // 🗑️ Supprime un véhicule
    const deleteCar = async (id) => {
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour supprimer votre véhicule.");
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            await api.delete(`/api/v1/vehicules/${id}`);
            setCars(prev => prev.filter(car => car.id !== id));
            toast.success('Votre véhicule a été supprimé avec succès !');
            return true;
        } catch (err) {
            console.error(`Erreur lors de la suppression du véhicule ${id}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la suppression de votre véhicule.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 📄 Télécharge un document de véhicule
    const uploadVehicleDocument = async (documentType, vehiculeId, file) => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post(
                `/api/v1/vehicules/upload/${documentType}/${vehiculeId}`,
                formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log(response);
            toast.success('Document téléchargé avec succès !');
            return response.data;
        } catch (err) {
            console.error("Erreur lors du téléchargement du document:", err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec du téléchargement du document.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 📜 Récupère les documents d'un véhicule
    const getVehicleDocuments = async (vehiculeId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/v1/vehicules/${vehiculeId}/documents`);
            setCarDocuments(response.data);
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la récupération des documents du véhicule ${vehiculeId}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec du chargement des documents.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 🔽 Télécharge un document à partir du serveur
    const downloadDocument = async (fileName) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`${fileName}`, {
                responseType: 'blob', // Spécifie le type de réponse pour les fichiers binaires
            });

            // Crée une URL temporaire pour le blob et déclenche le téléchargement
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success('Document téléchargé avec succès !');
        } catch (err) {
            console.error(`Erreur lors du téléchargement du document ${fileName}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec du téléchargement du document.');
        } finally {
            setLoading(false);
        }
    };

    // 🛡️ Met à jour l'état de vérification d'un véhicule (pour les admins)
    const updateVehicleVerificationState = async (vehiculeId, isVerified) => {
        if (!user || user.role !== "Admin") {
            toast.error("Accès refusé. Cette action est réservée aux administrateurs.");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/api/v1/vehicules/update-verify-state/${vehiculeId}/${isVerified}`);
            setCars(prevCars =>
                prevCars.map(car => car.id === vehiculeId ? { ...car, isVerified: isVerified } : car)
            );
            toast.success(`État de vérification du véhicule ${vehiculeId} mis à jour avec succès !`);
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la mise à jour de l'état de vérification pour le véhicule ${vehiculeId}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || `Échec de la mise à jour de l'état de vérification.`);
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
        fetchUserCars,
        getCarById,
        createCar,
        updateCar,
        deleteCar,
        uploadVehicleDocument,
        getVehicleDocuments,
        updateVehicleVerificationState,
        userId: user?.id || null,
        // Nouvelles valeurs pour la gestion par l'admin
        adminCars,
        adminCarPagination,
        isLoadingAdminCars,
        adminCarListError,
        fetchAdminCars,
        // Nouvelle fonction de téléchargement
        downloadDocument,
        // Nouvel état pour les détails et documents
        carDetails,
        isCarDetailsLoading,
        carDocuments,
        // Nouvelles valeurs pour la gestion des permis de conduire par l'admin
        adminLicences,
        adminLicencePagination,
        isLoadingAdminLicences,
        adminLicenceListError,
        fetchAdminDrivingLicences,
        // Nouvelles valeurs pour les documents de véhicule d'admin
        adminVehicleDocuments,
        isLoadingAdminVehicleDocuments,
        adminVehicleDocumentsError,
        fetchAdminVehicleDocuments,
    };

    return (
        <carContext.Provider value={contextValue}>
            {children}
        </carContext.Provider>
    );
}

export default CarContextProvider;