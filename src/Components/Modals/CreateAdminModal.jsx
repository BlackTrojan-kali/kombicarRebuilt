import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Assurez-vous que le chemin est correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus, faUser, faEnvelope, faLock, faUserTag, faCheckCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme'; // Assurez-vous que le chemin est correct

const AdminFormModal = ({ isOpen, onClose, onSaveAdmin, initialAdminData }) => {
  const { theme } = useColorScheme();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin'); // Rôle par défaut
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isActive, setIsActive] = useState(true); // Statut par défaut
  const [isEditing, setIsEditing] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Gère l'initialisation des champs et le mode (création/édition)
  useEffect(() => {
    if (isOpen) {
      if (initialAdminData) {
        // Mode édition
        setFirstName(initialAdminData.firstName || '');
        setLastName(initialAdminData.lastName || '');
        setEmail(initialAdminData.email || '');
        setRole(initialAdminData.role || 'admin');
        setIsActive(initialAdminData.isActive !== undefined ? initialAdminData.isActive : true);
        setPassword(''); // Ne pas pré-remplir le mot de passe en mode édition pour des raisons de sécurité
        setConfirmPassword('');
        setIsEditing(true);
      } else {
        // Mode création
        setFirstName('');
        setLastName('');
        setEmail('');
        setRole('admin');
        setPassword('');
        setConfirmPassword('');
        setIsActive(true);
        setIsEditing(false);
      }
      setPasswordError(''); // Réinitialiser les erreurs de mot de passe à l'ouverture
    }
  }, [isOpen, initialAdminData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError(''); // Réinitialiser avant nouvelle validation

    // Validation des champs obligatoires
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !role.trim()) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Validation du mot de passe en mode création ou si un nouveau mot de passe est saisi en mode édition
    if (!isEditing || (password.trim() || confirmPassword.trim())) {
      if (password !== confirmPassword) {
        setPasswordError('Les mots de passe ne correspondent pas.');
        return;
      }
      if (password.length < 6) { // Exemple de règle de mot de passe
        setPasswordError('Le mot de passe doit contenir au moins 6 caractères.');
        return;
      }
    }

    const adminToSave = {
      ...initialAdminData, // Garde l'ID si c'est une modification
      firstName,
      lastName,
      email,
      role,
      isActive,
    };

    // N'ajoute le mot de passe que s'il a été saisi (pour création ou modification)
    if (password.trim()) {
      adminToSave.password = password;
    }

    onSaveAdmin(adminToSave, isEditing); // Passe les données et le mode
    onClose(); // Ferme la modal après la soumission
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
            form="admin-form" // Lier au formulaire par son ID
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {submitButtonText}
          </button>
        </div>
      }
    >
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
              <option value="admin">Administrateur</option>
              <option value="super-admin">Super Administrateur</option>
              {/* Ajoutez d'autres rôles si nécessaire */}
            </select>
          </div>
        </div>

        {/* Mot de passe (conditionnel en mode création ou si saisi en mode édition) */}
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
                  required={!isEditing}
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
                  required={!isEditing}
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
    </Modal>
  );
};

export default AdminFormModal;