import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusCircle, faEdit, faFileUpload, faCarSide, faTag,
  faChair, faPalette, faIdCard, faShieldAlt, faSpinner,
  faTrashAlt, faCheckCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';
import useAuth from '../../hooks/useAuth'; // Assurez-vous d'importer useAuth
import useCars from '../../hooks/useCar';
import CarForm from '../../Components/form/CarForm';
import Modal from '../../Components/Modals/Modal';
import toast, { Toaster } from 'react-hot-toast';

const MyVehicle = () => {
  const { theme } = useColorScheme();
  const { user } = useAuth(); // Accès aux informations de l'utilisateur, y compris le statut d'administrateur

  // Utilisez VOTRE useCars hook pour accéder directement au CarContext
  const { 
    cars, 
    loading, 
    error, 
    fetchUserCars, 
    createCar, 
    updateCar, 
    deleteCar, 
    uploadVehicleDocument,
    updateVehicleVerificationState // Ajoutez la nouvelle fonction d'administration
  } = useCars();

  const userCar = cars && cars.length > 0 ? cars[0] : null;

  const [documentFile, setDocumentFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCarData, setEditingCarData] = useState(null);

  useEffect(() => {
    fetchUserCars();
  }, [])//fetchUserCars]);

  const pageBgColor = theme === 'dark' ? 'bg-gray-900' : '';
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';
  const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';

  const openCreateModal = () => {
    setEditingCarData(null);
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    setEditingCarData(userCar);
    setIsModalOpen(true);
  };

  const closeCarModal = () => {
    setIsModalOpen(false);
    setEditingCarData(null);
  };

  const handleSaveCar = async (carDataToSave, isEditingMode) => {
    let success = false;
    if (isEditingMode) {
      success = await updateCar(carDataToSave.id, carDataToSave);
      if (success) {
        toast.success("Véhicule modifié avec succès !");
      } else {
        toast.error("Échec de la modification du véhicule.");
      }
    } else {
      success = await createCar(carDataToSave);
      if (success) {
        toast.success("Véhicule créé avec succès !");
      } else {
        toast.error("Échec de la création du véhicule.");
      }
    }
    fetchUserCars();
    closeCarModal();
  };

  const handleDeleteCar = async () => {
    if (userCar && window.confirm("Êtes-vous sûr de vouloir supprimer votre véhicule ? Cette action est irréversible.")) {
      const success = await deleteCar(userCar.id);
      if (success) {
        toast.success("Véhicule supprimé avec succès !");
      } else {
        toast.error("Échec de la suppression du véhicule.");
      }
    }
  };


  const handleDocumentFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!userCar) {
      toast.error('Veuillez d\'abord enregistrer votre véhicule.');
      return;
    }
    if (!documentFile || !documentType) {
      toast.error('Veuillez sélectionner un type de document et un fichier.');
      return;
    }

    setIsUploading(true);
    const success = await uploadVehicleDocument(documentType, userCar.id, documentFile);
    if (success) {
      setDocumentFile(null);
      setDocumentType('');
      toast.success("Document téléversé avec succès !");
    } else {
      toast.error("Échec du téléversement du document.");
    }
    setIsUploading(false);
  };

  // Nouvelle fonction pour l'administration
  const handleUpdateVerificationState = async () => {
    if (!userCar) return;
    const isConfirmed = window.confirm(`Êtes-vous sûr de vouloir ${userCar.isVerified ? 'annuler la vérification de' : 'vérifier'} ce véhicule ?`);
    if (isConfirmed) {
      await updateVehicleVerificationState(userCar.id, !userCar.isVerified);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${pageBgColor} ${textColorPrimary}`}>
        <p className="text-xl">Chargement de votre véhicule...</p>
      </div>
    );
  }

  if (error && !userCar) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${pageBgColor} ${textColorPrimary}`}>
        <p className="text-xl text-red-500">Erreur: {error.message || "Impossible de charger votre véhicule."}</p>
      </div>
    );
  }

  return (
    <div className={`${pageBgColor} ${textColorPrimary} min-h-screen pt-20 pb-10 transition-colors duration-300`}>
      <Toaster />
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h1 className={`text-4xl font-extrabold ${textColorPrimary} text-center mb-8`}>
          Gérer Mon Véhicule 🚗
        </h1>

        {!userCar ? (
          <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor} text-center`}>
            <p className={`${textColorSecondary} text-lg mb-6`}>
              Vous n'avez pas encore de véhicule enregistré. Ajoutez-en un maintenant !
            </p>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center mx-auto"
            >
              <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
              Ajouter Mon Véhicule
            </button>
          </div>
        ) : (
          <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className={`text-3xl font-bold ${textColorPrimary}`}>
                <FontAwesomeIcon icon={faCarSide} className="mr-3 text-blue-500" />
                {userCar.brand} {userCar.model}
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={openEditModal}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 flex items-center"
                  title="Modifier le véhicule"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2 hidden sm:inline" /> Modifier
                </button>
                <button
                  onClick={handleDeleteCar}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 flex items-center"
                  title="Supprimer le véhicule"
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="mr-2 hidden sm:inline" /> Supprimer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faTag} className={`mr-3 ${textColorSecondary}`} />
                <p><strong className={textColorPrimary}>Marque:</strong> {userCar.brand}</p>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCarSide} className={`mr-3 ${textColorSecondary}`} />
                <p><strong className={textColorPrimary}>Modèle:</strong> {userCar.model}</p>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faChair} className={`mr-3 ${textColorSecondary}`} />
                <p><strong className={textColorPrimary}>Places:</strong> {userCar.numberPlaces}</p>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faPalette} className={`mr-3 ${textColorSecondary}`} />
                <p><strong className={textColorPrimary}>Couleur:</strong> {userCar.color}</p>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faIdCard} className={`mr-3 ${textColorSecondary}`} />
                <p><strong className={textColorPrimary}>Immatriculation:</strong> {userCar.registrationCode}</p>
              </div>
              <div className="flex items-center">
                {userCar.isVerified ? (
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-3 text-green-500" />
                ) : (
                  <FontAwesomeIcon icon={faTimesCircle} className="mr-3 text-red-500" />
                )}
                <p><strong className={textColorPrimary}>Statut:</strong> {userCar.isVerified ? 'Vérifié' : 'Non Vérifié'}</p>
              </div>
            </div>
          </div>
        )}

        {/* --- Section Panneau d'Administration (Visible uniquement pour les admins) --- */}
        {user?.isAdmin && userCar && (
          <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
            <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-3 border-b ${borderColor}`}>
              <FontAwesomeIcon icon={faShieldAlt} className='mr-2 text-red-500' />
              Panneau d'Administration
            </h2>
            <div className="flex items-center space-x-4">
              <p className={`${textColorSecondary} text-lg font-semibold`}>
                Statut de Vérification du Véhicule :
              </p>
              <button
                onClick={handleUpdateVerificationState}
                className={`px-4 py-2 font-semibold rounded-md shadow-sm transition-colors duration-200 flex items-center ${
                  userCar.isVerified ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
                } text-white`}
                disabled={loading}
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                ) : (
                  <>
                    <FontAwesomeIcon icon={userCar.isVerified ? faTimesCircle : faCheckCircle} className="mr-2" />
                    {userCar.isVerified ? 'Annuler la Vérification' : 'Marquer comme Vérifié'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* --- Section Téléchargement de Documents --- */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
          <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-3 border-b ${borderColor}`}>
            <FontAwesomeIcon icon={faFileUpload} className='mr-2 text-green-500' />
            Télécharger les Documents du Véhicule
          </h2>
          {!userCar && (
            <p className={`${textColorSecondary} mb-4`}>Veuillez enregistrer votre véhicule avant de pouvoir télécharger des documents.</p>
          )}
          <form onSubmit={handleUploadDocument} className="space-y-4" disabled={!userCar}>
            <div>
              <label htmlFor="documentType" className={`block text-sm font-medium ${textColorPrimary} mb-1`}>Type de Document :</label>
              <select
                id="documentType"
                value={documentType}
                onChange={handleDocumentTypeChange}
                className={`w-full p-3 rounded-lg ${inputBg} ${textColorPrimary} border ${inputBorder} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
                disabled={!userCar || isUploading}
              >
                <option value="">Sélectionner un type</option>
                <option value="CarteGrise">Carte Grise</option>
                <option value="Assurance">Attestation d'Assurance</option>
                <option value="ControleTechnique">Contrôle Technique</option>
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
                disabled={!userCar || isUploading}
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                !userCar || isUploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-md'
              } flex items-center justify-center`}
              disabled={!userCar || isUploading}
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
      </main>

      {/* La Modal qui contient le CarForm */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeCarModal}
        title={editingCarData ? "Modifier le Véhicule" : "Ajouter un Nouveau Véhicule"}
        size="lg"
        footer={
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeCarModal}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="car-form" // Lier au formulaire par son ID
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={loading} // Utilisez le loading directement du useCars hook
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Sauvegarde...
                </>
              ) : (
                editingCarData ? 'Sauvegarder les Modifications' : 'Créer le Véhicule'
              )}
            </button>
          </div>
        }
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