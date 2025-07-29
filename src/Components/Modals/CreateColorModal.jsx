import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Assurez-vous que le chemin est correct vers votre composant Modal
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faHashtag } from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme'; // Assurez-vous que le chemin est correct

const ColorFormModal = ({ isOpen, onClose, onSaveColor, initialColorData }) => {
  const { theme } = useColorScheme();
  const [colorName, setColorName] = useState('');
  const [hexCode, setHexCode] = useState('#FFFFFF');
  const [isEditing, setIsEditing] = useState(false);

  // Gère l'initialisation des champs et le mode (création/édition)
  useEffect(() => {
    if (isOpen) {
      if (initialColorData) {
        // Mode édition
        setColorName(initialColorData.name);
        setHexCode(initialColorData.hexCode);
        setIsEditing(true);
      } else {
        // Mode création
        setColorName('');
        setHexCode('#FFFFFF');
        setIsEditing(false);
      }
    }
  }, [isOpen, initialColorData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (colorName.trim() && hexCode.trim()) {
      const colorToSave = {
        ...initialColorData, // Garde l'ID si c'est une modification
        name: colorName,
        hexCode: hexCode
      };
      onSaveColor(colorToSave, isEditing); // Passe les données et le mode
      onClose(); // Ferme la modal après la soumission
    } else {
      // Potentiellement afficher un message d'erreur ou un toast ici
      alert('Veuillez remplir tous les champs.');
    }
  };

  const handleHexCodeChange = (e) => {
    let value = e.target.value;
    // S'assurer que le code hexadécimal commence par '#' si l'utilisateur ne l'a pas mis
    if (!value.startsWith('#') && value.length > 0) {
      value = '#' + value;
    }
    setHexCode(value);
  };

  const modalTitle = isEditing ? "Modifier la Couleur" : "Ajouter une Nouvelle Couleur";
  const submitButtonText = isEditing ? "Sauvegarder les Modifications" : "Créer la Couleur";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="md"
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
            form="color-form" // Lier au formulaire par son ID
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {submitButtonText}
          </button>
        </div>
      }
    >
      <form id="color-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="colorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de la Couleur</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faPalette} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="colorName"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              placeholder="Ex: Bleu Ciel"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="hexCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code Hexadécimal</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faHashtag} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="hexCode"
              value={hexCode}
              onChange={handleHexCodeChange}
              className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              placeholder="Ex: #FF5733"
              maxLength="7" // # + 6 caractères hexadécimaux
              required
            />
          </div>
        </div>

        {/* Aperçu de la couleur */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aperçu :</span>
          <div
            className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-md"
            style={{ backgroundColor: hexCode }}
            title={colorName || 'Aperçu de la couleur'}
          ></div>
        </div>
      </form>
    </Modal>
  );
};

export default ColorFormModal;