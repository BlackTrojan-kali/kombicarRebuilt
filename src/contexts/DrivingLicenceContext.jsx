import { createContext, useState } from "react";
import api from "../api/api";
import { toast } from "sonner";

export const DrivingLicenceContext = createContext({});

export function DrivingLicenceProvider({ children }) {
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

  // Function to update JSON info
  const updateLicenceInfo = async (licenceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put('/api/v1/licence-driving/update-infos', licenceData);
      setLicenceInfo(response.data);
      toast.success("Licence mise à jour avec succès");
      return true;
    } catch (err) {
      const defaultMessage = "Échec de la mise à jour du permis. Veuillez vérifier vos champs.";
      const apiError = err.response?.data;
      
      let errorMessage = defaultMessage;

      if (typeof apiError === 'string') {
        errorMessage = apiError;
      } else if (apiError?.message) {
        errorMessage = apiError.message;
      }
      
      toast.error(errorMessage);
      console.error("Échec de la mise à jour des informations du permis de conduire:", err);
      setError(errorMessage);
      throw err; // Ajout de throw err pour une gestion uniforme
    } finally {
      setLoading(false);
    }
  };

  // Function to upload a document
  const uploadLicenceDocument = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/v1/licence-driving/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLicenceInfo(response.data);
      toast.success("Document téléchargé avec succès.");
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error("Échec du téléchargement du document.");
      console.error("Échec du téléchargement du document du permis de conduire:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to get license details (for current user)
  const getLicenceDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/v1/licence-driving/details');
      setLicenceInfo(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      console.error("Échec de la récupération des détails du permis:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // NOUVELLE FONCTION : Get specific license details by ID for admin
  const getLicenceDetailsAdmin = async (licenceId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/v1/licence-driving/admin/details/${licenceId}`);
      console.log(response.data)
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

  // Function to change verification state
  const changeVerificationState = async (licenceId, verificationState, rejectionReason = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/api/v1/licence-driving/change-verification-state`, {
        licenceId,
        verificationState,
        rejectionReason
      });
      setLicenceInfo(response.data);
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

  // Function to get the list of licenses for admin
  const getLicencesList = async (page = 1, verificationState = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/v1/licence-driving/admin/list-licences-driving/${page}/${verificationState}`);
      setLicenceList(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      console.error("Échec de la récupération de la liste des permis:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to download a driving license document
  const downloadLicenceDocument = async (fileName) => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: Ajustez l'URL si votre endpoint de téléchargement est différent.
      const response = await api.get(`${fileName}`, { 
        responseType: 'blob',
      });
      
      // Tentative d'extraction du nom de fichier depuis Content-Disposition (bonne pratique)
      const contentDisposition = response.headers['content-disposition'];
      let suggestedFileName = fileName.substring(fileName.lastIndexOf('/') + 1); // Fallback: utiliser le dernier segment de l'URL
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
      window.URL.revokeObjectURL(url); // Libère la mémoire

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
    updateLicenceInfo,
    uploadLicenceDocument,
    getLicenceDetails,
    getLicenceDetailsAdmin, // <-- Ajout de la nouvelle fonction
    changeVerificationState,
    getLicencesList,
    downloadLicenceDocument,
  };

  return (
    <DrivingLicenceContext.Provider value={value}>
      {children}
    </DrivingLicenceContext.Provider>
  );
}