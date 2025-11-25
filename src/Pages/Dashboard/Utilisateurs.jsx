// src/pages/admin/Utilisateurs.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faArrowLeft,
  faArrowRight,
  faTrash,
  faUserShield,
  faCrown,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { toast } from "sonner";
import useColorScheme from "../../hooks/useColorScheme";
// import useUser from "../../hooks/useUser"; // Non utilisé, peut être retiré
import { useRole } from "../../contexts/Admin/RoleContext"; // Assurez-vous que ce contexte existe
import { useUserAdminContext } from "../../contexts/Admin/UsersAdminContext";

const ROLES = {
  NONE: 0,
  ADMIN: 1,
  SUPER_ADMIN: 2,
  DRIVER: 3,
};

const getRoleDisplay = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return (
        <span className="text-yellow-500 font-bold flex items-center gap-2">
          <FontAwesomeIcon icon={faUserShield} /> ADMIN
        </span>
      );
    case ROLES.SUPER_ADMIN:
      return (
        <span className="text-purple-500 font-bold flex items-center gap-2">
          <FontAwesomeIcon icon={faCrown} /> SUPER ADMIN
        </span>
      );
    case ROLES.DRIVER:
      return <span className="text-green-500 font-bold">DRIVER</span>;
    case ROLES.NONE:
    default:
      return <span className="text-gray-400 font-semibold">STANDARD</span>;
  }
};

