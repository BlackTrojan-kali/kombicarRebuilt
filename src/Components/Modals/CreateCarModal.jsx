import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCarSide, faTag, faChair, faPalette, faIdCard, faWind, faList
} from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';

const CarForm = ({ onSave, initialCarData, isEditing, isLoading, theme }) => {

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

  const availableVehicleTypes = [
    { id: 0, name: 'Berline', icon: faCarSide },
    { id: 1, name: 'Compacte', icon: faCarSide },
    { id: 2, name: 'SUV', icon: faCarSide },
    { id: 3, name: 'Minibus', icon: faCarSide },
    { id: 4, name: 'Autre', icon: faCarSide },
  ];
  
  const [carFormData, setCarFormData] = useState({
    brand: '',
    model: '',
    numberPlaces: '',
    color: '',
    airConditionned: false,
    registrationCode: '',
    vehiculeType: '',
  });

  useEffect(() => {
    if (initialCarData) {
      setCarFormData({
        brand: initialCarData.brand || '',
        model: initialCarData.model || '',
        numberPlaces: initialCarData.numberPlaces || '',
        color: initialCarData.color || '',
        airConditionned: initialCarData.airConditionned ?? false,
        registrationCode: initialCarData.registrationCode || '',
        vehiculeType: initialCarData.vehiculeType ?? '',
      });
    } else {
      setCarFormData({
        brand: '',
        model: '',
        numberPlaces: '',
        color: '',
        airConditionned: false,
        registrationCode: '',
        vehiculeType: '',
      });
    }
  }, [initialCarData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCarFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation des champs
    if (!carFormData.brand.trim() || !carFormData.model.trim() || !carFormData.registrationCode.trim() || !carFormData.numberPlaces || carFormData.vehiculeType === '') {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    const carToSave = {
      ...carFormData,
      numberPlaces: parseInt(carFormData.numberPlaces, 10),
      vehiculeType: parseInt(carFormData.vehiculeType, 10),
    };
    
    if (isEditing) {
      carToSave.id = initialCarData.id;
    }

    onSave(carToSave, isEditing);
  };

  const inputClass = `w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500
    ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`;

  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center";
  
  return (
    <form id="car-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Toaster />
      {/* Marque (Brand) */}
      <div>
        <label htmlFor="brand" className={labelClass}>
            <FontAwesomeIcon icon={faTag} className="mr-2" />
            Marque *
        </label>
        <input type="text" id="brand" name="brand" value={carFormData.brand} onChange={handleChange} className={inputClass} placeholder="Ex: Toyota" required />
      </div>

      {/* Modèle (Model) */}
      <div>
        <label htmlFor="model" className={labelClass}>
            <FontAwesomeIcon icon={faCarSide} className="mr-2" />
            Modèle *
        </label>
        <input type="text" id="model" name="model" value={carFormData.model} onChange={handleChange} className={inputClass} placeholder="Ex: Corolla" required />
      </div>

      {/* Nombre de Places (numberPlaces) */}
      <div>
        <label htmlFor="numberPlaces" className={labelClass}>
            <FontAwesomeIcon icon={faChair} className="mr-2" />
            Nombre de Places *
        </label>
        <input type="number" id="numberPlaces" name="numberPlaces" value={carFormData.numberPlaces} onChange={handleChange} className={inputClass} placeholder="Ex: 5" min="1" required />
      </div>

      {/* Type de Véhicule (vehiculeType) */}
      <div>
        <label htmlFor="vehiculeType" className={labelClass}>
            <FontAwesomeIcon icon={faList} className="mr-2" />
            Type de Véhicule *
        </label>
        <select id="vehiculeType" name="vehiculeType" value={carFormData.vehiculeType} onChange={handleChange} className={inputClass} required>
          <option value="">Sélectionner un type</option>
          {availableVehicleTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Couleur (color) */}
      <div>
        <label htmlFor="color" className={labelClass}>
            <FontAwesomeIcon icon={faPalette} className="mr-2" />
            Couleur *
        </label>
        <select id="color" name="color" value={carFormData.color} onChange={handleChange} className={inputClass} required>
          <option value="">Sélectionner une couleur</option>
          {availableColors.map((color) => (
            <option key={color.id} value={color.name}>
              {color.name}
            </option>
          ))}
        </select>
      </div>

      {/* Numéro d'Immatriculation (registrationCode) */}
      <div>
        <label htmlFor="registrationCode" className={labelClass}>
            <FontAwesomeIcon icon={faIdCard} className="mr-2" />
            Numéro d'Immatriculation *
        </label>
        <input type="text" id="registrationCode" name="registrationCode" value={carFormData.registrationCode} onChange={handleChange} className={inputClass} placeholder="Ex: AB-123-CD" required />
      </div>
      
      {/* Climatisation (airConditionned) */}
      <div className="md:col-span-2 flex items-center mt-2">
        <input
          type="checkbox"
          id="airConditionned"
          name="airConditionned"
          checked={carFormData.airConditionned}
          onChange={handleChange}
          className={`h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}`}
        />
        <label htmlFor="airConditionned" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <FontAwesomeIcon icon={faWind} className="mr-2" />
            Véhicule climatisé
        </label>
      </div>
    </form>
  );
};

export default CarForm;
