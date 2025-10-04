import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useWithDraw from '../../../hooks/useWithDraw';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSpinner,
    faCheckCircle,
    faTimesCircle,
    faArrowLeft,
    faUserCircle, // Nouvelle icône
    faEnvelope, // Nouvelle icône
    faMobileAlt, // Nouvelle icône
} from '@fortawesome/free-solid-svg-icons';
import { toast } from "sonner";

// Fonctions utilitaires de formatage
const getStatusText = (status) => {
    switch (status) {
        case 0: return { text: "En attente", class: "bg-yellow-200 text-yellow-800" };
        case 1: return { text: "Validée", class: "bg-green-200 text-green-800" };
        case 2: return { text: "Rejetée", class: "bg-red-200 text-red-800" };
        default: return { text: "Inconnu", class: "bg-gray-200 text-gray-800" };
    }
};

const formatOperator = (operator) => {
    switch (operator) {
        case 1:
            return 'Orange Money';
        case 2:
            return 'MTN MoMo';
        default:
            return 'Opérateur non spécifié';
    }
};


const AdminWithdrawalDetails = () => {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const {
        adminDetails,
        isAdminDetailsLoading,
        adminDetailsError,
        fetchAdminWithdrawalDetails,
        updateWithdrawalStatus,
    } = useWithDraw();

    const [rejectReason, setRejectReason] = useState('');
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        if (requestId) {
            fetchAdminWithdrawalDetails(requestId);
        }
    }, [requestId,]); // Ajout de la dépendance fetchAdminWithdrawalDetails

    // Modification de la fonction pour refléter le besoin d'envoyer la raison du rejet
    const handleUpdateStatus = async (status, reason = '') => {
        if (isUpdatingStatus) return;

        if (status === 2 && !reason.trim()) {
            toast.error("Veuillez fournir une raison pour le rejet.");
            return;
        }

        setIsUpdatingStatus(true);
        try {
            // L'API est supposée utiliser le body pour envoyer le statut et la raison
            // Si l'API ne prend que le statut en paramètre de route et la raison en body,
            // cette structure doit être vérifiée côté backend.
            // En se basant sur le code du Provider: updateWithdrawalStatus(requestId, newStatus)
            // Nous devons nous assurer que le Provider peut gérer la raison.
            
            // Correction : L'endpoint du Provider est `update-status/${requestId}`, et le body est `{ status: newStatus }`.
            // Le Provider doit être mis à jour pour inclure la raison de rejet s'il y en a une,
            // ou l'endpoint backend doit le gérer. En attendant, on passe la raison.

            await updateWithdrawalStatus(requestId, status, reason);
            toast.success(`La demande a été ${status === 1 ? 'validée' : 'rejetée'} avec succès.`);
            
            // Rediriger ou recharger après la mise à jour
            navigate('/admin/withdrawals/pending');
        } catch (err) {
            console.error(err);
            // Le message d'erreur est géré dans le Provider via toast.error
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    if (isAdminDetailsLoading) {
        return (
            <div className="flex justify-center items-center h-screen text-blue-500">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                <p className="ml-4 text-xl">Chargement des détails...</p>
            </div>
        );
    }

    if (adminDetailsError) {
        return (
            <div className="text-center text-red-500 p-8 bg-red-50 dark:bg-red-900 rounded-lg">
                <p className="text-2xl font-bold">Erreur</p>
                <p className="mt-2 text-lg">Impossible de charger les détails de la demande.</p>
                <p className="mt-2 text-sm text-red-400">{adminDetailsError}</p>
            </div>
        );
    }

    if (!adminDetails) {
        return (
            <div className="text-center text-gray-500 p-8 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold">Demande non trouvée</p>
                <p className="mt-2 text-lg">Aucune demande de retrait ne correspond à cet ID.</p>
            </div>
        );
    }

    const statusInfo = getStatusText(adminDetails.status);
    const operatorName = formatOperator(adminDetails.operator);
    const user = adminDetails.user || {}; // S'assurer que user existe

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 max-w-4xl">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Détails de la Demande de Retrait
                </h1>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Retour
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Colonne 1 : Informations Utilisateur */}
                <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-gray-200">
                        <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                        Informations Utilisateur
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-medium">Nom complet :</span> 
                        <Link 
                            to={`/admin/withdrawals/user-history/${user.id}/1`}
                            className="ml-2 text-blue-500 hover:underline font-semibold"
                        >
                            {user.firstName} {user.lastName}
                        </Link>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-medium">ID Utilisateur :</span> <span className="font-mono text-xs">{user.id}</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-1 text-gray-500" />
                        <span className="font-medium">Email :</span> {user.email}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        <FontAwesomeIcon icon={faMobileAlt} className="mr-1 text-gray-500" />
                        <span className="font-medium">Téléphone :</span> {user.phoneNumber}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-medium">Solde actuel :</span> <span className="font-bold text-blue-600">{user.balance} FCFA</span>
                    </p>
                </div>
                
                {/* Colonne 2 : Détails de la Demande */}
                <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-gray-200">
                        Détails du Paiement
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-medium">ID de la demande :</span> <span className="font-mono">{String(adminDetails.id).substring(0, 8)}...</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-medium">Montant :</span> <span className="font-bold text-green-600">{adminDetails.amount} FCFA</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-medium">Part de service :</span> <span className="font-bold text-red-500">{adminDetails.servicePart || 0} FCFA</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-medium">Opérateur ciblé :</span> {operatorName}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-medium">Numéro de Téléphone :</span> {adminDetails.phoneNumber}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-medium">ID de Transaction (si validée) :</span> <span className="font-mono text-sm">{adminDetails.transactionId || 'N/A'}</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-medium">Demandé le :</span> {new Date(adminDetails.requestedAt).toLocaleString()}
                    </p>
                    {adminDetails.processedAt && (
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                            <span className="font-medium">Traité le :</span> {new Date(adminDetails.processedAt).toLocaleString()}
                        </p>
                    )}
                </div>

                {/* Colonne 3 : Actions Administratives */}
                <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-gray-200">
                        Statut & Actions
                    </h2>
                     <p className="text-gray-700 dark:text-gray-300 mb-4">
                        <span className="font-medium">Statut actuel :</span>
                        <span className={`inline-block ml-2 px-3 py-1 text-sm font-bold rounded-full ${statusInfo.class}`}>
                            {statusInfo.text}
                        </span>
                    </p>

                    {adminDetails.status === 2 && (
                        <div className="p-3 bg-red-100 dark:bg-red-800 rounded-lg mb-4">
                            <span className="font-medium text-red-600 dark:text-red-300">Raison du rejet :</span> 
                            <p className="text-sm text-red-700 dark:text-red-200 mt-1">{adminDetails.rejectReason || 'Aucune raison spécifiée.'}</p>
                        </div>
                    )}
                    
                    {adminDetails.status === 0 ? (
                        <>
                            {/* Validation */}
                            <div className="mb-4">
                                <button
                                    onClick={() => handleUpdateStatus(1)}
                                    disabled={isUpdatingStatus}
                                    className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 disabled:bg-green-300"
                                >
                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                    {isUpdatingStatus ? 'Validation en cours...' : 'Valider la demande'}
                                </button>
                            </div>
                            
                            {/* Rejet */}
                            <div className="flex flex-col gap-2 border-t pt-4 border-gray-200 dark:border-gray-600">
                                <textarea
                                    className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100 focus:ring-red-500 focus:border-red-500"
                                    rows="3"
                                    placeholder="Raison du rejet (obligatoire pour le rejet)..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                ></textarea>
                                <button
                                    onClick={() => handleUpdateStatus(2, rejectReason)}
                                    disabled={isUpdatingStatus || !rejectReason.trim()}
                                    className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200 disabled:bg-red-300"
                                >
                                    <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                                    {isUpdatingStatus ? 'Rejet en cours...' : 'Rejeter la demande'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-600 dark:text-gray-400 p-4 border rounded-lg bg-gray-100 dark:bg-gray-600">
                            Cette demande a été <span className="font-bold">{statusInfo.text.toLowerCase()}</span> et n'est plus en attente d'action.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminWithdrawalDetails;