import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheckCircle, faTimesCircle, faDownload, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// IMPORTANT : Changement du hook useCars au hook correct useDrivingLicence
import useDrivingLicence from '../../hooks/useDrivingLicence'; 
import { toast } from "sonner";

const DrivingLicenceDetails = () => {
    const { licenceId } = useParams();
    // Utilisation des fonctions du hook useDrivingLicence
    const { 
        getLicenceDetailsAdmin, // Utilisé pour charger les détails
        downloadLicenceDocument, // Utilisé pour le téléchargement
        changeVerificationState, // Utilisé pour vérifier/rejeter
        loading, // État de chargement global du contexte
        error: contextError // Erreur globale du contexte
    } = useDrivingLicence();

    const [licenceDetails, setLicenceDetails] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false); // État spécifique à la mise à jour de vérification

    // --- Chargement initial des détails ---
    useEffect(() => {
        const getDetails = async () => {
            try {
                // Utilisation de la fonction Admin spécifique pour les détails
                const details = await getLicenceDetailsAdmin(licenceId);
                setLicenceDetails(details);
            } catch (error) {
                // L'erreur est déjà gérée dans le contexte, mais une console.error ici est utile
                console.error("Erreur lors du chargement des détails du permis:", error);
            }
        };

        if (licenceId) {
            getDetails();
        }
    }, [licenceId]); // CORRECTION : Ajout de getLicenceDetailsAdmin comme dépendance

    // --- Gestion du Téléchargement ---
    const handleDownload = () => {
        if (licenceDetails?.url) {
            // Utilisation de la fonction de téléchargement du Context
            downloadLicenceDocument(licenceDetails.url);
        } else {
            toast.error("URL du document non disponible.");
        }
    };

    // --- Gestion de la Vérification / Rejet ---
    // isVerified est un booléen, il est converti en 1 (Vérifié) ou 2 (Rejeté) pour l'API
    const handleVerification = async (isVerified, rejectionReason = null) => {
        setIsUpdating(true);
        const newState = isVerified ? 1 : 2; // 1: Verified, 2: Rejected
        try {
            // Utilisation de la fonction de modification d'état du Context
            // licenceDetails.id est l'ID du permis nécessaire pour la requête
            await changeVerificationState(licenceDetails.id, newState, rejectionReason);
            
            // Mettre à jour l'état local après la réussite
            setLicenceDetails(prev => ({ ...prev, verificationState: newState }));
            toast.success(`Le permis a été ${isVerified ? 'vérifié' : 'rejeté'} avec succès.`);
        } catch (error) {
            // Le Context gère déjà le toast d'erreur, on peut se contenter d'un message console si l'on est certain
             console.error("Échec de la mise à jour de l'état:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    // --- Fonctions d'aide (inchangées) ---
    const getStateColor = (state) => {
        switch (state) {
            case 1:
                return 'text-green-500 bg-green-100 dark:bg-green-900';
            case 2:
                return 'text-red-500 bg-red-100 dark:bg-red-900';
            case 0:
            default:
                return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900';
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

    // --- Affichage du chargement / erreur ---
    if (loading || isUpdating) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FontAwesomeIcon icon={faClock} spin className="text-4xl text-blue-500" />
                <p className="ml-4 text-xl text-gray-700 dark:text-gray-300">
                  {isUpdating ? "Mise à jour de l'état..." : "Chargement des détails du permis..."}
                </p>
            </div>
        );
    }

    if (contextError || !licenceDetails) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-red-500 text-lg">
                <p>Erreur: {contextError || "Détails du permis non trouvés."}</p>
            </div>
        );
    }

    // --- Rendu principal ---
    return (
        <div className='pl-12  pt-6 pb-40 bg-gray-100 dark:bg-gray-900 min-h-screen'>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    {/* Le lien de retour peut être amélioré pour revenir à la page exacte du filtre précédent */}
                    <Link to="/admin/licences/0/1" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Retour à la liste
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Détails du Permis de Conduire</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Colonne 1: Informations sur l'utilisateur */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Informations sur l'utilisateur</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Nom:</span> {licenceDetails?.firstName} {licenceDetails?.lastName}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Email:</span> {licenceDetails?.email}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Téléphone:</span> {licenceDetails?.phoneNumber || 'N/A'}
                        </p>
                    </div>

                    {/* Colonne 2: Détails du permis */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Détails du permis</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Numéro de Permis:</span> {licenceDetails?.licenceDriving?.licenseNumber}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Date de naissance:</span> {licenceDetails?.licenceDriving?.dateOfBirth ? new Date(licenceDetails?.licenceDriving?.dateOfBirth).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Date d'émission:</span> {licenceDetails?.licenceDriving?.issueDate ? new Date(licenceDetails?.licenceDriving?.issueDate).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Date d'expiration:</span> {licenceDetails?.licenceDriving?.expirationDate ? new Date(licenceDetails?.licenceDriving?.expirationDate).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">État de vérification:</span> 
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStateColor(licenceDetails?.licenceDriving?.verificationState)}`}>
                                {getStateText(licenceDetails?.licenceDriving?.verificationState)}
                            </span>
                        </p>
                        {licenceDetails.rejectionReason && licenceDetails.verificationState === 2 && (
                            <p className="text-red-600 dark:text-red-400 mt-2 p-2 bg-red-50 dark:bg-red-900 rounded-md text-sm">
                                <span className="font-medium">Raison du rejet:</span> {licenceDetails.rejectionReason}
                            </p>
                        )}
                    </div>
                </div>

                {/* --- Actions --- */}
                <div className="mt-8 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6">
                    {/* Bouton de Téléchargement */}
                    <button
                        onClick={handleDownload}
                        disabled={!licenceDetails?.licenceDriving?.url}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${licenceDetails.url ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                        <FontAwesomeIcon icon={faDownload} /> Télécharger le document
                    </button>

                    <div className="space-x-4">
                        {/* Bouton Vérifier */}
                        <button
                            onClick={() => handleVerification(true)}
                            disabled={isUpdating || licenceDetails?.licenceDriving?.verificationState === 1}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 
                                ${licenceDetails?.licenceDriving?.verificationState === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'} 
                                ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <FontAwesomeIcon icon={faCheckCircle} /> {isUpdating ? 'Vérification...' : 'Vérifier'}
                        </button>
                        
                        {/* Bouton Rejeter */}
                        <button
                            onClick={() => handleVerification(false)}
                            disabled={isUpdating || licenceDetails?.licenceDriving?.verificationState === 2}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 
                                ${licenceDetails?.licenceDriving?.verificationState === 2 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'} 
                                ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
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