// src/Components/Modals/CreateCarModal.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faCar, faIdCard, faPalette, faUsers, faSnowflake, faEdit } from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';

const CarFormModal = ({ isOpen, onClose, onSave, carToEdit }) => {
  const { theme } = useColorScheme();
  const isDark = theme === 'dark';

  // Détection du mode (Création vs Édition)
  const isEditingMode = !!carToEdit;

  // État du formulaire basé sur le DTO AddVehiculeDto / UpdateVehiculeDto
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    numberPlaces: 4,
    color: '',
    registrationCode: '',
    airConditionned: false,
    vehiculeType: 0 // Valeur par défaut de l'énumération
  });

  // Remplir le formulaire si on est en mode édition
  useEffect(() => {
    if (carToEdit) {
      setFormData({
        id: carToEdit.id, // Nécessaire pour l'update
        brand: carToEdit.brand || '',
        model: carToEdit.model || '',
        numberPlaces: carToEdit.numberPlaces || 4,
        color: carToEdit.color || '',
        registrationCode: carToEdit.registrationCode || '',
        airConditionned: carToEdit.airConditionned || false,
        vehiculeType: carToEdit.vehiculeType || 0
      });
    } else {
      // Réinitialiser en mode création
      setFormData({
        brand: '',
        model: '',
        numberPlaces: 4,
        color: '',
        registrationCode: '',
        airConditionned: false,
        vehiculeType: 0
      });
    }
  }, [carToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // On passe les données du formulaire et le mode (true pour édition, false pour création)
    onSave(formData, isEditingMode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        } border`}
      >
        {/* HEADER MODAL */}
        <div className={`px-6 py-4 border-b flex justify-between items-center ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'}`}>
          <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isEditingMode ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/40'}`}>
                <FontAwesomeIcon icon={isEditingMode ? faEdit : faCar} size="sm" />
            </div>
            {isEditingMode ? 'Modifier le véhicule' : 'Nouveau véhicule'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* BODY MODAL */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-2">
            
            {/* Marque */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Marque</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FontAwesomeIcon icon={faCar} />
                </div>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Toyota"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                />
              </div>
            </div>

            {/* Modèle */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Modèle</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                placeholder="Ex: Corolla"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
              />
            </div>

            {/* Immatriculation */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Plaque d'immatriculation</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FontAwesomeIcon icon={faIdCard} />
                </div>
                <input
                  type="text"
                  name="registrationCode"
                  value={formData.registrationCode}
                  onChange={handleChange}
                  required
                  placeholder="Ex: CE-1234-AB"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none font-mono uppercase"
                />
              </div>
            </div>

            {/* Couleur */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Couleur</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FontAwesomeIcon icon={faPalette} />
                </div>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Noir"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                />
              </div>
            </div>

            {/* Nombre de places */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nombre de places</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <input
                  type="number"
                  name="numberPlaces"
                  min="1"
                  max="100"
                  value={formData.numberPlaces}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                />
              </div>
            </div>

            {/* Climatisation */}
            <div className="sm:col-span-2 mt-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            name="airConditionned"
                            checked={formData.airConditionned}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-300 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <FontAwesomeIcon icon={faSnowflake} className="text-blue-400" />
                        Véhicule climatisé
                    </span>
                </label>
            </div>

          </div>

          {/* FOOTER MODAL */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors active:scale-95"
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 flex items-center gap-2 ${
                isEditingMode 
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
              } shadow-lg`}
            >
              <FontAwesomeIcon icon={faSave} />
              {isEditingMode ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarFormModal;