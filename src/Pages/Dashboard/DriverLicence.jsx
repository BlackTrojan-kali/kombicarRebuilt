import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAdminDLicenceContext } from "../../contexts/Admin/AdminDlicenceContext";

const DriverLicence = () => {
  const {
    driverLicence,
    isLoadingDriverLicence,
    driverLicenceError,
    getLicenceByUserId,
    changeVerificationState,
    downloadLicenceDocument,
  } = useAdminDLicenceContext();
const {userId} = useParams()
  useEffect(() => {
    if (userId) {
      getLicenceByUserId(userId);
    }
  }, [userId]);

  const handleStatusChange = (state) => {
    let reason = null;
    if (state === 2) { // 2 = Rejeté (exemple d'énumération : 0=En attente, 1=Validé, 2=Rejeté)
      reason = window.prompt("Veuillez saisir le motif du rejet :");
      if (!reason) return; // Annulation de l'action si aucun motif
    } else {
      if (!window.confirm("Confirmez-vous la validation de ce permis ?")) return;
    }
    
    changeVerificationState(driverLicence.id, state, reason);
  };

  if (isLoadingDriverLicence) return <div className="p-4 text-center">Chargement du permis...</div>;
  if (driverLicenceError) return <div className="p-4 text-red-500">Erreur : {driverLicenceError}</div>;
  if (!driverLicence) return <div className="p-4 text-gray-500">Aucun permis enregistré pour ce chauffeur.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold border-b pb-2">Permis de Conduire</h2>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <div>
             <h3 className="text-lg font-bold">Permis N° {driverLicence.licenceNumber || "Non spécifié"}</h3>
             <p className="text-sm text-gray-500">Date d'expiration : {driverLicence.expirationDate ? new Date(driverLicence.expirationDate).toLocaleDateString() : "Inconnue"}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold 
            ${driverLicence.verificationState === 1 ? 'bg-green-100 text-green-800' : 
              driverLicence.verificationState === 2 ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'}`}>
            {driverLicence.verificationState === 1 ? "Validé" : 
             driverLicence.verificationState === 2 ? "Rejeté" : "En attente"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div><span className="font-semibold">Catégorie(s) :</span> {driverLicence.categories || "B"}</div>
          <div><span className="font-semibold">Pays d'émission :</span> {driverLicence.country || "Non spécifié"}</div>
        </div>

        {/* Actions Administrateur */}
        <div className="flex flex-wrap gap-3 mt-4 border-t pt-4">
          <button 
            onClick={() => handleStatusChange(1)} // 1 = Validé
            disabled={driverLicence.verificationState === 1}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium transition"
          >
            Valider le permis
          </button>
          
          <button 
            onClick={() => handleStatusChange(2)} // 2 = Rejeté
            disabled={driverLicence.verificationState === 2}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium transition"
          >
            Rejeter
          </button>

          {driverLicence.documentUrl && (
            <button 
              onClick={() => downloadLicenceDocument(driverLicence.documentUrl)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition flex items-center"
            >
              Télécharger le scan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverLicence;