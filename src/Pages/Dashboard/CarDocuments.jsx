// src/pages/admin/CarDocuments.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, 
    faFileAlt, 
    faDownload, 
    faCalendarAlt, 
    faSyncAlt, 
    faExclamationTriangle, 
    faFolderOpen 
} from '@fortawesome/free-solid-svg-icons';

// 🛑 Remplacement de useCar par useAdminCarContext
import { useAdminCarContext } from '../../contexts/Admin/CarAdminContext';
import useColorScheme from '../../hooks/useColorScheme';

const CarDocuments = () => {
  const { vehiculeId } = useParams();
  const navigate = useNavigate();
  const { theme } = useColorScheme();
  const isDark = theme === 'dark';

  const { 
    fetchAdminVehicleDocuments, 
    adminVehicleDocuments, 
    isLoadingAdminVehicleDocuments, 
    adminVehicleDocumentsError, 
    downloadDocument 
  } = useAdminCarContext();

  useEffect(() => {
    if (vehiculeId) {
      fetchAdminVehicleDocuments(vehiculeId).catch(err => {
        console.error("Failed to fetch admin vehicle documents:", err);
      });
    }
  }, [vehiculeId]);

  const handleDownload = async (documentUrl) => {
    try {
      await downloadDocument(documentUrl);
    } catch (err) {
      console.log(err);
    }
  };

  // ----------------------------------------
  // ETATS DE CHARGEMENT ET ERREUR
  // ----------------------------------------
  if (isLoadingAdminVehicleDocuments) {
    return (
      <div className="pl-12 pt-8 pb-40 bg-slate-50 dark:bg-slate-900 min-h-screen text-center">
        <div className="py-32">
          <FontAwesomeIcon icon={faSyncAlt} className="text-4xl text-blue-500 animate-spin mb-4 opacity-80" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Chargement des documents...</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Récupération des fichiers pour le véhicule #{vehiculeId}.</p>
        </div>
      </div>
    );
  }

  if (adminVehicleDocumentsError) {
    return (
      <div className="pl-12 pt-8 pb-40 bg-slate-50 dark:bg-slate-900 min-h-screen text-center">
        <div className="py-20 max-w-lg mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl p-8 shadow-sm">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Erreur de chargement</h2>
            <p className="text-red-600/80 dark:text-red-400/80 mb-6">
              {adminVehicleDocumentsError}
            </p>
            <button 
                onClick={() => navigate('/admin/cars')}
                className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-2.5 px-6 rounded-xl transition-all"
            >
                Retour aux véhicules
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------
  // VUE PRINCIPALE
  // ----------------------------------------
  return (
    <div className="pl-12 pt-8 pb-40 bg-slate-50 dark:bg-slate-900 min-h-screen pr-6">
      
      {/* EN-TÊTE AVEC BOUTON RETOUR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/admin/cars')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-95"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Documents du Véhicule <span className="text-blue-600 dark:text-blue-400">#{vehiculeId}</span>
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Consultez et téléchargez les pièces justificatives.
                </p>
            </div>
        </div>
      </div>

      {/* CONTENU */}
      {(!adminVehicleDocuments || adminVehicleDocuments.length === 0) ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 p-12 text-center">
            <FontAwesomeIcon icon={faFolderOpen} className="text-6xl text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Aucun document</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Le propriétaire n'a pas encore téléversé de documents pour ce véhicule.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {adminVehicleDocuments.map((doc) => (
            <div 
                key={doc.id} 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 p-5 flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <FontAwesomeIcon icon={faFileAlt} className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2" title={doc.name || `Document Type ${doc.type}`}>
                    {doc.name || `Document (Type: ${doc.type})`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1.5 font-medium">
                    <FontAwesomeIcon icon={faCalendarAlt} className="opacity-70" /> 
                    Ajouté le {new Date(doc.createdAt).toLocaleDateString('fr-CM')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDownload(doc.url)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 transition-colors active:scale-[0.98]"
              >
                <FontAwesomeIcon icon={faDownload} />
                Télécharger le fichier
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarDocuments;