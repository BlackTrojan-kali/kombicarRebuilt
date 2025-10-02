import React, { useState, useEffect } from 'react';
import useNotificationsList from '../hooks/useNotificationsList'; // Assurez-vous que le chemin est correct
import { FiTrash2, FiSend, FiEdit, FiEye, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'sonner';

const AdminNotifications = () => {
    // Récupération de tous les états et fonctions d'administration
    const {
        allNotifications, 
        isLoadingAllNotifications, 
        allPagination, 
        setCurrentAllPage,
        fetchAllPlatformNotifications, // Pour le rechargement
        deleteAllPlatformNotifications,
        publishNotification, // Pour la création
    } = useNotificationsList();

    // États locaux pour le formulaire de création
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [selectedIds, setSelectedIds] = useState([]); // Pour la sélection de masse

    // -------------------------------------------------------------------
    // -- Logique de Gestion des Sélection et Soumission
    // -------------------------------------------------------------------

    const handleToggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) {
            toast.info("Veuillez sélectionner au moins une notification à supprimer.");
            return;
        }
        
        // Appel de la fonction de suppression globale
        const success = deleteAllPlatformNotifications(selectedIds);
        
        if (success) {
            setSelectedIds([]); // Réinitialiser la sélection après succès
        }
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) {
            toast.error("Le titre et le contenu ne peuvent être vides.");
            return;
        }

        const notificationData = {
            title: newTitle,
            content: newContent,
            // Ajoutez ici des champs supplémentaires requis par votre API, 
            // comme 'targetUserType' ou 'priority'
        };

        const result = await publishNotification(notificationData);
        
        if (result) {
            setNewTitle('');
            setNewContent('');
            // Pas besoin de recharger explicitement si le contexte gère la mise à jour locale
        }
    };

    // -------------------------------------------------------------------
    // -- Rendu du Tableau des Notifications Globales
    // -------------------------------------------------------------------

    const renderGlobalList = () => {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Liste Globale de la Plateforme</h3>
                
                {/* Actions de masse */}
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">{selectedIds.length} sélectionné(s)</p>
                    <button
                        onClick={handleDeleteSelected}
                        disabled={selectedIds.length === 0}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 transition"
                    >
                        <FiTrash2 className="mr-2" /> Supprimer la sélection
                    </button>
                </div>

                {isLoadingAllNotifications ? (
                    <p className="text-center py-10 text-gray-500">Chargement des notifications globales...</p>
                ) : allNotifications.length === 0 ? (
                    <p className="text-center py-10 text-gray-500">Aucune notification globale trouvée.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    <th className="py-3 px-4">
                                        <input 
                                            type="checkbox" 
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds(allNotifications.map(n => n.id));
                                                } else {
                                                    setSelectedIds([]);
                                                }
                                            }}
                                            checked={selectedIds.length === allNotifications.length && allNotifications.length > 0}
                                            className="form-checkbox h-4 w-4 text-blue-600"
                                        />
                                    </th>
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-4">Titre</th>
                                    <th className="py-3 px-4">Publié le</th>
                                    <th className="py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allNotifications.map((n) => (
                                    <tr key={n.id} className="border-t hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.includes(n.id)}
                                                onChange={() => handleToggleSelect(n.id)}
                                                className="form-checkbox h-4 w-4 text-blue-600"
                                            />
                                        </td>
                                        <td className="py-3 px-4 text-sm font-mono text-gray-500">{n.id.substring(0, 8)}...</td>
                                        <td className="py-3 px-4 text-sm font-medium">{n.title}</td>
                                        <td className="py-3 px-4 text-sm">{new Date(n.timestamp).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 flex space-x-2">
                                            <button 
                                                title="Voir Détails Admin"
                                                onClick={() => toast.info(`Détails Admin de ${n.id} chargés via fetchAllNotificationDetails.`)}
                                                className="p-1 text-blue-600 hover:text-blue-800"
                                            >
                                                <FiEye className="h-5 w-5" />
                                            </button>
                                            <button 
                                                title="Modifier"
                                                onClick={() => toast.info(`Modification de ${n.id} via updateNotificationContent...`)}
                                                className="p-1 text-yellow-600 hover:text-yellow-800"
                                            >
                                                <FiEdit className="h-5 w-5" />
                                            </button>
                                            <button 
                                                title="Supprimer"
                                                onClick={() => deleteAllPlatformNotifications([n.id])}
                                                className="p-1 text-red-600 hover:text-red-800"
                                            >
                                                <FiTrash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* Pagination Admin */}
                <div className="flex justify-center space-x-4 mt-6">
                    <button
                        onClick={() => setCurrentAllPage(allPagination.page - 1)}
                        disabled={!allPagination.hasPreviousPage || isLoadingAllNotifications}
                        className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
                    >
                        Précédent
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">Page {allPagination.page} / {Math.ceil(allPagination.totalCount / 10) || 1}</span>
                    <button
                        onClick={() => setCurrentAllPage(allPagination.page + 1)}
                        disabled={!allPagination.hasNextPage || isLoadingAllNotifications}
                        className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
                    >
                        Suivant
                    </button>
                </div>
            </div>
        );
    };

    // -------------------------------------------------------------------
    // -- Rendu du Formulaire de Publication (Création)
    // -------------------------------------------------------------------
    const renderPublishForm = () => {
        return (
            <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border-t-4 border-blue-500">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <FiSend className="mr-2 h-6 w-6" /> Publier une Nouvelle Notification
                </h3>
                <form onSubmit={handlePublish} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
                        <input
                            id="title"
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Titre de la notification (ex: Maintenance du serveur)"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Contenu</label>
                        <textarea
                            id="content"
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            rows="4"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Message détaillé à envoyer aux utilisateurs/plateforme..."
                            required
                        ></textarea>
                    </div>
                    
                    {/* Ajoutez ici d'autres champs comme la cible, la priorité, etc. */}
                    
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                        disabled={isLoadingAllNotifications}
                    >
                        <FiSend className="mr-2 h-5 w-5" /> Publier
                    </button>
                </form>
            </div>
        );
    };

    // -------------------------------------------------------------------
    // -- Rendu Principal
    // -------------------------------------------------------------------

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Administration des Notifications
            </h1>
            
            {renderGlobalList()}
            
            {renderPublishForm()}
            
        </div>
    );
};

export default AdminNotifications;