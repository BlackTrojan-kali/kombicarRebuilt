import React, { useState } from 'react';
import usePromoCode from '../../hooks/usePromoCode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faPlus } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

// Définition du composant
const CreatePromoCodeModal = ({ isOpen, onClose }) => {
  // Accès à la fonction de création via le hook
  const { createPromoCode } = usePromoCode();
  
  // Définition du mapping pour la disponibilité
  const availabilityOptions = {
    0: "Covoiturage", // Correspond à CARPOOLING
    1: "VTC",          // Correspond à VTC
    3: "Tous"          // Correspond à ALL
  };

  // États pour les données du formulaire, le chargement et les messages
  const [formData, setFormData] = useState({
    name: '',
    reductionPercent: '',
    availability: '', // Initialiser à vide pour forcer la sélection
    expiredAt: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Construction de l'objet de données à envoyer
      // Les champs numeric et date doivent être formatés
      const newCodeData = {
        name: formData.name,
        // Conversion des champs numériques
        reductionPercent: parseInt(formData.reductionPercent, 10),
        availability: parseInt(formData.availability, 10),
        // Conversion de la date en ISO 8601
        expiredAt: formData.expiredAt ? dayjs(formData.expiredAt).toISOString() : null,
      };
      
      await createPromoCode(newCodeData);
      setSuccess("Code promotionnel créé avec succès !");
      
      // Réinitialiser le formulaire après un court délai
      setTimeout(() => {
        setFormData({ name: '', reductionPercent: '', availability: '', expiredAt: '' });
        onClose();
      }, 1500);

    } catch (err) {
      setError("Échec de la création. Veuillez vérifier les informations et réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rendu conditionnel
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative p-8 w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all duration-300 scale-100 opacity-100">
        {/* Bouton de fermeture */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-full transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        <h3 className="text-2xl font-extrabold mb-6 text-center text-gray-900 dark:text-white">
          <FontAwesomeIcon icon={faPlus} className="mr-2 text-blue-500" />
          Créer un Nouveau Code Promo
        </h3>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm font-medium">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4 text-sm font-medium">{success}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nom du code */}
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nom du code (ex: SUMMER20)</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                required
              />
            </div>
            
            {/* Pourcentage de réduction */}
            <div>
              <label htmlFor="reductionPercent" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Réduction (%)</label>
              <input
                type="number"
                name="reductionPercent"
                id="reductionPercent"
                value={formData.reductionPercent}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                required
              />
            </div>

            {/* Disponibilité (SELECT mis à jour) */}
            <div>
              <label htmlFor="availability" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Disponible pour</label>
              <select
                name="availability"
                id="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                required
              >
                <option value="" disabled>Sélectionner la cible</option>
                {Object.entries(availabilityOptions).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date d'expiration */}
            <div className="sm:col-span-2">
              <label htmlFor="expiredAt" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date d'expiration</label>
              <input
                type="date"
                name="expiredAt"
                id="expiredAt"
                value={formData.expiredAt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : 'Créer le code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePromoCodeModal;
