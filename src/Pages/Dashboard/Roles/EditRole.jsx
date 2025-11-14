import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRole } from '../../../contexts/RoleContext'; // Ajustez le chemin
import { toast } from 'sonner';

// Simuler la liste complète des permissions disponibles
// REMARQUE : Dans une application réelle, cette liste serait chargée via une API ou un contexte.
const AVAILABLE_PERMISSIONS = [
    "UsersCanListAdmin", "UsersCanListDrivers", "UsersCanListUsers",
    "TripsCanChangeStatus", "TripsCanDelete",
    "VehiculeCanList", "VehiculeCanReadDetails", "VehiculeCanUpdateVerificationState",
    "PromoCodeCanList", "PromoCodeCanUpdate", "PromoCodeCanDelete",
    "WithdrawRequestsCanList", "WithdrawRequestsCanUpdateStatus",
    "LicenceCanDrivingList", "LicenceDrivingCanChangeVerificationState",
    "NotificationsCanList", "NotificationsCanPublish", "NotificationsCanDelete",
    "UsersCanChangeRole", "RolesCanList", "RolesCanUpdate", "RolesCanAdd" 
];

const EditRole = () => {
    const { roleId } = useParams();
    const navigate = useNavigate();
    const { getRoleById, updateRole, loading, role } = useRole();
    
    // État local pour le formulaire
    const [formData, setFormData] = useState({
        name: '',
        permissions: [],
        roleId: roleId,
    });

    const [isLoadingRole, setIsLoadingRole] = useState(true);

    // 1. Chargement initial du rôle
    useEffect(() => {
        const fetchRole = async () => {
            if (!roleId) {
                toast.error("ID du rôle manquant.");
                navigate('/admin/roles');
                return;
            }
            try {
                const fetchedRole = await getRoleById(roleId);
                
                // Si getRoleById est mis en cache, utiliser directement 'fetchedRole'
                // Sinon, 'role' sera mis à jour par le contexte.
                const dataToUse = fetchedRole || role; 

                if (dataToUse) {
                    setFormData({
                        name: dataToUse.name || '',
                        permissions: dataToUse.permissions || [],
                        roleId: roleId,
                    });
                } else {
                    toast.error("Rôle non trouvé.");
                    navigate('/admin/roles');
                }
            } catch (error) {
                toast.error("Erreur lors du chargement du rôle.");
                console.error(error);
            } finally {
                setIsLoadingRole(false);
            }
        };

        fetchRole();
    }, [roleId, getRoleById, navigate]);
    
    // 2. Gestion des changements de nom
    const handleNameChange = useCallback((e) => {
        setFormData(prev => ({
            ...prev,
            name: e.target.value,
        }));
    }, []);

    // 3. Gestion du changement des permissions (checkboxes)
    const handlePermissionChange = useCallback((permissionName) => {
        setFormData(prev => {
            const currentPermissions = prev.permissions;
            if (currentPermissions.includes(permissionName)) {
                // Retirer la permission
                return {
                    ...prev,
                    permissions: currentPermissions.filter(p => p !== permissionName),
                };
            } else {
                // Ajouter la permission
                return {
                    ...prev,
                    permissions: [...currentPermissions, permissionName],
                };
            }
        });
    }, []);

    // 4. Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation basique
        if (!formData.name.trim()) {
            toast.warning("Le nom du rôle est obligatoire.");
            return;
        }

        try {
            // L'objet formData correspond au format attendu : { name, permissions, roleId }
            await updateRole(formData);
            toast.success(`Rôle "${formData.name}" mis à jour avec succès.`);
            navigate('/admin/roles');
        } catch (error) {
            const message = error?.response?.data?.message || "Échec de la mise à jour du rôle.";
            toast.error(message);
            console.error(error);
        }
    };

    // Affichage de l'état de chargement initial
    if (isLoadingRole) {
        return (
            <div className="p-8 text-center text-xl text-gray-500">
                Chargement des données du rôle...
            </div>
        );
    }
    
    // Rendu du formulaire
    return (
        <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-xl dark:bg-gray-800">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Modifier le rôle : {formData.name}
            </h2>
            
            <form onSubmit={handleSubmit}>
                {/* Champ Nom du Rôle */}
                <div className="mb-6">
                    <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom du Rôle
                    </label>
                    <input
                        type="text"
                        id="roleName"
                        value={formData.name}
                        onChange={handleNameChange}
                        disabled={loading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Ex: Super Admin"
                        required
                    />
                </div>

                {/* Sélecteur de Permissions */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">
                        Permissions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        {AVAILABLE_PERMISSIONS.map((permission) => (
                            <div key={permission} className="flex items-center">
                                <input
                                    id={permission}
                                    type="checkbox"
                                    checked={formData.permissions.includes(permission)}
                                    onChange={() => handlePermissionChange(permission)}
                                    disabled={loading}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label 
                                    htmlFor={permission} 
                                    className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                                >
                                    {permission}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bouton de soumission */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-3 text-lg font-semibold rounded-lg transition duration-200 ${
                            loading 
                            ? 'bg-blue-300 dark:bg-blue-600 cursor-not-allowed opacity-70' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                        }`}
                    >
                        {loading ? 'Mise à jour...' : 'Sauvegarder les modifications'}
                    </button>
                </div>
                
                {/* Bouton Annuler */}
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/roles')}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditRole;