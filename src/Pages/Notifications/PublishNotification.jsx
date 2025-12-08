import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select'; 
import { NotificationContext } from '../../contexts/NotificationContext'; 
import { toast } from 'sonner';
import api from '../../api/api'; 

// Composant pour la publication de notifications ciblées (un ou plusieurs utilisateurs)
const PublishNotification = () => {
    // Utilisation du contexte de notification
    const { publishToSelectedUsers } = useContext(NotificationContext);

    // États du formulaire
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    // selectedUsers est maintenant un TABLEAU d'objets sélectionnés par React-Select
    const [selectedUsers, setSelectedUsers] = useState([]); 
    const [userOptions, setUserOptions] = useState([]); // Liste des options pour React-Select
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    
    // Ajout d'une limite pour la sélection de tous les utilisateurs (bonne pratique)
    const MAX_USER_SELECTION = 1000; 

    // Chargement des utilisateurs pour le sélecteur
    const fetchUserOptions = async () => {
        setIsLoadingUsers(true);
        try {
            // NOTE : Dans une application réelle avec des milliers d'utilisateurs,
            // vous devriez implémenter la pagination ou la recherche côté serveur
            // dans `react-select` pour éviter de charger trop de données en une fois.
            const response = await api.get('/api/v1/users/admin/list-users/1'); 
            
            // Adapter la structure de la réponse à celle attendue par React-Select: { value: userId, label: userEmail }
            const options = response.data.items.map(user => ({
                value: user.id, 
                label: `${user.email} (${user.firstName || 'N/A'} ${user.lastName || 'N/A'})`,
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
    
    // NOUVELLE FONCTION : Sélectionner tous les utilisateurs
    const selectAllUsers = () => {
        if (userOptions.length > MAX_USER_SELECTION) {
            toast.warning(`La liste contient plus de ${MAX_USER_SELECTION} clients. Veuillez sélectionner manuellement les destinataires pour éviter une charge excessive.`);
            return;
        }
        setSelectedUsers(userOptions);
        toast.info(`${userOptions.length} clients sélectionnés.`);
    };
    
    // Fonction de soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérification des champs requis
        if (!title || !message || selectedUsers.length === 0) {
            toast.warning('Veuillez remplir le titre, le message et sélectionner au moins un client.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Extraction des UUIDs de la liste des objets sélectionnés
            const userIds = selectedUsers.map(user => user.value);

            const data = {
                title: title,
                message: message,
                userIds: userIds, 
            };

            // Utilisation de la fonction pour la publication à plusieurs utilisateurs
            await publishToSelectedUsers(data); 

            toast.success(`Notification publiée avec succès pour ${userIds.length} client(s) !`);

            // Réinitialiser le formulaire
            setTitle('');
            setMessage('');
            setSelectedUsers([]);

        } catch (error) {
            console.error("Erreur lors de l'envoi de la notification:", error);
            toast.error("Échec de l'envoi de la notification.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const count = selectedUsers.length;
    
    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-2xl space-y-6 mt-10 border border-gray-100">
            <h2 className="text-3xl font-extrabold text-blue-800 border-b pb-3">
                  Publier une Notification Ciblée (Admin)
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Champ Client(s) (React-Select Multi) */}
                <div>
                    <label htmlFor="client-select" className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between items-center">
                        <span>Client(s) Destinataire(s)</span>
                        <button
                            type="button"
                            onClick={selectAllUsers}
                            disabled={isLoadingUsers || userOptions.length === 0 || userOptions.length > MAX_USER_SELECTION}
                            className={`px-3 py-1 text-xs font-medium rounded-full transition duration-150 ease-in-out ${
                                isLoadingUsers || userOptions.length === 0 || userOptions.length > MAX_USER_SELECTION
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                            }`}
                        >
                            {isLoadingUsers ? 'Chargement...' : 'Sélectionner Tous les Clients'}
                        </button>
                    </label>
                    
                    <Select
                        id="client-select"
                        value={selectedUsers}
                        onChange={setSelectedUsers}
                        options={userOptions}
                        isLoading={isLoadingUsers}
                        placeholder="Sélectionner un ou plusieurs clients..."
                        isMulti 
                        isClearable
                        required
                        classNamePrefix="react-select"
                        isDisabled={isLoadingUsers}
                    />
                    {isLoadingUsers && <p className="mt-1 text-xs text-gray-500">Chargement des utilisateurs...</p>}
                    {userOptions.length > MAX_USER_SELECTION && (
                        <p className="mt-1 text-xs text-red-500 font-medium">⚠️ La sélection de tous les clients est désactivée (Trop de résultats).</p>
                    )}
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
                    disabled={isSubmitting || isLoadingUsers || !title || !message || count === 0}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white transition duration-200 ${
                        isSubmitting || isLoadingUsers || count === 0 ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-[1.01]'
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
                        `Publier la Notification à ${count} client(s)`
                    )}
                </button>
            </form>
        </div>
    );
}

export default PublishNotification;