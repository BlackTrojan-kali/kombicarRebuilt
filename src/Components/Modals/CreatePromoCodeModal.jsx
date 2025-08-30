import React, { useState } from 'react';
import usePromoCode from '../../hooks/usePromoCode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faPlus } from '@fortawesome/free-solid-svg-icons';

// Définition du composant
const CreatePromoCodeModal = ({ isOpen, onClose }) => {
  // Accès à la fonction de création via le hook
  const { createPromoCode } = usePromoCode();
  
  // États pour les données du formulaire, le chargement et les messages
  const [formData, setFormData] = useState({
    name: '',
    reductionPercent: '',
    availability: '',
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
      const newCodeData = {
        name: formData.name,
        reductionPercent: parseInt(formData.reductionPercent, 10),
        availability: parseInt(formData.availability, 10),
        expiredAt: new Date(formData.expiredAt).toISOString()
      };
      
      await createPromoCode(newCodeData);
      setSuccess("Code promotionnel créé avec succès !");
      
      // Réinitialiser le formulaire après un court délai
      setTimeout(() => {
        setFormData({ name: '', reductionPercent: '', availability: '', expiredAt: '' });
        onClose();
      }, 1500);

    } catch (err) {
      setError("Échec de la création. Veuillez vérifier les informations.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rendu conditionnel
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600/10 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative p-8 w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        {/* Bouton de fermeture */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        <h3 className="text-2xl font-bold mb-6 text-center">Créer un Nouveau Code Promo</h3>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4 text-center">{success}</div>}

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">Nom du code</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="reductionPercent" className="block text-sm font-medium mb-1">Pourcentage de réduction</label>
            <input
              type="number"
              name="reductionPercent"
              id="reductionPercent"
              value={formData.reductionPercent}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="availability" className="block text-sm font-medium mb-1">Disponibilité</label>
            <input
              type="number"
              name="availability"
              id="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="expiredAt" className="block text-sm font-medium mb-1">Date d'expiration</label>
            <input
              type="date"
              name="expiredAt"
              id="expiredAt"
              value={formData.expiredAt}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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