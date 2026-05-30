// src/services/vehiculeService.ts
import api from '../config/api';
import type { 
  Vehicule, 
  AddVehiculePayload, 
  UpdateVehiculePayload, 
  VehiculeDocument, 
  VehiculeDocumentType 
} from '../types/VehiculesTypes';

export const vehiculeService = {

  /**
   * Ajoute un nouveau véhicule.
   * Method: POST
   * Endpoint: /v1/vehicules
   */
  addVehicule: async (payload: AddVehiculePayload): Promise<void> => {
    const response = await api.post('/v1/vehicules', payload);
    return response.data;
  },

  /**
   * Récupère la liste de tous les véhicules de l'utilisateur authentifié.
   * Method: GET
   * Endpoint: /v1/vehicules
   */
  getAllVehicules: async (): Promise<Vehicule[]> => {
    const response = await api.get<Vehicule[]>('/v1/vehicules');
    return response.data;
  },

  /**
   * Récupère les détails d'un véhicule spécifique.
   * Method: GET
   * Endpoint: /v1/vehicules/{id}
   */
  getVehiculeById: async (id: number): Promise<Vehicule> => {
    const response = await api.get<Vehicule>(`/v1/vehicules/${id}`);
    return response.data;
  },

  /**
   * Met à jour les détails d'un véhicule existant.
   * Method: PUT
   * Endpoint: /v1/vehicules
   */
  updateVehicule: async (payload: UpdateVehiculePayload): Promise<void> => {
    const response = await api.put('/v1/vehicules', payload);
    return response.data;
  },

  /**
   * Supprime un véhicule spécifique.
   * Method: DELETE
   * Endpoint: /v1/vehicules/{id}
   */
  deleteVehicule: async (id: number): Promise<void> => {
    const response = await api.delete(`/v1/vehicules/${id}`);
    return response.data;
  },

  /**
   * Téléverse un document pour un véhicule (carte grise, assurance, photo, etc.).
   * Method: POST
   * Endpoint: /v1/vehicules/upload/{documentType}/{vehiculeId}
   */
  uploadDocument: async (
    vehiculeId: number, 
    documentType: VehiculeDocumentType, 
    file: File
  ): Promise<void> => {
    const formData = new FormData();
    // Le paramètre de fichier est nommé "file" dans le Swagger
    formData.append('file', file);

    const response = await api.post(
      `/v1/vehicules/upload/${documentType}/${vehiculeId}`, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Liste tous les documents téléversés pour un véhicule spécifique.
   * Method: GET
   * Endpoint: /v1/vehicules/{vehiculeId}/documents
   */
  getVehiculeDocuments: async (vehiculeId: number): Promise<VehiculeDocument[]> => {
    const response = await api.get<VehiculeDocument[]>(`/v1/vehicules/${vehiculeId}/documents`);
    return response.data;
  }
};