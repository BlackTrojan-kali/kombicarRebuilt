import React, { useEffect, useState, useCallback } from 'react';
import { useNotification } from '../../hooks/useNotifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons'; // Importation d'icônes

const UserNotifications = () => {
    // État local pour gérer la pagination et l'affichage
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [notificationsData, setNotificationsData] = useState({
        items: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    // Récupérer les fonctions du contexte
    const { getNotification, markNotificationsAsRead, deleteNotifications } = useNotification();

    // Fonction pour charger les notifications (récupère les données depuis l'API)
    const loadNotifications = useCallback(async (page) => {
        setLoading(true);
        try {
            const res = await getNotification(page); 
            
            if (res && res.data) {
                setNotificationsData(res.data);
                setCurrentPage(res.data.page);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [getNotification]);

    // Chargement initial des données et rechargement quand la page change
    useEffect(() => {
        loadNotifications(currentPage);
    }, [loadNotifications, currentPage]); 
    
    // Fonction de rappel pour marquer comme lu (pour un seul élément)
    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationsAsRead([id]);
            // Recharger la page pour synchroniser l'affichage avec l'API
            loadNotifications(currentPage); 
        } catch (error) {
            console.error("Erreur lors du marquage comme lu:", error);
        }
    };
    
    // Fonction de rappel pour supprimer une notification
    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette notification ?")) return;
        try {
            await deleteNotifications([id]);
            // Recharger la page pour synchroniser l'affichage avec l'API
            loadNotifications(currentPage); 
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
        }
    };
    
    // Gestion du changement de page simplifié
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // --- Rendu Conditionnel ---

    if (loading) {
        // Style Tailwind pour l'état de chargement
        return (
            <div className="flex justify-center items-center h-48 text-lg text-gray-600 dark:text-gray-400">
                <FontAwesomeIcon icon={faSpinner} spin className="mr-3" />
                Chargement des notifications...
            </div>
        );
    }

    if (notificationsData?.items?.length === 0) {
        // Style Tailwind pour l'état vide
        return (
            <div className="text-center p-8  dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg shadow-inner">
                <p className="text-lg font-medium text-gray-500 dark:text-gray-300">
                    Vous n'avez aucune notification.
                </p>
            </div>
        );
    }

    return (
        <div className="user-notifications p-4 md:p-8 max-w-4xl mx-auto dark:text-gray-100">
            <br /><br />
            <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-gray-800 dark:text-white">
                Mes Notifications ({notificationsData.totalCount})
            </h2>

            {/* Liste des Notifications */}
            <div className="notifications-list space-y-3">
                {notificationsData?.items?.map((notif) => (
                    <div 
                        key={notif.id} 
                        // Styles conditionnels Tailwind basés sur isRead
                        className={`
                            p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out border border-gray-200 
                            ${notif.isRead 
                                ? 'bg-white dark:bg-gray-700 hover:shadow-lg dark:border-gray-600 opacity-80' 
                                : 'bg-blue-50 dark:bg-blue-900/50 hover:shadow-xl border-blue-200 dark:border-blue-800 font-medium'
                            }
                        `}
                    >
                        <div className="flex justify-between items-start">
                            <h3 className={`text-lg font-semibold ${notif.isRead ? 'text-gray-700 dark:text-gray-200' : 'text-blue-800 dark:text-blue-300'}`}>
                                {notif.title}
                            </h3>
                            {notif.isRead && (
                                <FontAwesomeIcon 
                                    icon={faCheckCircle} 
                                    className="text-green-500 text-xl ml-4 flex-shrink-0"
                                    title="Lu"
                                />
                            )}
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 mb-3">
                            {notif.content}
                        </p>
                        
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <small>
                                Publié le {new Date(notif.pusblishAt).toLocaleString()}
                            </small>
                            
                            <div className="actions flex space-x-3">
                                {!notif.isRead && (
                                    <button 
                                        onClick={() => handleMarkAsRead(notif.id)} 
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
                                        title="Marquer comme lu"
                                    >
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                                        Lu
                                    </button>
                                )}
                                <button 
                                    onClick={() => handleDelete(notif.id)} 
                                    className="text-xs font-semibold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors"
                                    title="Supprimer la notification"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Contrôles de Pagination */}
            <div className="pagination-controls flex justify-center items-center mt-8 space-x-4">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={!notificationsData.hasPreviousPage || loading}
                    className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                               bg-gray-200 text-gray-700 hover:bg-gray-300 
                               dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    &larr; Précédent
                </button>
                
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Page {currentPage}
                </span>
                
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={!notificationsData.hasNextPage || loading}
                    className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                               bg-gray-200 text-gray-700 hover:bg-gray-300 
                               dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    Suivant &rarr;
                </button>
            </div>
        </div>
    );
}

export default UserNotifications;