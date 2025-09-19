import { createContext, useState } from "react";
import api from "../api/api";
import { toast } from "sonner";

export const DrivingLicenceContext = createContext({});

export function DrivingLicenceProvider({ children }) {
  const [licenceInfo, setLicenceInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour la mise à jour des infos JSON
  const updateLicenceInfo = async (licenceData) => {
    setLoading(true);
    setError(null);
    console.log(licenceData)
    try {
      const response = await api.put('/api/v1/licence-driving/update-infos', licenceData);
      
      setLicenceInfo(response.data);
      toast.success("licence mise a jour avec success")
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error("echec de la mise a jour du permis veillez verifiez vos champs")
      console.error("Échec de la mise à jour des informations du permis de conduire:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour le téléchargement de document
  const uploadLicenceDocument = async (formData) => {
    console.log(formData)
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/v1/licence-driving/upload', formData);
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

  // Fonction pour obtenir les détails du permis
  const getLicenceDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/v1/licence-driving/details');
      console.log(response);
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

  // Fonction mise à jour pour changer l'état de vérification
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

  const value = {
    licenceInfo,
    loading,
    error,
    updateLicenceInfo,
    uploadLicenceDocument,
    getLicenceDetails,
    changeVerificationState
  };

  return (
    <DrivingLicenceContext.Provider value={value}>
      {children}
    </DrivingLicenceContext.Provider>
  );
}