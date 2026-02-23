import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faClock, faCheckCircle, faTimesCircle, faDownload, 
    faArrowLeft, faSpinner, faUser, faIdCard, 
    faEnvelope, faPhone, faCalendarAlt, faFileSignature,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { toast } from "sonner";
import { useAdminDLicenceContext } from '../../contexts/Admin/AdminDlicenceContext';

const DrivingLicenceDetails = () => {
    const { licenceId } = useParams();
    
    const { 
        getLicenceDetailsAdmin, 
        downloadLicenceDocument, 
        changeVerificationState, 
        loading, 
        error: contextError 
    } = useAdminDLicenceContext();

    const [licenceDetails, setLicenceDetails] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false); 

    const fetchDetails = useCallback(async () => {
        if (!licenceId) return;
        try {
            const details = await getLicenceDetailsAdmin(licenceId);
            setLicenceDetails(details);
        } catch (error) {
            console.error("Erreur lors du chargement des détails du permis:", error);
        }
    }, [licenceId, getLicenceDetailsAdmin]); 

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleDownload = () => {
        const documentUrl = licenceDetails?.licenceDriving?.url;
        if (documentUrl) {
            downloadLicenceDocument(documentUrl);
        } else {
            toast.error("URL du document non disponible.");
        }
    };

    const handleVerification = async (isVerified) => {
        if (!licenceDetails?.licenceDriving?.id) {
            toast.error("ID du permis non trouvé.");
            return;
        }

        const newState = isVerified ? 1 : 2;
        let reason = null;

        if (!isVerified) {
            const inputReason = prompt("Veuillez entrer la raison du rejet :");
            if (inputReason === null || inputReason.trim() === '') {
                toast.error("Le rejet nécessite une raison.");
                return;
            }
            reason = inputReason.trim();
        }

        setIsUpdating(true);
        try {
            await changeVerificationState(licenceDetails.licenceDriving.id, newState, reason);
            
            setLicenceDetails(prev => ({ 
                ...prev, 
                licenceDriving: {
                    ...prev.licenceDriving,
                    verificationState: newState,
                    rejectionReason: reason 
                }
            }));

            toast.success(`Le permis a été ${isVerified ? 'vérifié' : 'rejeté'} avec succès.`);
        } catch (error) {
            console.error("Échec de la mise à jour de l'état:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const getStateConfig = (state) => {
        switch (parseInt(state)) {
            case 1:
                return { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200', text: 'Vérifié', icon: faCheckCircle };
            case 2:
                return { color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200', text: 'Rejeté', icon: faTimesCircle };
            case 0:
            default:
                return { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200', text: 'En attente', icon: faClock };
        }
    };

    const isFetching = loading && !licenceDetails;

    if (isFetching || isUpdating) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-blue-600 dark:text-blue-500 mb-4" />
                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                    {isUpdating ? "Mise à jour du statut en cours..." : "Chargement des détails du permis..."}
                </p>
            </div>
        );
    }

    if (contextError || !licenceDetails) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-6 rounded-xl border border-red-200 dark:border-red-800 max-w-md text-center">
                    <FontAwesomeIcon icon={faTimesCircle} className="text-3xl mb-3" />
                    <p className="font-semibold text-lg mb-2">Impossible de charger les données</p>
                    <p className="text-sm">{contextError || "Détails du permis introuvables."}</p>
                    <Link to="/admin/licences/0/1" className="mt-4 inline-block text-sm underline hover:text-red-800">Retour à la liste</Link>
                </div>
            </div>
        );
    }
    
    const { licenceDriving, firstName, lastName, email, phoneNumber } = licenceDetails;
    const statusConfig = getStateConfig(licenceDriving?.verificationState);

    return (
        <div className='p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen'>
            
            {/* Header / Navigation */}
            <div className="mb-6">
                <Link 
                    to="/admin/licences/0/1" 
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors mb-4"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Retour à la liste
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        Détails du Permis
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full border ${statusConfig.color}`}>
                            <FontAwesomeIcon icon={statusConfig.icon} className="w-4 h-4" />
                            {statusConfig.text}
                        </span>
                    </h1>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Informations Utilisateur */}
                    <div>
                        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100 dark:border-gray-700">
                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profil du Chauffeur</h2>
                        </div>
                        
                        <div className="space-y-5">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nom complet</p>
                                <p className="text-base font-semibold text-gray-900 dark:text-white">{firstName} {lastName}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 w-4" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Adresse e-mail</p>
                                    <p className="text-base text-gray-900 dark:text-white">{email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faPhone} className="text-gray-400 w-4" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Téléphone</p>
                                    <p className="text-base text-gray-900 dark:text-white">{phoneNumber || 'Non renseigné'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informations Permis */}
                    <div>
                        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100 dark:border-gray-700">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <FontAwesomeIcon icon={faIdCard} />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Données du Permis</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="sm:col-span-2">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Numéro de Permis</p>
                                <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 inline-block px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700">
                                    {licenceDriving?.licenseNumber || 'N/A'}
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <FontAwesomeIcon icon={faUser} className="text-gray-400 mt-1 w-4" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date de naissance</p>
                                    <p className="text-base text-gray-900 dark:text-white">
                                        {licenceDriving?.dateOfBirth ? new Date(licenceDriving.dateOfBirth).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FontAwesomeIcon icon={faFileSignature} className="text-gray-400 mt-1 w-4" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date d'émission</p>
                                    <p className="text-base text-gray-900 dark:text-white">
                                        {licenceDriving?.issueDate ? new Date(licenceDriving.issueDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mt-1 w-4" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date d'expiration</p>
                                    <p className="text-base font-medium text-gray-900 dark:text-white">
                                        {licenceDriving?.expirationDate ? new Date(licenceDriving.expirationDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Zone de Rejet (Affichée uniquement si le permis est rejeté) */}
                {licenceDriving?.verificationState === 2 && licenceDriving?.rejectionReason && (
                    <div className="mx-6 md:mx-8 mb-8 bg-rose-50 border-l-4 border-rose-500 dark:bg-rose-900/20 rounded-r-lg p-4">
                        <div className="flex items-start">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-rose-500 mt-0.5 mr-3" />
                            <div>
                                <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300">Raison du rejet</h3>
                                <p className="text-sm text-rose-700 dark:text-rose-400 mt-1">
                                    {licenceDriving.rejectionReason}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions Footer */}
                <div className="bg-gray-50/50 dark:bg-gray-800/50 px-6 py-5 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                    
                    <button
                        onClick={handleDownload}
                        disabled={!licenceDriving?.url || isUpdating}
                        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            licenceDriving?.url 
                            ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:text-blue-400' 
                            : 'bg-gray-100 text-gray-400 border-2 border-transparent cursor-not-allowed dark:bg-gray-800/50 dark:text-gray-500'
                        }`}
                    >
                        <FontAwesomeIcon icon={faDownload} /> 
                        Voir le document
                    </button>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => handleVerification(false)}
                            disabled={isUpdating || licenceDriving?.verificationState === 2}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                                licenceDriving?.verificationState === 2 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500 shadow-none' 
                                : 'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-md hover:-translate-y-0.5 focus:ring-4 focus:ring-rose-500/30'
                            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <FontAwesomeIcon icon={faTimesCircle} /> Rejeter
                        </button>

                        <button
                            onClick={() => handleVerification(true)}
                            disabled={isUpdating || licenceDriving?.verificationState === 1}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                                licenceDriving?.verificationState === 1 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500 shadow-none' 
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md hover:-translate-y-0.5 focus:ring-4 focus:ring-emerald-500/30'
                            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <FontAwesomeIcon icon={faCheckCircle} /> Valider
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DrivingLicenceDetails;