import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusCircle, faEdit, faFileUpload, faCarSide, faTag,
  faChair, faPalette, faIdCard, faShieldAlt, faSpinner,
  faTrashAlt, faCheckCircle, faTimesCircle, faList, faFileAlt,
  faTemperatureHigh, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import useColorScheme from '../../hooks/useColorScheme';
import useAuth from '../../hooks/useAuth';
import useCars from '../../hooks/useCar';
import CarForm from '../../Components/form/CarForm';
import Modal from '../../Components/Modals/Modal';
import Swal from 'sweetalert2';
import { toast } from "sonner";


const MyVehicle = () => {
  const { theme } = useColorScheme();
  const { user } = useAuth();
  
  const { 
    cars, 
    loading, 
    error, 
    fetchUserCars, 
    createCar, 
    updateCar, 
    deleteCar, 
    uploadVehicleDocument,
    updateVehicleVerificationState
  } = useCars();

  const [documentFile, setDocumentFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCarData, setEditingCarData] = useState(null);
  const [selectedCarId, setSelectedCarId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserCars();
    }
  }, [user]);

  // Design variables
  const pageBgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50/5'; // Fond grisâtre
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';
  const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-200';
  const pillBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const swalBg = theme === 'dark' ? '#1F2937' : '#FFFFFF';
  const swalColor = theme === 'dark' ? '#F9FAFB' : '#1F2937';

  const vehicleTypeMap = {
    0: 'Voiture',
    1: 'Camionnette',
    2: 'Moto',
  };

  const documentTypeMap = {
    0: "Carte Grise",
    1: "Attestation d'Assurance",
    2: "Document d'identité",
    3: "Photo",
    4: "Photo d'immatriculation",
  };

  const openCreateModal = () => {
    setEditingCarData(null);
    setIsModalOpen(true);
  };

  const openEditModal = (car) => {
    setEditingCarData(car);
    setIsModalOpen(true);
  };

  const closeCarModal = () => {
    setIsModalOpen(false);
    setEditingCarData(null);
  };

  const handleSaveCar = async (carDataToSave, isEditingMode) => {
    if (isEditingMode) {
      await updateCar(carDataToSave.id, carDataToSave);
    } else {
      await createCar(carDataToSave);
    }
    closeCarModal();
  };

  const handleDeleteCar = (carId) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer ce véhicule. Cette action est irréversible !`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
      background: swalBg,
      color: swalColor,
      borderRadius: '1.5rem'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCar(carId);
      }
    });
  };

  const handleDocumentFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!selectedCarId) {
        toast.error('Veuillez sélectionner un véhicule pour télécharger le document.');
        return;
    }
    if (!documentFile || !documentType) {
      toast.error('Veuillez sélectionner un type de document et un fichier.');
      return;
    }

    setIsUploading(true);
    await uploadVehicleDocument(parseInt(documentType), selectedCarId, documentFile);
    setIsUploading(false);
    setDocumentFile(null);
    setDocumentType('');
    setSelectedCarId(null);
  };

  const handleUpdateVerificationState = (carId, isVerified) => {
    Swal.fire({
      title: 'Confirmer l\'action',
      text: `Êtes-vous sûr de vouloir ${isVerified ? 'annuler la vérification de' : 'vérifier'} ce véhicule ?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: isVerified ? '#DC2626' : '#22C55E',
      cancelButtonColor: '#6B7280',
      confirmButtonText: isVerified ? 'Oui, annuler' : 'Oui, vérifier',
      cancelButtonText: 'Annuler',
      background: swalBg,
      color: swalColor,
      borderRadius: '1.5rem'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateVehicleVerificationState(carId, !isVerified);
      }
    });
  };

  if (!user) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${pageBgColor} ${textColorPrimary} text-center px-4`}>
        <FontAwesomeIcon icon={faInfoCircle} className="text-5xl text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Veuillez vous connecter</h2>
        <p className={textColorSecondary}>Vous devez être connecté pour gérer vos véhicules.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${pageBgColor} ${textColorPrimary}`}>
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className={`text-lg font-medium ${textColorSecondary}`}>Chargement de vos véhicules...</p>
      </div>
    );
  }

  return (
    <div className={`${pageBgColor} ${textColorPrimary} min-h-screen pt-28 pb-20 transition-colors duration-300 font-sans`}>
      <main className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* --- HEADER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
                <h1 className={`text-3xl sm:text-4xl font-extrabold ${textColorPrimary} mb-2`}>
                    Mes Véhicules
                </h1>
                <p className={`${textColorSecondary} text-[15px]`}>Gérez vos voitures, motos et documents associés.</p>
            </div>
            <button
                onClick={openCreateModal}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition-colors duration-200 flex items-center flex-shrink-0"
            >
                <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                Ajouter un Véhicule
            </button>
        </div>

        {/* --- LISTE DES VÉHICULES --- */}
        {cars.length === 0 ? (
            <div className={`${cardBg} rounded-3xl shadow-sm p-10 mb-10 border border-dashed border-gray-300 dark:border-gray-700 text-center`}>
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FontAwesomeIcon icon={faCarSide} className="text-3xl text-gray-400" />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${textColorPrimary}`}>Aucun véhicule</h3>
                <p className={`${textColorSecondary} text-[15px] mb-8 max-w-md mx-auto`}>
                    Vous n'avez pas encore de véhicule enregistré. Ajoutez-en un pour commencer à proposer des trajets en tant que conducteur.
                </p>
                <button
                    onClick={openCreateModal}
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition-colors duration-200 inline-flex items-center"
                >
                    <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                    Ajouter Mon Premier Véhicule
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {cars.map(car => (
                    <div key={car.id} className={`${cardBg} rounded-3xl shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8 border ${borderColor} flex flex-col`}>
                        
                        {/* En-tête de la carte */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center flex-shrink-0">
                                    <FontAwesomeIcon icon={faCarSide} className="text-xl" />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${textColorPrimary}`}>
                                        {car.brand} {car.model}
                                    </h2>
                                    <p className={`text-sm font-medium ${textColorSecondary} uppercase tracking-wide mt-0.5`}>
                                        {car.registrationCode}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Statut Vérifié */}
                            {car.isVerified ? (
                                <span className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-green-100 dark:border-green-800/50">
                                    <FontAwesomeIcon icon={faCheckCircle} /> Vérifié
                                </span>
                            ) : (
                                <span className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-gray-200 dark:border-gray-700">
                                    <FontAwesomeIcon icon={faTimesCircle} /> Non vérifié
                                </span>
                            )}
                        </div>

                        {/* Caractéristiques (Tags) */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            <span className={`px-3 py-1.5 rounded-xl text-[13px] font-medium flex items-center gap-2 ${pillBg} ${textColorPrimary}`}>
                                <FontAwesomeIcon icon={faPalette} className="text-gray-400" /> {car.color}
                            </span>
                            <span className={`px-3 py-1.5 rounded-xl text-[13px] font-medium flex items-center gap-2 ${pillBg} ${textColorPrimary}`}>
                                <FontAwesomeIcon icon={faChair} className="text-gray-400" /> {car.numberPlaces} places
                            </span>
                            <span className={`px-3 py-1.5 rounded-xl text-[13px] font-medium flex items-center gap-2 ${pillBg} ${textColorPrimary}`}>
                                <FontAwesomeIcon icon={faList} className="text-gray-400" /> {vehicleTypeMap[car.vehiculeType] || 'Inconnu'}
                            </span>
                            {car.airConditionned && (
                                <span className={`px-3 py-1.5 rounded-xl text-[13px] font-medium flex items-center gap-2 ${pillBg} ${textColorPrimary}`}>
                                    <FontAwesomeIcon icon={faTemperatureHigh} className="text-blue-500" /> Climatisé
                                </span>
                            )}
                        </div>

                        <div className="mt-auto">
                            <hr className={`border-t ${borderColor} mb-4`} />
                            
                            {/* Actions Utilisateur (Style épuré) */}
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    to={`/profile/car/documents/${car.id}`}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 rounded-xl font-semibold text-[14px] transition-colors"
                                >
                                    <FontAwesomeIcon icon={faFileAlt} /> Documents
                                </Link>
                                <button
                                    onClick={() => openEditModal(car)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-xl font-semibold text-[14px] transition-colors"
                                >
                                    <FontAwesomeIcon icon={faEdit} /> Modifier
                                </button>
                                <button
                                    onClick={() => handleDeleteCar(car.id)}
                                    className="flex items-center justify-center w-11 h-[42px] bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl transition-colors"
                                    title="Supprimer"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div>

                            {/* --- Section Admin par véhicule --- */}
                            {user?.isAdmin && (
                                <div className={`mt-4 pt-4 border-t border-dashed ${borderColor}`}>
                                    <h3 className={`text-sm font-bold ${textColorPrimary} mb-3 flex items-center`}>
                                        <FontAwesomeIcon icon={faShieldAlt} className='mr-2 text-purple-500' /> Espace Admin
                                    </h3>
                                    <button
                                        onClick={() => handleUpdateVerificationState(car.id, car.isVerified)}
                                        className={`w-full py-2.5 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center text-[14px] ${
                                        car.isVerified ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                        }`}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={car.isVerified ? faTimesCircle : faCheckCircle} className="mr-2" />
                                                {car.isVerified ? 'Révoquer la Vérification' : 'Approuver le Véhicule'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* --- SECTION UPLOAD DOCUMENTS --- */}
        {cars.length > 0 && (
          <div className={`${cardBg} rounded-3xl shadow-sm p-8 sm:p-10 mb-10 border ${borderColor}`}>
            <h2 className={`text-2xl font-bold ${textColorPrimary} mb-2`}>
              Documents du véhicule
            </h2>
            <p className={`${textColorSecondary} text-[15px] mb-8`}>
                Téléchargez votre carte grise, assurance ou photos pour faire vérifier votre véhicule.
            </p>

            <form onSubmit={handleUploadDocument} className="max-w-3xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="selectCar" className={`block text-sm font-bold ${textColorPrimary} mb-2`}>
                            Véhicule concerné
                        </label>
                        <select
                            id="selectCar"
                            value={selectedCarId || ''}
                            onChange={(e) => setSelectedCarId(e.target.value)}
                            className={`w-full p-3.5 rounded-xl ${inputBg} ${textColorPrimary} border ${inputBorder} focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium`}
                            required
                        >
                            <option value="" disabled>Sélectionnez un véhicule...</option>
                            {cars.map(car => (
                                <option key={car.id} value={car.id}>
                                    {car.brand} {car.model} ({car.registrationCode})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="documentType" className={`block text-sm font-bold ${textColorPrimary} mb-2`}>
                            Type de document
                        </label>
                        <select
                            id="documentType"
                            value={documentType}
                            onChange={handleDocumentTypeChange}
                            className={`w-full p-3.5 rounded-xl ${inputBg} ${textColorPrimary} border ${inputBorder} focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium`}
                            required
                        >
                            <option value="" disabled>Sélectionnez le type...</option>
                            {Object.entries(documentTypeMap).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="documentFile" className={`block text-sm font-bold ${textColorPrimary} mb-2`}>Fichier (Image ou PDF)</label>
                    <div className="flex items-center">
                        <input
                            type="file"
                            id="documentFile"
                            onChange={handleDocumentFileChange}
                            className={`w-full p-3 rounded-xl ${inputBg} ${textColorPrimary} border ${inputBorder} focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400 cursor-pointer`}
                            required
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <button
                        type="submit"
                        className={`w-full sm:w-auto py-3.5 px-8 rounded-full font-bold transition-all duration-200 ${
                            isUploading || !selectedCarId || !documentFile || !documentType
                            ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                        } flex items-center justify-center`}
                        disabled={isUploading || !selectedCarId || !documentFile || !documentType}
                    >
                        {isUploading ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin className="mr-3" />
                                Téléchargement...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faFileUpload} className="mr-3" />
                                Envoyer le document
                            </>
                        )}
                    </button>
                </div>
            </form>
          </div>
        )}
      </main>

      {/* La Modal qui contient le CarForm */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeCarModal}
        title={editingCarData ? "Modifier le Véhicule" : "Ajouter un Nouveau Véhicule"}
        size="lg"
      >
        <CarForm
          initialCarData={editingCarData}
          onSave={handleSaveCar}
          isEditing={!!editingCarData}
          isLoading={loading}
          theme={theme}
        />
      </Modal>
    </div>
  );
};

export default MyVehicle;