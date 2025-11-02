import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useCar from '../../hooks/useCar';
import { toast } from 'sonner';

const CarDocuments = () => {
  const { vehiculeId } = useParams();
  const { 
    fetchAdminVehicleDocuments, 
    adminVehicleDocuments, 
    isLoadingAdminVehicleDocuments, 
    adminVehicleDocumentsError, 
    downloadDocument 
  } = useCar();

  useEffect(() => {
    if (vehiculeId) {
      // Fetch the documents for the specific vehicle
      fetchAdminVehicleDocuments(vehiculeId).catch(err => {
        // The error is already handled by a toast in the context, but it's good practice to catch it here too.
        console.error("Failed to fetch admin vehicle documents:", err);
      });
    }
  }, [vehiculeId]);

  const handleDownload = async (documentUrl) => {
    try {
      // The URL contains the file name at the end, which is what the downloadDocument function needs.
    //  const fileName = documentUrl.split('/').pop();
      await downloadDocument(documentUrl);
    } catch (err) {
      console.log(err)
      // The error is already handled by a toast in the context.
    }
  };

  if (isLoadingAdminVehicleDocuments) {
    return <div className="text-center mt-8 text-gray-600">Chargement des documents...</div>;
  }

  if (adminVehicleDocumentsError) {
    return <div className="text-center mt-8 text-red-500">Erreur: {adminVehicleDocumentsError}</div>;
  }

  if (!adminVehicleDocuments || adminVehicleDocuments.length === 0) {
    return <div className="text-center mt-8 text-gray-500">Aucun document trouvé pour ce véhicule.</div>;
  }
  return (
    <div className="pl-12  pt-6 pb-40 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Documents du Véhicule (Admin)</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {adminVehicleDocuments.map((doc) => (
            <li key={doc.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <span className="text-lg font-medium text-gray-900">{doc.name}</span>
                <p className="text-sm text-gray-500">Créé le: {new Date(doc.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <button
                  onClick={() => handleDownload(doc.url)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Télécharger
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CarDocuments;