import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faSpinner, faArrowLeft, faTimesCircle, faCheckCircle, faDownload } from '@fortawesome/free-solid-svg-icons';
import  useCars  from '../../hooks/useCar'; // Assurez-vous que le chemin est correct
import useColorScheme from '../../hooks/useColorScheme';
import toast, { Toaster } from 'react-hot-toast';

const VehiculeDoc = () => {
  // Récupération des paramètres de l'URL pour l'ID du véhicule
  const { vehiculeId } = useParams();

  // Accès aux fonctions et états du contexte de véhicules
  const { getVehicleDocuments, getCarById, loading, error } = useCars();
  
  // États locaux pour gérer les documents et les informations du véhicule
  const [documents, setDocuments] = useState([]);
  const [car, setCar] = useState(null);
  
  const { theme } = useColorScheme();
  
  // Définition des classes de style basées sur le thème
  const pageBgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  
  // Effet pour charger les documents et les détails du véhicule
  useEffect(() => {
    const fetchDocumentsAndCar = async () => {
      if (vehiculeId) {
        // Récupérer les documents
        const docs = await getVehicleDocuments(vehiculeId);
        if (docs) {
          setDocuments(docs);
        }

        // Récupérer les détails du véhicule
        const carData = await getCarById(vehiculeId);
        if (carData) {
          setCar(carData);
        }
      }
    };

    fetchDocumentsAndCar();
  }, [vehiculeId, getVehicleDocuments, getCarById]);

  // Gérer l'état de chargement initial
  if (loading && !car && documents.length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${pageBgColor} ${textColorPrimary}`}>
        <p className="text-xl">
          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
          Chargement des documents...
        </p>
      </div>
    );
  }

  return (
    <div className={`${pageBgColor} ${textColorPrimary} min-h-screen py-10 transition-colors duration-300`}>
      <Toaster />
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* En-tête de la page */}
        <div className="flex items-center mb-8">
          <Link to="/my-vehicles" className={`p-2 rounded-full ${cardBg} hover:bg-opacity-80 transition-colors`}>
            <FontAwesomeIcon icon={faArrowLeft} className={textColorPrimary} />
          </Link>
          <div className="ml-4">
            <h1 className={`text-3xl font-bold ${textColorPrimary}`}>
              Documents pour {car ? `${car.brand} ${car.model}` : 'ce véhicule'}
            </h1>
            <p className={textColorSecondary}>
              Liste de tous les documents téléversés pour ce véhicule.
            </p>
          </div>
        </div>

        {/* Affichage des documents */}
        {documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map(doc => (
              <div key={doc.id} className={`${cardBg} rounded-xl shadow-md p-4 flex items-center justify-between border ${borderColor}`}>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 text-2xl mr-4" />
                  <div>
                    <h3 className={`font-semibold text-lg ${textColorPrimary}`}>
                      {doc.name}
                    </h3>
                    <p className={`text-sm ${textColorSecondary}`}>
                      Type: {doc.type} - Créé le: {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium`}>
                    {doc.isVerified ? (
                      <span className="text-green-500 flex items-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Vérifié
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center">
                        <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                        Non Vérifié
                      </span>
                    )}
                  </span>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    title="Télécharger le document"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor} text-center`}>
            <p className={`${textColorSecondary} text-lg`}>
              Aucun document n'a été trouvé pour ce véhicule.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default VehiculeDoc;
