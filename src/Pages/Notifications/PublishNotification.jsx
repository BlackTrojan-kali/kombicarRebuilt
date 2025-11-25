import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select'; // Assurez-vous d'avoir installé react-select
import { NotificationContext } from '../../contexts/NotificationContext'; // Chemin ajusté pour l'exemple
import { toast } from 'sonner';
import api from '../../api/api'; // Nécessaire pour lister les utilisateurs

// Composant pour la publication de notifications ciblées (un ou plusieurs utilisateurs)
const PublishNotification = () => {
    // Utilisation du contexte de notification
    // Nous exportons les DEUX fonctions de publication pour choisir laquelle utiliser, 
    // mais dans ce cas, nous allons utiliser la nouvelle fonction multi-utilisateur
    const { publishToSelectedUsers } = useContext(NotificationContext);

    // États du formulaire
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    // selectedUsers est maintenant un TABLEAU d'objets sélectionnés par React-Select
    const [selectedUsers, setSelectedUsers] = useState([]); 
    const [userOptions, setUserOptions] = useState([]); // Liste des options pour React-Select
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    // Chargement des utilisateurs pour le sélecteur
    const fetchUserOptions = async () => {
        setIsLoadingUsers(true);
        try {
            // REMPLACER PAR VOTRE VRAI ENDPOINT ADMIN POUR LISTER TOUS LES UTILISATEURS
            const response = await api.get('/api/v1/users/admin/list-users/1'); 
            
            // Adapter la structure de la réponse à celle attendue par React-Select: { value: userId, label: userEmail }
            const options = response.data.items.map(user => ({
                value: user.id, // L'ID utilisateur (UUID) attendu par l'API
                label: `${user.email} (${user.firstName} ${user.lastName})`,
            }));

            setUserOptions(options);

        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs:", error);
            toast.error("Échec du chargement de la liste des clients.");
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUserOptions();
    }, []);
    
    // Fonction de soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Si selectedUsers est null ou un tableau vide
        if (!title || !message || selectedUsers.length === 0) {
            toast.warning('Veuillez remplir tous les champs (titre, message) et sélectionner au moins un client.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Extraction des UUIDs de la liste des objets sélectionnés
            const userIds = selectedUsers.map(user => user.value);

            const data = {
                title: title,
                message: message,
                userIds: userIds, // Utilisation du tableau d'IDs
            };

            // Utilisation de la nouvelle fonction pour la publication à plusieurs utilisateurs
            await publishToSelectedUsers(data); 

            toast.success(`Notification publiée avec succès pour ${userIds.length} client(s) !`);

            // Réinitialiser le formulaire
            setTitle('');
            setMessage('');
            setSelectedUsers([]);

        } catch (error) {
            console.error("Erreur lors de l'envoi de la notification:", error);
            // La gestion d'erreur plus précise est dans le NotificationContext
            toast.error("Échec de l'envoi de la notification.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-2xl space-y-6 mt-10 border border-gray-100">
            <h2 className="text-3xl font-extrabold text-blue-800 border-b pb-3">
                Publier une Notification Ciblée (Multi-Utilisateurs)
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Champ Client(s) (React-Select Multi) */}
                <div>
                    <label htmlFor="client-select" className="block text-sm font-semibold text-gray-700 mb-2">
                        Client(s) Destinataire(s)
                    </label>
                    <Select
                        id="client-select"
                        value={selectedUsers}
                        onChange={setSelectedUsers}
                        options={userOptions}
                        isLoading={isLoadingUsers}
                        placeholder="Sélectionner un ou plusieurs clients..."
                        isMulti // <-- Permet la sélection multiple
                        isClearable
                        required
                        classNamePrefix="react-select"
                        isDisabled={isLoadingUsers}
                    />
                    {isLoadingUsers && <p className="mt-1 text-xs text-gray-500">Chargement des utilisateurs...</p>}
                </div>

                {/* Champ Titre */}
                <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                        Titre de la Notification
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                        placeholder="Ex: Mise à jour importante"
                        required
                    />
                </div>

                {/* Champ Message */}
                <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                        Message
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none transition duration-150 ease-in-out"
                        placeholder="Écrivez le contenu de la notification ici..."
                        required
                    />
                </div>

                {/* Bouton de Soumission */}
                <button
                    type="submit"
                    disabled={isSubmitting || isLoadingUsers || !title || !message || selectedUsers.length === 0}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white transition duration-200 ${
                        isSubmitting || isLoadingUsers ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-[1.01]'
                    }`}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Publication en cours...
                        </>
                    ) : (
                        `Publier la Notification à ${selectedUsers.length || 0} client(s)`
                    )}
                </button>
            </form>
        </div>
    );
}

export default PublishNotification;