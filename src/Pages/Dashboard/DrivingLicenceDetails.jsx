import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheckCircle, faTimesCircle, faDownload, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import useCars from '../../hooks/useCar';
import toast from 'react-hot-toast';

const DrivingLicenceDetails = () => {
    const { licenceId } = useParams();
    const { 
        fetchDrivingLicenceDetails, 
        downloadDocument, 
        updateDrivingLicenceVerificationState,
        isLoadingAdminLicences,
        adminLicenceListError
    } = useCars();

    const [licenceDetails, setLicenceDetails] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const getDetails = async () => {
            try {
                const details = await fetchDrivingLicenceDetails(licenceId);
                setLicenceDetails(details);
            } catch (error) {
                console.error("Erreur lors du chargement des détails du permis:", error);
            }
        };

        if (licenceId) {
            getDetails();
        }
    }, [licenceId]);

    const handleDownload = () => {
        if (licenceDetails?.url) {
            downloadDocument(licenceDetails.url);
        } else {
            toast.error("URL du document non disponible.");
        }
    };

    const handleVerification = async (isVerified) => {
        setIsUpdating(true);
        try {
            await updateDrivingLicenceVerificationState(licenceId, isVerified);
            // Mettre à jour l'état local après la réussite
            setLicenceDetails(prev => ({ ...prev, verificationState: isVerified ? 1 : 2 }));
            toast.success(`Le permis a été ${isVerified ? 'vérifié' : 'rejeté'} avec succès.`);
        } catch (error) {
            toast.error("Échec de la mise à jour de l'état.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoadingAdminLicences) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FontAwesomeIcon icon={faClock} spin className="text-4xl text-blue-500" />
                <p className="ml-4 text-xl text-gray-700 dark:text-gray-300">Chargement des détails du permis...</p>
            </div>
        );
    }

    if (adminLicenceListError || !licenceDetails) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-red-500 text-lg">
                <p>Erreur: {adminLicenceListError || "Détails du permis non trouvés."}</p>
            </div>
        );
    }

    const getStateColor = (state) => {
        switch (state) {
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
        switch (state) {
            case 1:
                return 'Vérifié';
            case 2:
                return 'Rejeté';
            case 0:
            default:
                return 'En attente';
        }
    };

    return (
        <div className='p-6 bg-gray-100 dark:bg-gray-900 min-h-screen'>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <Link to="/admin/licences/0/1" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Retour à la liste
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Détails du Permis de Conduire</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Informations sur l'utilisateur</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Nom:</span> {licenceDetails.user?.firstName} {licenceDetails.user?.lastName}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Email:</span> {licenceDetails.user?.email}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Téléphone:</span> {licenceDetails.user?.phoneNumber}
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Détails du permis</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Numéro de Permis:</span> {licenceDetails.licenseNumber}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Date de naissance:</span> {new Date(licenceDetails.dateOfBirth).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Date d'émission:</span> {new Date(licenceDetails.issueDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Date d'expiration:</span> {new Date(licenceDetails.expirationDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">État de vérification:</span> 
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStateColor(licenceDetails.verificationState)} bg-opacity-10`}>
                                {getStateText(licenceDetails.verificationState)}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <FontAwesomeIcon icon={faDownload} /> Télécharger le document
                    </button>

                    <div className="space-x-4">
                        <button
                            onClick={() => handleVerification(true)}
                            disabled={isUpdating}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${licenceDetails.verificationState === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <FontAwesomeIcon icon={faCheckCircle} /> {isUpdating ? 'Vérification...' : 'Vérifier'}
                        </button>
                        <button
                            onClick={() => handleVerification(false)}
                            disabled={isUpdating}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${licenceDetails.verificationState === 2 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <FontAwesomeIcon icon={faTimesCircle} /> {isUpdating ? 'Rejet...' : 'Rejeter'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrivingLicenceDetails;