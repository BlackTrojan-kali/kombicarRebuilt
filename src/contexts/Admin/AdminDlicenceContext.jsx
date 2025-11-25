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

  // 3. NOUVELLE FONCTION AJOUTÉE : getLicenceDetailsAdmin
  const getLicenceDetailsAdmin = async (licenceId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/v1/licence-driving/admin/details/${licenceId}`);
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
    downloadLicenceDocument,
    changeVerificationState,
    getLicencesList,
    getLicenceDetailsAdmin, // <-- Ajout de la nouvelle fonction
  };

  return (
    <AdminDLicenceContext.Provider value={value}>
      {children}
    </AdminDLicenceContext.Provider>
  );
}
 
export const useAdminDLicenceContext = () => useContext(AdminDLicenceContext);