import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar, faTag, faCalendarAlt, faPalette, faFileAlt, faIdCard, faCarSide, faChair, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';
import toast, { Toaster } from 'react-hot-toast';

const CarFormModal = ({ isOpen, onClose, onSaveCar, initialCarData }) => {
  const { theme } = useColorScheme();

  // Liste de couleurs (déplacée à l'extérieur pour ne pas être recréée à chaque rendu)
  const availableColors = [
    { id: 1, name: 'Blanc', hexCode: '#FFFFFF' },
    { id: 2, name: 'Noir', hexCode: '#000000' },
    { id: 3, name: 'Gris', hexCode: '#808080' },
    { id: 4, name: 'Rouge', hexCode: '#FF0000' },
    { id: 5, name: 'Bleu', hexCode: '#0000FF' },
    { id: 6, name: 'Vert', hexCode: '#008000' },
    { id: 7, name: 'Jaune', hexCode: '#FFFF00' },
    { id: 8, name: 'Argent', hexCode: '#C0C0C0' },
    { id: 9, name: 'Orange', hexCode: '#FFA500' },
    { id: 10, name: 'Marron', hexCode: '#A52A2A' },
  ];

  // État unique pour gérer tous les champs du formulaire, ALIGNÉ AVEC LE DTO
  const [carFormData, setCarFormData] = useState({
    brand: '', // Correspond à 'brand' dans le DTO
    model: '', // Correspond à 'model' dans le DTO
    numberPlaces: 5, // Correspond à 'numberPlaces' dans le DTO, valeur par défaut
    color: '', // Correspond à 'color' dans le DTO (nom de la couleur)
    isVerified: false, // Correspond à 'isVerified' dans le DTO
    registrationCode: '', // Correspond à 'registrationCode' dans le DTO
    // Les champs ci-dessous ne sont pas dans le DTO fourni, mais sont conservés si votre API les utilise
    // ou si vous prévoyez d'étendre votre DTO.
    // annee: '', // A été supprimé car non dans le DTO Vehicule
    // chassisNumber: '', // Non dans le DTO Vehicule
    // description: '', // Non dans le DTO Vehicule
  });

  const [isEditing, setIsEditing] = useState(false);

  // Gère l'initialisation des champs et le mode (création/édition)
  useEffect(() => {
    if (isOpen) {
      if (initialCarData) {
        // Mode édition: Mapper les données initiales aux champs du formulaire
        setCarFormData({
          brand: initialCarData.brand || '',
          model: initialCarData.model || '',
          numberPlaces: initialCarData.numberPlaces || 5, // Default à 5 si non défini
          color: initialCarData.color || '',
          isVerified: initialCarData.isVerified ?? false, // Utilisez 'isVerified'
          registrationCode: initialCarData.registrationCode || '',
          // S'il y a d'autres champs non-DTO, les mapper ici
          // annee: initialCarData.annee || '',
          // chassisNumber: initialCarData.chassisNumber || '',
          // description: initialCarData.description || '',
        });
        setIsEditing(true);
      } else {
        // Mode création: Réinitialiser les champs
        setCarFormData({
          brand: '',
          model: '',
          numberPlaces: 5,
          color: '',
          isVerified: false,
          registrationCode: '',
          // annee: '',
          // chassisNumber: '',
          // description: '',
        });
        setIsEditing(false);
      }
    }
  }, [isOpen, initialCarData]);

  // Handler générique pour mettre à jour l'état du formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCarFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Valider les champs nécessaires selon votre DTO
    if (!carFormData.brand.trim() || !carFormData.model.trim() || !carFormData.numberPlaces || !carFormData.color.trim() || !carFormData.registrationCode.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires (Marque, Modèle, Nombre de Places, Couleur, Immatriculation).');
      return;
    }
    
    // Construction de l'objet à envoyer, aligné avec le DTO
    const carToSave = {
      ...(isEditing && { id: initialCarData.id }), // Inclure l'ID seulement en mode édition
      brand: carFormData.brand,
      model: carFormData.model,
      numberPlaces: parseInt(carFormData.numberPlaces, 10), // Assurer que c'est un entier
      color: carFormData.color, // La couleur est déjà le nom de la couleur sélectionnée
      isVerified: carFormData.isVerified,
      registrationCode: carFormData.registrationCode,
      // Les champs ci-dessous ne sont pas dans le DTO fourni, à réintégrer si nécessaire
      // annee: parseInt(carFormData.annee, 10),
      // chassisNumber: carFormData.chassisNumber,
      // description: carFormData.description,
    };

    onSaveCar(carToSave, isEditing); // Passe les données et le mode
    onClose(); // Ferme la modal après la soumission
  };

  const modalTitle = isEditing ? "Modifier le Véhicule" : "Ajouter un Nouveau Véhicule";
  const submitButtonText = isEditing ? "Sauvegarder les Modifications" : "Créer le Véhicule";

  return (
    <>
      <Toaster />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={modalTitle}
        size="lg" // Utilisez une taille plus grande pour ce formulaire
        footer={
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="car-form" // Lier au formulaire par son ID
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {submitButtonText}
            </button>
          </div>
        }
      >
        <form id="car-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Marque (Brand) */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marque</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faCarSide} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="brand"
                name="brand" // CHANGÉ: de 'marque' à 'brand'
                value={carFormData.brand}
                onChange={handleChange}
                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Ex: Toyota"
                required
              />
            </div>
          </div>

          {/* Modèle (Model) */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modèle</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faCar} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="model"
                name="model" // CHANGÉ: de 'modele' à 'model'
                value={carFormData.model}
                onChange={handleChange}
                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Ex: Corolla"
                required
              />
            </div>
          </div>

          {/* Nombre de Places (numberPlaces) */}
          <div>
            <label htmlFor="numberPlaces" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de Places</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faChair} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="numberPlaces"
                name="numberPlaces"
                value={carFormData.numberPlaces}
                onChange={handleChange}
                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Ex: 5"
                min="1"
                required
              />
            </div>
          </div>

          {/* Couleur (color - nom de la couleur) */}
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Couleur</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faPalette} className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="color"
                name="color" // CHANGÉ: de 'couleurId' à 'color'
                value={carFormData.color} // La valeur est le nom de la couleur directement
                onChange={handleChange}
                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                required
              >
                <option value="">Sélectionner une couleur</option>
                {availableColors.map((color) => (
                  <option key={color.id} value={color.name}> {/* La valeur de l'option est le nom de la couleur */}
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Numéro d'Immatriculation (registrationCode) */}
          <div>
            <label htmlFor="registrationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Numéro d'Immatriculation</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faIdCard} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="registrationCode"
                name="registrationCode" // CHANGÉ: de 'licensePlate' à 'registrationCode'
                value={carFormData.registrationCode}
                onChange={handleChange}
                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Ex: AB-123-CD"
                required
              />
            </div>
          </div>
          
          {/* Statut Vérifié (isVerified) */}
          <div className="md:col-span-2 flex items-center mt-2">
            <input
              type="checkbox"
              id="isVerified"
              name="isVerified" // CHANGÉ: de 'disponible' à 'isVerified'
              checked={carFormData.isVerified}
              onChange={handleChange}
              className={`h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500
                ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}`}
            />
            <label htmlFor="isVerified" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Véhicule vérifié par les administrateurs
            </label>
          </div>

          {/* Champs non DTO supprimés pour l'instant */}
          {/*
          <div>
            <label htmlFor="annee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Année</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="annee"
                name="annee"
                value={carFormData.annee}
                onChange={handleChange}
                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Ex: 2020"
                min="1900"
                max={new Date().getFullYear() + 2}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="chassisNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Numéro de Châssis (VIN)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faFileAlt} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="chassisNumber"
                name="chassisNumber"
                value={carFormData.chassisNumber}
                onChange={handleChange}
                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Ex: JHGDFG6789KJHG5"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={carFormData.description}
              onChange={handleChange}
              className={`py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              placeholder="Informations supplémentaires sur le véhicule..."
            ></textarea>
          </div>
          */}
        </form>
      </Modal>
    </>
  );
};

export default CarFormModal;