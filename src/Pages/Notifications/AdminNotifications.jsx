import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faTrash, faEye, faPaperPlane, faBell, 
    faGlobe, faUser, faSpinner, faArrowLeft, 
    faArrowRight, faTimes 
} from "@fortawesome/free-solid-svg-icons";
import { useNotification } from '../../hooks/useNotifications';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

const AdminNotifications = () => {
    const { 
        getAllPlatformNotifications, 
        deletePlatformNotifications, 
        getAdminNotificationDetails
    } = useNotification(); 
    
    const [notifications, setNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // États pour la modale de détails
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

    const fetchNotifications = useCallback(async (page) => {
        setIsLoading(true);
        setError(null);
        try {
            const pageToFetch = page > 0 ? page : 1;
            const res = await getAllPlatformNotifications(pageToFetch);
            
            if (res.data && res.data.items) {
                setNotifications(res.data.items); 
                setTotalCount(res.data.totalCount || 0);
                setCurrentPage(pageToFetch);
            } else {
                 throw new Error("Structure de données de notifications invalide.");
            }
        } catch (err) {
            console.error("Erreur lors du chargement des notifications Admin:", err);
            setError("Impossible de charger les notifications de la plateforme.");
        } finally {
            setIsLoading(false);
        }
    }, [getAllPlatformNotifications]);

    useEffect(() => {
        fetchNotifications(1);
    }, [fetchNotifications]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            fetchNotifications(newPage);
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette notification ? Cette action la retirera pour tous les utilisateurs ciblés.")) {
            try {
                await deletePlatformNotifications([id]); 
                toast.success("Notification supprimée avec succès.");
                // Si c'était le dernier élément de la page, on recule d'une page
                if (notifications.length === 1 && currentPage > 1) {
                    fetchNotifications(currentPage - 1);
                } else {
                    fetchNotifications(currentPage);
                }
            } catch (err) {
                console.error("Échec de la suppression:", err);
                toast.error("Erreur lors de la suppression de la notification.");
            }
        }
    };
    
    const handleViewDetails = async (id) => {
        setIsLoadingDetails(true);
        setIsModalOpen(true);
        try {
            const res = await getAdminNotificationDetails(id);
            setSelectedNotification(res.data);
        } catch (err) {
            toast.error("Erreur lors de la récupération des détails de la notification.");
            setIsModalOpen(false);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedNotification(null), 200); // Petit délai pour l'animation
    };

    if (isLoading && notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-blue-600 dark:text-blue-500 mb-4" />
                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Chargement de l'historique...</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            
            {/* Header avec bouton d'action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <FontAwesomeIcon icon={faBell} className="text-blue-600" />
                        Administration des Notifications
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Gérez l'historique de communication ({totalCount} notification{totalCount > 1 ? 's' : ''} au total).
                    </p>
                </div>
                <Link 
                    to="/admin/publish-notification" 
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all focus:ring-4 focus:ring-blue-500/30"
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                    Nouvelle Notification
                </Link>
            </div>

            {error ? (
                <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-6 rounded-xl border border-red-200 dark:border-red-800 text-center">
                    <p className="font-semibold text-lg">{error}</p>
                    <button onClick={() => fetchNotifications(currentPage)} className="mt-3 text-sm underline hover:text-red-800">Réessayer</button>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                    
                    {notifications.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="bg-gray-50 dark:bg-gray-700/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faBell} className="text-3xl text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Aucune communication</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Aucune notification n'a encore été publiée sur la plateforme.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Message</th>
                                        <th className="px-6 py-4">Cible</th>
                                        <th className="px-6 py-4">Date de Publication</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                    {notifications.map((n) => (
                                        <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                #{n.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">
                                                        {n.title || "Sans Titre"}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-sm">
                                                        {n.content || 'Aucun contenu'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {n.isGlobal ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                                                        <FontAwesomeIcon icon={faGlobe} /> Plateforme
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800">
                                                        <FontAwesomeIcon icon={faUser} /> Utils. Spécifique
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {n.pusblishAt ? new Date(n.pusblishAt).toLocaleString() : '---'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(n.id)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                        title="Voir les détails"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(n.id)}
                                                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                                                        title="Supprimer définitivement"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination Footer */}
                    {totalCount > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> sur <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                            </span>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1 || isLoading}
                                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        currentPage > 1 
                                            ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700' 
                                            : 'bg-gray-100 text-gray-400 border border-gray-200 pointer-events-none dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-600'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" /> Précédent
                                </button>
                                
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages || isLoading}
                                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        currentPage < totalPages 
                                            ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700' 
                                            : 'bg-gray-100 text-gray-400 border border-gray-200 pointer-events-none dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-600'
                                    }`}
                                >
                                    Suivant <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modale de Détails de la Notification */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all">
                        
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Détails de la Notification</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>
                        </div>

                        <div className="p-6">
                            {isLoadingDetails ? (
                                <div className="flex justify-center py-8">
                                    <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-blue-600" />
                                </div>
                            ) : selectedNotification ? (
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Titre</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedNotification.title}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contenu complet</p>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                                            {selectedNotification.content}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cible</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {selectedNotification.isGlobal ? 'Plateforme globale' : `Utilisateur: ${selectedNotification.userId || 'N/A'}`}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date de publication</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {selectedNotification.pusblishAt ? new Date(selectedNotification.pusblishAt).toLocaleString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-red-500">Données introuvables.</p>
                            )}
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                            <button onClick={closeModal} className="px-5 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNotifications;