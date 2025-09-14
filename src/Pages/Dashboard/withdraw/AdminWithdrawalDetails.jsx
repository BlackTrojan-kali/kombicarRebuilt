import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useWithDraw from '../../../hooks/useWithDraw';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

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
  }, [requestId, fetchAdminWithdrawalDetails]);

  const handleUpdateStatus = async (status, reason = '') => {
    if (isUpdatingStatus) return;

    if (status === 2 && !reason) {
      toast.error("Veuillez fournir une raison pour le rejet.");
      return;
    }

    setIsUpdatingStatus(true);
    try {
      await updateWithdrawalStatus(requestId, { newStatus: status, reason });
      toast.success(`La demande a été ${status === 1 ? 'validée' : 'rejetée'} avec succès.`);
      // Recharger les détails pour afficher le nouveau statut ou rediriger
      navigate('/admin/withdrawals/pending');
    } catch (err) {
      console.error(err);
      toast.error("Échec de la mise à jour du statut.");
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
      <div className="text-center text-red-500 p-8">
        <p className="text-2xl font-bold">Erreur</p>
        <p className="mt-2 text-lg">Impossible de charger les détails de la demande : {adminDetailsError}</p>
      </div>
    );
  }

  if (!adminDetails) {
    return (
      <div className="text-center text-gray-500 p-8">
        <p className="text-2xl font-bold">Demande non trouvée</p>
        <p className="mt-2 text-lg">Aucune demande de retrait ne correspond à cet ID.</p>
      </div>
    );
  }

  const getStatusText = (status) => {
    switch (status) {
      case 0: return { text: "En attente", class: "bg-yellow-200 text-yellow-800" };
      case 1: return { text: "Validée", class: "bg-green-200 text-green-800" };
      case 2: return { text: "Rejetée", class: "bg-red-200 text-red-800" };
      default: return { text: "Inconnu", class: "bg-gray-200 text-gray-800" };
    }
  };

  const statusInfo = getStatusText(adminDetails.status);

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 max-w-3xl">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section Informations sur la demande */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-gray-200">
            Détails de la Demande
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">ID de la demande :</span> <span className="font-mono">{adminDetails.id}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">Montant :</span> <span className="font-bold text-green-600">{adminDetails.amount} FCFA</span>
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">Numéro de Téléphone :</span> {adminDetails.phoneNumber}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">Opérateur :</span> {adminDetails.operator}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">Demandé le :</span> {new Date(adminDetails.requestedAt).toLocaleString()}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">Statut :</span>
            <span className={`inline-block ml-2 px-3 py-1 text-sm font-bold rounded-full ${statusInfo.class}`}>
              {statusInfo.text}
            </span>
          </p>
          {adminDetails.status === 2 && (
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              <span className="font-medium text-red-600">Raison du rejet :</span> {adminDetails.rejectReason}
            </p>
          )}
        </div>

        {/* Section Actions Administratives */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-gray-200">
            Actions
          </h2>
          {adminDetails.status === 0 ? (
            <>
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
              <div className="flex flex-col gap-2">
                <textarea
                  className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
                  rows="3"
                  placeholder="Raison du rejet..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                ></textarea>
                <button
                  onClick={() => handleUpdateStatus(2, rejectReason)}
                  disabled={isUpdatingStatus || !rejectReason}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200 disabled:bg-red-300"
                >
                  <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                  {isUpdatingStatus ? 'Rejet en cours...' : 'Rejeter la demande'}
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Le statut de cette demande a déjà été traité.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWithdrawalDetails;