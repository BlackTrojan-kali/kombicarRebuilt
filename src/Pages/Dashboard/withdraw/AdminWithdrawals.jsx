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
import { useWithdrawAdminContext } from '../../../contexts/Admin/WithDrawalAdminContext';

// Fonctions utilitaires de formatage
// ... (Ces fonctions sont parfaites, on les garde)
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
// -------------------------------------------------------------------

const AdminWithdrawals = ({ type = "pending" }) => {
    // Supposons que le routage pour user-history soit : /admin/withdrawals/user-history/:userId/:page
    const { page, userId: userIdFromParams } = useParams();
    const location = useLocation();

    // La page actuelle est toujours extraite des params, mais stockée localement
    const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
    
    // Utilisation des params pour obtenir le userId de manière plus fiable
    const userId = type === 'user-history' ? userIdFromParams : null;
    
    // Extraction des fonctions/états du contexte
    const {
        pendingRequests, pendingRequestsPagination, isLoadingPendingRequests, pendingRequestsError, fetchPendingWithdrawalRequests,
        allHistory, allHistoryPagination, isLoadingAllHistory, allHistoryError, fetchAllWithdrawalHistory,
        adminUserHistory, adminUserHistoryPagination, isAdminHistoryLoading, adminHistoryError, fetchAdminUserWithdrawalHistory,
    } = useWithdrawAdminContext(); // useWithDraw est un alias pour useWithdrawAdminContext()

    const [userName, setUserName] = useState('');

    // Mise à jour de currentPage si 'page' dans les params change (navigation externe)
    useEffect(() => {
        setCurrentPage(page ? parseInt(page) : 1);
    }, [page]);


    // --- Logique de récupération des données ---
    useEffect(() => {
        const fetchData = async () => {
            // Réinitialiser le nom d'utilisateur si l'on quitte l'historique utilisateur
            if (type !== 'user-history') setUserName('');

            let data;
            switch (type) {
                case 'pending':
                    data = await fetchPendingWithdrawalRequests(currentPage);
                    break;
                case 'history':
                    data = await fetchAllWithdrawalHistory(currentPage);
                    break;
                case 'user-history':
                    if (userId) {
                        data = await fetchAdminUserWithdrawalHistory(userId, currentPage);
                        // Tenter de récupérer le nom complet
                        if (data?.items?.length > 0 && data.items[0].user) {
                            const user = data.items[0].user;
                            setUserName(`${user.firstName} ${user.lastName}`);
                        } else {
                            // Afficher l'ID tronqué si le nom n'est pas disponible (ou un placeholder)
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

    // --- Fonctions d'Affichage ---
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

    // Fonction pour choisir les données/états appropriés
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

    // Calcul du nombre total de pages (plus précis : utilise totalCount et la taille de la liste actuelle comme limite par page)
    const itemsPerPage = requests.length > 0 ? requests.length : 10; // Utilise la taille réelle de la liste, ou 10 par défaut
    const totalPages = pagination.totalCount > 0 ? Math.ceil(pagination.totalCount / itemsPerPage) : 0;
    
    // Génère le lien de pagination pour chaque type
    const getPaginationLink = (newPage) => {
        if (type === 'user-history') {
            return `/admin/withdrawals/user-history/${userId}/${newPage}`; // Correction du chemin pour l'historique utilisateur si besoin
        }
        return `/admin/withdrawals/${type}/${newPage}`;
    }

    // --- Rendu du Composant ---
    return (
        <div className="container mx-auto pl-12 pt-6 pb-40 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            {/* Titre */}
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-4">
                <FontAwesomeIcon icon={getIcon()} className="mr-3 text-blue-500" />
                {getTitle()}
            </h1>

            {/* Chargement */}
            {isLoading && (
                <div className="flex justify-center items-center h-48 text-blue-500">
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                    <p className="ml-3 text-lg">Chargement des demandes...</p>
                </div>
            )}

            {/* Erreur */}
            {error && (
                <div className="text-center text-red-500 p-4 border border-red-400 rounded-md bg-red-50 dark:bg-red-900 dark:border-red-700">
                    <p>Erreur lors du chargement des demandes : **{error}**</p>
                </div>
            )}

            {/* Affichage des Données */}
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
                                        // Affiche le nom ou l'ID si l'objet 'user' n'est pas fourni (sauf dans le cas user-history où il est supposé être dans l'état userName)
                                        const displayUserName = request.user ? `${request.user.firstName} ${request.user.lastName}` : (request.userId || 'N/A');
                                        
                                        return (
                                            <tr
                                                key={request.id}
                                                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                            >
                                                <td className="py-4 px-4 text-sm font-mono text-gray-800 dark:text-gray-200">
                                                    {String(request.id).substring(0, 8)}...
                                                </td>
                                                <td className="py-4 px-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                                                    <Link to={`/admin/withdrawals/user-history/${request.userId}/1`}>
                                                        <FontAwesomeIcon icon={faUserCircle} className="mr-1" />
                                                        **{displayUserName}**
                                                    </Link>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                                                    <FontAwesomeIcon icon={faMobileAlt} className="mr-1 text-gray-500 dark:text-gray-400" />
                                                    {operatorName}
                                                </td>
                                                <td className="py-4 px-4 text-sm font-bold text-green-600 dark:text-green-400">
                                                    <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                                                    **{request.amount} FCFA**
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

                    {/* Pagination */}
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
                                Page **{pagination.page}** de **{totalPages}**
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