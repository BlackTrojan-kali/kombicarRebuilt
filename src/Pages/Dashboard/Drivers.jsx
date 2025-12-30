// src/pages/admin/Drivers.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie, faEnvelope, faPhone, faStar, faTrash, 
  faUserPlus, faSyncAlt, faArrowLeft, faArrowRight,
  faTachometerAlt, faThumbsUp, faThumbsDown, faIdCard
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { toast } from "sonner";
import Swal from 'sweetalert2';

import useColorScheme from '../../hooks/useColorScheme';
import { useUserAdminContext } from '../../contexts/Admin/UsersAdminContext';

const Drivers = () => {
  const { theme } = useColorScheme();
  const isDark = theme === 'dark';

  const { 
    userList, 
    pagination, 
    isLoading, 
    listVerifiedConductors,
    error, 
    deleteUserAsAdmin 
  } = useUserAdminContext();

  const [currentPage, setCurrentPage] = useState(1); 

  useEffect(() => {
    listVerifiedConductors(currentPage); 
  }, [currentPage]);

  const handleNextPage = () => pagination?.hasNextPage && setCurrentPage((p) => p + 1);
  const handlePreviousPage = () => pagination?.hasPreviousPage && setCurrentPage((p) => p - 1);

  // Fonction pour générer le badge de statut selon le code de vérification
  const renderStatusBadge = (verificationState) => {
    let statusClasses, statusIcon, statusText;

    switch (verificationState) {
      case 0:
        statusClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
        statusIcon = faTachometerAlt;
        statusText = 'En attente';
        break;
      case 1:
        statusClasses = 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
        statusIcon = faThumbsUp;
        statusText = 'Vérifié';
        break;
      case 2:
        statusClasses = 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
        statusIcon = faThumbsDown;
        statusText = 'Rejeté';
        break;
      default:
        statusClasses = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        statusIcon = faIdCard;
        statusText = 'Non soumis';
        break;
    }

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${statusClasses}`}>
        <FontAwesomeIcon icon={statusIcon} />
        {statusText}
      </span>
    );
  };

  const handleDeleteDriver = async (driverId, driverName) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer le chauffeur ${driverName}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
      background: isDark ? '#1F2937' : '#FFFFFF',
      color: isDark ? '#F9FAFB' : '#1F2937',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await toast.promise(deleteUserAsAdmin(driverId), {
            loading: `Suppression de ${driverName}...`,
            success: `Le chauffeur ${driverName} a été supprimé.`,
            error: "Échec de la suppression.",
          });
          listVerifiedConductors(currentPage); 
        } catch (error) {
          console.error("Erreur suppression:", error);
        }
      }
    });
  };

  return (
    <div className="pl-12 pt-6 pb-40 bg-gray-50 dark:bg-gray-900 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 mr-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Liste des Chauffeurs Vérifiés 🚗
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => listVerifiedConductors(currentPage)}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            <FontAwesomeIcon icon={faSyncAlt} className={`${isLoading ? 'animate-spin' : ''} mr-2`} />
            Actualiser
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all active:scale-95"
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mr-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Chauffeurs Enregistrés ({pagination?.totalCount || 0})
        </h2>

        {isLoading ? (
          <div className="p-12 text-center text-blue-500">
            <FontAwesomeIcon icon={faSyncAlt} className="animate-spin text-3xl mb-4" />
            <p>Chargement des chauffeurs...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            <p>Erreur : {error}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
              <table className={`w-full table-auto ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                <thead>
                  <tr className={`uppercase text-[11px] font-bold text-left ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                    <th className="py-4 px-4">Chauffeur</th>
                    <th className="py-4 px-4">Contact</th>
                    <th className="py-4 px-4 text-center">Statut</th>
                    <th className="py-4 px-4 text-center">Note</th>
                    <th className="py-4 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {userList && userList.length > 0 ? (
                    userList.map((driver) => (
                      <tr key={driver.id} className={`border-b ${isDark ? "border-gray-700" : "border-gray-200"} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}>
                        {/* Infos Chauffeur */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                              <FontAwesomeIcon icon={faUserTie} />
                            </div>
                            <div className="flex flex-col">
                              <Link to={`/admin/users/details/${driver.id}`} className="font-bold hover:text-blue-500 transition-colors">
                                {driver.firstName} {driver.lastName}
                              </Link>
                              <span className="text-[10px] opacity-50 font-mono italic">{driver.id.substring(0, 8)}...</span>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-4 px-4 text-xs">
                          <div className="flex flex-col gap-1 italic opacity-80">
                            <span className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faEnvelope} className="w-3 text-blue-500" /> {driver.email}
                            </span>
                            <span className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faPhone} className="w-3 text-green-500" /> {driver.phoneNumber || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* STATUT (NOUVELLE COLONNE) */}
                        <td className="py-4 px-4 text-center">
                          {renderStatusBadge(driver.licenceDriving?.verificationState)}
                        </td>

                        {/* Note */}
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 px-2 py-1 rounded-full font-bold">
                            <FontAwesomeIcon icon={faStar} size="xs" />
                            {driver.note || "0.0"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleDeleteDriver(driver.id, `${driver.firstName} ${driver.lastName}`)}
                              className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-sm transition-all active:scale-90"
                              title="Supprimer"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-gray-500 italic">Aucun chauffeur trouvé.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={`mt-6 flex flex-col sm:flex-row justify-between items-center text-sm p-4 rounded-xl shadow-inner ${isDark ? "bg-gray-900/50 text-gray-200" : "bg-gray-50 text-gray-700"}`}>
              <div className="mb-4 sm:mb-0 font-medium">
                Affichage de <span className="text-blue-500">{(pagination?.page - 1) * 10 + 1}</span> à <span className="text-blue-500">{Math.min(pagination?.totalCount || 0, (pagination?.page || 1) * 10)}</span> sur <span className="font-bold">{pagination?.totalCount || 0}</span> chauffeurs.
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePreviousPage}
                  disabled={!pagination?.hasPreviousPage || isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${!pagination?.hasPreviousPage || isLoading ? "opacity-40 cursor-not-allowed bg-gray-200 dark:bg-gray-800" : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 shadow-sm"}`}
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Précédent
                </button>
                
                <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md">
                  Page {pagination?.page || 1}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={!pagination?.hasNextPage || isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${!pagination?.hasNextPage || isLoading ? "opacity-40 cursor-not-allowed bg-gray-200 dark:bg-gray-800" : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 shadow-sm"}`}
                >
                  Suivant <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Drivers;