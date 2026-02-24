import { useState, useCallback } from 'react';

export const useAdminVtcDriver = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = '/api/v1/admin/vtc/drivers';

  const handleResponse = async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw errorData || { code: 'UNKNOWN_ERROR', description: 'Une erreur est survenue' };
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  };

  const getDrivers = useCallback(async (page = 1, pageSize = 12, status, isOnline) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      
      if (status !== undefined) queryParams.append('status', status.toString());
      if (isOnline !== undefined) queryParams.append('isOnline', isOnline.toString());

      const response = await fetch(`${BASE_URL}?${queryParams.toString()}`);
      return await handleResponse(response);
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDriverDetails = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      return await handleResponse(response);
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDriverDocuments = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/${id}/documents`);
      return await handleResponse(response);
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateDriver = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/${id}/validate`, { method: 'PUT' });
      await handleResponse(response);
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const blockDriver = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/${id}/block`, { method: 'PUT' });
      await handleResponse(response);
      return true;
    } catch (err) {
      setError(err);
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