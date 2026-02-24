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
  
  const { userId } = useParams();
  
  useEffect(() => {
    if (userId) {
      getLicenceByUserId(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleStatusChange = (state) => {
    let reason = null;
    if (state === 2) { // 2 = Rejeté
      reason = window.prompt("Veuillez saisir le motif du rejet :");
      if (!reason) return; // Annulation de l'action si aucun motif
    } else {
      if (!window.confirm("Confirmez-vous la validation de ce permis ?")) return;
    }
    
    changeVerificationState(driverLicence.id, state, reason);
  };

  if (isLoadingDriverLicence) return <div className="p-4 text-center text-gray-500 dark:text-gray-400 animate-pulse">Chargement du permis...</div>;
  if (driverLicenceError) return <div className="p-4 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">Erreur : {driverLicenceError}</div>;
  if (!driverLicence) return <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">Aucun permis enregistré pour ce chauffeur.</div>;

  return (
    <div className="space-y-6 transition-colors duration-200">
      <h2 className="text-xl font-bold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-800 dark:text-white">
        Permis de Conduire
      </h2>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex justify-between items-start mb-6">
          <div>
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">
               Permis N° {driverLicence.licenceNumber || "Non spécifié"}
             </h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
               Date d'expiration : <span className="font-medium text-gray-700 dark:text-gray-300">{driverLicence.expirationDate ? new Date(driverLicence.expirationDate).toLocaleDateString('fr-FR') : "Inconnue"}</span>
             </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
            ${driverLicence.verificationState === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
              driverLicence.verificationState === 2 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
            {driverLicence.verificationState === 1 ? "Validé" : 
             driverLicence.verificationState === 2 ? "Rejeté" : "En attente"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
          <div>
            <span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">Catégorie(s)</span> 
            <span className="font-semibold text-gray-900 dark:text-gray-100">{driverLicence.categories || "B"}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">Pays d'émission</span> 
            <span className="font-semibold text-gray-900 dark:text-gray-100">{driverLicence.country || "Non spécifié"}</span>
          </div>
        </div>

        {/* Actions Administrateur */}
        <div className="flex flex-wrap gap-3 mt-4 border-t border-gray-100 dark:border-gray-700 pt-5">
          <button 
            onClick={() => handleStatusChange(1)} // 1 = Validé
            disabled={driverLicence.verificationState === 1}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            Valider le permis
          </button>
          
          <button 
            onClick={() => handleStatusChange(2)} // 2 = Rejeté
            disabled={driverLicence.verificationState === 2}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            Rejeter
          </button>

          {driverLicence.documentUrl && (
            <button 
              onClick={() => downloadLicenceDocument(driverLicence.documentUrl)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center ml-auto"
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