import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faClock, faEye, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import useCars from '../../hooks/useCar'; // Utilisation du hook useCars

const DrivingLicences = () => {
  const { verificationState = 0, page = 1 } = useParams();
  const {
    adminLicences,
    adminLicencePagination,
    isLoadingAdminLicences,
    adminLicenceListError,
    fetchAdminDrivingLicences,
    downloadDocument,
  } = useCars();

  useEffect(() => {
    fetchAdminDrivingLicences(page, verificationState);
  }, [page, verificationState]);

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

  if (isLoadingAdminLicences) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FontAwesomeIcon icon={faClock} spin className="text-4xl text-blue-500" />
        <p className="ml-4 text-xl text-gray-700 dark:text-gray-300">Chargement des permis...</p>
      </div>
    );
  }

  if (adminLicenceListError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500 text-lg">
        <p>Erreur: {adminLicenceListError}</p>
      </div>
    );
  }

  return (
    <div className='p-6 bg-gray-100 dark:bg-gray-900 min-h-screen'>
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

        {adminLicences.length === 0 ? (
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
                  {adminLicences.map((licence) => (
                    <tr key={licence.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {licence.user?.firstName} {licence.user?.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{licence.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{licence.licenseNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{new Date(licence.expirationDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStateColor(licence.verificationState)} bg-opacity-10`}>
                          {getStateText(licence.verificationState)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/licences/details/${licence.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500 mr-4"
                          title="Voir les détails"
                        >
                          <FontAwesomeIcon icon={faEye} className="mr-1" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <Link
                to={`/admin/licences/${verificationState}/${parseInt(page) - 1}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${adminLicencePagination.hasPreviousPage ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                aria-disabled={!adminLicencePagination.hasPreviousPage}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Précédent
              </Link>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {adminLicencePagination.page} sur {Math.ceil(adminLicencePagination.totalCount / 10)}
              </span>
              <Link
                to={`/admin/licences/${verificationState}/${parseInt(page) + 1}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${adminLicencePagination.hasNextPage ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                aria-disabled={!adminLicencePagination.hasNextPage}
              >
                Suivant <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DrivingLicences;