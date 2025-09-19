import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusCircle, faEdit, faFileUpload, faCarSide, faTag,
  faChair, faPalette, faIdCard, faShieldAlt, faSpinner,
  faTrashAlt, faCheckCircle, faTimesCircle, faList, faFileAlt,
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

  const pageBgColor = theme === 'dark' ? 'bg-gray-900' : '';
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';
  const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateVehicleVerificationState(carId, !isVerified);
      }
    });
  };

  if (!user) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${pageBgColor} ${textColorPrimary}`}>
        <p className="text-xl">Veuillez vous connecter pour voir vos véhicules.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${pageBgColor} ${textColorPrimary}`}>
        <p className="text-xl">
          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
          Chargement de vos véhicules...
        </p>
      </div>
    );
  }
  return (
    <div className={`${pageBgColor} ${textColorPrimary} min-h-screen pt-20 pb-10 transition-colors duration-300`}>
      <main className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className="flex justify-between items-center mb-8">
            <h1 className={`text-4xl font-extrabold ${textColorPrimary}`}>
            Gérer Mes Véhicules 🚗
            </h1>
            <button
                onClick={openCreateModal}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 flex items-center"
            >
                <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                Ajouter un Véhicule
            </button>
        </div>

        {cars.length === 0 ? (
            <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor} text-center`}>
                <p className={`${textColorSecondary} text-lg mb-4`}>
                Vous n'avez pas encore de véhicule enregistré.
                </p>
                <button
                onClick={openCreateModal}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center mx-auto"
                >
                <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                Ajouter Mon Premier Véhicule
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {cars.map(car => (
                    <div key={car.id} className={`${cardBg} rounded-2xl shadow-xl p-6 border ${borderColor}`}>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className={`text-2xl font-bold ${textColorPrimary}`}>
                                <FontAwesomeIcon icon={faCarSide} className="mr-3 text-blue-500" />
                                {car.brand} {car.model}
                            </h2>
                            <div className="flex space-x-2">
                                <Link
                                    to={`/profile/car/documents/${car.id}`}
                                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition-colors duration-200"
                                    title="Voir les documents"
                                >
                                    <FontAwesomeIcon icon={faFileAlt} />
                                </Link>
                                <button
                                    onClick={() => openEditModal(car)}
                                    className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-sm transition-colors duration-200"
                                    title="Modifier"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                    onClick={() => handleDeleteCar(car.id)}
                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm transition-colors duration-200"
                                    title="Supprimer"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div>
                        </div>

                        <div className="text-sm">
                            <p className="flex items-center mb-1">
                                <FontAwesomeIcon icon={faIdCard} className={`mr-2 ${textColorSecondary}`} />
                                <strong className={textColorPrimary}>Immatriculation:</strong> {car.registrationCode}
                            </p>
                            <p className="flex items-center mb-1">
                                <FontAwesomeIcon icon={faPalette} className={`mr-2 ${textColorSecondary}`} />
                                <strong className={textColorPrimary}>Couleur:</strong> {car.color}
                            </p>
                            <p className="flex items-center mb-1">
                                <FontAwesomeIcon icon={faChair} className={`mr-2 ${textColorSecondary}`} />
                                <strong className={textColorPrimary}>Places:</strong> {car.numberPlaces}
                            </p>
                            <p className="flex items-center mb-1">
                                <FontAwesomeIcon icon={faList} className={`mr-2 ${textColorSecondary}`} />
                                <strong className={textColorPrimary}>Type:</strong> {vehicleTypeMap[car.vehiculeType] || 'Inconnu'}
                            </p>
                            <div className="flex items-center mb-1">
                                {car.airConditionned ? (
                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-500" />
                                ) : (
                                    <FontAwesomeIcon icon={faTimesCircle} className="mr-2 text-red-500" />
                                )}
                                <p><strong className={textColorPrimary}>Climatisation:</strong> {car.airConditionned ? 'Oui' : 'Non'}</p>
                            </div>
                            <div className="flex items-center">
                                {car.isVerified ? (
                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-500" />
                                ) : (
                                    <FontAwesomeIcon icon={faTimesCircle} className="mr-2 text-red-500" />
                                )}
                                <p><strong className={textColorPrimary}>Statut:</strong> {car.isVerified ? 'Vérifié' : 'Non Vérifié'}</p>
                            </div>
                            
                            {/* --- Section Admin par véhicule --- */}
                            {user?.isAdmin && (
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-600">
                                    <h3 className={`text-base font-semibold ${textColorPrimary} mb-2 flex items-center`}>
                                        <FontAwesomeIcon icon={faShieldAlt} className='mr-2 text-red-500' />
                                        Admin
                                    </h3>
                                    <button
                                        onClick={() => handleUpdateVerificationState(car.id, car.isVerified)}
                                        className={`w-full py-2 font-semibold rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center text-sm ${
                                        car.isVerified ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
                                        } text-white`}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                        ) : (
                                        <>
                                            <FontAwesomeIcon icon={car.isVerified ? faTimesCircle : faCheckCircle} className="mr-2" />
                                            {car.isVerified ? 'Annuler la Vérification' : 'Marquer comme Vérifié'}
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

        {/* --- Section Téléchargement de Documents (référencée à un véhicule sélectionné) --- */}
        {cars.length > 0 && (
          <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
            <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-3 border-b ${borderColor}`}>
              <FontAwesomeIcon icon={faFileUpload} className='mr-2 text-green-500' />
              Télécharger les Documents du Véhicule
            </h2>
            <form onSubmit={handleUploadDocument} className="space-y-4">
                <div>
                    <label htmlFor="selectCar" className={`block text-sm font-medium ${textColorPrimary} mb-1`}>
                        Sélectionner un Véhicule :
                    </label>
                    <select
                        id="selectCar"
                        value={selectedCarId || ''}
                        onChange={(e) => setSelectedCarId(e.target.value)}
                        className={`w-full p-3 rounded-lg ${inputBg} ${textColorPrimary} border ${inputBorder} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                    >
                        <option value="">Sélectionner un véhicule</option>
                        {cars.map(car => (
                            <option key={car.id} value={car.id}>
                                {car.brand} {car.model} ({car.registrationCode})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="documentType" className={`block text-sm font-medium ${textColorPrimary} mb-1`}>Type de Document :</label>
                    <select
                        id="documentType"
                        value={documentType}
                        onChange={handleDocumentTypeChange}
                        className={`w-full p-3 rounded-lg ${inputBg} ${textColorPrimary} border ${inputBorder} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                    >
                        <option value="">Sélectionner un type</option>
                        {Object.entries(documentTypeMap).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="documentFile" className={`block text-sm font-medium ${textColorPrimary} mb-1`}>Fichier :</label>
                    <input
                        type="file"
                        id="documentFile"
                        onChange={handleDocumentFileChange}
                        className={`w-full p-3 rounded-lg ${inputBg} ${textColorPrimary} border ${inputBorder} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                        isUploading || !selectedCarId || !documentFile || !documentType
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white shadow-md'
                    } flex items-center justify-center`}
                    disabled={isUploading || !selectedCarId || !documentFile || !documentType}
                >
                    {isUploading ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                            Téléchargement...
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
                            Télécharger le Document
                        </>
                    )}
                </button>
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