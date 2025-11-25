import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faEye, faArrowLeft, faArrowRight, faEdit, faDownload } from '@fortawesome/free-solid-svg-icons';
import useDrivingLicence from '../../hooks/useDrivingLicence';
import LicenceUpdateModal from '../../Components/Modals/LicenceUpdateModal';
import { useAdminDLicenceContext } from '../../contexts/Admin/AdminDlicenceContext';

const DrivingLicences = () => {
  const { verificationState = 0, page = 1 } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLicence, setSelectedLicence] = useState(null);

  const { 
    licenceList, 
    loading, 
    error, 
    getLicencesList,
    downloadLicenceDocument // Import the new download function
  } = useAdminDLicenceContext();

  useEffect(() => {
    getLicencesList(page, verificationState);
  }, [page, verificationState]);
  const handleUpdateClick = (licence) => {
    setSelectedLicence(licence);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLicence(null);
    // Optional: Re-fetch the list after closing the modal to ensure data is fresh.
    getLicencesList(page, verificationState);
  };

  // New function to handle the download click
  const handleDownloadClick = (licenceUrl) => {
    if (licenceUrl) {
    //  const fileName = licenceUrl.substring(licenceUrl.lastIndexOf('/') + 1);
      downloadLicenceDocument(licenceUrl);
    } else {
      console.error("URL du document non disponible.");
    }
  };

  const getStateColor = (state) => {
    switch (parseInt(state)) {
      case 1:
        return 'text-green-500';
      case 2:
        return 'text-red-500';
      case 0:
      default:
        return 'text-yellow-500';
    }
  };

  const getStateText = (state) => {
    switch (parseInt(state)) {
      case 1:
        return 'Vérifié';
      case 2:
        return 'Rejeté';
      case 0:
      default:
        return 'En attente';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FontAwesomeIcon icon={faClock} spin className="text-4xl text-blue-500" />
        <p className="ml-4 text-xl text-gray-700 dark:text-gray-300">Chargement des permis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500 text-lg">
        <p>Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className='pl-12  pt-6 pb-40 bg-gray-100 dark:bg-gray-900 min-h-screen'>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Permis de Conduire</h2>
          <div className="flex space-x-2 sm:space-x-4">
            <Link to="/admin/licences/0/1" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${verificationState == 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-yellow-700'}`}>
              En Attente
            </Link>
            <Link to="/admin/licences/1/1" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${verificationState == 1 ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-700'}`}>
              Vérifiés
            </Link>
            <Link to="/admin/licences/2/1" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${verificationState == 2 ? 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-700'}`}>
              Rejetés
            </Link>
          </div>
        </div>

        {licenceList?.items?.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500 dark:text-gray-400">Aucun permis de conduire trouvé pour cet état.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom du Chauffeur</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Numéro de Permis</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expiration</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">État</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {licenceList?.items?.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {item.firstName} {item.lastName}
                          </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{item.email}</div>
                          </div>
                        </div>
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{item.licenceDriving?.licenseNumber}</div>
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{item.licenceDriving?.expirationDate ? new Date(item.licenceDriving.expirationDate).toLocaleDateString() : 'N/A'}</div>
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStateColor(item.licenceDriving?.verificationState)} bg-opacity-10`}>
                          {getStateText(item.licenceDriving?.verificationState)}
                        </span>
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/licences/details/${item.licenceDriving?.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500 mr-2"
                          title="Voir les détails"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                        {/* The Update button will only appear if the license is pending */}
                        { (
                          <button
                            onClick={() => handleUpdateClick(item.licenceDriving)}
                            className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-500 mr-2"
                            title="Mettre à jour le statut"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        )}

                        {/* The Download button will appear if a document URL exists */}
                        {item.licenceDriving?.url && (
                          <button
                            onClick={() => handleDownloadClick(item.licenceDriving.url)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500"
                            title="Télécharger le document"
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </button>
                        )}
                  </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <Link
                to={`/admin/licences/${verificationState}/${parseInt(licenceList.page) - 1}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${licenceList.hasPreviousPage ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                aria-disabled={!licenceList.hasPreviousPage}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Précédent
              </Link>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {licenceList.page} sur {licenceList.totalCount > 0 ? Math.ceil(licenceList.totalCount / 10) : 1}
              </span>
              <Link
                to={`/admin/licences/${verificationState}/${parseInt(licenceList.page) + 1}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${licenceList.hasNextPage ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                aria-disabled={!licenceList.hasNextPage}
              >
                Suivant <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </>
        )}
      </div>

      {selectedLicence && (
        <LicenceUpdateModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          licence={selectedLicence}
        />
      )}
    </div>
  );
};

export default DrivingLicences;