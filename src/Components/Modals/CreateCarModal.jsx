import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar, faTag, faCalendarAlt, faPalette, faFileAlt, faIdCard, faCarSide
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';
import toast, { Toaster } from 'react-hot-toast'; // Import de Toaster et toast

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
  ];

  // État unique pour gérer tous les champs du formulaire
  const [carFormData, setCarFormData] = useState({
    marque: '',
    modele: '',
    annee: '',
    couleurId: '',
    disponible: false, // Ajout du champ disponible pour le statut
    // Les champs ci-dessous ne sont pas utilisés dans le contexte actuel mais sont inclus pour l'exemple
    licensePlate: '',
    chassisNumber: '',
    description: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  // Gère l'initialisation des champs et le mode (création/édition)
  useEffect(() => {
    if (isOpen) {
      if (initialCarData) {
        // Mode édition
        setCarFormData({
          marque: initialCarData.marque || '',
          modele: initialCarData.modele || '',
          annee: initialCarData.annee || '',
          couleurId: initialCarData.couleurId || '',
          disponible: initialCarData.disponible !== undefined ? initialCarData.disponible : true,
          licensePlate: initialCarData.licensePlate || '',
          chassisNumber: initialCarData.chassisNumber || '',
          description: initialCarData.description || '',
        });
        setIsEditing(true);
      } else {
        // Mode création
        setCarFormData({
          marque: '',
          modele: '',
          annee: '',
          couleurId: '',
          disponible: true,
          licensePlate: '',
          chassisNumber: '',
          description: '',
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
    
    // Valider les champs nécessaires
    if (!carFormData.marque.trim() || !carFormData.modele.trim() || !carFormData.annee || !carFormData.couleurId) {
      toast.error('Veuillez remplir tous les champs obligatoires (Marque, Modèle, Année, Couleur).');
      return;
    }
    
    const selectedColor = availableColors.find(c => c.id === parseInt(carFormData.couleurId, 10));

    const carToSave = {
      ...initialCarData, // Garde l'ID si c'est une modification
      marque: carFormData.marque,
      modele: carFormData.modele,
      annee: parseInt(carFormData.annee, 10), // Assurer que l'année est un nombre
      couleur: selectedColor ? selectedColor.name : 'Inconnu', // Stocke le nom de la couleur
      disponible: carFormData.disponible,
      // Les champs ci-dessous ne sont pas dans le contexte, mais peuvent être envoyés si l'API les gère
      licensePlate: carFormData.licensePlate,
      chassisNumber: carFormData.chassisNumber,
      description: carFormData.description,
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
          {/* Marque */}
          <div>
            <label htmlFor="marque" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marque</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faCarSide} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="marque"
                name="marque"
                value={carFormData.marque}
                onChange={handleChange}
                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Ex: Toyota"
                required
              />
            </div>
          </div>

          {/* Modèle */}
          <div>
            <label htmlFor="modele" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modèle</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faCar} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="modele"
                name="modele"
                value={carFormData.modele}
                onChange={handleChange}
                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Ex: Corolla"
                required
              />
            </div>
          </div>

          {/* Année */}
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
                max={new Date().getFullYear() + 2} // Limiter l'année future
                required
              />
            </div>
          </div>

          {/* Couleur */}
          <div>
            <label htmlFor="couleurId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Couleur</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faPalette} className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="couleurId"
                name="couleurId"
                value={carFormData.couleurId}
                onChange={handleChange}
                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                required
              >
                <option value="">Sélectionner une couleur</option>
                {availableColors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Numéro d'Immatriculation */}
          <div>
            <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Numéro d'Immatriculation</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faIdCard} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="licensePlate"
                name="licensePlate"
                value={carFormData.licensePlate}
                onChange={handleChange}
                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Ex: CE-123-CD"
              />
            </div>
          </div>

          {/* Numéro de Châssis (VIN) */}
          <div>
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
          
          {/* Statut de disponibilité */}
          <div className="md:col-span-2 flex items-center mt-2">
            <input
              type="checkbox"
              id="disponible"
              name="disponible"
              checked={carFormData.disponible}
              onChange={handleChange}
              className={`h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500
                ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}`}
            />
            <label htmlFor="disponible" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Disponible pour la location
            </label>
          </div>

          {/* Description (sur toute la largeur) */}
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
        </form>
      </Modal>
    </>
  );
};

export default CarFormModal;