const Utilisateurs = () => {
  const { theme } = useColorScheme();
  const isDark = theme === "dark";

  // CORRECTION des noms de variables/fonctions du contexte
  const {
    listStandardUsers,
    userList: standardUserList, // Renommage : userList est la liste active
    pagination: standardUserPagination, // Renommage : pagination est l'objet de pagination actif
    isLoading: isLoadingStandardUsers, // Renommage : isLoading est l'état de chargement actif
    error: standardUserListError, // Renommage : error est l'état d'erreur actif
    updateUserRoleAsSuperAdmin, // Correction : utilisation de la bonne fonction
    deleteUserAsAdmin, // Correction : utilisation de la bonne fonction
  } = useUserAdminContext();

  const { roles, getRoles } = useRole();

  const [currentPage, setCurrentPage] = useState(1);
  // Extraction simplifiée, basée sur l'état 'pagination' du contexte
  const { totalCount, page, hasNextPage, hasPreviousPage } = standardUserPagination || {};

  // Charger les utilisateurs et les rôles
  useEffect(() => {
    // Le hook listStandardUsers est appelé avec la page en cours.
    // Il met à jour les états userList, pagination, isLoading, et error du contexte.
    listStandardUsers(currentPage);
    getRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]); // Dépendances ajustées pour éviter les avertissements

  // Pagination
  const handleNextPage = () => hasNextPage && setCurrentPage((p) => p + 1);
  const handlePreviousPage = () => hasPreviousPage && setCurrentPage((p) => p - 1);

  // Changer le rôle avec 2 selects
  const handleChangeRole = (userId, userName, currentRole) => {
    if (!roles || roles.length === 0) {
      toast.error("La liste des rôles n'est pas chargée.");
      return;
    }

    // Création du HTML du formulaire
    const html = `
      <div class="flex flex-col gap-3 p-2">
        <div class="text-left">
          <label for="internalRole" class="${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium">Rôle interne (Valeur numérique) :</label>
          <select id="internalRole" class="swal2-input mt-1 block w-full border border-gray-300 rounded-md p-2">
            ${Object.entries(ROLES)
              .map(
                ([key, value]) =>
                  `<option value="${value}" ${
                    currentRole === value ? "selected" : ""
                  }>${key} (${value})</option>`
              )
              .join("")}
          </select>
        </div>

        <div class="text-left">
          <label for="externalRole" class="${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium">Rôle enregistré (ID du rôle) :</label>
          <select id="externalRole" class="swal2-input mt-1 block w-full border border-gray-300 rounded-md p-2">
            ${roles
              .map((r) => `<option value="${r.id}">${r.name.toUpperCase()}</option>`)
              .join("")}
          </select>
        </div>
      </div>
    `;

    Swal.fire({
      title: `Modifier le rôle de ${userName}`,
      html,
      showCancelButton: true,
      confirmButtonText: "Confirmer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#2563EB",
      background: isDark ? "#1F2937" : "#FFFFFF",
      color: isDark ? "#F9FAFB" : "#1F2937",
      customClass: {
        popup: isDark ? 'bg-gray-800' : 'bg-white',
        title: isDark ? 'text-white' : 'text-gray-900',
      },
      preConfirm: () => {
        const internal = parseInt(
          Swal.getPopup().querySelector("#internalRole").value, 10
        );
        const external =
          Swal.getPopup().querySelector("#externalRole").value;
        
        // Vérification simple, mais l'API peut nécessiter une vérification plus stricte
        if (internal === null || external === null) {
          Swal.showValidationMessage("Vous devez choisir les deux rôles.");
          return false; // Important pour empêcher la fermeture
        }
        return { internal, external };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const { internal, external } = result.value;
        try {
          // Utilisation de la fonction correcte du contexte
          await toast.promise(updateUserRoleAsSuperAdmin(userId, internal, external), {
            loading: `Mise à jour du rôle de ${userName}...`,
            success: `Le rôle de ${userName} a été changé.`,
            error: "Échec de la mise à jour du rôle.",
          });
          // Rechargement de la liste après succès
          listStandardUsers(currentPage);
        } catch (err) {
          console.error("Erreur lors du changement de rôle :", err);
        }
      }
    });
  }; 

  // Supprimer un utilisateur
  const handleDeleteUser = (userId, userName) => {
    Swal.fire({
      title: "Supprimer cet utilisateur ?",
      text: `Vous êtes sur le point de supprimer définitivement ${userName}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      background: isDark ? "#1F2937" : "#FFFFFF",
      color: isDark ? "#F9FAFB" : "#1F2937",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Utilisation de la fonction correcte du contexte
          await toast.promise(deleteUserAsAdmin(userId), {
            loading: `Suppression de ${userName}...`,
            success: `${userName} a été supprimé.`,
            error: "Erreur lors de la suppression.",
          });

          // Logique de rechargement de page intelligente
          const newTotalCount = (totalCount || 0) - 1;
          const newPage =
            newTotalCount > 0 &&
            standardUserList.length === 1 && // Si c'était le dernier élément de la page
            currentPage > 1
              ? currentPage - 1
              : currentPage;

          // Mise à jour de la page si elle a changé ou rechargement de la page actuelle
          if (newPage !== currentPage) {
            setCurrentPage(newPage);
          } else {
            listStandardUsers(newPage);
          }
        } catch (err) {
          console.error("Erreur suppression:", err);
        }
      }
    });
  };

  return (
    <div className="pl-12 pt-6 pb-40 bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Liste des Utilisateurs Simples
        </h1>
        <button
          onClick={() => listStandardUsers(currentPage)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          disabled={isLoadingStandardUsers}
        >
          <FontAwesomeIcon icon={faSyncAlt} className="mr-2" />
          Actualiser
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Utilisateurs Standards ({totalCount || 0})
        </h2>

        {isLoadingStandardUsers ? (
          <div className="p-4 text-center text-blue-500 dark:text-blue-400">
            Chargement des utilisateurs...
          </div>
        ) : standardUserListError ? (
          <div className="p-4 text-center text-red-500 dark:text-red-400">
            <p>Erreur : {standardUserListError}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg">
              <table
                className={`w-full table-auto ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <thead>
                  <tr
                    className={`uppercase text-sm font-semibold text-left ${
                      isDark
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <th className="py-3 px-4 rounded-tl-lg">ID</th>
                    <th className="py-3 px-4">Nom complet</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Téléphone</th>
                    <th className="py-3 px-4">Rôle</th>
                    <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {standardUserList && standardUserList.length > 0 ? (
                    standardUserList.map((user) => {
                      const fullName = `${user.firstName} ${user.lastName}`;
                      return (
                        <tr
                          key={user.id}
                          className={`border-b ${
                            isDark ? "border-gray-700" : "border-gray-200"
                          } last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                        >
                          <td className="py-4 px-4">{user.id}</td>
                          <td className="py-4 px-4 flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="text-gray-400"
                            />
                            {fullName}
                          </td>
                          <td className="py-4 px-4">
                            <FontAwesomeIcon
                              icon={faEnvelope}
                              className="text-gray-400 mr-2"
                            />
                            {user.email}
                          </td>
                          <td className="py-4 px-4">
                            <FontAwesomeIcon
                              icon={faPhone}
                              className="text-gray-400 mr-2"
                            />
                            {user.phoneNumber || "N/A"}
                          </td>
                          <td className="py-4 px-4">{getRoleDisplay(user.role)}</td>
                          <td className="py-4 px-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() =>
                                  handleChangeRole(user.id, fullName, user.role)
                                }
                                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                title="Changer le rôle"
                              >
                                <FontAwesomeIcon icon={faUserShield} />
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteUser(user.id, fullName)
                                }
                                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                title="Supprimer l'utilisateur"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        Aucun utilisateur à afficher.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className={`mt-4 flex flex-col sm:flex-row justify-between items-center text-sm p-4 rounded-md shadow ${
                isDark
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <div className="mb-2 sm:mb-0">
                Affichage de{" "}
                {totalCount === 0 ? 0 : (page - 1) * 10 + 1} à{" "}
                {Math.min(totalCount || 0, (page || 1) * 10)} sur {totalCount || 0}{" "}
                utilisateurs.
            </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={!hasPreviousPage || isLoadingStandardUsers}
                  className={`px-4 py-2 rounded-md ${
                    !hasPreviousPage || isLoadingStandardUsers
                      ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  }`}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  Précédent
                </button>
                <span
                  className={`px-4 py-2 rounded-md font-bold ${
                    isDark ? "bg-gray-600" : "bg-gray-200"
                  }`}
                >
                  Page {page || 1}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={!hasNextPage || isLoadingStandardUsers}
                  className={`px-4 py-2 rounded-md ${
                    !hasNextPage || isLoadingStandardUsers
                      ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  }`}
                >
                  Suivant
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Utilisateurs;