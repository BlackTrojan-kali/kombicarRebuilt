import { createContext, useContext, useState } from "react";
import api from '../../api/api';
import { toast } from "sonner";
import useAuth from "../../hooks/useAuth";

export const carAdminContext = createContext({});

// Ce fournisseur de contexte gère toutes les opérations liées aux véhicules
export function CarAdminContextProvider({ children }) {
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
            const errorMessage = error.response?.data?.description || "Une erreur inattendue est survenue.";
            setAdminCarListError(errorMessage);
            toast.error(errorMessage);
            setAdminCars([]);
            throw error;
        } finally {
            setIsLoadingAdminCars(false);
        }
    };

    // 🔍 Fonction pour rechercher et filtrer les véhicules pour les administrateurs
    const searchAdminCars = async (page = 1, filters = {}) => {
        setIsLoadingAdminCars(true);
        setAdminCarListError(null);
        try {
            const response = await api.post(`/api/v1/vehicules/admin/search/${page}`, filters);

            if (response.status !== 200) {
                throw new Error("Échec de la recherche de véhicules.");
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
            console.error("Erreur lors de la recherche des véhicules pour l'admin:", error);
            const errorMessage = error.response?.data?.description || "Une erreur inattendue est survenue lors de la recherche.";
            setAdminCarListError(errorMessage);
            toast.error(errorMessage);
            setAdminCars([]);
            throw error;
        } finally {
            setIsLoadingAdminCars(false);
        }
    };
    
    // Fonctions pour les permis de conduire (Admin)
    const fetchAdminDrivingLicences = async (page = 1, verificationState = 0) => {
        // Logique vide pour le moment
    };

    // 📜 Fonction pour récupérer les documents d'un véhicule spécifique pour l'admin
    const fetchAdminVehicleDocuments = async (vehiculeId) => {
        setIsLoadingAdminVehicleDocuments(true);
        setAdminVehicleDocumentsError(null);
        try {
            const response = await api.get(`/api/v1/vehicules/admin/${vehiculeId}/documents`);
            
            if (response.status !== 200) {
                throw new Error("Échec de la récupération des documents du véhicule.");
            }
            
            setAdminVehicleDocuments(response.data);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la liste des documents du véhicule ${vehiculeId} pour l'admin:`, error);
            const errorMessage = error.response?.data?.description || "Une erreur inattendue est survenue lors de la récupération des documents.";
            setAdminVehicleDocumentsError(errorMessage);
            toast.error(errorMessage);
            setAdminVehicleDocuments([]);
            throw error;
        } finally {
            setIsLoadingAdminVehicleDocuments(false);
        }
    }; 
 
    // 🔎 Récupère un véhicule par son ID (Admin)
    const getCarById = async (id) => {
        setIsCarDetailsLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/v1/vehicules/admin/${id}`);
            
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

  

    // 📝 Met à jour un véhicule existant (Admin)
    const updateCar = async (id, carData) => {
        if (!user || user.role !== "Admin") {
            toast.error("Accès refusé. Cette action est réservée aux administrateurs.");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            // 🎯 APPEL À L'ENDPOINT PUT POUR LA MISE À JOUR
            const response = await api.put(`/api/v1/vehicules/admin/update`, carData);
            
            if (response.status !== 200) {
                throw new Error("Échec de la mise à jour du véhicule.");
            }

            const updatedCar = response.data;

            // Mise à jour de l'état local (adminCars) après un succès
            setAdminCars(prevAdminCars =>
                prevAdminCars.map(car => car.id === id ? updatedCar : car)
            );

            // Si les détails de ce véhicule sont affichés, on les met à jour aussi
            if (carDetails && carDetails.id === id) {
                setCarDetails(updatedCar);
            }

            toast.success(`Le véhicule ${id} a été mis à jour avec succès !`);
            return updatedCar;
        } catch (err) {
            console.error(`Erreur lors de la mise à jour du véhicule ${id}:`, err);
            
            const errorMessage = err.response?.data?.description || `Échec de la mise à jour du véhicule. (Code: ${err.response?.data?.code})`;
            
            setError(err);
            toast.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 🗑️ Supprime un véhicule (Admin)
    const deleteCar = async (id) => {
        if (!user || user.role !== "Admin") {
            toast.error("Accès refusé. Cette action est réservée aux administrateurs.");
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            // 🎯 APPEL À L'ENDPOINT DELETE POUR LA SUPPRESSION
            const response = await api.delete(`/api/v1/vehicules/admin/${id}`);
            
            if (response.status !== 200) {
                throw new Error("Échec de la suppression du véhicule.");
            }

            // Mise à jour de l'état local (adminCars) en filtrant le véhicule supprimé
            setAdminCars(prevAdminCars =>
                prevAdminCars.filter(car => car.id !== id)
            );

            // Réinitialisation des détails si le véhicule supprimé était affiché
            if (carDetails && carDetails.id === id) {
                setCarDetails(null);
            }

            toast.success(`Le véhicule ${id} a été supprimé avec succès.`);
            return true;
        } catch (err) {
            console.error(`Erreur lors de la suppression du véhicule ${id}:`, err);
            
            const errorMessage = err.response?.data?.description || `Échec de la suppression du véhicule. (Code: ${err.response?.data?.code})`;
            
            setError(err);
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 📄 Télécharge un document de véhicule (Admin)
    const uploadVehicleDocument = async (documentType, vehiculeId, file) => {
        if (!user || user.role !== "Admin") {
            toast.error("Accès refusé. Cette action est réservée aux administrateurs.");
            return null;
        }

        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append("file", file); // Assurez-vous que le backend attend le champ 'file'

        try {
            // 🎯 APPEL À L'ENDPOINT POST POUR LE TÉLÉVERSEMENT
            const response = await api.post(`/api/v1/vehicules/admin/upload/${documentType}/${vehiculeId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.status !== 200 && response.status !== 201) {
                throw new Error("Échec du téléversement du document.");
            }

            toast.success(`Document (${documentType}) téléversé et associé au véhicule ${vehiculeId} avec succès.`);
            // Note: Vous pourriez vouloir appeler fetchAdminVehicleDocuments(vehiculeId) ici
            // pour rafraîchir la liste des documents si elle est affichée.
            return response.data;
        } catch (err) {
            console.error(`Erreur lors du téléversement du document pour le véhicule ${vehiculeId}:`, err);
            
            const errorMessage = err.response?.data?.description || `Échec du téléversement du document. (Code: ${err.response?.data?.code})`;
            
            setError(err);
            toast.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 📜 Récupère les documents d'un véhicule
    const getVehicleDocuments = async (vehiculeId) => {
        // Logique vide pour le moment
    };

    // 🔽 Télécharge un document à partir du serveur
    const downloadDocument = async (fileName) => {
        // Logique vide pour le moment
    };

    // 🛡️ Met à jour l'état de vérification d'un véhicule (pour les admins)
    const updateVehicleVerificationState = async (vehiculeId, isVerified) => {
        if (!user ) {
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
            setAdminCars(prevAdminCars =>
                prevAdminCars.map(car => car.id === vehiculeId ? { ...car, isVerified: isVerified } : car)
            );

            toast.success(`État de vérification du véhicule ${vehiculeId} mis à jour avec succès !`);
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la mise à jour de l'état de vérification pour le véhicule ${vehiculeId}:`, err);
            
            const errorMessage = err.response?.data?.description || `Échec de la mise à jour de l'état de vérification. (Code: ${err.response?.data?.code})`;
            
            setError(err);
            toast.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const contextValue = {
        cars,
        loading,
        error,
        getCarById, 
        updateCar,
        deleteCar,
        uploadVehicleDocument, // 👈 Fonction mise à jour
        getVehicleDocuments,
        updateVehicleVerificationState,
        userId: user?.id || null,
        // Nouvelles valeurs pour la gestion par l'admin
        adminCars,
        adminCarPagination,
        isLoadingAdminCars,
        adminCarListError,
        fetchAdminCars,
        searchAdminCars,
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
        <carAdminContext.Provider value={contextValue}> 
            {children}
        </carAdminContext.Provider> 
    );
}

export default CarAdminContextProvider;
export const useAdminCarContext = () => useContext(carAdminContext);