import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye, faPaperPlane, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNotification } from '../../hooks/useNotifications'; // Assurez-vous que le chemin est correct
import { Link } from 'react-router-dom';
const AdminNotifications = () => {
    // 💡 Récupération des fonctions du contexte
    const { 
        getAllPlatformNotifications, 
        deletePlatformNotifications, 
        getAdminNotificationDetails // Utile pour ouvrir une modale/détails
    } = useNotification(); 
    
    // États locaux pour gérer la liste et la pagination
    const [notifications, setNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fonction pour charger la liste des notifications
    const fetchNotifications = useCallback(async (page) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await getAllPlatformNotifications(page);
            
            // 💡 Adaptation à la structure de l'API (à ajuster si nécessaire)
            setNotifications(res.data.items || res.data.notifications || []); 
            setTotalPages(res.data.totalPages || 1);
            setCurrentPage(page);
        } catch (err) {
            console.error("Erreur lors du chargement des notifications Admin:", err);
            setError("Impossible de charger les notifications de la plateforme.");
        } finally {
            setIsLoading(false);
        }
    }, [getAllPlatformNotifications]);

    // Chargement initial
    useEffect(() => {
        fetchNotifications(1);
    }, [fetchNotifications]);

    // Gestion du clic sur la page
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            fetchNotifications(page);
        }
    };
    
    // Action de suppression
    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette notification de la plateforme ?")) {
            try {
                // deletePlatformNotifications attend un tableau d'IDs
                await deletePlatformNotifications([id]); 
                
                // Mettre à jour la liste locale après suppression réussie
                setNotifications(prev => prev.filter(n => n.id !== id));
                
                // Recharger la page si la suppression a vidé la liste (facultatif)
                if (notifications.length === 1 && currentPage > 1) {
                    fetchNotifications(currentPage - 1);
                }
            } catch (err) {
                console.error("Échec de la suppression:", err);
                alert("Erreur lors de la suppression de la notification.");
            }
        }
    };
    
    // Affichage des détails (simulation)
    const handleViewDetails = async (id) => {
        try {
            const res = await getAdminNotificationDetails(id);
            alert(`Détails de la notification ${id}:\n\nTitre: ${res.data.title}\nMessage: ${res.data.message}`);
        } catch (err) {
            alert("Erreur lors de la récupération des détails de la notification.");
        }
    };


    if (isLoading) {
        return <div className="p-6 text-center text-kombiblue-500">Chargement des notifications...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500 border border-red-500 bg-red-50 rounded-lg">{error}</div>;
    }

    return (
        <div className="pl-12  pt-6 pb-40 bg-white dark:bg-gray-800 min-h-[80vh]">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-3">
                Administration des Notifications ({totalPages} pages)
            </h1>

            {notifications.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Aucune notification trouvée sur la plateforme.</p>
            ) : (
                <div className="shadow-lg rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/12">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-3/12">Titre / Message</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12">Destinataire</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12">Statut</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12">Date</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {notifications.map((n) => (
                                <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{n.id}</td>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs">
                                        <div className='font-semibold'>{n.title || "Sans Titre"}</div>
                                        <div className='text-xs italic text-gray-400'>{n.message ? n.message.substring(0, 50) + (n.message.length > 50 ? '...' : '') : 'Pas de message'}</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {n.userId ? `Utilisateur ID ${n.userId}` : 'Tous les utilisateurs'}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${n.is_read ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                            {n.is_read ? 'Lue' : 'Non lue'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {new Date(n.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleViewDetails(n.id)}
                                            className="text-kombiblue-500 hover:text-kombiblue-700 dark:hover:text-blue-400 mr-3"
                                            title="Voir les détails"
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        {/* Supprimer */}
                                        <button
                                            onClick={() => handleDelete(n.id)}
                                            className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
                                            title="Supprimer la notification"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                page === currentPage 
                                ? 'bg-kombiblue-500 text-white shadow-md' 
                                : 'bg-gray-200 text-gray-700 hover:bg-kombiblue-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
            
            {/* Action Administrateur : Publier une Nouvelle Notification */}
            <div className="mt-10 pt-6 border-t dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Actions de Publication</h2>
                <Link 
                    to="/admin/publish-notification" // Remplacez par votre route de formulaire de publication
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
                >
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2 -ml-1 h-5 w-5" />
                    Publier une Nouvelle Notification
                </Link>
            </div>
        </div>
    );
};

export default AdminNotifications;