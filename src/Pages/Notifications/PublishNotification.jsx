import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select'; 
import { NotificationContext } from '../../contexts/NotificationContext'; 
import { toast } from 'sonner';
import api from '../../api/api'; 

// Définition des modes de ciblage pour plus de clarté
const TARGET_MODES = {
    SINGLE: 'single',
    MULTIPLE: 'multiple',
    ALL_PLATFORM: 'all_platform', // Utilisera /publish avec userId: null
};

// Composant pour la publication de notifications ciblées (un, plusieurs ou tous les utilisateurs)
const PublishNotification = () => {
    // Utilisation des deux fonctions de publication depuis le contexte
    const { publishToSelectedUsers, publishNotification } = useContext(NotificationContext);

    // États du formulaire
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    
    // État pour le mode de ciblage sélectionné (par défaut : Cibler un ou plusieurs utilisateurs)
    const [targetMode, setTargetMode] = useState(TARGET_MODES.MULTIPLE); 
    
    // selectedUsers est utilisé pour les modes SINGLE et MULTIPLE
    const [selectedUsers, setSelectedUsers] = useState([]); 
    const [userOptions, setUserOptions] = useState([]); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    
    const MAX_USER_SELECTION = 1000; 

    // Chargement des utilisateurs pour le sélecteur
    const fetchUserOptions = async () => {
        setIsLoadingUsers(true);
        try {
            // Dans un contexte réel, cette API devrait gérer la pagination ou être ciblée.
            const response = await api.get('/api/v1/users/admin/list-users/1'); 
            
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
        // Chargement uniquement si nous ne sommes pas en mode ALL_PLATFORM où la sélection n'est pas nécessaire
        if (targetMode !== TARGET_MODES.ALL_PLATFORM) {
             fetchUserOptions();
        }
    }, [targetMode]); // Déclenchement au changement de mode
    
    // Fonction de soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Vérifications Préliminaires
        if (!title || !message) {
            toast.warning('Veuillez remplir le titre et le message.');
            return;
        }
        
        // Vérification des destinataires spécifiques
        if (targetMode !== TARGET_MODES.ALL_PLATFORM && selectedUsers.length === 0) {
             toast.warning('Veuillez sélectionner au moins un client ou choisir le ciblage Plateforme entière.');
             return;
        }

        setIsSubmitting(true);
        let publicationPromise; // Variable pour stocker la promesse d'appel API
        let successMessage = "Notification publiée avec succès !";
        
        try {
            switch (targetMode) {
                case TARGET_MODES.ALL_PLATFORM:
                    // Utilise publishNotification avec userId: null (ou non défini)
                    publicationPromise = publishNotification({ title, message, userId: null });
                    successMessage = "Notification publiée avec succès à TOUTE la plateforme !";
                    break;

                case TARGET_MODES.SINGLE:
                    // Utilise publishNotification avec l'ID du premier utilisateur sélectionné
                    const singleUserId = selectedUsers[0].value;
                    publicationPromise = publishNotification({ title, message, userId: singleUserId });
                    successMessage = `Notification publiée avec succès au client : ${selectedUsers[0].label}`;
                    break;
                    
                case TARGET_MODES.MULTIPLE:
                    // Utilise publishToSelectedUsers avec la liste des IDs
                    const userIds = selectedUsers.map(user => user.value);
                    publicationPromise = publishToSelectedUsers({ title, message, userIds });
                    successMessage = `Notification publiée avec succès pour ${userIds.length} client(s) sélectionné(s).`;
                    break;
                    
                default:
                    throw new Error("Mode de ciblage non valide.");
            }

            await publicationPromise;

            toast.success(successMessage);

            // Réinitialiser le formulaire
            setTitle('');
            setMessage('');
            setSelectedUsers([]); // Réinitialise toujours la sélection
            setTargetMode(TARGET_MODES.MULTIPLE); // Optionnel : Réinitialiser le mode
            fetchUserOptions(); // Recharger au cas où le mode était 'ALL' et on revient à 'SINGLE/MULTIPLE'

        } catch (error) {
            console.error("Erreur lors de l'envoi de la notification:", error);
            toast.error("Échec de l'envoi de la notification.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Détermine le type de sélection (multi ou simple) en fonction du mode
    const isMultiSelect = targetMode === TARGET_MODES.MULTIPLE;
    
    // Calcule le nombre de clients ciblés pour le bouton
    let count;
    if (targetMode === TARGET_MODES.ALL_PLATFORM) {
        count = 'toute la Plateforme';
    } else if (targetMode === TARGET_MODES.SINGLE) {
        count = selectedUsers.length > 0 ? '1' : 'un seul client';
    } else { // MULTIPLE
        count = selectedUsers.length;
    }
    
    // NOUVELLE FONCTION : Sélectionner tous les utilisateurs
    const selectAllUsers = () => {
        if (userOptions.length > MAX_USER_SELECTION) {
             toast.warning(`La liste contient plus de ${MAX_USER_SELECTION} clients. Veuillez sélectionner manuellement les destinataires pour éviter une charge excessive.`);
             return;
        }
        setSelectedUsers(userOptions);
        toast.info(`${userOptions.length} clients sélectionnés.`);
    };

    // Détermine si le bouton de soumission doit être désactivé
    const isSubmitDisabled = isSubmitting || isLoadingUsers || !title || !message || 
                             (targetMode !== TARGET_MODES.ALL_PLATFORM && selectedUsers.length === 0);

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-2xl space-y-6 mt-10 border border-gray-100">
            <h2 className="text-3xl font-extrabold text-blue-800 border-b pb-3">
                Publier une Notification (Admin)
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Sélecteur de Mode de Ciblage */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Type de Ciblage
                    </label>
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => setTargetMode(TARGET_MODES.SINGLE)}
                            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition duration-150 ${targetMode === TARGET_MODES.SINGLE ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                        >
                            Un Client Spécifique
                        </button>
                        <button
                            type="button"
                            onClick={() => setTargetMode(TARGET_MODES.MULTIPLE)}
                            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition duration-150 ${targetMode === TARGET_MODES.MULTIPLE ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                        >
                            Plusieurs Clients
                        </button>
                        <button
                            type="button"
                            onClick={() => setTargetMode(TARGET_MODES.ALL_PLATFORM)}
                            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition duration-150 ${targetMode === TARGET_MODES.ALL_PLATFORM ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                        >
                            Toute la Plateforme (⚠️)
                        </button>
                    </div>
                </div>

                {/* Champ Client(s) - Affiché seulement si le mode n'est pas ALL_PLATFORM */}
                {targetMode !== TARGET_MODES.ALL_PLATFORM && (
                    <div>
                        <label htmlFor="client-select" className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between items-center">
                            <span>{isMultiSelect ? 'Client(s) Destinataire(s)' : 'Client Destinataire Unique'}</span>
                            
                            {/* Bouton Sélectionner Tout - visible uniquement en mode MULTIPLE */}
                            {isMultiSelect && (
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
                            )}
                        </label>
                        
                        <Select
                            id="client-select"
                            value={selectedUsers}
                            // Pour le mode SINGLE, React-Select renvoie un objet unique
                            // Pour le mode MULTIPLE, il renvoie un tableau
                            onChange={(newValue) => setSelectedUsers(isMultiSelect ? newValue : (newValue ? [newValue] : []))}
                            options={userOptions}
                            isLoading={isLoadingUsers}
                            placeholder={isMultiSelect ? "Sélectionner un ou plusieurs clients..." : "Sélectionner un client unique..."}
                            isMulti={isMultiSelect}
                            isClearable
                            required
                            classNamePrefix="react-select"
                            isDisabled={isLoadingUsers}
                        />

                        {isLoadingUsers && <p className="mt-1 text-xs text-gray-500">Chargement des utilisateurs...</p>}
                        {userOptions.length > MAX_USER_SELECTION && isMultiSelect && (
                             <p className="mt-1 text-xs text-red-500 font-medium">⚠️ La sélection de tous les clients est désactivée (Trop de résultats).</p>
                        )}
                        {targetMode === TARGET_MODES.SINGLE && selectedUsers.length > 1 && (
                            <p className="mt-1 text-xs text-red-500 font-medium">⚠️ Veuillez sélectionner un seul client en mode "Un Client Spécifique".</p>
                        )}
                    </div>
                )}
                
                {/* Avertissement pour le mode ALL_PLATFORM */}
                {targetMode === TARGET_MODES.ALL_PLATFORM && (
                    <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm font-medium">
                        Attention : La notification sera envoyée à **TOUS** les utilisateurs enregistrés de la plateforme.
                    </div>
                )}


                {/* Champ Titre */}
                <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">Titre de la Notification</label>
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
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
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
                    disabled={isSubmitDisabled}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white transition duration-200 ${
                        isSubmitDisabled ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-[1.01]'
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
                        `Publier la Notification à ${count} ${targetMode === TARGET_MODES.ALL_PLATFORM ? '' : (targetMode === TARGET_MODES.SINGLE ? 'client' : 'client(s)')}`
                    )}
                </button>
            </form>
        </div>
    );
}

export default PublishNotification;