import React, { useEffect } from "react";
import { useAdminCarContext } from "../../contexts/Admin/CarAdminContext";
import { useParams } from "react-router-dom";

const DriverVehicles = () => {
  const {
    driverCars,
    isLoadingDriverCars,
    driverCarsError,
    fetchVehiclesByDriverId,
    updateVehicleVerificationState,
    downloadDocument,
  } = useAdminCarContext();

const {userId} = useParams()

  useEffect(() => {
    if (userId) {
      fetchVehiclesByDriverId(userId);
    }
  }, [userId]);

  const handleVerify = (vehiculeId, state) => {
    if (window.confirm(`Voulez-vous vraiment ${state ? 'valider' : 'rejeter'} ce véhicule ?`)) {
      updateVehicleVerificationState(vehiculeId, state);
    }
  };

  if (isLoadingDriverCars) return <div className="p-4 text-center">Chargement des véhicules...</div>;
  if (driverCarsError) return <div className="p-4 text-red-500">Erreur : {driverCarsError}</div>;
  if (!driverCars || driverCars.length === 0) return <div className="p-4 text-gray-500">Aucun véhicule trouvé pour ce chauffeur.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold border-b pb-2">Véhicules du Chauffeur</h2>
      
      {driverCars.map((car) => (
        <div key={car.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold uppercase">{car.brand} {car.model}</h3>
              <p className="text-sm text-gray-500">Immatriculation : <span className="font-mono text-black">{car.registrationCode}</span></p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${car.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {car.isVerified ? "Vérifié" : "En attente"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div><span className="font-semibold">Couleur :</span> {car.color}</div>
            <div><span className="font-semibold">Places :</span> {car.numberPlaces}</div>
            <div><span className="font-semibold">Climatisation :</span> {car.airConditionned ? "Oui" : "Non"}</div>
            {car.vtcVehicleType && (
              <div><span className="font-semibold">Catégorie VTC :</span> {car.vtcVehicleType.name}</div>
            )}
          </div>

          {/* Options VTC Détaillées */}
          {car.vtcVehicleType && (
            <div className="bg-gray-50 p-3 rounded text-sm mb-4">
              <h4 className="font-semibold mb-2">Tarification & Configuration</h4>
              <ul className="grid grid-cols-2 gap-2">
                <li>Base : {car.vtcVehicleType.baseFare} FCFA</li>
                <li>Prix/Km : {car.vtcVehicleType.pricePerKm} FCFA</li>
                <li>Commission : {car.vtcVehicleType.commissionPercent}%</li>
                <li>Capacité Max : {car.vtcVehicleType.capacity} passagers</li>
              </ul>
            </div>
          )}

          {/* Actions Administrateur */}
          <div className="flex gap-3 mt-4 border-t pt-4">
            {!car.isVerified ? (
              <button 
                onClick={() => handleVerify(car.id, true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition"
              >
                Approuver le véhicule
              </button>
            ) : (
              <button 
                onClick={() => handleVerify(car.id, false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition"
              >
                Révoquer l'approbation
              </button>
            )}
            
            <button 
              onClick={() => {/* Remplacez par votre logique pour obtenir l'URL du document */}}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm font-medium transition"
            >
              Voir les documents
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DriverVehicles;