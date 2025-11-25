import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye, faEdit, faTrash, faPlusCircle,
  faArrowLeft, faArrowRight,
  faCheckCircle,
  faTimesCircle,
  faListAlt,
  faUser,
  faBuilding,
  faPalette,
  faIdCard
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

import CarFormModal from '../../Components/Modals/CreateCarModal';
// 🛑 MODIFICATION CLÉ : Remplacement de useCars par useAdminCarContext
import { useAdminCarContext } from '../../contexts/Admin/CarAdminContext'; 
import useColorScheme from '../../hooks/useColorScheme';
import { toast } from "sonner";

const Cars = () => {
  const { theme } = useColorScheme();

  // 🎯 Appel direct au hook de contexte
  const {
    adminCars,
    adminCarPagination,
    isLoadingAdminCars,
    adminCarListError,
    fetchAdminCars,
    // Note: Utilisation du nom exact défini dans le contexte : 'deleteCar'
    deleteCar, 
    createCar,
    updateCar,
    updateVehicleVerificationState
  } = useAdminCarContext(); // <-- Utilisation du contexte

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [carToEdit, setCarToEdit] = useState(null);
  // Correction: La valeur initiale pour le filtre de vérification doit être un booléen
  const [verificationFilter, setVerificationFilter] = useState(false); 

  // Charger les données à chaque changement de page ou de filtre
  useEffect(() => {
    // Le 'page' est initialisé à 0 dans le contexte, on utilise '|| 1' pour la première requête
    fetchAdminCars(adminCarPagination.page || 1, verificationFilter); 
  }, [verificationFilter]); // Ajout de fetchAdminCars aux dépendances pour être exhaustif

  useEffect(() => {
    if (adminCarListError) {
      toast.error(adminCarListError);
    }
  }, [adminCarListError]);

  const handleNextPage = () => {
    if (adminCarPagination.hasNextPage) {
      // On passe la nouvelle page et le filtre actuel
      fetchAdminCars(adminCarPagination.page + 1, verificationFilter); 
    }
  };

  const handlePreviousPage = () => {
    if (adminCarPagination.hasPreviousPage) {
      // On passe la nouvelle page et le filtre actuel
      fetchAdminCars(adminCarPagination.page - 1, verificationFilter); 
    }
  };

  const handleDeleteVehicle = (vehicleId, vehicleBrand, vehicleModel) => {
    Swal.fire({
      title: 'Supprimer le véhicule ?',
      text: `Le véhicule "${vehicleBrand} ${vehicleModel}" sera supprimé définitivement.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#9CA3AF',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
      color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // 🚨 CORRECTION : Utilisation de 'deleteCar' comme défini dans le contexte
        const success = await deleteCar(vehicleId); 
        if (success) {
          toast.success(`Le véhicule a été supprimé.`);
          // Recharge la page actuelle pour rafraîchir la liste après suppression
          fetchAdminCars(adminCarPagination.page, verificationFilter); 
        }
      }
    });
  };

  const handleToggleVerification = (vehicle) => {
    const newState = !vehicle.isVerified;

    Swal.fire({
      title: newState ? 'Vérifier ce véhicule ?' : 'Retirer la vérification ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newState ? '#10B981' : '#EF4444',
      cancelButtonText: 'Annuler',
      background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
      color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateVehicleVerificationState(vehicle.id, newState);
        // Recharge la page actuelle pour mettre à jour le statut dans la liste
        fetchAdminCars(adminCarPagination.page, verificationFilter); 
      }
    });
  };

  const handleSaveCar = async (carData, isEditingMode) => {
    const result = isEditingMode
      ? await updateCar(carData.id, carData)
      // Note: createCar est ici mais pour un usage admin, vérifiez si l'endpoint backend le permet
      : await createCar(carData); 

    if (result) {
      toast.success(`Véhicule enregistré.`);
      // Recharge la première page (1) après une création/édition réussie
      fetchAdminCars(1, verificationFilter); 
      setIsFormModalOpen(false);
    } else {
      // Le message d'erreur est normalement géré par toast.error dans le contexte
      // Nous pouvons laisser un message générique ici au cas où
      // toast.error(`Échec de l’opération.`); 
    }
  };

  return (
    <div className="pl-12 pt-6 pb-40 min-h-full bg-gray-100 dark:bg-gray-900">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Parc Automobile 🚗
        </h1>

        <button
          onClick={() => { setIsFormModalOpen(true); setCarToEdit(null); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow transition"
        >
          <FontAwesomeIcon icon={faPlusCircle} />
          Nouveau Véhicule
        </button>
      </div>

      {/* CONTAINER */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">

        {/* FILTER BAR */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setVerificationFilter(true)}
            className={`px-4 py-2 rounded-lg text-sm ${
              verificationFilter === true
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> Vérifiés
          </button>

          <button
            onClick={() => setVerificationFilter(false)}
            className={`px-4 py-2 rounded-lg text-sm ${
              verificationFilter === false
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faTimesCircle} className="mr-2" /> Non Vérifiés
          </button>
        </div>

        {/* TABLE */}
        {isLoadingAdminCars ? (
          <p className="text-center py-6 text-blue-500">Chargement...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  <th className="py-3 px-4 rounded-tl-xl">ID</th>
                  <th className="py-3 px-4">Conducteur</th>
                  <th className="py-3 px-4">Marque</th>
                  <th className="py-3 px-4">Modèle</th>
                  <th className="py-3 px-4">Places</th>
                  <th className="py-3 px-4">Couleur</th>
                  <th className="py-3 px-4">Immatriculation</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                  <th className="py-3 px-4 rounded-tr-xl"></th>
                </tr>
              </thead>

              <tbody>
                {adminCars?.map(car => (
                  <tr
                    key={car.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-4 px-4">{car.id}</td>

                    <td className="py-4 px-4">
                      <Link
                        to={`/admin/users/details/${car.userId}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        **{car.driver?.firstName} {car.driver?.lastName}**
                      </Link>
                    </td>

                    <td className="py-4 px-4"><FontAwesomeIcon icon={faBuilding} className="mr-2 text-gray-400" />{car.brand}</td>
                    <td className="py-4 px-4">{car.model}</td>
                    <td className="py-4 px-4">{car.numberPlaces}</td>
                    <td className="py-4 px-4"><FontAwesomeIcon icon={faPalette} className="mr-2" style={{ color: car.color || 'grey' }}/>{car.color}</td>

                    <td className="py-4 px-4 font-semibold text-blue-600 dark:text-blue-400">
                      <FontAwesomeIcon icon={faIdCard} className="mr-2" />{car.registrationCode}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          car.isVerified
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {car.isVerified ? 'Vérifié' : 'Non vérifié'}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex gap-3 justify-center">

                        {/* Documents */}
                        <Link
                          to={`/admin/car-documents/${car.id}`}
                          title="Voir les documents"
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition duration-150"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>

                        {/* Edit */}
                        <button
                          title="Modifier"
                          onClick={() => { setCarToEdit(car); setIsFormModalOpen(true); }}
                          className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition duration-150"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>

                        {/* Delete */}
                        <button
                          title="Supprimer"
                          onClick={() => handleDeleteVehicle(car.id, car.brand, car.model)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition duration-150"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>

                    {/* Vérification TOGGLE */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleToggleVerification(car)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold text-white transition duration-150 ${
                          car.isVerified
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {car.isVerified ? 'Annuler' : 'Vérifier'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* EMPTY STATE */}
            {adminCars?.length === 0 && (
              <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                <FontAwesomeIcon icon={faListAlt} className="mr-2" />
                Aucun véhicule trouvé.
              </p>
            )}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-6 text-sm">

          <button
            disabled={!adminCarPagination.hasPreviousPage || isLoadingAdminCars}
            onClick={handlePreviousPage}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 disabled:opacity-40 transition duration-150"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Précédent
          </button>

          <span className="text-gray-600 dark:text-gray-300">
            Page **{adminCarPagination.page}** sur **{Math.ceil(adminCarPagination.totalCount / (adminCars?.length || 1))}** ({adminCarPagination.totalCount} au total)
          </span>

          <button
            disabled={!adminCarPagination.hasNextPage || isLoadingAdminCars}
            onClick={handleNextPage}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 disabled:opacity-40 transition duration-150"
          >
            Suivant <FontAwesomeIcon icon={faArrowRight} />
          </button>

        </div>
      </div>

      {isFormModalOpen && (
        <CarFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveCar}
          carToEdit={carToEdit}
        />
      )}
    </div>
  );
};

export default Cars;