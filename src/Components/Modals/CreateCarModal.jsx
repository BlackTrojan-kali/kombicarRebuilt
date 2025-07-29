import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Assurez-vous que le chemin est correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar, faTag, faCalendarAlt, faPalette, faFileAlt, faIdCard, faCarSide
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme'; // Assurez-vous que le chemin est correct

const CarFormModal = ({ isOpen, onClose, onSaveCar, initialCarData }) => {
  const { theme } = useColorScheme();

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [colorId, setColorId] = useState(''); // Pour stocker l'ID de la couleur sélectionnée
  const [licensePlate, setLicensePlate] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Exemple de liste de couleurs (à remplacer par vos données réelles depuis le backend)
  const availableColors = [
    { id: 1, name: 'Blanc', hexCode: '#FFFFFF' },
    { id: 2, name: 'Noir', hexCode: '#000000' },
    { id: 3, name: 'Gris', hexCode: '#808080' },
    { id: 4, name: 'Rouge', hexCode: '#FF0000' },
    { id: 5, name: 'Bleu', hexCode: '#0000FF' },
    { id: 6, name: 'Vert', hexCode: '#008000' },
    { id: 7, name: 'Jaune', hexCode: '#FFFF00' },
  ];

  // Gère l'initialisation des champs et le mode (création/édition)
  useEffect(() => {
    if (isOpen) {
      if (initialCarData) {
        // Mode édition
        setMake(initialCarData.make || '');
        setModel(initialCarData.model || '');
        setYear(initialCarData.year || '');
        setColorId(initialCarData.colorId || '');
        setLicensePlate(initialCarData.licensePlate || '');
        setChassisNumber(initialCarData.chassisNumber || '');
        setDescription(initialCarData.description || '');
        setIsEditing(true);
      } else {
        // Mode création
        setMake('');
        setModel('');
        setYear('');
        setColorId('');
        setLicensePlate('');
        setChassisNumber('');
        setDescription('');
        setIsEditing(false);
      }
    }
  }, [isOpen, initialCarData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Valider les champs nécessaires
    if (!make.trim() || !model.trim() || !year || !licensePlate.trim() || !colorId) {
      alert('Veuillez remplir tous les champs obligatoires (Marque, Modèle, Année, Immatriculation, Couleur).');
      return;
    }

    const carToSave = {
      ...initialCarData, // Garde l'ID si c'est une modification
      make,
      model,
      year: parseInt(year, 10), // Assurer que l'année est un nombre
      colorId: parseInt(colorId, 10), // Assurer que l'ID couleur est un nombre
      licensePlate,
      chassisNumber: chassisNumber.trim(),
      description: description.trim(),
    };

    onSaveCar(carToSave, isEditing); // Passe les données et le mode
    onClose(); // Ferme la modal après la soumission
  };

  const modalTitle = isEditing ? "Modifier le Véhicule" : "Ajouter un Nouveau Véhicule";
  const submitButtonText = isEditing ? "Sauvegarder les Modifications" : "Créer le Véhicule";

  return (
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
          <label htmlFor="make" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marque</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faCarSide} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              placeholder="Ex: Toyota"
              required
            />
          </div>
        </div>

        {/* Modèle */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modèle</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faCar} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              placeholder="Ex: Corolla"
              required
            />
          </div>
        </div>

        {/* Année */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Année</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
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
          <label htmlFor="colorId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Couleur</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faPalette} className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="colorId"
              value={colorId}
              onChange={(e) => setColorId(e.target.value)}
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
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              placeholder="Ex: CE-123-CD"
              required
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
              value={chassisNumber}
              onChange={(e) => setChassisNumber(e.target.value)}
              className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              placeholder="Ex: JHGDFG6789KJHG5"
            />
          </div>
        </div>

        {/* Description (sur toute la largeur) */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
              ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
            placeholder="Informations supplémentaires sur le véhicule..."
          ></textarea>
        </div>
      </form>
    </Modal>
  );
};

export default CarFormModal;