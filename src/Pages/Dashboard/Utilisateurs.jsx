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
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { toast } from "sonner";
import useColorScheme from "../../hooks/useColorScheme";
import { useRole } from "../../contexts/Admin/RoleContext";
import { useUserAdminContext } from "../../contexts/Admin/UsersAdminContext";

const ROLES = {
  NONE: 0,
  ADMIN: 1,
  SUPER_ADMIN: 2,
  DRIVER: 3,
};

/**
 * Formate la date au format : 16/12/2025 à 07:12
 */
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
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

  const {
    listStandardUsers,
    userList: standardUserList,
    pagination: standardUserPagination,
    isLoading: isLoadingStandardUsers,
    error: standardUserListError,
    updateUserRoleAsSuperAdmin,
    deleteUserAsAdmin,
  } = useUserAdminContext();

  const { roles, getRoles } = useRole();
  const [currentPage, setCurrentPage] = useState(1);

  const { totalCount, page, hasNextPage, hasPreviousPage } =
    standardUserPagination || {};

  useEffect(() => {
    listStandardUsers(currentPage);
    getRoles();
  }, [currentPage]);

  const handleNextPage = () => hasNextPage && setCurrentPage((p) => p + 1);
  const handlePreviousPage = () =>
    hasPreviousPage && setCurrentPage((p) => p - 1);

  const handleChangeRole = (userId, userName, currentRole) => {
    if (!roles || roles.length === 0) {
      toast.error("La liste des rôles n'est pas chargée.");
      return;
    }

    const html = `
      <div class="flex flex-col gap-3 p-2">
        <div class="text-left">
          <label for="internalRole" class="${
            isDark ? "text-gray-300" : "text-gray-700"
          } font-medium">Rôle interne (Valeur numérique) :</label>
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
          <label for="externalRole" class="${
            isDark ? "text-gray-300" : "text-gray-700"
          } font-medium">Rôle enregistré (ID du rôle) :</label>
          <select id="externalRole" class="swal2-input mt-1 block w-full border border-gray-300 rounded-md p-2">
            ${roles
              .map(
                (r) =>
                  `<option value="${r.id}">${r.name.toUpperCase()}</option>`
              )
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
        popup: isDark ? "bg-gray-800" : "bg-white",
        title: isDark ? "text-white" : "text-gray-900",
      },
      preConfirm: () => {
        const internal = parseInt(
          Swal.getPopup().querySelector("#internalRole").value,
          10
        );
        const external = Swal.getPopup().querySelector("#externalRole").value;

        if (isNaN(internal) || !external) {
          Swal.showValidationMessage("Vous devez choisir les deux rôles.");
          return false;
        }
        return { internal, external };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const { internal, external } = result.value;
        try {
          await toast.promise(
            updateUserRoleAsSuperAdmin(userId, internal, external),
            {
              loading: `Mise à jour du rôle de ${userName}...`,
              success: `Le rôle de ${userName} a été changé.`,
              error: "Échec de la mise à jour du rôle.",
            }
          );
          listStandardUsers(currentPage);
        } catch (err) {
          console.error("Erreur lors du changement de rôle :", err);
        }
      }
    });
  };

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
          await toast.promise(deleteUserAsAdmin(userId), {
            loading: `Suppression de ${userName}...`,
            success: `${userName} a été supprimé.`,
            error: "Erreur lors de la suppression.",
          });

          const newTotalCount = (totalCount || 0) - 1;
          const newPage =
            newTotalCount > 0 &&
            standardUserList.length === 1 &&
            currentPage > 1
              ? currentPage - 1
              : currentPage;

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
      <div className="flex justify-between items-center mb-6 mr-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Liste des Utilisateurs Simples
        </h1>
        <button
          onClick={() => listStandardUsers(currentPage)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all active:scale-95"
          disabled={isLoadingStandardUsers}
        >
          <FontAwesomeIcon
            icon={faSyncAlt}
            className={`mr-2 ${isLoadingStandardUsers ? "animate-spin" : ""}`}
          />
          Actualiser
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mr-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Utilisateurs Standards ({totalCount || 0})
        </h2>

        {isLoadingStandardUsers ? (
          <div className="p-12 text-center text-blue-500 dark:text-blue-400">
            <FontAwesomeIcon icon={faSyncAlt} className="animate-spin text-3xl mb-4" />
            <p>Chargement des utilisateurs...</p>
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
                    className={`uppercase text-xs font-bold text-left ${
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
                    <th className="py-3 px-4">Date Création</th>
                    <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
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
                          <td className="py-4 px-4 font-mono text-xs opacity-60">
                            {user.id.substring(0, 8)}...
                          </td>
                          <td className="py-4 px-4 font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600">
                                <FontAwesomeIcon icon={faUser} size="xs" />
                              </div>
                              {fullName}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-500 dark:text-gray-400">
                            {user.email}
                          </td>
                          <td className="py-4 px-4">
                            {user.phoneNumber || "N/A"}
                          </td>
                          <td className="py-4 px-4">{getRoleDisplay(user.role)}</td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col">
                              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-xs opacity-50" />
                                {formatDate(user.createdAt)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() =>
                                  handleChangeRole(user.id, fullName, user.role)
                                }
                                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow-sm transition-all active:scale-90"
                                title="Changer le rôle"
                              >
                                <FontAwesomeIcon icon={faUserShield} />
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteUser(user.id, fullName)
                                }
                                className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-sm transition-all active:scale-90"
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
                        colSpan="7"
                        className="py-12 text-center text-gray-500 dark:text-gray-400"
                      >
                        Aucun utilisateur trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination UI */}
            <div
              className={`mt-6 flex flex-col sm:flex-row justify-between items-center text-sm p-4 rounded-xl shadow-inner ${
                isDark ? "bg-gray-900/50 text-gray-200" : "bg-gray-50 text-gray-700"
              }`}
            >
              <div className="mb-4 sm:mb-0 font-medium">
                Affichage de{" "}
                <span className="text-blue-500">
                  {totalCount === 0 ? 0 : (page - 1) * 10 + 1}
                </span>{" "}
                à{" "}
                <span className="text-blue-500">
                  {Math.min(totalCount || 0, (page || 1) * 10)}
                </span>{" "}
                sur <span className="font-bold">{totalCount || 0}</span> membres.
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePreviousPage}
                  disabled={!hasPreviousPage || isLoadingStandardUsers}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    !hasPreviousPage || isLoadingStandardUsers
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-50"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Précédent
                </button>
                
                <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md shadow-blue-500/20">
                  Page {page || 1}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={!hasNextPage || isLoadingStandardUsers}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    !hasNextPage || isLoadingStandardUsers
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-50"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Suivant
                  <FontAwesomeIcon icon={faArrowRight} />
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