import { useState, useCallback } from 'react';
import api from '../../../api/api'; // Import de votre instance Axios centralisée

export const useAdminVtcDriver = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Les 4 paramètres sont obligatoires. Par défaut, on filtre les chauffeurs validés et en ligne.
  const getDrivers = useCallback(async (page = 1, pageSize = 12, status = true, isOnline = true) => {
    setIsLoading(true);
    setError(null);
    try {
      // Axios gère automatiquement la sérialisation des paramètres (URLSearchParams n'est plus nécessaire)
      const response = await api.get('/api/v1/admin/vtc/drivers', {
        params: { page, pageSize, status, isOnline }
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDriverDetails = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/v1/admin/vtc/drivers/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDriverDocuments = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/v1/admin/vtc/drivers/${id}/documents`);
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateDriver = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.put(`/api/v1/admin/vtc/drivers/${id}/validate`);
      return true;
    } catch (err) {
      setError(err.response?.data || err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const blockDriver = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.put(`/api/v1/admin/vtc/drivers/${id}/block`);
      return true;
    } catch (err) {
      setError(err.response?.data || err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getDrivers,
    getDriverDetails,
    getDriverDocuments,
    validateDriver,
    blockDriver
  };
};