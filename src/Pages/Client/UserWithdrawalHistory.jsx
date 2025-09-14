import React, { useEffect } from 'react';
import useWithDraw from '../../hooks/useWithDraw'; // Assurez-vous que ce chemin est correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const UserWithdrawalHistory = () => {
    // Utilisation du hook personnalisé pour accéder aux données et fonctions du contexte
    const {
        userWithdrawalHistory,
        userWithdrawalPagination,
        isLoadingUserHistory,
        userHistoryError,
        fetchUserWithdrawalHistory
    } = useWithDraw();

    useEffect(() => {
        // Appelle la fonction pour récupérer l'historique de l'utilisateur au chargement du composant
        fetchUserWithdrawalHistory(1);
    }, [fetchUserWithdrawalHistory]);

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-4">Historique de mes Retraits</h1>

            {isLoadingUserHistory && (
                <div className="flex justify-center items-center h-48 text-blue-500">
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                    <p className="ml-3 text-lg">Chargement de votre historique...</p>
                </div>
            )}

            {userHistoryError && (
                <div className="text-center text-red-500 p-4 border border-red-400 rounded-md bg-red-50">
                    <p>Erreur lors du chargement de l'historique : {userHistoryError}</p>
                </div>
            )}

            {!isLoadingUserHistory && !userHistoryError && (
                <>
                    {userWithdrawalHistory.length === 0 ? (
                        <div className="text-center text-gray-500 p-6">
                            <p className="text-lg">Vous n'avez pas encore effectué de demande de retrait.</p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {userWithdrawalHistory.map((request) => (
                                <li key={request.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                ID de la demande : <span className="font-mono">{request.id}</span>
                                            </p>
                                            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                Montant : <span className="text-green-600 dark:text-green-400">{request.amount} FCFA</span>
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 text-right">
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {new Date(request.requestedAt).toLocaleDateString()}
                                            </p>
                                            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                                                request.status === 0 ? 'bg-yellow-200 text-yellow-800' :
                                                request.status === 1 ? 'bg-green-200 text-green-800' :
                                                'bg-red-200 text-red-800'
                                            }`}>
                                                {request.status === 0 ? 'En attente' :
                                                request.status === 1 ? 'Validée' :
                                                'Rejetée'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Numéro : {request.phoneNumber}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                    
                    {/* Logique de pagination ici, si nécessaire */}
                    {userWithdrawalPagination.totalCount > 0 && (
                        <div className="flex justify-center mt-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Page {userWithdrawalPagination.page} sur {Math.ceil(userWithdrawalPagination.totalCount / userWithdrawalHistory.length)}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UserWithdrawalHistory;