import { createContext, useContext, useState } from "react";
import api from "../../api/api";
import { toast } from "sonner";

export const AdminDLicenceContext = createContext({});

export function AdminDLicenceProvider({ children }) {
  const [licenceInfo, setLicenceInfo] = useState(null);
  const [licenceList, setLicenceList] = useState({
    items: [],
    totalCount: 0,
    page: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- NOUVEAUX ÉTATS POUR LE PERMIS D'UN CHAUFFEUR SPÉCIFIQUE ---
  const [driverLicence, setDriverLicence] = useState(null);
  const [isLoadingDriverLicence, setIsLoadingDriverLicence] = useState(false);
  const [driverLicenceError, setDriverLicenceError] = useState(null);

  // 1. Mise à jour de l'état de vérification (PUT)
  const changeVerificationState = async (licenceId, verificationState, rejectionReason = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/api/v1/licence-driving/change-verification-state`, {
        licenceId,
        verificationState,
        rejectionReason,
      });
      
      // Mise à jour locale pour garder l'interface réactive
      if (driverLicence?.id === licenceId) {
         setDriverLicence(prev => ({ ...prev, verificationState })); // Adaptez 'verificationState' au nom exact de votre propriété si besoin
      }
      if (licenceInfo?.id === licenceId) {
         setLicenceInfo(prev => ({ ...prev, verificationState }));
      }

      toast.success("État de vérification mis à jour.");
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error("Échec de la mise à jour de l'état de vérification.");
      console.error("Échec de la mise à jour de l'état de vérification:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // 2. Récupération de la liste paginée (GET)
  const getLicencesList = async (page = 1, verificationState = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/v1/licence-driving/admin/list-licences-driving/${page}/${verificationState}`);
      setLicenceList(response.data);
      toast.success("Liste des permis récupérée.");
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error("Échec de la récupération de la liste des permis.");
      console.error("Échec de la récupération de la liste des permis:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 3. Récupération des détails d'un permis (Admin)
  const getLicenceDetailsAdmin = async (licenceId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/v1/licence-driving/admin/details/${licenceId}`);
      setLicenceInfo(response.data);
      toast.success(`Détails du permis ${licenceId} récupérés.`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error("Échec de la récupération des détails du permis pour l'administrateur.");
      console.error("Échec de la récupération des détails du permis pour l'administrateur:", err);
      throw err;
    } finally {
      setLoading(false);
    } 
  };

  // 4. NOUVELLE FONCTION : Récupération du permis via l'ID de l'utilisateur
  const getLicenceByUserId = async (userId) => {
    setIsLoadingDriverLicence(true);
    setDriverLicenceError(null);
    try {
      // J'ai déduit ce chemin d'après vos conventions REST. Ajustez-le si l'URL exacte diffère.
      const response = await api.get(`/api/v1/vehicules/admin/details/${userId}`);
      setDriverLicence(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setDriverLicenceError(errorMessage);
      toast.error("Échec de la récupération de la licence du chauffeur.");
      console.error("Erreur récupération licence chauffeur:", err);
      throw err;
    } finally {
      setIsLoadingDriverLicence(false);
    }
  };

  // Function to download a driving license document
  const downloadLicenceDocument = async (fileName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`${fileName}`, { 
        responseType: 'blob',
      });
      
      const contentDisposition = response.headers['content-disposition'];
      let suggestedFileName = fileName.substring(fileName.lastIndexOf('/') + 1); 
      if (contentDisposition) {
          const matches = /filename="?(.+)"?/.exec(contentDisposition);
          if (matches && matches[1]) {
              suggestedFileName = matches[1];
          }
      }
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', suggestedFileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url); 

      toast.success("Téléchargement du document en cours...");
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error("Échec du téléchargement du document.");
      console.error("Échec du téléchargement du document:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    licenceInfo,
    licenceList,
    loading,
    error,
    downloadLicenceDocument,
    changeVerificationState,
    getLicencesList,
    getLicenceDetailsAdmin,
    // --- Nouveaux exports ---
    driverLicence,
    isLoadingDriverLicence,
    driverLicenceError,
    getLicenceByUserId,
  };

  return (
    <AdminDLicenceContext.Provider value={value}>
      {children}
    </AdminDLicenceContext.Provider>
  );
}
 
export const useAdminDLicenceContext = () => useContext(AdminDLicenceContext);