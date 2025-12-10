import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye, faPaperPlane, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNotification } from '../../hooks/useNotifications';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 10; // Hypothèse : 10 notifications par page

const AdminNotifications = () => {
    // 💡 Récupération des fonctions du contexte
    const { 
        getAllPlatformNotifications, 
        deletePlatformNotifications, 
        getAdminNotificationDetails
    } = useNotification(); 
    
    // États locaux pour gérer la liste et la pagination
    const [notifications, setNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0); // Nouveau: pour calculer totalPages
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Calcul du nombre total de pages
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    // Fonction pour charger la liste des notifications
    const fetchNotifications = useCallback(async (page) => {
        setIsLoading(true);
        setError(null);
        try {
            // L'API attend une page > 0, si l'on tente de charger la page 0, on met page 1 par défaut
            const pageToFetch = page > 0 ? page : 1;
            const res = await getAllPlatformNotifications(pageToFetch);
            
            // 💡 ADAPTATION À LA STRUCTURE DE RÉPONSE API FOURNIE 💡
            // Structure: { items: [...], totalCount: 0, page: 0, ...}
            if (res.data && res.data.items) {
                setNotifications(res.data.items); 
                setTotalCount(res.data.totalCount || 0); // Mise à jour du total
                setCurrentPage(pageToFetch); // Mise à jour de la page actuelle (pour la pagination)
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
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette notification de la plateforme ? Cette action est irréversible pour tous les utilisateurs ciblés.")) {
            try {
                // deletePlatformNotifications attend un tableau d'IDs
                await deletePlatformNotifications([id]); 
                
                // Recharger la page actuelle après suppression
                fetchNotifications(currentPage);

            } catch (err) {
                console.error("Échec de la suppression:", err);
                alert("Erreur lors de la suppression de la notification.");
            }
        }
    };
    
    // Affichage des détails (simulation avec getAdminNotificationDetails)
    const handleViewDetails = async (id) => {
        try {
            const res = await getAdminNotificationDetails(id);
            const data = res.data;

            // Afficher les détails dans une alerte pour l'exemple
            alert(
                `Détails de la notification #${id}\n\n` +
                `Titre: ${data.title}\n` +
                `Message: ${data.content}\n` + // Utilisation de 'content' si c'est la propriété dans l'API
                `Cible: ${data.isGlobal ? 'Plateforme entière' : (data.userId ? 'Utilisateur Spécifique' : 'N/A')}\n` +
                `Publié le: ${new Date(data.pusblishAt).toLocaleString()}` // Attention à la typo 'pusblishAt'
            );
        } catch (err) {
            alert("Erreur lors de la récupération des détails de la notification (Admin).");
        }
    };


    if (isLoading) {
        return <div className="p-6 text-center text-blue-500">Chargement des notifications...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500 border border-red-500 bg-red-50 rounded-lg">{error}</div>;
    }

    return (
        <div className="pl-12 pt-6 pb-40 bg-white dark:bg-gray-800 min-h-[80vh]">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-3">
                Administration des Notifications ({totalCount} au total / Page {currentPage} sur {totalPages})
            </h1>

            {notifications.length === 0 && totalCount > 0 && (
                 <p className="text-gray-500 dark:text-gray-400">Aucune notification trouvée sur cette page.</p>
            )}

            {notifications.length === 0 && totalCount === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Aucune notification publiée sur la plateforme.</p>
            ) : (
                <div className="shadow-lg rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/12">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-3/12">Titre / Message</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12">Cible</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12">Statut (Is Read)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12">Date de Publication</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {notifications.map((n) => (
                                <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{n.id}</td>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs">
                                        <div className='font-semibold'>{n.title || "Sans Titre"}</div>
                                        {/* Utilisation de 'content' selon votre structure API */}
                                        <div className='text-xs italic text-gray-400'>{n.content ? n.content.substring(0, 50) + (n.content.length > 50 ? '...' : '') : 'Pas de message'}</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {/* Utilisation de 'isGlobal' pour déterminer la cible */}
                                        {n.isGlobal ? 
                                            <span className='font-bold text-blue-600 dark:text-blue-400'>Plateforme</span> : 
                                            `Utilisateur ID ${n.userId ? n.userId.substring(0, 8) + '...' : 'N/A'}`
                                        }
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        {/* Votre API renvoie isRead, mais cela concerne la lecture pour UN utilisateur. 
                                            Pour l'Admin, on affiche l'état d'existence. (L'état 'isRead' ici est potentiellement trompeur s'il ne s'agit pas d'une métrique agrégée) 
                                            Je laisse l'indicateur d'état, mais l'interprétation doit être vérifiée côté backend.*/}
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${n.isRead ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                            {n.isRead ? 'Lue (Exemple)' : 'Non lue (Exemple)'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {/* Utilisation de la propriété 'pusblishAt' */}
                                        {new Date(n.pusblishAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleViewDetails(n.id)}
                                            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 mr-3"
                                            title="Voir les détails"
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        
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
                            disabled={page === currentPage || isLoading}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                page === currentPage 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-gray-200 text-gray-700 hover:bg-blue-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
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
                    to="/admin/publish-notification" // Assurez-vous que cette route mène au composant mis à jour précédemment
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