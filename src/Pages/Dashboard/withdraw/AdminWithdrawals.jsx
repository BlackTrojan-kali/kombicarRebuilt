import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import useWithDraw from '../../../hooks/useWithDraw';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faEye,
  faChevronLeft,
  faChevronRight,
  faHourglassHalf,
  faCalendarDay,
  faHistory,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';

const AdminWithdrawals = ({ type = "pending" }) => {
  const { page } = useParams();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
  const {
    pendingRequests,
    pendingRequestsPagination,
    isLoadingPendingRequests,
    pendingRequestsError,
    fetchPendingWithdrawalRequests,
    allHistory,
    allHistoryPagination,
    isLoadingAllHistory,
    allHistoryError,
    fetchAllWithdrawalHistory,
    adminUserHistory,
    adminUserHistoryPagination,
    isAdminHistoryLoading,
    adminHistoryError,
    fetchAdminUserWithdrawalHistory,
  } = useWithDraw();

  // Pour gérer l'historique d'un utilisateur, on récupère l'userId depuis le pathname
  const userId = type === 'user-history' ? location.pathname.split('/').pop() : null;

  useEffect(() => {
    switch (type) {
      case 'pending':
        fetchPendingWithdrawalRequests(currentPage);
        break;
      case 'history':
        fetchAllWithdrawalHistory(currentPage);
        break;
      case 'user-history':
        if (userId) {
          fetchAdminUserWithdrawalHistory(userId, currentPage);
        }
        break;
      default:
        fetchPendingWithdrawalRequests(currentPage);
    }
  }, [
    type,
    currentPage,
    userId,
  ]);

  const getTitle = () => {
    switch (type) {
      case 'pending':
        return 'Demandes de Retrait en Attente';
      case 'history':
        return 'Historique Complet des Retraits';
      case 'user-history':
        return `Historique des Retraits de l'utilisateur ${userId}`;
      default:
        return 'Gestion des Retraits';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'pending':
        return faHourglassHalf;
      case 'history':
        return faHistory;
      case 'user-history':
        return faUserCircle;
      default:
        return faHistory;
    }
  };

  const currentData = () => {
    switch (type) {
      case 'pending':
        return {
          requests: pendingRequests,
          pagination: pendingRequestsPagination,
          isLoading: isLoadingPendingRequests,
          error: pendingRequestsError,
        };
      case 'history':
        return {
          requests: allHistory,
          pagination: allHistoryPagination,
          isLoading: isLoadingAllHistory,
          error: allHistoryError,
        };
      case 'user-history':
        return {
          requests: adminUserHistory,
          pagination: adminUserHistoryPagination,
          isLoading: isAdminHistoryLoading,
          error: adminHistoryError,
        };
      default:
        return {
          requests: [],
          pagination: { page: 0, totalCount: 0, hasNextPage: false, hasPreviousPage: false },
          isLoading: false,
          error: null,
        };
    }
  };

  const { requests, pagination, isLoading, error } = currentData();

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-4">
        <FontAwesomeIcon icon={getIcon()} className="mr-3 text-blue-500" />
        {getTitle()}
      </h1>

      {isLoading && (
        <div className="flex justify-center items-center h-48 text-blue-500">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p className="ml-3 text-lg">Chargement des demandes...</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 p-4 border border-red-400 rounded-md bg-red-50">
          <p>Erreur lors du chargement des demandes : {error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {requests.length === 0 ? (
            <div className="text-center text-gray-500 p-6">
              <p className="text-lg">Aucune demande de retrait trouvée.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">ID</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Montant</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Numéro de Téléphone</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Statut</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Date de Demande</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="py-4 px-4 text-sm font-mono text-gray-800 dark:text-gray-200">{request.id}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-green-600 dark:text-green-400">{request.amount} FCFA</td>
                      <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">{request.phoneNumber}</td>
                      <td className="py-4 px-4 text-sm">
                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                            request.status === 0 ? 'bg-yellow-200 text-yellow-800' :
                            request.status === 1 ? 'bg-green-200 text-green-800' :
                            'bg-red-200 text-red-800'
                        }`}>
                            {request.status === 0 ? 'En attente' :
                            request.status === 1 ? 'Validée' :
                            'Rejetée'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <Link to={`/admin/withdrawals/details/${request.id}`} className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
                          <FontAwesomeIcon icon={faEye} />
                          <span className="ml-2">Détails</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Logique de pagination */}
          {pagination.totalCount > 0 && (
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!pagination.hasPreviousPage}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {pagination.page} de {Math.ceil(pagination.totalCount / requests.length)}
              </span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminWithdrawals;