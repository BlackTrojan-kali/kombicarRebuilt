import React, { useState, useEffect } from 'react';
import useDrivingLicence from '../../hooks/useDrivingLicence';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faFileAlt, faUpload, faSave, faSpinner, faCheckCircle, faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { toast } from "sonner";

import useColorScheme from '../../hooks/useColorScheme';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const MyDrivingLicence = () => {
  const { theme } = useColorScheme();
  const {user} = useAuth();
 
  const { 
    licenceInfo, 
    loading, 
    error, 
    getLicenceDetails, 
    updateLicenceInfo, 
    uploadLicenceDocument 
  } = useDrivingLicence();

  const [licenceData, setLicenceData] = useState({
    licenseNumber: '',
    dateOfBirth: '',
    issueDate: '',
    expirationDate: '',
    category: 0 
  });
  const [file, setFile] = useState(null);

  const documentTypeMap = {
    0: "Carte Grise",
    1: "Attestation d'Assurance",
    2: "Permis de conduire",
    3: "Photo",
    4: "Photo d'immatriculation",
  };
  const licenceCategoryMap = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
  };

  useEffect(() => {
    getLicenceDetails();
  }, []);

  useEffect(() => {
    if (licenceInfo) {
      setLicenceData({
        licenseNumber: licenceInfo.licenseNumber || '',
        dateOfBirth: licenceInfo.dateOfBirth ? dayjs(licenceInfo.dateOfBirth).format('YYYY-MM-DD') : '',
        issueDate: licenceInfo.issueDate ? dayjs(licenceInfo.issueDate).format('YYYY-MM-DD') : '',
        expirationDate: licenceInfo.expirationDate ? dayjs(licenceInfo.expirationDate).format('YYYY-MM-DD') : '',
        category: licenceInfo.category || 0
      });
    }
  }, [licenceInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLicenceData(prevData => ({ 
      ...prevData, 
      // Convertir la catégorie en nombre uniquement si le nom est 'category'
      [name]: name === 'category' ? parseInt(value, 10) : value 
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdateInfoSubmit = async (e) => {
    e.preventDefault();
    
    // 🛑 Logique de formatage pour respecter l'ISO 8601 complet
    const formattedData = {
      ...licenceData,
      // Utiliser .toISOString() uniquement si la date n'est pas vide
      dateOfBirth: licenceData.dateOfBirth ? dayjs(licenceData.dateOfBirth).toISOString() : null,
      issueDate: licenceData.issueDate ? dayjs(licenceData.issueDate).toISOString() : null,
      expirationDate: licenceData.expirationDate ? dayjs(licenceData.expirationDate).toISOString() : null
    };
    // S'assurer que les champs requis (comme licenseNumber et dates) ne sont pas null/vides
    // Vous pouvez ajouter une validation front-end ici si nécessaire

    try {
      // Le toast de succès est géré dans le hook useDrivingLicence, 
      // donc nous laissons la gestion des erreurs ici pour éviter la duplication.
      await updateLicenceInfo(formattedData);
      // toast.success est retiré ici car il est déjà dans le hook.
    } catch (err) {
      // Le toast d'erreur est géré dans le hook useDrivingLicence.
      // Vous pouvez logguer l'erreur locale si besoin.
    }
  };

  const handleUploadDocumentSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Veuillez sélectionner un fichier à uploader.');
      return;
    }

    const formData = new FormData();
    formData.append('licenceFile', file);
    // La ligne suivante est commentée dans votre code, elle pourrait être nécessaire
    // si l'API exige le type de document dans le FormData et non dans l'URL.
    // formData.append('type', 2); 

    try {
      await uploadLicenceDocument(formData);
      // toast.success est retiré ici car il est déjà dans le hook.
    } catch (err) {
      // Le toast d'erreur est géré dans le hook useDrivingLicence.
    }
  };

  const pageBgColor = theme === 'dark' ? 'bg-gray-900' : '';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  if (loading && !licenceInfo) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${pageBgColor} ${textColor}`}>
        <FontAwesomeIcon icon={faSpinner} spin size="2x" className="mr-2" />
        <p className="text-xl">Chargement des informations du permis...</p>
      </div>
    );
  }

  return (
    <div className={`${pageBgColor} ${textColor} min-h-screen py-10 transition-colors duration-300`}>
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl sm:text-4xl font-extrabold'>
            <FontAwesomeIcon icon={faIdCard} className='mr-3 text-blue-500' />
            Mon Permis de Conduire
          </h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
            Gérez et mettez à jour les informations et le document de votre permis.
          </p>
        </div>

        {licenceInfo && (
          <div className={`${cardBg} rounded-xl shadow-md p-6 mb-6 text-center border ${borderColor}`}>
            <h2 className='text-xl font-bold mb-2'>Statut de vérification</h2>
            {licenceInfo.verificationState === 1 && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                <FontAwesomeIcon icon={faExclamationTriangle} className='mr-2' /> En attente de vérification
              </span>
            )}
            {licenceInfo.verificationState === 2 && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-800 dark:text-green-100">
                <FontAwesomeIcon icon={faCheckCircle} className='mr-2' /> Vérifié
              </span>
            )}
            {licenceInfo.verificationState === 3 && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-800 dark:text-red-100">
                <FontAwesomeIcon icon={faTimesCircle} className='mr-2' /> Rejeté
              </span>
            )}
            {licenceInfo.rejectionReason && (
              <p className={`text-sm mt-2 italic ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Raison du rejet: {licenceInfo.rejectionReason}</p>
            )}
            {licenceInfo.documentUrl && (
              <div className='mt-4'>
                <p className='font-semibold'>Document actuel :</p>
                <img src={licenceInfo.documentUrl} alt="Permis de conduire" className="mt-2 max-h-64 mx-auto rounded-lg shadow-lg border border-gray-300 dark:border-gray-600" />
              </div>
            )}
          </div>
        )}

        {/* Formulaire de mise à jour des infos */}
        <div className={`${cardBg} rounded-xl shadow-xl p-8 mb-8 border ${borderColor}`}>
          <h2 className={`text-2xl font-bold mb-4 pb-3 border-b ${borderColor}`}>
            <FontAwesomeIcon icon={faSave} className='mr-2 text-blue-500' />
            Mettre à jour les informations
          </h2>
          <form onSubmit={handleUpdateInfoSubmit} className='space-y-4'>
            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium">Numéro de permis</label>
              <input 
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={licenceData.licenseNumber}
                onChange={handleInputChange}
                required
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${inputBg} ${textColor}`}
              />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium">Date de naissance</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={licenceData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${inputBg} ${textColor}`}
                />
              </div>
              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium">Date de délivrance</label>
                <input
                  type="date"
                  id="issueDate"
                  name="issueDate"
                  value={licenceData.issueDate}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${inputBg} ${textColor}`}
                />
              </div>
              <div>
                <label htmlFor="expirationDate" className="block text-sm font-medium">Date d'expiration</label>
                <input
                  type="date"
                  id="expirationDate"
                  name="expirationDate"
                  value={licenceData.expirationDate}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${inputBg} ${textColor}`}
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium">Catégorie</label>
                <select
                  id="category"
                  name="category"
                  value={licenceData.category}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${inputBg} ${textColor}`}
                >
                  {Object.entries(licenceCategoryMap).map(([value, label]) => (
                    <option key={value} value={parseInt(value, 10)}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className='mr-2' /> Mise à jour...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className='mr-2' /> Sauvegarder les informations
                </>
              )}
            </button>
          </form>
        </div>

        {/* Formulaire de téléchargement de document */}
        <div className={`${cardBg} rounded-xl shadow-xl p-8 border ${borderColor}`}>
          <h2 className={`text-2xl font-bold mb-4 pb-3 border-b ${borderColor}`}>
            <FontAwesomeIcon icon={faFileAlt} className='mr-2 text-purple-500' />
            Télécharger le document
            {licenceInfo?.verificationState === 1 && (
              <span className={`ml-3 text-sm font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                (Remplacera le document actuel)
              </span>
            )}
          </h2>
          <form onSubmit={handleUploadDocumentSubmit} className='space-y-4'>
            <div>
              <label htmlFor="file" className="block text-sm font-medium">Sélectionner un fichier (JPEG, PNG ou PDF)</label>
              <input
                type="file"
                id="file"
                name="licenceFile"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                required
                className={`mt-1 block w-full text-sm ${inputBg} ${textColor}`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className='mr-2' /> Téléchargement...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faUpload} className='mr-2' /> Télécharger le document
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default MyDrivingLicence;