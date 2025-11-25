import React, { useEffect, useState } from 'react';
import useWithDraw from '../../hooks/useWithDraw';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from '../../Components/Modals/Modal'; // Assurez-vous d'avoir un composant Modal
import useAuth from '../../hooks/useAuth';
import { toast } from "sonner";

const UserWithdrawalHistory = () => {
    const {
        userWithdrawalHistory,
        userWithdrawalPagination,
        isLoadingUserHistory,
        userHistoryError,
        fetchUserWithdrawalHistory,
        submitWithdrawalRequest, // Nouvelle fonction pour la demande de retrait
        isLoading, // État de chargement global du contexte,
        appSettings,
        fetchApplicationsSettingsDetails
    } = useWithDraw();

    /*
        user,
        setUser,
        loading,
        fetchUserInfo,*/
    const {
        user,
        fetchUserInfo
    } = useAuth()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [operator, setOperator] = useState(1);


    useEffect(() => {
        fetchUserWithdrawalHistory(1);
        fetchApplicationsSettingsDetails();
    }, []);

    const handleWithdrawalRequest = async (e) => {
        e.preventDefault();
        if (!amount || !phoneNumber) {
            toast.error("Veuillez remplir tous les champs.");
            return;
        }

        const success = await submitWithdrawalRequest(amount, phoneNumber, operator);
        console.log("Withdrawal request success:", success);
        if (success === true) {
            // Recharger l'historique après une demande réussie
            fetchUserWithdrawalHistory(1);
            setIsModalOpen(false); // Fermer la modale
            fetchUserInfo(); // Mettre à jour les informations utilisateur
            toast.success("Demande de retrait soumise avec succès.");
            // Réinitialiser les champs du formulaire
            setAmount('');
            setPhoneNumber('');
            setOperator(1);
        }
    };

    return (
        
        <div className="container mt-[100px] mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Historique de mes Retraits - <span className='text-xl'>(Mon solde actuel: {user?.balance} FCFA)</span> </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Nouvelle Demande
                </button>
            </div>

            {isLoadingUserHistory && (
                <div className="flex justify-center items-center h-48 text-blue-500">
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                    <p className="ml-3 text-lg">Chargement de votre historique...</p>
                </div>
            )}

            {userHistoryError && (
                <div className="text-center text-red-500 p-4 border border-red-400 rounded-md bg-red-50">
                    <p>Erreur lors du chargement de l'historique : {userHistoryError}</p>
                </div>
            )}

            {!isLoadingUserHistory && !userHistoryError && (
                <>
                    {userWithdrawalHistory.length === 0 ? (
                        <div className="text-center text-gray-500 p-6">
                            <p className="text-lg">Vous n'avez pas encore effectué de demande de retrait.</p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {userWithdrawalHistory.map((request) => (
                                <li key={request.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                ID de la demande : <span className="font-mono">{request.id}</span>
                                            </p>
                                            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                Montant : <span className="text-green-600 dark:text-green-400">{request.amount} FCFA</span>
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 text-right">
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {new Date(request.requestedAt).toLocaleDateString()}
                                            </p>
                                            {/* 
                                            
                                                REFUSED = 0,
                                                PENDING = 1,
                                                COMPLETED = 2
                                            */}
                                            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                                                request.status === 0 ? 'bg-red-200 text-red-800 ' :
                                                request.status === 1 ? 'bg-yellow-200 text-yellow-800' :
                                                'bg-green-200 text-green-800'
                                            }`}>
                                                {request.status === 0 ? 'Rejetée' :
                                                request.status === 1 ? 'En attente' :
                                                'Validée'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Numéro : {request.phoneNumber}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                    
                    {userWithdrawalPagination.totalCount > 0 && (
                        <div className="flex justify-center mt-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Page {userWithdrawalPagination.page} sur {Math.ceil(userWithdrawalPagination.totalCount / userWithdrawalHistory.length)}
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Modal de demande de retrait */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Demande de Retrait">
                <form onSubmit={handleWithdrawalRequest} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Montant (FCFA) - Minimum: {appSettings ? appSettings.minimumWithdrawAmount : '5000'} FCFA
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            placeholder="Ex: 5000"
                            required
                        />
                    </div>
                    <div>
                            <label htmlFor="operator" className={`block mb-2 text-lg font-medium `}>
                                Méthode de paiement
                            </label>
                            <select
                                id="operator"
                                value={operator}
                                onChange={(e) => setOperator(parseInt(e.target.value))}
                                className={`w-full p-2.5 rounded-lg border focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50 border-gray-300 text-gray-900`}
                            >
                                <option value={1}>Orange Money</option>
                                <option value={2}>MTN MoMo</option>
                            </select>

                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Numéro de téléphone
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            placeholder="Ex: 6XXXXXXXX"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                            disabled={isLoading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${
                                isLoading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                    Envoi...
                                </>
                            ) : (
                                'Soumettre la Demande'
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserWithdrawalHistory;