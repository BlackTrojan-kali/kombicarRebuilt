import React, { useEffect, useState, useCallback } from "react";
import { useRole } from "../../../contexts/Admin/RoleContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; 

const RoleList = () => {
  const { roles, getRoles, deleteRole,loading } = useRole();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Logique de chargement des rôles, déclenchée par le changement de 'page'
  useEffect(() => {
    // On inclut 'getRoles' dans les dépendances car c'est une fonction du contexte
    // et 'page' car la liste doit être rechargée à chaque changement de page.
    getRoles(page);
  }, [page]);



  // Supprimer un rôle
  const handleDelete = useCallback(async (roleId) => {
    const confirm = await Swal.fire({
      title: "Confirmation",
      text: "Voulez-vous vraiment supprimer ce rôle ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Couleur rouge pour la suppression
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteRole(roleId);
        Swal.fire("Supprimé", "Le rôle a été supprimé avec succès", "success");
        // Recharger la page actuelle après suppression
        getRoles(page); 
      } catch (error) {
        // Afficher le message d'erreur du backend si disponible, sinon un message générique
        const errorMessage = error.message || "Impossible de supprimer le rôle";
        Swal.fire("Erreur", errorMessage, "error");
      }
    }
  }, [deleteRole, getRoles, page]); // Ajout des dépendances pour useCallback


  // Déterminer si le bouton 'Suivant' doit être désactivé
  // On suppose qu'une page complète contient un nombre maximal d'éléments. 
  // Si le tableau est vide, ou si roles.length < taille_page (non disponible ici), on désactive.
  // Pour l'instant, on se base sur roles.length
  const isNextDisabled = roles.length === 0 || loading; 
  // Vous devrez ajuster 'isNextDisabled' si votre API retourne le nombre total de pages ou le 'hasMore'

  return (
    <div className="pl-12 pt-6 pb-40">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Liste des rôles</h2>
        <button
          onClick={() => navigate("/admin/roles/create")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Créer un rôle
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Chargement...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-gray-700 font-medium border-b break-words max-w-xs">
                  Nom
                </th>
                <th className="p-3 text-left text-gray-700 font-medium border-b break-words max-w-xs">
                  Permissions
                </th>
                <th className="p-3 text-center text-gray-700 font-medium border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    Aucun rôle trouvé.
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b text-gray-800 break-words max-w-xs">{role.name}</td>
                    <td className="p-3 border-b text-gray-700 break-words max-w-xs">
                      {/* Gérer le cas où permissions est null ou non un tableau */}
                      {Array.isArray(role.permissions) ? role.permissions.join(", ") : (role.permissions || 'Aucune')}
                    </td>
                    <td className="p-3 border-b text-center space-x-2">
                      <button
                        onClick={() => navigate(`/admin/roles/edit/${role.id}`)} 
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination simple */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          ← Précédent
        </button>
        <span className="px-3 py-2 text-gray-700">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={isNextDisabled} // Désactivé si aucun rôle n'est chargé
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
};

export default RoleList;