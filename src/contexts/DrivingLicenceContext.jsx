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
      toast.success("licence mise a jour avec success");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error("echec de la mise a jour du permis veillez verifiez vos champs");
      console.error("Échec de la mise à jour des informations du permis de conduire:", err);
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
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      console.error("Échec du téléchargement du document du permis de conduire:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to get license details
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
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
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

  // NOUVELLE FONCTION : Download a driving license document
  const downloadLicenceDocument = async (fileName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`${fileName}`, {
        responseType: 'blob', // Important: set responseType to 'blob' for binary data
      });
      
      // Create a temporary URL for the blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
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
    changeVerificationState,
    getLicencesList,
    downloadLicenceDocument // Add the new function to the context value
  };

  return (
    <DrivingLicenceContext.Provider value={value}>
      {children}
    </DrivingLicenceContext.Provider>
  );
}