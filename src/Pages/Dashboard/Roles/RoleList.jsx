import React, { useEffect, useState, useCallback } from "react";
import { useRole } from "../../../contexts/Admin/RoleContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; 
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react'; // Ajout d'icônes

const RoleList = () => {
  const { roles, getRoles, deleteRole, loading } = useRole();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Logique de chargement des rôles, déclenchée par le changement de 'page'
  useEffect(() => {
    getRoles(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Supprimer un rôle
  const handleDelete = useCallback(async (roleId) => {
    const confirm = await Swal.fire({
      title: "Confirmation",
      text: "Voulez-vous vraiment supprimer ce rôle ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6B7280", // Couleur grise pour annuler
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      background: document.documentElement.classList.contains('dark') ? '#1F2937' : '#fff', // Support Darkmode pour Swal
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
    });

    if (confirm.isConfirmed) {
      try {
        await deleteRole(roleId);
        Swal.fire({
            title: "Supprimé", 
            text: "Le rôle a été supprimé avec succès", 
            icon: "success",
            background: document.documentElement.classList.contains('dark') ? '#1F2937' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
        });
        getRoles(page); 
      } catch (error) {
        const errorMessage = error.message || "Impossible de supprimer le rôle";
        Swal.fire({
            title: "Erreur", 
            text: errorMessage, 
            icon: "error",
            background: document.documentElement.classList.contains('dark') ? '#1F2937' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
        });
      }
    }
  }, [deleteRole, getRoles, page]);

  const isNextDisabled = roles.length === 0 || loading; 

  return (
    <div className="p-6 max-w-7xl mx-auto transition-colors duration-200">
      
      {/* --- EN-TÊTE --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Rôles</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Créez et configurez les permissions des administrateurs et collaborateurs.
            </p>
        </div>
        <button
          onClick={() => navigate("/admin/roles/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} />
          Créer un rôle
        </button>
      </div>

      {/* --- TABLEAU DES RÔLES --- */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                <th className="p-4 w-1/4">Nom du rôle</th>
                <th className="p-4 w-2/4">Permissions accordées</th>
                <th className="p-4 text-right w-1/4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              
              {/* État de chargement */}
              {loading && roles.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex justify-center items-center gap-3">
                        <RefreshCw className="animate-spin" size={20} />
                        Chargement des rôles...
                    </div>
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                /* État vide */
                <tr>
                  <td colSpan="3" className="p-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-transparent">
                    Aucun rôle n'a été trouvé.
                  </td>
                </tr>
              ) : (
                /* Liste des rôles */
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors group">
                    
                    {/* Nom du Rôle */}
                    <td className="p-4 align-top">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {role.name}
                        </span>
                    </td>
                    
                    {/* Permissions (Affichage sous forme de tags) */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(role.permissions) && role.permissions.length > 0 ? (
                            role.permissions.map((perm, index) => (
                                <span key={index} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium border border-gray-200 dark:border-gray-600">
                                    {perm}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm italic text-gray-400 dark:text-gray-500">
                                {role.permissions || 'Aucune permission assignée'}
                            </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="p-4 align-top text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/admin/roles/edit/${role.id}`)} 
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Modifier le rôle"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(role.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Supprimer le rôle"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION --- */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page courante : <span className="font-semibold text-gray-900 dark:text-white">{page}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={isNextDisabled}
              className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleList;