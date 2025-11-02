import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar, faBuilding, faUser, faIdCard,
  faEye, faEdit, faTrash, faPlusCircle, faCheckCircle, faTimesCircle, faCarSide,
  faPalette, faListAlt, faArrowLeft, faArrowRight, faFilter
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

import CarFormModal from '../../Components/Modals/CreateCarModal';
import useCars from '../../hooks/useCar';
import useColorScheme from '../../hooks/useColorScheme';
import { toast } from "sonner";

const Cars = () => {
  const { theme } = useColorScheme();

  const {
    adminCars,
    adminCarPagination,
    isLoadingAdminCars,
    adminCarListError,
    fetchAdminCars,
    deleteCar,
    createCar,
    updateCar,
    updateVehicleVerificationState
  } = useCars();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [carToEdit, setCarToEdit] = useState(null);
  const [verificationFilter, setVerificationFilter] = useState(false); // 'true', 'false', ou null pour tous

  useEffect(() => {
    fetchAdminCars(adminCarPagination.page || 1, verificationFilter);
  }, [adminCarPagination.page, verificationFilter]);

  useEffect(() => {
    if (adminCarListError) {
      toast.error(adminCarListError);
    }
  }, [adminCarListError]);

  const handleNextPage = () => {
    if (adminCarPagination.hasNextPage) {
      fetchAdminCars(adminCarPagination.page + 1, verificationFilter);
    }
  };

  const handlePreviousPage = () => {
    if (adminCarPagination.hasPreviousPage) {
      fetchAdminCars(adminCarPagination.page - 1, verificationFilter);
    }
  };

  const handleDeleteVehicle = (vehicleId, vehicleBrand, vehicleModel) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer le véhicule "${vehicleBrand} ${vehicleModel}". Cette action est irréversible !`,
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
        const success = await deleteCar(vehicleId);
        if (success) {
          toast.success(`Le véhicule "${vehicleBrand} ${vehicleModel}" a été supprimé avec succès !`);
          fetchAdminCars(adminCarPagination.page, verificationFilter);
        } else {
          toast.error(`Échec de la suppression du véhicule "${vehicleBrand} ${vehicleModel}".`);
        }
      }
    });
  };

  const handleToggleVerification = (vehicle) => {
    const newVerificationState = !vehicle.isVerified;
    const confirmText = newVerificationState
      ? `Êtes-vous sûr de vouloir vérifier ce véhicule ?`
      : `Êtes-vous sûr de vouloir annuler la vérification de ce véhicule ?`;

    Swal.fire({
      title: 'Confirmer la vérification',
      text: confirmText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newVerificationState ? '#22C55E' : '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, continuer !',
      cancelButtonText: 'Annuler',
      background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
      color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateVehicleVerificationState(vehicle.id, newVerificationState);
        fetchAdminCars(adminCarPagination.page, verificationFilter);
      }
    });
  };

  const handleAddVehicle = () => {
    setCarToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditVehicle = (vehicle) => {
    setCarToEdit(vehicle);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setCarToEdit(null);
  };

  const handleSaveCar = async (carData, isEditingMode) => {
    if (isEditingMode) {
      const result = await updateCar(carData.id, carData);
      if (result) {
        toast.success(`Le véhicule "${carData.brand} ${carData.model}" a été mis à jour avec succès !`);
        fetchAdminCars(adminCarPagination.page, verificationFilter);
        handleCloseFormModal();
      } else {
        toast.error(`Échec de la mise à jour du véhicule "${carData.brand} ${carData.model}".`);
      }
    } else {
      const result = await createCar(carData);
      if (result) {
        toast.success(`Le véhicule "${result.brand} ${result.model}" a été ajouté avec succès !`);
        fetchAdminCars(1, verificationFilter); // Retour à la première page après l'ajout
        handleCloseFormModal();
      } else {
        toast.error(`Échec de l'ajout du véhicule "${carData.brand} ${carData.model}".`);
      }
    }
  };

  const handleFilterChange = (filter) => {
    setVerificationFilter(filter);
  };

  return (
    <div className='pl-12  pt-6 pb-40 bg-gray-50 dark:bg-gray-900 min-h-full'>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 sm:mb-0">
          Gestion des Véhicules
        </h1>
        <button
          onClick={handleAddVehicle}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
          Ajouter un Véhicule
        </button>
      </div>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4">
          <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-0'>Parc Automobile</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => handleFilterChange(true)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                verificationFilter === true
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              Vérifiés
            </button>
            <button
              onClick={() => handleFilterChange(false)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                verificationFilter === false
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
              Non Vérifiés
            </button>
          </div>
        </div>
        {isLoadingAdminCars ? (
          <div className="p-4 text-center text-blue-500 dark:text-blue-400">
            Chargement des véhicules...
          </div>
        ) : adminCarListError ? (
          <div className="p-4 text-center text-red-500 dark:text-red-400">
            Une erreur est survenue lors du chargement des véhicules : {adminCarListError}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg">
              <table className={`w-full table-auto ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                <thead>
                  <tr className={`uppercase text-sm font-semibold text-left ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    <th className="py-3 px-4 rounded-tl-lg">ID</th>
                    <th className="py-3 px-4">Conducteur</th>
                    <th className="py-3 px-4">Marque</th>
                    <th className="py-3 px-4">Modèle</th>
                    <th className="py-3 px-4">Places</th>
                    <th className="py-3 px-4">Couleur</th>
                    <th className="py-3 px-4">Immatriculation</th>
                    <th className="py-3 px-4">Vérifié</th>
                    <th className="py-3 px-4 text-center">Vérification</th>
                    <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminCars && adminCars.length > 0 ? (
                    adminCars.map(car => (
                      <tr key={car.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} last:border-b-0`}>
                        <td className="py-4 px-4">{car.id}</td>
                        <td className="py-4 px-4">
                            <span className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                                <Link to={`/admin/users/details/${car.userId}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                  {car.driver?.firstName} {car.driver?.lastName}
                                </Link>
                            </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faBuilding} className="text-gray-400" />
                            {car.brand}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faCar} className="text-gray-400" />
                            {car.model}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                            <span className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faListAlt} className="text-gray-400" />
                              {car.numberPlaces}
                            </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faPalette} className="text-gray-400" />
                            {car.color}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                            <span className="flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
                                <FontAwesomeIcon icon={faIdCard} className="text-gray-400" />
                                {car.registrationCode}
                            </span>
                        </td>
                        <td className="py-4 px-4">
                          {(() => {
                            const isVerified = car.isVerified;
                            let statusClasses = '';
                            let statusIcon = null;
                            if (isVerified) {
                              statusClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
                              statusIcon = faCheckCircle;
                            } else {
                              statusClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
                              statusIcon = faTimesCircle;
                            }
                            return (
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusClasses}`}>
                                <FontAwesomeIcon icon={statusIcon} />
                                {isVerified ? 'Oui' : 'Non'}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleToggleVerification(car)}
                            className={`px-3 py-1 rounded-md text-white font-semibold transition-colors duration-200 ${
                              car.isVerified ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
                            }`}
                            title={car.isVerified ? 'Annuler la vérification' : 'Marquer comme vérifié'}
                          >
                            <FontAwesomeIcon icon={car.isVerified ? faTimesCircle : faCheckCircle} className="mr-2" />
                            {car.isVerified ? 'Annuler' : 'Vérifier'}
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center gap-2">
                            <Link
                              to={`/admin/car-documents/${car.id}`}
                              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                              title="Voir les documents"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Link>
                            <button
                              onClick={() => handleEditVehicle(car)}
                              className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200"
                              title="Modifier"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(car.id, car.brand, car.model)}
                              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
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
                      <td colSpan="10" className="py-8 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center">
                          <FontAwesomeIcon icon={faCarSide} className="text-4xl mb-2" />
                          <p>Aucun véhicule à afficher pour le moment.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className={`mt-4 flex flex-col sm:flex-row justify-between items-center text-sm p-4 rounded-md shadow ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
              <div className="mb-2 sm:mb-0">
                Affichage de {adminCarPagination.page * 10 - 9} à {Math.min(adminCarPagination.page * 10, adminCarPagination.totalCount)} sur {adminCarPagination.totalCount} véhicules.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={!adminCarPagination.hasPreviousPage || isLoadingAdminCars}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${!adminCarPagination.hasPreviousPage || isLoadingAdminCars ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  Précédent
                </button>
                <span className={`px-4 py-2 rounded-md font-bold ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  Page {adminCarPagination.page} sur {Math.ceil(adminCarPagination.totalCount / 10) || 1}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={!adminCarPagination.hasNextPage || isLoadingAdminCars}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${!adminCarPagination.hasNextPage || isLoadingAdminCars ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  Suivant
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {isFormModalOpen && (
        <CarFormModal
          isOpen={isFormModalOpen}
          onClose={handleCloseFormModal}
          onSave={handleSaveCar}
          carToEdit={carToEdit}
        />
      )}
    </div>
  );
};

export default Cars;