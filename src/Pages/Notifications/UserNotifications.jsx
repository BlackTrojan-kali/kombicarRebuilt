import React, { useEffect, useState, useCallback } from 'react';
import { useNotification } from '../../hooks/useNotifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

const UserNotifications = () => {
    // État local pour gérer la pagination et l'affichage des données
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [notificationsData, setNotificationsData] = useState({
        items: [],
        totalCount: 0,
        page: 1, // Assurez-vous que l'état initial correspond à la première page
        hasNextPage: false,
        hasPreviousPage: false,
    });


    // Récupérer les fonctions du contexte
    // NOTE : On récupère setNotification ici, même si on ne l'utilise pas pour les actions globales,
    // car le contexte met à jour son propre state 'notification'.
    const { getNotification, markNotificationsAsRead, deleteNotifications, setNotification } = useNotification();

    // Fonction pour charger les notifications (récupère les données depuis l'API)
    const loadNotifications = useCallback(async (page) => {
        setLoading(true);
        try {
            const res = await getNotification(page); 
            
            if (res && res.data) {
                // 💡 MISE À JOUR : Mise à jour de l'état local du composant avec la réponse paginée complète
                setNotificationsData(res.data);
                // 💡 CORRECTION : Mettre à jour currentPage uniquement si l'API renvoie le numéro de page
                // mais on utilise 'page' directement dans le useEffect, donc on peut le laisser ainsi.
                // setNotificationsData(prev => ({ ...prev, page: res.data.page }));
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
            
            // 💡 OPTIMISATION : Mettre à jour le state local immédiatement (sans recharger la page)
            setNotificationsData(prev => ({
                ...prev,
                items: prev.items.map(n => 
                    n.id === id ? { ...n, isRead: true } : n
                )
            }));
            
            // L'appel à loadNotifications(currentPage) n'est plus nécessaire ici,
            // car le state local a été mis à jour pour une meilleure réactivité.
        } catch (error) {
            console.error("Erreur lors du marquage comme lu:", error);
        }
    };
    
    // Fonction de rappel pour supprimer une notification
    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette notification ?")) return;
        try {
            await deleteNotifications([id]);
            
            // 💡 OPTIMISATION : Mettre à jour le state local immédiatement (sans recharger la page)
            // 1. Filtrer l'élément supprimé
            const newItems = notificationsData.items.filter(n => n.id !== id);
            
            // 2. Mettre à jour les données de pagination
            setNotificationsData(prev => ({
                ...prev,
                items: newItems,
                // On décrémente totalCount et le compte d'éléments sur la page courante
                totalCount: prev.totalCount - 1, 
            }));
            
            // 3. S'il n'y a plus d'éléments sur la page courante ET qu'il ne s'agit pas de la première page,
            // on recule d'une page pour éviter un écran vide.
            if (newItems.length === 0 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }
            // L'appel à loadNotifications(currentPage) n'est plus nécessaire ici.
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
        }
    };
    
    // Gestion du changement de page simplifié
    const handlePageChange = (newPage) => {
        // Le useEffect détectera le changement de currentPage et appellera loadNotifications
        setCurrentPage(newPage);
    };

    // --- Rendu Conditionnel ---

    if (loading && notificationsData.items.length === 0) {
        // Affiche le spinner seulement s'il n'y a pas encore de données
        return (
            <div className="flex justify-center items-center h-48 text-lg text-gray-600 dark:text-gray-400">
                <FontAwesomeIcon icon={faSpinner} spin className="mr-3" />
                Chargement des notifications...
            </div>
        );
    }

    if (notificationsData?.length === 0 && !loading) {
        // Style Tailwind pour l'état vide
        return (
            <div className="text-center px-8 py-[200px] dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg shadow-inner">
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
                        {/* Indicateur de chargement au niveau de l'élément si vous souhaitez */}
                        {/* {loading && <FontAwesomeIcon icon={faSpinner} spin />} */}
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
                    Page {notificationsData.page} sur {Math.ceil(notificationsData.totalCount / notificationsData?.length) || 1}
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