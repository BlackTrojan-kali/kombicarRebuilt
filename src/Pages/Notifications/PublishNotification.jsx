import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select'; 
import { NotificationContext } from '../../contexts/NotificationContext'; 
import { toast } from 'sonner';
import api from '../../api/api'; 
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faPaperPlane, faUser, faUsers, 
    faGlobe, faExclamationTriangle, faArrowLeft 
} from "@fortawesome/free-solid-svg-icons";

// Définition des modes de ciblage
const TARGET_MODES = {
    SINGLE: 'single',
    MULTIPLE: 'multiple',
    ALL_PLATFORM: 'all_platform',
};

const PublishNotification = () => {
    const { publishToSelectedUsers, publishNotification } = useContext(NotificationContext);

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetMode, setTargetMode] = useState(TARGET_MODES.MULTIPLE); 
    const [selectedUsers, setSelectedUsers] = useState([]); 
    const [userOptions, setUserOptions] = useState([]); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    
    const MAX_USER_SELECTION = 1000; 

    const fetchUserOptions = async () => {
        setIsLoadingUsers(true);
        try {
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
        if (targetMode !== TARGET_MODES.ALL_PLATFORM) {
             fetchUserOptions();
        }
    }, [targetMode]); 
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !message) {
            toast.warning('Veuillez remplir le titre et le message.');
            return;
        }
        
        if (targetMode !== TARGET_MODES.ALL_PLATFORM && selectedUsers.length === 0) {
             toast.warning('Veuillez sélectionner au moins un client ou choisir le ciblage Plateforme entière.');
             return;
        }

        setIsSubmitting(true);
        let publicationPromise; 
        let successMessage = "Notification publiée avec succès !";
        
        try {
            switch (targetMode) {
                case TARGET_MODES.ALL_PLATFORM:
                    publicationPromise = publishNotification({ title, message, userId: null });
                    successMessage = "Notification publiée avec succès à TOUTE la plateforme !";
                    break;

                case TARGET_MODES.SINGLE:
                    const singleUserId = selectedUsers[0].value;
                    publicationPromise = publishNotification({ title, message, userId: singleUserId });
                    successMessage = `Notification publiée avec succès au client : ${selectedUsers[0].label}`;
                    break;
                    
                case TARGET_MODES.MULTIPLE:
                    const userIds = selectedUsers.map(user => user.value);
                    publicationPromise = publishToSelectedUsers({ title, message, userIds });
                    successMessage = `Notification publiée avec succès pour ${userIds.length} client(s) sélectionné(s).`;
                    break;
                    
                default:
                    throw new Error("Mode de ciblage non valide.");
            }

            await publicationPromise;
            toast.success(successMessage);

            // Réinitialisation
            setTitle('');
            setMessage('');
            setSelectedUsers([]); 
            setTargetMode(TARGET_MODES.MULTIPLE); 
            fetchUserOptions(); 

        } catch (error) {
            console.error("Erreur lors de l'envoi de la notification:", error);
            toast.error("Échec de l'envoi de la notification.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const isMultiSelect = targetMode === TARGET_MODES.MULTIPLE;
    
    let count;
    if (targetMode === TARGET_MODES.ALL_PLATFORM) {
        count = 'toute la plateforme';
    } else if (targetMode === TARGET_MODES.SINGLE) {
        count = selectedUsers.length > 0 ? '1 client' : 'un client';
    } else { 
        count = `${selectedUsers.length} client(s)`;
    }
    
    const selectAllUsers = () => {
        if (userOptions.length > MAX_USER_SELECTION) {
             toast.warning(`La liste contient plus de ${MAX_USER_SELECTION} clients. Veuillez sélectionner manuellement les destinataires.`);
             return;
        }
        setSelectedUsers(userOptions);
        toast.info(`${userOptions.length} clients sélectionnés.`);
    };

    const isSubmitDisabled = isSubmitting || isLoadingUsers || !title || !message || 
                             (targetMode !== TARGET_MODES.ALL_PLATFORM && selectedUsers.length === 0);

    return (
        <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            
            <div className="max-w-3xl mx-auto">
                {/* Header Navigation */}
                <div className="mb-6">
                    <Link 
                        to="/admin/notifications" 
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors mb-4"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Retour à l'historique
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </div>
                            Nouvelle Notification
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            Créez et diffusez un message ciblé à vos utilisateurs.
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                        
                        {/* Section : Ciblage */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">1. Audience cible</h3>
                            
                            {/* Segmented Control */}
                            <div className="flex flex-col sm:flex-row p-1.5 bg-gray-100 dark:bg-gray-900/50 rounded-xl mb-6">
                                <button
                                    type="button"
                                    onClick={() => setTargetMode(TARGET_MODES.SINGLE)}
                                    className={`flex-1 py-2.5 px-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                                        targetMode === TARGET_MODES.SINGLE 
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-600' 
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faUser} /> Client Unique
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTargetMode(TARGET_MODES.MULTIPLE)}
                                    className={`flex-1 py-2.5 px-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                                        targetMode === TARGET_MODES.MULTIPLE 
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-600' 
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faUsers} /> Sélection Multiple
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTargetMode(TARGET_MODES.ALL_PLATFORM)}
                                    className={`flex-1 py-2.5 px-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                                        targetMode === TARGET_MODES.ALL_PLATFORM 
                                        ? 'bg-rose-500 text-white shadow-sm ring-1 ring-rose-600' 
                                        : 'text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faGlobe} /> Toute la Plateforme
                                </button>
                            </div>

                            {/* Alerte pour le mode ALL_PLATFORM */}
                            {targetMode === TARGET_MODES.ALL_PLATFORM && (
                                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-3">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-rose-500 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300">Avertissement de diffusion globale</h4>
                                        <p className="text-sm text-rose-600 dark:text-rose-400 mt-1">
                                            Cette notification sera envoyée instantanément à <strong>absolument tous les utilisateurs</strong> enregistrés sur l'application. Utilisez cette option avec parcimonie.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* React-Select (Stylisé pour Tailwind / Dark Mode) */}
                            {targetMode !== TARGET_MODES.ALL_PLATFORM && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="client-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {isMultiSelect ? 'Sélectionnez les destinataires' : 'Sélectionnez le destinataire'}
                                        </label>
                                        
                                        {isMultiSelect && (
                                            <button
                                                type="button"
                                                onClick={selectAllUsers}
                                                disabled={isLoadingUsers || userOptions.length === 0 || userOptions.length > MAX_USER_SELECTION}
                                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Sélectionner tous les {userOptions.length} clients
                                            </button>
                                        )}
                                    </div>
                                    
                                    <Select
                                        id="client-select"
                                        value={selectedUsers}
                                        onChange={(newValue) => setSelectedUsers(isMultiSelect ? newValue : (newValue ? [newValue] : []))}
                                        options={userOptions}
                                        isLoading={isLoadingUsers}
                                        placeholder={isMultiSelect ? "Rechercher des clients..." : "Rechercher un client..."}
                                        isMulti={isMultiSelect}
                                        isClearable
                                        required
                                        isDisabled={isLoadingUsers}
                                        noOptionsMessage={() => "Aucun utilisateur trouvé"}
                                        unstyled // Retire les styles par défaut de React-Select
                                        classNames={{
                                            control: (state) => `bg-gray-50 dark:bg-gray-900/50 border ${state.isFocused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-3 py-1.5 transition-all shadow-sm`,
                                            menu: () => "bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 mt-2 overflow-hidden z-50",
                                            option: (state) => `px-4 py-2.5 cursor-pointer text-sm transition-colors ${state.isFocused ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`,
                                            singleValue: () => "text-gray-900 dark:text-white text-sm font-medium",
                                            multiValue: () => "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg mr-2 shadow-sm",
                                            multiValueLabel: () => "text-gray-800 dark:text-gray-200 px-2 py-1 text-sm font-medium",
                                            multiValueRemove: () => "text-gray-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-r-lg px-1.5 transition-colors",
                                            input: () => "text-gray-900 dark:text-white text-sm",
                                            placeholder: () => "text-gray-400 dark:text-gray-500 text-sm"
                                        }}
                                    />
                                    
                                    {isLoadingUsers && <p className="text-xs text-blue-500 font-medium">Synchronisation des utilisateurs...</p>}
                                    {targetMode === TARGET_MODES.SINGLE && selectedUsers.length > 1 && (
                                        <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                                            <FontAwesomeIcon icon={faExclamationTriangle} /> Un seul client autorisé dans ce mode.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Section : Contenu */}
                        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">2. Contenu du message</h3>
                            
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Titre de la Notification</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm sm:text-sm"
                                        placeholder="Ex: Mise à jour de sécurité importante"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message complet</label>
                                    <textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows="5"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y transition-all shadow-sm sm:text-sm"
                                        placeholder="Rédigez le contenu détaillé de la notification ici..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer & Submit */}
                        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                            <button
                                type="submit"
                                disabled={isSubmitDisabled}
                                className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white shadow-sm transition-all duration-200 ${
                                    isSubmitDisabled 
                                    ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed shadow-none' 
                                    : targetMode === TARGET_MODES.ALL_PLATFORM
                                        ? 'bg-rose-600 hover:bg-rose-700 focus:ring-4 focus:ring-rose-500/30 hover:-translate-y-0.5'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 hover:-translate-y-0.5'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                        Envoyer à {count}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PublishNotification;