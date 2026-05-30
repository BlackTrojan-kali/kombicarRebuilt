// src/services/fileService.ts
import api from '../config/api';

export const fileService = {
  /**
   * Télécharge un fichier depuis le serveur et force le téléchargement dans le navigateur.
   * @param fileUrl - La propriété 'url' du fichier (ex: de user.pictureProfileUrl ou licence.url)
   * @param customDownloadName - (Optionnel) Un nom personnalisé pour le fichier téléchargé.
   */
  downloadFile: async (fileUrl: string, customDownloadName?: string): Promise<void> => {
    // On extrait uniquement le nom du fichier à la fin de l'URL
    // Ex: "https://api.com/images/permis-123.jpg" devient "permis-123.jpg"
    const fileName = fileUrl.split('/').pop();

    if (!fileName) {
      throw new Error("Impossible d'extraire le nom du fichier depuis l'URL fournie.");
    }

    try {
      // Appel à l'endpoint global avec le type de réponse 'blob' (Données binaires)
      const response = await api.get(`/api/download/${fileName}`, {
        responseType: 'blob',
      });

      // Création d'une URL locale temporaire pour ces données binaires
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      
      // Création d'un élément <a> invisible pour déclencher le téléchargement
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Nom du fichier téléchargé : soit le nom personnalisé, soit le nom d'origine
      link.setAttribute('download', customDownloadName || fileName);
      
      // Ajout au DOM, clic forcé, puis nettoyage
      document.body.appendChild(link);
      link.click();
      
      // Nettoyage des éléments temporaires pour libérer la mémoire
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier :", error);
      throw error;
    }
  },

  /**
   * (Bonus) Récupère l'URL locale d'un fichier sécurisé pour l'afficher dans une balise <img />
   * Très utile si les images nécessitent le token d'authentification pour être vues.
   */
  getFileUrlForDisplay: async (fileUrl: string): Promise<string> => {
    const fileName = fileUrl.split('/').pop();
    if (!fileName) throw new Error("Nom de fichier invalide.");
    
    const response = await api.get(`/api/download/${fileName}`, {
      responseType: 'blob',
    });
    
    return window.URL.createObjectURL(new Blob([response.data]));
  }
};