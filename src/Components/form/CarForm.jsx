import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCar, faTag, faChair, faPalette, faIdCard, faSpinner, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const CarForm = ({ initialCarData, onSave, isEditing, textColorPrimary, textColorSecondary, inputBg, inputBorder }) => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    numberPlaces: '',
    color: '',
    registrationCode: '',
    isVerified: false, // Valeur par défaut
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialCarData) {
      setFormData({
        brand: initialCarData.brand || '',
        model: initialCarData.model || '',
        numberPlaces: initialCarData.numberPlaces || '',
        color: initialCarData.color || '',
        registrationCode: initialCarData.registrationCode || '',
        isVerified: initialCarData.isVerified ?? false,
      });
    } else {
      // Réinitialiser le formulaire si on passe en mode création
      setFormData({
        brand: '',
        model: '',
        numberPlaces: '',
        color: '',
        registrationCode: '',
        isVerified: false,
      });
    }
  }, [initialCarData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Ajouter l'ID du véhicule si c'est une modification
    const dataToSave = isEditing ? { ...formData, id: initialCarData.id } : formData;

    try {
      await onSave(dataToSave, isEditing);
      if (!isEditing) {
        // Réinitialiser le formulaire après une création réussie
        setFormData({
          brand: '',
          model: '',
          numberPlaces: '',
          color: '',
          registrationCode: '',
          isVerified: false,
        });
      }
    } catch (error) {
      // Les toasts d'erreur sont déjà gérés par le CarContext, mais vous pouvez ajouter ici une gestion spécifique si besoin.
      console.error("Erreur lors de la sauvegarde du véhicule dans le formulaire:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      id="car-form" // L'ID pour le lien avec le bouton de la modal
      onSubmit={handleSubmit}
      // Les classes suivantes gèrent le défilement et la hauteur maximale du formulaire.
      // Elles permettent au contenu de défiler si la page est trop petite.
      className={`space-y-6 overflow-y-auto max-h-[calc(100vh-240px)]`}
    >
      <div>
        <label htmlFor="brand" className={`block text-sm font-medium ${textColorPrimary} mb-1`}>
          <FontAwesomeIcon icon={faTag} className="mr-2" /> Marque:
        </label>
        <input
          type="text"
          id="brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          required
          className={`w-full p-3 rounded-lg ${inputBg} ${textColorPrimary} border ${inputBorder} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      <div>
        <label htmlFor="model" className={`block text-sm font-medium ${textColorPrimary} mb-1`}>
          <FontAwesomeIcon icon={faCar} className="mr-2" /> Modèle:
        </label>
        <input
          type="text"
          id="model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          required
          className={`w-full p-3 rounded-lg ${inputBg} ${textColorPrimary} border ${inputBorder} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      <div>
        <label htmlFor="numberPlaces" className={`block text-sm font-medium ${textColorPrimary} mb-1`}>
          <FontAwesomeIcon icon={faChair} className="mr-2" /> Nombre de places:
        </label>
        <input
          type="number"
          id="numberPlaces"
          name="numberPlaces"
          value={formData.numberPlaces}
          onChange={handleChange}
          required
          min="1"
          className={`w-full p-3 rounded-lg ${inputBg} ${textColorPrimary} border ${inputBorder} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      <div>
        <label htmlFor="color" className={`block text-sm font-medium ${textColorPrimary} mb-1`}>
          <FontAwesomeIcon icon={faPalette} className="mr-2" /> Couleur:
        </label>
        <input
          type="text"
          id="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          required
          className={`w-full p-3 rounded-lg ${inputBg} ${textColorPrimary} border ${inputBorder} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      <div>
        <label htmlFor="registrationCode" className={`block text-sm font-medium ${textColorPrimary} mb-1`}>
          <FontAwesomeIcon icon={faIdCard} className="mr-2" /> Code d'immatriculation:
        </label>
        <input
          type="text"
          id="registrationCode"
          name="registrationCode"
          value={formData.registrationCode}
          onChange={handleChange}
          required
          className={`w-full p-3 rounded-lg ${inputBg} ${textColorPrimary} border ${inputBorder} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isVerified"
          name="isVerified"
          checked={formData.isVerified}
          onChange={handleChange}
          className={`h-5 w-5 text-blue-600 rounded focus:ring-blue-500 ${inputBg} ${inputBorder}`}
        />
        <label htmlFor="isVerified" className={`ml-2 block text-sm font-medium ${textColorPrimary}`}>
          <FontAwesomeIcon icon={faShieldAlt} className="mr-2" /> Véhicule Vérifié
        </label>
      </div>
      <button
        type="submit"
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : isEditing
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-md'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
        } flex items-center justify-center`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            Sauvegarde...
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {isEditing ? 'Modifier le Véhicule' : 'Publier le Véhicule'}
          </>
        )}
      </button>
    </form>
  );
};

export default CarForm;
