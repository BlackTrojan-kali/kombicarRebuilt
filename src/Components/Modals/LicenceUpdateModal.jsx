import React, { useState } from 'react';
import useDrivingLicence from '../../hooks/useDrivingLicence';
import { toast } from 'sonner';

const LicenceUpdateModal = ({ isOpen, onClose, licence }) => {
  const { changeVerificationState, getLicencesList, loading } = useDrivingLicence();
  const [verificationState, setVerificationState] = useState(licence.verificationState);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changeVerificationState(licence.id, parseInt(verificationState), rejectionReason);
      toast.success("Statut du permis mis à jour avec succès !");
      onClose();
      // Re-fetch the list to show the updated status immediately
      getLicencesList(); 
    } catch (err) {
      toast.error("Échec de la mise à jour du statut.");
      console.error("Erreur lors de la mise à jour du statut:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/10 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Mettre à jour le permis de {licence.licenseNumber}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              État de vérification
            </label>
            <select
              id="status"
              value={verificationState}
              onChange={(e) => setVerificationState(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
              <option value={0}>En attente</option>
              <option value={1}>Vérifié</option>
              <option value={2}>Rejeté</option>
            </select>
          </div>
          {parseInt(verificationState) === 2 && (
            <div className="mb-4">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Motif du rejet
              </label>
              <textarea
                id="reason"
                rows="3"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              ></textarea>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LicenceUpdateModal;