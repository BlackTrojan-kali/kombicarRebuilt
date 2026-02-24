import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdminCarContext } from "../../contexts/Admin/CarAdminContext";
import { toast } from "sonner";
import { useAdminVtc } from "../../contexts/Admin/VTCcontexts/useAdminVtc";

// Mapping de l'énumération VehiculeType pour l'affichage du type physique
const VEHICULE_TYPE_MAP = {
  0: "Berline",
  1: "SUV",
  2: "Van / Minibus"
};

const DriverVehicles = () => {
  const { userId } = useParams();

  // Contexte existant pour récupérer les véhicules du chauffeur
  const {
    driverCars,
    isLoadingDriverCars,
    driverCarsError,
    fetchVehiclesByDriverId,
    updateVehicleVerificationState,
    // downloadDocument,
  } = useAdminCarContext();

  // Hook VTC pour la validation et les catégories
  const { 
    vehicleTypes, 
    fetchVehicleTypes, 
    validateVehicle 
  } = useAdminVtc();

  // État local pour gérer la modale de validation
  const [validationModal, setValidationModal] = useState({
    isOpen: false,
    carId: null,
    carName: "",
    categoryId: ""
  });

  // ==========================================
  // GESTION DU CYCLE DE VIE
  // ==========================================

  useEffect(() => {
    if (userId) {
      fetchVehiclesByDriverId(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    fetchVehicleTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleRevoke = (vehiculeId) => {
    if (window.confirm(`Voulez-vous vraiment révoquer l'approbation de ce véhicule ?`)) {
      updateVehicleVerificationState(vehiculeId, false);
    }
  };

  const openValidationModal = (car) => {
    setValidationModal({
      isOpen: true,
      carId: car.id,
      carName: `${car.brand} ${car.model}`,
      // Pré-sélection basée strictement sur l'ID renvoyé par l'API
      categoryId: car.vtcVehicleTypeId !== null && car.vtcVehicleTypeId !== undefined ? car.vtcVehicleTypeId : "" 
    });
  };

  const handleConfirmValidation = async () => {
    const typeId = validationModal.categoryId !== "" ? parseInt(validationModal.categoryId, 10) : null;
    
    const success = await validateVehicle(validationModal.carId, typeId);
    
    if (success) {
      setValidationModal({ isOpen: false, carId: null, carName: "", categoryId: "" });
      fetchVehiclesByDriverId(userId); // Rafraîchit pour obtenir le nouveau vtcVehicleTypeId
    }
  };

  // ==========================================
  // RENDU
  // ==========================================

  if (isLoadingDriverCars) return <div className="p-8 text-center text-gray-500 dark:text-gray-400 animate-pulse">Chargement des véhicules...</div>;
  if (driverCarsError) return <div className="p-4 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">Erreur : {driverCarsError}</div>;
  if (!driverCars || driverCars.length === 0) return <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">Aucun véhicule trouvé pour ce chauffeur.</div>;

  return (
    <div className="space-y-6 relative transition-colors duration-200">
      <h2 className="text-xl font-bold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-800 dark:text-white">
        Véhicules du Chauffeur
      </h2>
      
      {driverCars.map((car) => {
        // On cherche la catégorie correspondante dans la liste chargée via l'API
        const currentVtcType = vehicleTypes.find(type => type.id === car.vtcVehicleTypeId);

        return (
          <div key={car.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold uppercase text-gray-900 dark:text-white">{car.brand} {car.model}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Immatriculation : <span className="font-mono font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{car.registrationCode}</span>
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${car.isVerified ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                {car.isVerified ? "Vérifié" : "En attente"}
              </span>
            </div>

            {/* Grille des caractéristiques du véhicule */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <div><span className="text-gray-500 dark:text-gray-400 block text-xs">Type de véhicule</span> <span className="font-medium text-gray-900 dark:text-gray-100">{VEHICULE_TYPE_MAP[car.vehiculeType] || 'Inconnu'}</span></div>
              <div><span className="text-gray-500 dark:text-gray-400 block text-xs">Couleur</span> <span className="font-medium text-gray-900 dark:text-gray-100">{car.color || 'N/A'}</span></div>
              <div><span className="text-gray-500 dark:text-gray-400 block text-xs">Places</span> <span className="font-medium text-gray-900 dark:text-gray-100">{car.numberPlaces}</span></div>
              <div><span className="text-gray-500 dark:text-gray-400 block text-xs">Climatisation</span> <span className="font-medium text-gray-900 dark:text-gray-100">{car.airConditionned ? "Oui" : "Non"}</span></div>
              <div><span className="text-gray-500 dark:text-gray-400 block text-xs">Tarification VTC</span> <span className="font-medium text-blue-600 dark:text-blue-400">{currentVtcType ? currentVtcType.name : 'Non assignée'}</span></div>
            </div>

            {/* Options VTC Détaillées tirées de currentVtcType */}
            {currentVtcType && (
              <div className="border border-blue-100 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-900/20 p-4 rounded-lg text-sm mb-4">
                <div className="flex items-center gap-2 mb-3">
                  {currentVtcType.iconUrl && (
                    <img src={currentVtcType.iconUrl} alt="Icon" className="w-5 h-5 object-contain" />
                  )}
                  <h4 className="font-bold text-blue-800 dark:text-blue-300 text-xs uppercase tracking-wider">Détails Catégorie : {currentVtcType.name}</h4>
                </div>
                <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <li className="text-gray-600 dark:text-gray-400"><span className="block text-xs">Prise en charge</span> <span className="font-bold text-gray-900 dark:text-gray-100">{currentVtcType.baseFare} CFA</span></li>
                  <li className="text-gray-600 dark:text-gray-400"><span className="block text-xs">Prix / Km</span> <span className="font-bold text-gray-900 dark:text-gray-100">{currentVtcType.pricePerKm} CFA</span></li>
                  <li className="text-gray-600 dark:text-gray-400"><span className="block text-xs">Commission</span> <span className="font-bold text-gray-900 dark:text-gray-100">{currentVtcType.commissionPercent}%</span></li>
                  <li className="text-gray-600 dark:text-gray-400"><span className="block text-xs">Frais d'annulation</span> <span className="font-bold text-gray-900 dark:text-gray-100">{currentVtcType.cancellationFee} CFA</span></li>
                </ul>
              </div>
            )}

            {/* Actions Administrateur */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              {!car.isVerified ? (
                <button 
                  onClick={() => openValidationModal(car)}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
                >
                  Approuver & Catégoriser
                </button>
              ) : (
                <button 
                  onClick={() => handleRevoke(car.id)}
                  className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-5 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Révoquer
                </button>
              )}
              
              <button 
                onClick={() => {/* Logique d'affichage des documents */}}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 px-5 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                Voir les documents
              </button>
            </div>
          </div>
        );
      })}

      {/* --- MODALE DE VALIDATION VTC --- */}
      {validationModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl transition-colors">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Valider le véhicule</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Vous êtes sur le point de valider le véhicule <span className="font-bold text-gray-900 dark:text-gray-100">{validationModal.carName}</span>. Vous pouvez lui assigner une catégorie tarifaire.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Catégorie VTC (Optionnelle)</label>
              <select 
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                value={validationModal.categoryId}
                onChange={(e) => setValidationModal({...validationModal, categoryId: e.target.value})}
              >
                <option value="">-- Ne pas assigner de catégorie pour l'instant --</option>
                {vehicleTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} (Base: {type.baseFare} CFA - {type.capacity} places)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setValidationModal({ isOpen: false, carId: null, carName: "", categoryId: "" })}
                className="px-5 py-2.5 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleConfirmValidation}
                className="px-5 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                Confirmer la validation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverVehicles;