// src/services/sosService.ts
import api from '../config/api';
import type { TriggerSOSPayload } from '../types/SOSTypes';

export const sosService = {

  /**
   * Déclenche une alerte SOS pour un utilisateur en danger (passager ou conducteur).
   * Envoie la position GPS actuelle et l'identifiant de la course en cours.
   * Method: POST
   * Endpoint: /v1/sos/trigger
   */
  triggerSOS: async (payload: TriggerSOSPayload): Promise<void> => {
    // Si l'api-version est requise en query string selon ta config, tu peux l'ajouter dans 'params', 
    // mais le '/v1/' dans l'URL gère généralement le versioning dans ton architecture.
    const response = await api.post('/v1/sos/trigger', payload);
    return response.data;
  }

};