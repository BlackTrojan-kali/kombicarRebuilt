import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faEnvelope, faPhone, faMapPin, faClock, faArrowLeft, faArrowRight,
  faEye, faEdit, faTrash, faUserPlus, faCheckCircle, faBan
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import useUser from '../../hooks/useUser';

const Utilisateurs = () => {
  const { theme } = useColorScheme();
  
  const {
    standardUserList,
    standardUserPagination,
    isLoadingStandardUsers,
    standardUserListError,
    listStandardUsers,
    deleteAdmin
  } = useUser();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    // La fonction doit être `async` pour utiliser `await`
    const fetchUsers = async () => {
      try {
        const data = await listStandardUsers(currentPage);
        if (data && data.totalCount !== undefined) {
          setTotalRows(data.totalCount);
        }
      } catch (err) {
        // Géré par le hook, donc pas de code ici
      }
    };
    fetchUsers();
  }, [])//currentPage, perPage, listStandardUsers]);

  useEffect(() => {
    if (standardUserListError) {
      toast.error(standardUserListError);
    }
  }, [])//standardUserListError]);

  const totalPages = Math.ceil(totalRows / perPage);
  const effectiveTotalPages = totalPages;

  const handleNextPage = () => {
    if (currentPage < effectiveTotalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer l'utilisateur ${userName}. Cette action est irréversible !`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
      background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
      color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deletePromise = deleteAdmin(userId);
        
        await toast.promise(deletePromise, {
          loading: `Suppression de ${userName}...`,
          success: `L'utilisateur ${userName} a été supprimé avec succès !`,
          error: (err) => `Erreur : ${err.message}`,
        });
        
        // Rafraîchir la liste après la suppression
        const data = await listStandardUsers({ page: currentPage, perPage: perPage });
        if (data && data.totalCount !== undefined) {
          setTotalRows(data.totalCount);
        }
      }
    });
  };

  const handleAddUser = () => {
    toast('Le formulaire pour ajouter un utilisateur de rôle NONE s\'ouvrira ici.', {
      icon: '👨‍👩‍👧‍👦',
      duration: 3000,
      position: 'top-right',
    });
  };

  const getStatusInfo = (isActivated) => {
      if (isActivated) {
          return { text: 'Actif', icon: faCheckCircle, classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
      } else {
          return { text: 'Bloqué', icon: faBan, classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
      }
  };

  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-full'>
      <Toaster />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Liste des Utilisateurs
        </h1>
        <button
          onClick={handleAddUser}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
          Ajouter un Utilisateur
        </button>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
        <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>Utilisateurs Enregistrés</h2>
        
        {isLoadingStandardUsers ? (
          <div className="p-4 text-center text-blue-500 dark:text-blue-400">Chargement des utilisateurs...</div>
        ) : standardUserListError ? (
          <div className="p-4 text-center text-red-500 dark:text-red-400">
            Une erreur est survenue lors du chargement des utilisateurs : {standardUserListError}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg">
              <table className={`w-full table-auto ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                <thead>
                  <tr className={`uppercase text-sm font-semibold text-left ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    <th className="py-3 px-4 rounded-tl-lg">ID</th>
                    <th className="py-3 px-4">Nom de l'utilisateur</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Téléphone</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {standardUserList && standardUserList.length > 0 ? (
                    standardUserList.map(user => {
                      const statusInfo = getStatusInfo(user.isActivated);
                      return (
                        <tr key={user.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} last:border-b-0`}>
                          <td className="py-4 px-4">{user.id}</td>
                          <td className="py-4 px-4">
                            <span className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                              {user.firstName} {user.lastName}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                              {user.email}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                              {user.phoneNumber}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center justify-center gap-1 ${statusInfo.classes}`}>
                                <FontAwesomeIcon icon={statusInfo.icon} />
                                {statusInfo.text}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => toast(`Affichage des détails de ${user.firstName}...`, { icon: 'ℹ️' })}
                                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                                title="Voir les détails"
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </button>
                              <button
                                onClick={() => toast(`Modification de ${user.firstName}...`, { icon: '✍️' })}
                                className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200"
                                title="Modifier"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id, user.firstName)}
                                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                                title="Supprimer"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center">
                          <FontAwesomeIcon icon={faUser} className="text-4xl mb-2" />
                          <p>Aucun utilisateur à afficher pour le moment.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className={`mt-4 flex flex-col sm:flex-row justify-between items-center text-sm p-4 rounded-md shadow ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
              <div className="mb-2 sm:mb-0">
                Affichage de {Math.min(totalRows, (currentPage - 1) * perPage + 1)} à {Math.min(totalRows, currentPage * perPage)} sur {totalRows} utilisateurs.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || isLoadingStandardUsers}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${currentPage === 1 || isLoadingStandardUsers ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  Précédent
                </button>
                <span className={`px-4 py-2 rounded-md font-bold ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  Page {currentPage} sur {effectiveTotalPages || 1}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= effectiveTotalPages || isLoadingStandardUsers}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${currentPage >= effectiveTotalPages || isLoadingStandardUsers ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  Suivant
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Utilisateurs;