// src/services/licenceService.ts
import api from '../config/api';
import type { UpdateLicencePayload, LicenceDetails } from '../types/LicenceTypes';

export const licenceService = {
  
  /**
   * Met à jour les informations du permis de conduire ou en crée un nouveau.
   * Method: PUT
   * Endpoint: /v1/licence-driving/update-infos
   */
  updateInfos: async (payload: UpdateLicencePayload): Promise<void> => {
    const response = await api.put('/v1/licence-driving/update-infos', payload);
    return response.data;
  },

  /**
   * Charge la photo du permis de conduire.
   * Method: POST
   * Endpoint: /v1/licence-driving/upload
   * @param file - Le fichier image sélectionné par l'utilisateur.
   */
  uploadFile: async (file: File): Promise<void> => {
    const formData = new FormData();
    // Le paramètre attendu par le body de la requête s'appelle "licenceFile"
    formData.append('licenceFile', file);

    // On surcharge le Content-Type car on envoie du multipart/form-data
    const response = await api.post('/v1/licence-driving/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  /**
   * Obtient les détails du permis de conduire de l'utilisateur authentifié.
   * Method: GET
   * Endpoint: /v1/licence-driving/details
   * @returns Les informations du permis ou null si une erreur 404 survient (aucun permis existant).
   */
  getDetails: async (): Promise<LicenceDetails | null> => {
    try {
      const response = await api.get<LicenceDetails>('/v1/licence-driving/details');
      return response.data;
    } catch (error: any) {
      // Si le backend renvoie 404 (Aucun permis trouvé), on retourne null de manière gracieuse
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  }
};