import { useCallback, useState } from "react";
import { toast } from "sonner";
import api from "../../../api/api";

export const useCustomLocation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  // Ajout de l'état de pagination initialisé avec un totalCount à 0 par défaut
  const [pagination, setPagination] = useState({ totalCount: 0 }); 

  // GET: Récupère la liste paginée
  const fetchLocations = useCallback(async (page = 1, pageSize = 20, country = null) => {
    setIsLoading(true);
    try {
      const params = { page, pageSize };
      if (country) params.country = country;

      const response = await api.get('/api/v1/admin/custom-locations', { params });
      
      // Mise à jour de la liste des emplacements
      setLocations(response.data.items || response.data || []); 
      
      // Mise à jour de la pagination (ajustez "totalCount" selon le nom exact renvoyé par votre API)
      setPagination({
        totalCount: response.data.totalCount || response.data.length || 0,
        // Vous pouvez ajouter d'autres champs ici si votre API les renvoie, ex: totalPages: response.data.totalPages
      });

      return response.data;
    } catch (error) {
      toast.error("Erreur lors de la récupération des emplacements.");
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // POST: Crée un nouvel emplacement
  const createLocation = useCallback(async (locationData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/v1/admin/custom-locations', locationData);
      toast.success("L'emplacement a été créé avec succès.");
      return response.data;
    } catch (error) {
      toast.error("Erreur interne lors de la création de l'emplacement.");
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // PUT: Met à jour un emplacement existant
  const updateLocation = useCallback(async (id, locationData) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/api/v1/admin/custom-locations/${id}`, locationData);
      toast.success("L'emplacement a été mis à jour avec succès.");
      return response.data;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'emplacement.");
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // DELETE: Supprime un emplacement
  const deleteLocation = useCallback(async (id) => {
    setIsLoading(true);
    try {
      await api.delete(`/api/v1/admin/custom-locations/${id}`);
      toast.success("L'emplacement a été supprimé avec succès.");
      return true;
    } catch (error) {
      toast.error("Erreur lors de la suppression. L'emplacement n'a peut-être pas été trouvé.");
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // POST: Importe plusieurs emplacements (CSV ou JSON)
  const importLocationsBulk = useCallback(async (file) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/v1/admin/custom-locations/import-bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Les emplacements ont été importés avec succès.");
      return response.data;
    } catch (error) {
      toast.error("Erreur lors de l'importation des emplacements.");
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    locations,
    pagination, // Ne pas oublier d'exporter l'état ici pour le composant !
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    importLocationsBulk
  };
};