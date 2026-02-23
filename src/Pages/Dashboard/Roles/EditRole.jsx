import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRole } from '../../../contexts/Admin/RoleContext'; 
import { toast } from 'sonner';

const EditRole = () => {
    const { roleId } = useParams();
    const navigate = useNavigate();
    
    // On ne récupère pas 'role' ici car nous utilisons directement le retour de l'API
    const { 
        getRoleById, 
        updateRole, 
        loading, 
        getAllPermissions, 
        permissions: availablePermissions 
    } = useRole();
    
    const [formData, setFormData] = useState({
        name: '',
        permissions: [],
    });

    const [isLoadingRole, setIsLoadingRole] = useState(true);
    const [isFetchingPerms, setIsFetchingPerms] = useState(false);

    // 1. Chargement DYNAMIQUE des permissions depuis l'API (Une seule fois au montage)
    useEffect(() => {
        let isMounted = true;

        const fetchPerms = async () => {
            // Si on les a déjà dans le contexte, on ne refait pas l'appel
            if (availablePermissions && availablePermissions.length > 0) return;
            
            setIsFetchingPerms(true);
            try {
                await getAllPermissions();
            } catch (error) {
                if (isMounted) toast.error("Erreur lors du chargement des permissions disponibles.");
            } finally {
                if (isMounted) setIsFetchingPerms(false);
            }
        };

        fetchPerms();

        return () => { isMounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // <-- Tableau vide pour éviter les boucles, on fait confiance au cache du contexte

    // 2. Chargement initial du rôle à modifier
    useEffect(() => {
        let isMounted = true;

        const fetchRole = async () => {
            if (!roleId) {
                toast.error("ID du rôle manquant.");
                navigate('/admin/roles');
                return;
            }
            try {
                // On utilise directement la donnée retournée par la promesse
                const fetchedRole = await getRoleById(roleId);

                if (fetchedRole && isMounted) {
                    setFormData({
                        name: fetchedRole.name || '',
                        permissions: fetchedRole.permissions || [],
                    });
                } else if (isMounted) {
                    toast.error("Rôle non trouvé.");
                    navigate('/admin/roles');
                }
            } catch (error) {
                if (isMounted) {
                    toast.error("Erreur lors du chargement du rôle.");
                    console.error(error);
                }
            } finally {
                if (isMounted) setIsLoadingRole(false);
            }
        };

        fetchRole();

        return () => { isMounted = false; };
        // <-- On a retiré 'role' d'ici pour stopper la boucle infinie !
    }, [roleId, getRoleById, navigate]); 
    
    // 3. Gestion des changements de nom
    const handleNameChange = useCallback((e) => {
        setFormData(prev => ({
            ...prev,
            name: e.target.value,
        }));
    }, []);

    // 4. Gestion du changement des permissions (checkboxes)
    const handlePermissionChange = useCallback((permissionName) => {
        setFormData(prev => {
            const currentPermissions = prev.permissions;
            if (currentPermissions.includes(permissionName)) {
                return {
                    ...prev,
                    permissions: currentPermissions.filter(p => p !== permissionName),
                };
            } else {
                return {
                    ...prev,
                    permissions: [...currentPermissions, permissionName],
                };
            }
        });
    }, []);

    // 5. Tout sélectionner / Tout désélectionner
    const toggleAllPermissions = () => {
        if (formData.permissions.length === availablePermissions.length) {
            setFormData(prev => ({ ...prev, permissions: [] }));
        } else {
            setFormData(prev => ({ ...prev, permissions: [...availablePermissions] }));
        }
    };

    // 6. Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.warning("Le nom du rôle est obligatoire.");
            return;
        }

        try {
            await updateRole({
                id: roleId,
                name: formData.name,
                permissions: formData.permissions
            });
            toast.success(`Rôle "${formData.name}" mis à jour avec succès.`);
            navigate('/admin/roles');
        } catch (error) {
            const message = error?.response?.data?.message || "Échec de la mise à jour du rôle.";
            toast.error(message);
            console.error(error);
        }
    };

    if (isLoadingRole || isFetchingPerms) {
        return (
            <div className="p-8 text-center text-xl text-gray-500 flex flex-col items-center justify-center min-h-[50vh]">
                <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></span>
                Chargement des données...
            </div>
        );
    }
    
    return (
        <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-xl dark:bg-gray-800 mb-20">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Modifier le rôle : {formData.name}
            </h2>
            
            <form onSubmit={handleSubmit}>
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

                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Permissions d'accès
                        </h3>
                        {availablePermissions.length > 0 && (
                            <button 
                                type="button" 
                                onClick={toggleAllPermissions}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            >
                                {formData.permissions.length === availablePermissions.length ? "Tout désélectionner" : "Tout sélectionner"}
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50 custom-scrollbar">
                        {availablePermissions.map((permission) => (
                            <div key={permission} className="flex items-center hover:bg-white dark:hover:bg-gray-600 p-2 rounded transition-colors">
                                <input
                                    id={permission}
                                    type="checkbox"
                                    checked={formData.permissions.includes(permission)}
                                    onChange={() => handlePermissionChange(permission)}
                                    disabled={loading}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
                                />
                                <label 
                                    htmlFor={permission} 
                                    className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none flex-1"
                                >
                                    {permission}
                                </label>
                            </div>
                        ))}
                        {availablePermissions.length === 0 && (
                            <div className="col-span-full text-sm text-red-500 p-2 bg-red-50 rounded border border-red-100">
                                Aucune permission trouvée sur le serveur. Vérifiez votre connexion à l'API.
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/roles')}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2.5 text-base font-semibold rounded-lg transition duration-200 shadow-sm ${
                            loading 
                            ? 'bg-blue-400 cursor-not-allowed opacity-70 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        {loading ? 'Mise à jour en cours...' : 'Sauvegarder les modifications'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditRole;