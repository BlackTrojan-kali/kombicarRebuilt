import React, { useState, useEffect } from "react";
import { useRole } from "../../../contexts/Admin/RoleContext";
import Swal from "sweetalert2";
import { ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateOrEditRole = ({ roleToEdit = null, onSuccess }) => {
  const { addRole, updateRole, getAllPermissions, permissions: availablePermissions } = useRole();
  const navigate = useNavigate();
  
  const [name, setName] = useState(roleToEdit?.name || "");
  const [selectedPermissions, setSelectedPermissions] = useState(roleToEdit?.permissions || []);
  const [loading, setLoading] = useState(false);
  const [fetchingPerms, setFetchingPerms] = useState(false);

  // Fonction utilitaire pour adapter SweetAlert2 au Dark Mode
  const getSwalConfig = () => ({
    background: document.documentElement.classList.contains('dark') ? '#1F2937' : '#fff',
    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
  });

  // Chargement des permissions au montage
  useEffect(() => {
    let isMounted = true;

    const loadPerms = async () => {
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
  }, []);

  // Ajouter ou retirer une permission
  const togglePermission = (perm) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire({ title: "Erreur", text: "Le nom du rôle est obligatoire", icon: "error", ...getSwalConfig() });
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
        Swal.fire({ title: "Succès", text: "Le rôle a été mis à jour !", icon: "success", ...getSwalConfig() });
      } else {
        // Création
        await addRole({ name, permissions: selectedPermissions });
        Swal.fire({ title: "Succès", text: "Le rôle a été créé !", icon: "success", ...getSwalConfig() });
        setName("");
        setSelectedPermissions([]);
      }
      onSuccess?.(); // rafraîchir la liste si besoin
      navigate("/admin/roles"); // Retour automatique à la liste après succès
    } catch (err) {
      Swal.fire({ title: "Erreur", text: "Impossible de sauvegarder le rôle", icon: "error", ...getSwalConfig() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto transition-colors duration-200">
      
      {/* --- EN-TÊTE --- */}
      <div className="flex items-center gap-4 mb-8">
        <button 
            onClick={() => navigate('/admin/roles')}
            className="p-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors"
            title="Retour à la liste"
        >
            <ArrowLeft size={20} />
        </button>
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="text-blue-600 dark:text-blue-400" size={28} />
                {roleToEdit ? "Modifier le Rôle" : "Créer un Nouveau Rôle"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Définissez le nom du rôle et attribuez-lui les permissions nécessaires.
            </p>
        </div>
      </div>

      {/* --- FORMULAIRE --- */}
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section : Nom du rôle */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Nom du rôle
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Administrateur VTC, Superviseur Covoiturage..."
              className="w-full lg:w-1/2 border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            />
          </div>

          <hr className="border-gray-100 dark:border-gray-700" />

          {/* Section : Permissions */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Attribution des Permissions
              </label>
              {availablePermissions.length > 0 && (
                <div className="flex items-center gap-4">
                    <span className="text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                        Sélectionnées : {selectedPermissions.length} / {availablePermissions.length}
                    </span>
                    <button 
                        type="button" 
                        onClick={() => setSelectedPermissions(selectedPermissions.length === availablePermissions.length ? [] : [...availablePermissions])}
                        className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                    >
                        {selectedPermissions.length === availablePermissions.length ? "Tout désélectionner" : "Tout sélectionner"}
                    </button>
                </div>
              )}
            </div>
            
            {fetchingPerms ? (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <RefreshCw className="animate-spin inline-block mb-3" size={24} />
                <p className="font-medium">Chargement des permissions disponibles...</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {availablePermissions.map((perm) => {
                  const isSelected = selectedPermissions.includes(perm);
                  return (
                    <span
                        key={perm}
                        onClick={() => togglePermission(perm)}
                        className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 select-none ${
                        isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.02]"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
                        }`}
                    >
                        {perm}
                    </span>
                  );
                })}

                {/* Gestion si aucune permission n'est renvoyée par le backend */}
                {availablePermissions.length === 0 && !fetchingPerms && (
                  <div className="p-6 w-full text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30">
                    <p className="font-bold mb-1">Aucune permission trouvée sur le serveur.</p>
                    <p className="text-sm opacity-80">Vérifiez la connexion à l'API ou rechargez la page.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- BOUTON DE SOUMISSION --- */}
          <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
            <button
              type="submit"
              disabled={loading || fetchingPerms}
              className={`px-8 py-3 font-bold text-white rounded-lg transition-all shadow-sm flex items-center gap-2 ${
                loading || fetchingPerms 
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
              }`}
            >
              {loading ? (
                <>
                    <RefreshCw className="animate-spin" size={18} />
                    {roleToEdit ? "Mise à jour..." : "Création en cours..."}
                </>
              ) : (
                roleToEdit ? "Mettre à jour le rôle" : "Créer le rôle"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrEditRole;