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
    faHistory,
    faUserCircle,
    faMobileAlt, 
    faDollarSign, 
    faCalendarDay,
} from '@fortawesome/free-solid-svg-icons';

// Fonctions utilitaires de formatage
const formatStatus = (status) => {
    switch (status) {
        case 0:
            return { text: 'En attente', class: 'bg-yellow-200 text-yellow-800' };
        case 1:
            return { text: 'Validée', class: 'bg-green-200 text-green-800' };
        case 2:
            return { text: 'Rejetée', class: 'bg-red-200 text-red-800' };
        default:
            return { text: 'Inconnu', class: 'bg-gray-200 text-gray-800' };
    }
};

const formatOperator = (operator) => {
    switch (operator) {
        case 1:
            return 'Orange Money';
        case 2:
            return 'MTN MoMo';
        default:
            return 'Inconnu';
    }
};


const AdminWithdrawals = ({ type = "pending" }) => {
    const { page } = useParams();
    const location = useLocation();

    const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
    
    const pathSegments = location.pathname.split('/');
    const userId = type === 'user-history' 
        ? pathSegments.slice(2).find(segment => segment !== 'history' && !isNaN(parseInt(segment)) && pathSegments.indexOf(segment) > pathSegments.indexOf('history')) || pathSegments[pathSegments.length - 1] // Simplification
        : null;
    
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
    
    const [userName, setUserName] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            if (type !== 'user-history') setUserName('');

            switch (type) {
                case 'pending':
                    await fetchPendingWithdrawalRequests(currentPage);
                    break;
                case 'history':
                    await fetchAllWithdrawalHistory(currentPage);
                    break;
                case 'user-history':
                    if (userId) {
                        const data = await fetchAdminUserWithdrawalHistory(userId, currentPage);
                        if (data?.items?.length > 0 && data.items[0].user) {
                             const user = data.items[0].user;
                             setUserName(`${user.firstName} ${user.lastName}`);
                        } else {
                            setUserName(userId ? String(userId).substring(0, 8) + '...' : 'cet utilisateur');
                        }
                    }
                    break;
                default:
                    await fetchPendingWithdrawalRequests(currentPage);
            }
        };
        fetchData();
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
                return `Historique des Retraits de ${userName || 'cet utilisateur'}`;
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

    const totalPages = requests.length > 0 ? Math.ceil(pagination.totalCount / requests.length) : 0;
    
    const getPaginationLink = (newPage) => {
        if (type === 'user-history') {
            return `/admin/users/history/${userId}/${newPage}`;
        }
        return `/admin/withdrawals/${type}/${newPage}`;
    }


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
                <div className="text-center text-red-500 p-4 border border-red-400 rounded-md bg-red-50 dark:bg-red-900 dark:border-red-700">
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
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Utilisateur</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Opérateur</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Montant</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Statut</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Date de Demande</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request) => {
                                        const statusInfo = formatStatus(request.status);
                                        const operatorName = formatOperator(request.operator);
                                        const userName = request.user ? `${request.user.firstName} ${request.user.lastName}` : 'N/A';
                                        
                                        return (
                                            <tr
                                                key={request.id}
                                                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                            >
                                                <td className="py-4 px-4 text-sm font-mono text-gray-800 dark:text-gray-200">
                                                    {/* CORRECTION APPLIQUÉE ICI */}
                                                    {String(request.id).substring(0, 8)}...
                                                </td>
                                                <td className="py-4 px-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                                                    <Link to={`/admin/withdrawals/user-history/${request.userId}/1`}>
                                                        <FontAwesomeIcon icon={faUserCircle} className="mr-1" />
                                                        {userName}
                                                    </Link>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                                                    <FontAwesomeIcon icon={faMobileAlt} className="mr-1 text-gray-500 dark:text-gray-400" />
                                                    {operatorName}
                                                </td>
                                                <td className="py-4 px-4 text-sm font-bold text-green-600 dark:text-green-400">
                                                    <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                                                    {request.amount} FCFA
                                                </td>
                                                <td className="py-4 px-4 text-sm">
                                                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${statusInfo.class}`}>
                                                        {statusInfo.text}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                    <FontAwesomeIcon icon={faCalendarDay} className="mr-1" />
                                                    {new Date(request.requestedAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-4 text-sm">
                                                    <Link to={`/admin/withdrawals/details/${request.id}`} className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
                                                        <FontAwesomeIcon icon={faEye} />
                                                        <span className="ml-2">Détails</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {pagination.totalCount > 0 && requests.length > 0 && (
                        <div className="flex justify-center items-center mt-6 space-x-4">
                            <Link 
                                to={pagination.hasPreviousPage ? getPaginationLink(currentPage - 1) : '#'}
                                onClick={(e) => !pagination.hasPreviousPage && e.preventDefault()}
                                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                                    pagination.hasPreviousPage 
                                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                                }`}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </Link>

                            <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                                Page {pagination.page} de {totalPages}
                            </span>
                            <Link
                                to={pagination.hasNextPage ? getPaginationLink(currentPage + 1) : '#'}
                                onClick={(e) => !pagination.hasNextPage && e.preventDefault()}
                                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                                    pagination.hasNextPage 
                                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                                }`}
                            >
                                <FontAwesomeIcon icon={faChevronRight} />
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminWithdrawals;