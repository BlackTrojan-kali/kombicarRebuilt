import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserPlus, faUser, faEnvelope, faLock, faUserTag, faCheckCircle, faTimesCircle, faPhone, faGlobe
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';

const AdminFormModal = ({ isOpen, onClose, onSaveAdmin, initialAdminData }) => {
    const { theme } = useColorScheme();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState(225); // Valeur par défaut
    const [role, setRole] = useState('admin');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialAdminData) {
                // Mode édition
                setFirstName(initialAdminData.firstName || '');
                setLastName(initialAdminData.lastName || '');
                setEmail(initialAdminData.email || '');
                setPhoneNumber(initialAdminData.phoneNumber || '');
                setCountry(initialAdminData.country !== undefined ? initialAdminData.country : 225);
                
                // --- CORRECTION DU MAPPING POUR LA LECTURE ---
                // Si l'API renvoie 2, c'est 'super-admin'. Sinon (1 ou autre), 'admin'.
                const initialRole = initialAdminData.role === 2 ? 'super-admin' : 'admin';
                setRole(initialRole);
                
                setIsActive(initialAdminData.isActive !== undefined ? initialAdminData.isActive : initialAdminData.isVerified !== undefined ? initialAdminData.isVerified : true);
                setPassword('');
                setConfirmPassword('');
                setIsEditing(true);
            } else {
                // Mode création
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhoneNumber('');
                setCountry(225);
                setRole('admin'); // Par défaut au rôle 1
                setPassword('');
                setConfirmPassword('');
                setIsActive(true);
                setIsEditing(false);
            }
            setPasswordError('');
        }
    }, [isOpen, initialAdminData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setPasswordError('');

        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // --- CORRECTION DU MAPPING POUR LA SOUMISSION ---
        // 'super-admin' -> 2
        // 'admin' -> 1
        const roleToSend = role === 'super-admin' ? 2 : 1; 
        
        // Validation des mots de passe (obligatoire en création, optionnel en modification)
        if (!isEditing || (password.trim() || confirmPassword.trim())) {
            if (password !== confirmPassword) {
                setPasswordError('Les mots de passe ne correspondent pas.');
                return;
            }
            if (password.length < 6) {
                setPasswordError('Le mot de passe doit contenir au moins 6 caractères.');
                return;
            }
            if (!isEditing && !password.trim()) {
                setPasswordError('Le mot de passe est requis pour la création.');
                return;
            }
        }

        const adminToSave = {
            ...initialAdminData,
            firstName,
            lastName,
            email,
            phoneNumber,
            country,
            role: roleToSend, // Valeur numérique 1 ou 2
            // NOTE : L'état du composant précédent utilisait 'isVerified'. 
            // Si votre API attend 'isActive', cela est correct.
            isActive: isActive, 
        };

        if (password.trim()) {
            adminToSave.password = password;
        }

        onSaveAdmin(adminToSave, isEditing);
    };

    const modalTitle = isEditing ? "Modifier l'Administrateur" : "Ajouter un Nouvel Administrateur";
    const submitButtonText = isEditing ? "Sauvegarder les Modifications" : "Créer l'Administrateur";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            size="md"
            footer={
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        form="admin-form"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {submitButtonText}
                    </button>
                </div>
            }
        >
            <div className="max-h-[70vh] overflow-y-auto p-2 -m-2">
                <form id="admin-form" onSubmit={handleSubmit} className="space-y-4">
                    {/* Prénom */}
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                                    ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                placeholder="Ex: Jean"
                                required
                            />
                        </div>
                    </div>

                    {/* Nom */}
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                                    ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                placeholder="Ex: Dupont"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                                    ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                placeholder="Ex: jean.dupont@example.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Numéro de téléphone */}
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Numéro de Téléphone</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                                    ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                placeholder="Ex: +237 6 00 00 00 00"
                            />
                        </div>
                    </div>

                    {/* Pays */}
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pays (Code)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faGlobe} className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(parseInt(e.target.value, 10))}
                                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                                    ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                placeholder="Ex: 225"
                            />
                        </div>
                    </div>

                    {/* Rôle */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rôle</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faUserTag} className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                                    ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                                required
                            >
                                <option value="admin">Administrateur (Rôle 1)</option>
                                <option value="super-admin">Super Administrateur (Rôle 2)</option>
                            </select>
                        </div>
                    </div>

                    {/* Mot de passe (Conditionnel) */}
                    {!isEditing || (password.trim() || confirmPassword.trim()) ? (
                        <>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe {!isEditing && <span className="text-red-500">*</span>}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                                            ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                        placeholder={isEditing ? "Laisser vide pour ne pas changer" : "Saisir un mot de passe"}
                                        required={!isEditing && !password.trim()}
                                    />
                                </div>
                            </div>

                            {/* Confirmer Mot de passe */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmer Mot de passe {!isEditing && <span className="text-red-500">*</span>}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`pl-10 pr-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                                            ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                        placeholder={isEditing ? "Confirmer le nouveau mot de passe" : "Confirmer le mot de passe"}
                                        required={!isEditing && !confirmPassword.trim()}
                                    />
                                </div>
                                {passwordError && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                                )}
                            </div>
                        </>
                    ) : null}

                    {/* Statut Actif */}
                    <div>
                        <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut Actif</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className={`h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500
                                    ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                            />
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                                {isActive ? (
                                    <>
                                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" /> Actif
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 mr-1" /> Inactif
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AdminFormModal;