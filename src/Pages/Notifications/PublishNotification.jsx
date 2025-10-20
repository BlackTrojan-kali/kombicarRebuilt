import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select'; // Assurez-vous d'avoir installé react-select
import { NotificationContext } from '../../contexts/NotificationContext'; // Chemin à ajuster
import { toast } from 'sonner';
import api from '../../api/api'; // Nécessaire pour lister les utilisateurs

const PublishNotification = () => {
    // Utilisation du contexte de notification
    const { publishNotification } = useContext(NotificationContext);

    // États du formulaire
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null); // Utilisateur sélectionné par React-Select
    const [userOptions, setUserOptions] = useState([]); // Liste des options pour React-Select
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    // Simuler le chargement des utilisateurs pour le sélecteur
    // NOTE: Dans une vraie application, vous utiliseriez ici une fonction de votre UserContext
    // pour lister tous les utilisateurs ou conducteurs. Par exemple : listStandardUsers, listVerifiedConductors.
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

        if (!title || !message || !selectedUser) {
            toast.warning('Veuillez remplir tous les champs (titre, message et client).');
            return;
        }

        setIsSubmitting(true);
        try {
            const data = {
                title: title,
                message: message,
                userId: selectedUser.value, // Extraction de l'UUID de l'utilisateur
            };

            await publishNotification(data);

            toast.success('Notification publiée avec succès !');

            // Réinitialiser le formulaire
            setTitle('');
            setMessage('');
            setSelectedUser(null);

        } catch (error) {
            // La gestion d'erreur et le toast sont déjà dans votre NotificationContext,
            // mais on peut ajouter un toast générique ici si l'erreur n'a pas été gérée plus tôt.
            toast.error("Échec de l'envoi de la notification.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Publier une Notification Ciblée</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Champ Client (React-Select) */}
                <div>
                    <label htmlFor="client-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Client Destinataire
                    </label>
                    <Select
                        id="client-select"
                        value={selectedUser}
                        onChange={setSelectedUser}
                        options={userOptions}
                        isLoading={isLoadingUsers}
                        placeholder="Sélectionner un client..."
                        isClearable
                        required
                    />
                </div>

                {/* Champ Titre */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Titre
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Mise à jour importante"
                        required
                    />
                </div>

                {/* Champ Message */}
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Écrivez le contenu de la notification ici..."
                        required
                    />
                </div>

                {/* Bouton de Soumission */}
                <button
                    type="submit"
                    disabled={isSubmitting || isLoadingUsers}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                >
                    {isSubmitting ? 'Publication en cours...' : 'Publier la Notification'}
                </button>
            </form>
        </div>
    );
}

export default PublishNotification;