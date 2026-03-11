import { useState, useEffect } from "react";
import { useCustomLocation } from "../../contexts/Admin/VTCcontexts/useCustomLocations";

const CreateCustomLocation = ({ isOpen, onClose, locationToEdit = null }) => {
  const { createLocation, updateLocation, isLoading } = useCustomLocation();
  
  const isEditMode = Boolean(locationToEdit);

  const initialFormState = {
    name: "",
    address: "",
    latitude: 0,
    longitude: 0,
    country: 0,
    aliases: "",
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          name: locationToEdit.name || "",
          address: locationToEdit.address || "",
          latitude: locationToEdit.latitude || 0,
          longitude: locationToEdit.longitude || 0,
          country: locationToEdit.country || 0,
          aliases: locationToEdit.aliases || "",
          isActive: locationToEdit.isActive !== undefined ? locationToEdit.isActive : true,
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, locationToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (type === "number" ? Number(value) : value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateLocation(locationToEdit.id, { ...formData, id: locationToEdit.id });
      } else {
        await createLocation(formData);
      }
      onClose(); 
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Conteneur de la modale */}
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg mx-4 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* En-tête de la modale */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {isEditMode ? "Modifier l'emplacement" : "Créer un emplacement"}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Corps du formulaire avec défilement si l'écran est petit */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="location-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition outline-none"
                placeholder="Ex: Aéroport CDG"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Adresse <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition outline-none"
                placeholder="Ex: Terminal 2E, Roissy"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Latitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Longitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pays <span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition outline-none"
              >
                <option value={0}>0 - Défaut</option>
                <option value={33}>33 - France</option>
                <option value={221}>221 - Sénégal</option>
                <option value={223}>223 - Mali</option>
                <option value={224}>224 - Guinée</option>
                <option value={225}>225 - Côte d'Ivoire</option>
                <option value={226}>226 - Burkina Faso</option>
                <option value={228}>228 - Togo</option>
                <option value={229}>229 - Bénin</option>
                <option value={237}>237 - Cameroun</option>
                <option value={243}>243 - RDC</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alias <span className="text-xs text-gray-500">(séparés par des virgules)</span>
              </label>
              <input
                type="text"
                name="aliases"
                value={formData.aliases}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition outline-none"
                placeholder="Ex: CDG, Roissy"
              />
            </div>

            {isEditMode && (
              <div className="pt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Emplacement actif
                  </span>
                </label>
              </div>
            )}
          </form>
        </div>

        {/* Pied de page de la modale (Boutons d'action) */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 font-medium"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            form="location-form"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading 
              ? "Enregistrement..." 
              : isEditMode ? "Mettre à jour" : "Créer l'emplacement"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateCustomLocation;