// src/pages/admin/Cars.jsx
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
  faIdCard,
  faCar,
  faSyncAlt
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

import CarFormModal from '../../Components/Modals/CarFormModal'; // Assurez-vous du chemin !
import { useAdminCarContext } from '../../contexts/Admin/CarAdminContext'; 
import useColorScheme from '../../hooks/useColorScheme';
import { toast } from "sonner";

const Cars = () => {
  const { theme } = useColorScheme();
  const isDark = theme === 'dark';

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
  } = useAdminCarContext(); 

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [carToEdit, setCarToEdit] = useState(null);
  const [verificationFilter, setVerificationFilter] = useState(false); 

  useEffect(() => {
    fetchAdminCars(adminCarPagination.page || 1, verificationFilter); 
  }, [verificationFilter]); 

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
      title: 'Supprimer le véhicule ?',
      text: `Le véhicule "${vehicleBrand} ${vehicleModel}" sera supprimé définitivement. Cette action est irréversible.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: isDark ? '#4b5563' : '#9ca3af',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      background: isDark ? '#1e293b' : '#ffffff',
      color: isDark ? '#f8fafc' : '#0f172a',
      customClass: { popup: "rounded-2xl shadow-xl" }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await deleteCar(vehicleId); 
        if (success) {
          fetchAdminCars(adminCarPagination.page, verificationFilter); 
        }
      }
    });
  };

  const handleToggleVerification = (vehicle) => {
    const newState = !vehicle.isVerified;

    Swal.fire({
      title: newState ? 'Valider ce véhicule ?' : 'Révoquer la validation ?',
      text: newState ? "Ce véhicule sera marqué comme vérifié et autorisé à circuler." : "Ce véhicule ne sera plus considéré comme vérifié.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newState ? '#10b981' : '#ef4444',
      cancelButtonColor: isDark ? '#4b5563' : '#9ca3af',
      confirmButtonText: newState ? 'Oui, valider' : 'Oui, révoquer',
      cancelButtonText: 'Annuler',
      background: isDark ? '#1e293b' : '#ffffff',
      color: isDark ? '#f8fafc' : '#0f172a',
      customClass: { popup: "rounded-2xl shadow-xl" }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateVehicleVerificationState(vehicle.id, newState);
        fetchAdminCars(adminCarPagination.page, verificationFilter); 
      }
    });
  };

  // 🎯 FONCTION APPELÉE PAR LA MODALE LORS DE LA SAUVEGARDE
  const handleSaveCar = async (carData, isEditingMode) => {
    const result = isEditingMode
      ? await updateCar(carData.id, carData)
      : await createCar(carData); 

    if (result) {
      // On rafraîchit la page actuelle (pas forcément la page 1) avec le filtre en cours
      fetchAdminCars(adminCarPagination.page || 1, verificationFilter); 
      setIsFormModalOpen(false);
      setCarToEdit(null);
    }
  };

  return (
    <div className="pl-12 pt-8 pb-40 bg-slate-50 dark:bg-slate-900 min-h-screen">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 mr-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Parc Automobile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gérez la flotte de véhicules, vérifiez les documents et les statuts.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAdminCars(adminCarPagination.page || 1, verificationFilter)}
            disabled={isLoadingAdminCars}
            className={`flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white font-medium py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95 ${isLoadingAdminCars ? "opacity-80 cursor-not-allowed" : ""}`}
          >
            <FontAwesomeIcon icon={faSyncAlt} className={isLoadingAdminCars ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>

          <button
            onClick={() => { setCarToEdit(null); setIsFormModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95"
          >
            <FontAwesomeIcon icon={faPlusCircle} />
            <span className="hidden sm:inline">Nouveau Véhicule</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 p-5 mr-6">

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-5">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 w-full sm:w-auto">
                Liste des Véhicules <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">({adminCarPagination.totalCount || 0} total)</span>
            </h2>

            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl w-full sm:w-auto">
                <button
                    onClick={() => setVerificationFilter(true)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${verificationFilter === true ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    <FontAwesomeIcon icon={faCheckCircle} /> Vérifiés
                </button>

                <button
                    onClick={() => setVerificationFilter(false)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${verificationFilter === false ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    <FontAwesomeIcon icon={faTimesCircle} /> Non Vérifiés
                </button>
            </div>
        </div>

        {isLoadingAdminCars && adminCars?.length === 0 ? (
            <div className="py-20 text-center text-blue-500 dark:text-blue-400">
                <FontAwesomeIcon icon={faSyncAlt} className="animate-spin text-4xl mb-4 opacity-80" />
                <p className="font-medium">Chargement des véhicules...</p>
            </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Véhicule</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Propriétaire</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Immatriculation</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Statut</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Contrôle</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {adminCars?.map(car => {
                      const displayId = String(car.id);
                      return (
                        <tr key={car.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors duration-150 group">
                            <td className="py-4 px-4 font-mono text-xs text-slate-400 dark:text-slate-500">{displayId.length > 8 ? `${displayId.substring(0, 8)}...` : displayId}</td>
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-200 dark:border-slate-600">
                                        <FontAwesomeIcon icon={faCar} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{car.brand} {car.model}</span>
                                        <span className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                            <span><FontAwesomeIcon icon={faUser} className="text-[10px] opacity-70" /> {car.numberPlaces} pl.</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                            <span className="flex items-center gap-1">
                                                <span className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-500" style={{ backgroundColor: car.color || 'grey' }}></span>{car.color}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <Link to={`/admin/users/details/${car.userId}`} className="inline-flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faUser} className="text-xs" />
                                    </div>
                                    {car.driver?.firstName} {car.driver?.lastName}
                                </Link>
                            </td>
                            <td className="py-4 px-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                                    <FontAwesomeIcon icon={faIdCard} className="text-slate-400" /> {car.registrationCode}
                                </span>
                            </td>
                            <td className="py-4 px-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${car.isVerified ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-800' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500 border border-red-200 dark:border-red-800'}`}>
                                    <FontAwesomeIcon icon={car.isVerified ? faCheckCircle : faTimesCircle} /> {car.isVerified ? 'Vérifié' : 'Non vérifié'}
                                </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                                <button onClick={() => handleToggleVerification(car)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${car.isVerified ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700' : 'bg-emerald-500 hover:bg-emerald-600 text-white border border-transparent'}`}>
                                    {car.isVerified ? 'Révoquer' : 'Valider'}
                                </button>
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <Link to={`/admin/car-documents/${car.id}`} title="Voir les documents" className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 transition-colors">
                                        <FontAwesomeIcon icon={faEye} />
                                    </Link>
                                    <button title="Modifier" onClick={() => { setCarToEdit(car); setIsFormModalOpen(true); }} className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-400 transition-colors">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button title="Supprimer" onClick={() => handleDeleteVehicle(car.id, car.brand, car.model)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 transition-colors">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                  })}
                </tbody>
              </table>

              {adminCars?.length === 0 && (
                <div className="py-16 text-center text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50">
                    <FontAwesomeIcon icon={faListAlt} className="text-4xl mb-4 opacity-40" />
                    <p className="font-medium text-lg text-slate-600 dark:text-slate-300">Aucun véhicule trouvé</p>
                    <p className="mt-1 text-sm">Modifiez vos filtres ou ajoutez un nouveau véhicule.</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
                <div className="mb-4 sm:mb-0 text-slate-500 dark:text-slate-400">
                    Affichage de la page <span className="font-semibold text-slate-700 dark:text-slate-200">{adminCarPagination.page}</span> sur <span className="font-semibold text-slate-700 dark:text-slate-200">{Math.ceil(adminCarPagination.totalCount / (adminCars?.length || 1))}</span> <span className="ml-1 opacity-70">({adminCarPagination.totalCount} total)</span>
                </div>
                
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/30 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button onClick={handlePreviousPage} disabled={!adminCarPagination.hasPreviousPage || isLoadingAdminCars} className={`flex items-center justify-center gap-2 px-3 py-1.5 h-10 rounded-lg transition-all font-medium ${!adminCarPagination.hasPreviousPage || isLoadingAdminCars ? "text-slate-400 dark:text-slate-500 cursor-not-allowed" : "text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 hover:shadow-sm"}`}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Précédent
                    </button>
                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                    <button onClick={handleNextPage} disabled={!adminCarPagination.hasNextPage || isLoadingAdminCars} className={`flex items-center justify-center gap-2 px-3 py-1.5 h-10 rounded-lg transition-all font-medium ${!adminCarPagination.hasNextPage || isLoadingAdminCars ? "text-slate-400 dark:text-slate-500 cursor-not-allowed" : "text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 hover:shadow-sm"}`}>
                        Suivant <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </div>
          </>
        )}
      </div>

      {isFormModalOpen && (
        <CarFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveCar}
          carToEdit={carToEdit} // On passe bien les données à éditer ici
        />
      )}
    </div>
  );
};

export default Cars;