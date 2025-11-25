import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheckCircle, faTimesCircle, faDownload, faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from "sonner";
import { useAdminDLicenceContext } from '../../contexts/Admin/AdminDlicenceContext';

const DrivingLicenceDetails = () => {
    const { licenceId } = useParams();
    
    // Extraction des fonctions et états du contexte
    const { 
        getLicenceDetailsAdmin, 
        downloadLicenceDocument, 
        changeVerificationState, 
        loading, 
        error: contextError 
    } = useAdminDLicenceContext();

    // On utilise un état local pour stocker les détails après la récupération/mise à jour
    const [licenceDetails, setLicenceDetails] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false); 
    const [rejectionReason, setRejectionReason] = useState(''); // Pour gérer la raison de rejet

    // --- Chargement initial des détails (Utilisation de useCallback pour stabiliser la dépendance) ---
    const fetchDetails = useCallback(async () => {
        if (!licenceId) return;

        try {
            // Utilisation de la fonction Admin spécifique pour les détails
            // Cette fonction est censée retourner les données.
            const details = await getLicenceDetailsAdmin(licenceId);
            setLicenceDetails(details);
        } catch (error) {
            console.error("Erreur lors du chargement des détails du permis:", error);
            // Pas de toast ici, car le Context le gère déjà
        }
    }, [licenceId, getLicenceDetailsAdmin]); // IMPORTANT : Inclus getLicenceDetailsAdmin comme dépendance

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]); // Exécuter lors du montage et si fetchDetails change (licenceId change)

    // --- Gestion du Téléchargement ---
    const handleDownload = () => {
        // Utilisation des détails chargés
        const documentUrl = licenceDetails?.licenceDriving?.url;

        if (documentUrl) {
            // Utilisation de la fonction de téléchargement du Context
            downloadLicenceDocument(documentUrl);
        } else {
            toast.error("URL du document non disponible.");
        }
    };

    // --- Gestion de la Vérification / Rejet ---
    const handleVerification = async (isVerified) => {
        // On vérifie d'abord si l'ID est disponible
        if (!licenceDetails?.licenceDriving?.id) {
            toast.error("ID du permis non trouvé.");
            return;
        }

        const newState = isVerified ? 1 : 2; // 1: Verified, 2: Rejected
        let reason = null;

        if (!isVerified) {
            // Si rejet, on demande la raison (simple prompt pour l'exemple)
            const inputReason = prompt("Veuillez entrer la raison du rejet :");
            if (inputReason === null || inputReason.trim() === '') {
                toast.error("Le rejet nécessite une raison.");
                return;
            }
            reason = inputReason.trim();
        }

        setIsUpdating(true);
        try {
            // Utilisation de la fonction de modification d'état du Context
            await changeVerificationState(licenceDetails.licenceDriving.id, newState, reason);
            
            // Mettre à jour l'état local après la réussite
            setLicenceDetails(prev => ({ 
                ...prev, 
                licenceDriving: {
                    ...prev.licenceDriving,
                    verificationState: newState,
                    rejectionReason: reason // Mettre à jour la raison de rejet si applicable
                }
            }));

            // La toast de succès est gérée par le context, mais on peut en ajouter une plus spécifique
            toast.success(`Le permis a été ${isVerified ? 'vérifié' : 'rejeté'} avec succès.`);

        } catch (error) {
            // Le Context gère déjà le toast d'erreur
            console.error("Échec de la mise à jour de l'état:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    // --- Fonctions d'aide pour le rendu ---
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
    const isFetching = loading && !licenceDetails;

    if (isFetching || isUpdating) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-blue-500" />
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
    
    // Destructuration pour plus de clarté dans le JSX
    const { licenceDriving, firstName, lastName, email, phoneNumber } = licenceDetails;


    // --- Rendu principal ---
    return (
        <div className='pl-12 pt-6 pb-40 bg-gray-100 dark:bg-gray-900 min-h-screen'>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <Link to="/admin/licences/0/1" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Retour à la liste des permis en attente
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Détails du Permis de Conduire</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Colonne 1: Informations sur l'utilisateur */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Informations sur l'utilisateur</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Nom:</span> **{firstName} {lastName}**
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Email:</span> {email}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Téléphone:</span> {phoneNumber || 'N/A'}
                        </p>
                    </div>

                    {/* Colonne 2: Détails du permis */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Détails du permis</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Numéro de Permis:</span> **{licenceDriving?.licenseNumber || 'N/A'}**
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Date de naissance:</span> {licenceDriving?.dateOfBirth ? new Date(licenceDriving.dateOfBirth).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Date d'émission:</span> {licenceDriving?.issueDate ? new Date(licenceDriving.issueDate).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Date d'expiration:</span> {licenceDriving?.expirationDate ? new Date(licenceDriving.expirationDate).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">État de vérification:</span> 
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStateColor(licenceDriving?.verificationState)}`}>
                                {getStateText(licenceDriving?.verificationState)}
                            </span>
                        </p>
                        {licenceDriving?.rejectionReason && licenceDriving.verificationState === 2 && (
                            <p className="text-red-600 dark:text-red-400 mt-2 p-2 bg-red-50 dark:bg-red-900 rounded-md text-sm">
                                <span className="font-medium">Raison du rejet:</span> {licenceDriving.rejectionReason}
                            </p>
                        )}
                    </div>
                </div>

                {/* --- Actions --- */}
                <div className="mt-8 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6">
                    {/* Bouton de Téléchargement */}
                    <button
                        onClick={handleDownload}
                        disabled={!licenceDriving?.url || isUpdating}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${licenceDriving?.url ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                        <FontAwesomeIcon icon={faDownload} /> Télécharger le document
                    </button>

                    <div className="space-x-4">
                        {/* Bouton Vérifier */}
                        <button
                            onClick={() => handleVerification(true)}
                            disabled={isUpdating || licenceDriving?.verificationState === 1}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 
                                ${licenceDriving?.verificationState === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'} 
                                ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <FontAwesomeIcon icon={faCheckCircle} /> {isUpdating ? 'Vérification...' : 'Vérifier'}
                        </button>
                        
                        {/* Bouton Rejeter */}
                        <button
                            onClick={() => handleVerification(false)}
                            disabled={isUpdating || licenceDriving?.verificationState === 2}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 
                                ${licenceDriving?.verificationState === 2 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'} 
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