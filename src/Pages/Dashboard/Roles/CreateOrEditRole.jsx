import React, { useState, useEffect } from "react";
import { useRole } from "../../../contexts/Admin/RoleContext";
import Swal from "sweetalert2";

const CreateOrEditRole = ({ roleToEdit = null, onSuccess }) => {
  const { addRole, updateRole, getAllPermissions, permissions: availablePermissions } = useRole();
  
  const [name, setName] = useState(roleToEdit?.name || "");
  const [selectedPermissions, setSelectedPermissions] = useState(roleToEdit?.permissions || []);
  const [loading, setLoading] = useState(false);
  const [fetchingPerms, setFetchingPerms] = useState(false);

  // Chargement des permissions au montage (sécurisé contre les boucles infinies)
  useEffect(() => {
    let isMounted = true;

    const loadPerms = async () => {
      // Si on les a déjà dans le contexte, on ne refait pas l'appel
      if (availablePermissions && availablePermissions.length > 0) return;

      if (isMounted) setFetchingPerms(true);
      try {
        await getAllPermissions();
      } catch (error) {
        if (isMounted) console.error("Erreur lors du chargement des permissions");
      } finally {
        if (isMounted) setFetchingPerms(false);
      }
    };

    loadPerms();

    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <-- Tableau vide pour éviter que le composant ne boucle

  // Ajouter ou retirer une permission
  const togglePermission = (perm) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire("Erreur", "Le nom du rôle est obligatoire", "error");
      return;
    }

    try {
      setLoading(true);
      if (roleToEdit) {
        // Modification
        await updateRole({
          id: roleToEdit.id,
          name,
          permissions: selectedPermissions,
        });
        Swal.fire("Succès", "Le rôle a été mis à jour !", "success");
      } else {
        // Création
        await addRole({ name, permissions: selectedPermissions });
        Swal.fire("Succès", "Le rôle a été créé !", "success");
        setName("");
        setSelectedPermissions([]);
      }
      onSuccess?.(); // rafraîchir la liste si besoin
    } catch (err) {
      Swal.fire("Erreur", "Impossible de sauvegarder le rôle", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pl-12 pt-6 pb-40 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {roleToEdit ? "Modifier le rôle" : "Créer un nouveau rôle"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Nom du rôle</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Administrateur VTC"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Permissions */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium text-gray-700">Permissions</label>
            {availablePermissions.length > 0 && (
              <button 
                type="button" 
                onClick={() => setSelectedPermissions(selectedPermissions.length === availablePermissions.length ? [] : [...availablePermissions])}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                {selectedPermissions.length === availablePermissions.length ? "Tout désélectionner" : "Tout sélectionner"}
              </button>
            )}
          </div>
          
          {fetchingPerms ? (
            <div className="text-sm text-gray-500 py-4 flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
              Chargement des permissions depuis le serveur...
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availablePermissions.map((perm) => (
                <span
                  key={perm}
                  onClick={() => togglePermission(perm)}
                  className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200 shadow-sm ${
                    selectedPermissions.includes(perm)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {perm}
                </span>
              ))}
              {availablePermissions.length === 0 && !fetchingPerms && (
                <div className="text-sm text-red-500 p-2 bg-red-50 rounded border border-red-100 w-full">
                  Aucune permission trouvée sur le serveur.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bouton */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || fetchingPerms}
            className={`w-full px-4 py-2.5 font-semibold text-white rounded transition-colors shadow-sm ${
              loading || fetchingPerms ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (roleToEdit ? "Mise à jour en cours..." : "Création en cours...") : roleToEdit ? "Mettre à jour" : "Créer le rôle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrEditRole;