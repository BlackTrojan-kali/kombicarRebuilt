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
  faDownload, // Ajout de l'icône de téléchargement
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { toast } from "sonner";
import useColorScheme from "../../hooks/useColorScheme";
import { useRole } from "../../contexts/Admin/RoleContext";
import { useUserAdminContext } from "../../contexts/Admin/UsersAdminContext";
// import { UserContext } from "../../contexts/UserContext"; // Décommentez si l'export est ici

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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-800">
          <FontAwesomeIcon icon={faUserShield} /> ADMIN
        </span>
      );
    case ROLES.SUPER_ADMIN:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-500 border border-purple-200 dark:border-purple-800">
          <FontAwesomeIcon icon={faCrown} /> SUPER ADMIN
        </span>
      );
    case ROLES.DRIVER:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-800">
          DRIVER
        </span>
      );
    case ROLES.NONE:
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
          STANDARD
        </span>
      );
  }
};

const Utilisateurs = () => {
  const { theme } = useColorScheme();
  const isDark = theme === "dark";

  // Récupération des fonctions du contexte (Assurez-vous qu'exportUsers y est bien)
  const {
    listStandardUsers,
    userList: standardUserList,
    pagination: standardUserPagination,
    isLoading: isLoadingStandardUsers,
    error: standardUserListError,
    updateUserRoleAsSuperAdmin,
    deleteUserAsAdmin,
    exportUsers,      // <--- Récupération de l'export
    isExportingUsers, // <--- État de chargement de l'export
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

  // --- NOUVELLE FONCTION D'EXPORT ---
  const handleExportCSV = async () => {
    if (!exportUsers) {
      toast.error("La fonction d'exportation n'est pas disponible.");
      return;
    }
    try {
      await exportUsers();
    } catch (error) {
      console.error("L'exportation a échoué", error);
    }
  };

  const handleChangeRole = (userId, userName, currentRole) => {
    if (!roles || roles.length === 0) {
      toast.error("La liste des rôles n'est pas chargée.");
      return;
    }

    const html = `
      <div class="flex flex-col gap-4 p-2 text-sm">
        <div class="text-left">
          <label for="internalRole" class="${isDark ? "text-gray-300" : "text-gray-700"} font-semibold mb-1 block">Rôle interne (Numérique) :</label>
          <select id="internalRole" class="w-full border ${isDark ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-gray-50 text-gray-900"} rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 transition-colors">
            ${Object.entries(ROLES)
              .map(
                ([key, value]) =>
                  `<option value="${value}" ${currentRole === value ? "selected" : ""}>${key} (${value})</option>`
              )
              .join("")}
          </select>
        </div>

        <div class="text-left">
          <label for="externalRole" class="${isDark ? "text-gray-300" : "text-gray-700"} font-semibold mb-1 block">Rôle enregistré (ID) :</label>
          <select id="externalRole" class="w-full border ${isDark ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-gray-50 text-gray-900"} rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 transition-colors">
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
      title: `Modifier le rôle`,
      text: userName,
      html,
      showCancelButton: true,
      confirmButtonText: "Enregistrer les modifications",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: isDark ? "#4b5563" : "#9ca3af",
      background: isDark ? "#1e293b" : "#ffffff",
      color: isDark ? "#f8fafc" : "#0f172a",
      customClass: {
        popup: "rounded-2xl shadow-xl",
        title: "text-lg",
      },
      preConfirm: () => {
        const internal = parseInt(Swal.getPopup().querySelector("#internalRole").value, 10);
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
              success: `Le rôle de ${userName} a été mis à jour.`,
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
      title: "Êtes-vous sûr ?",
      text: `Vous êtes sur le point de supprimer définitivement ${userName}. Cette action est irréversible.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: isDark ? "#4b5563" : "#9ca3af",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      background: isDark ? "#1e293b" : "#ffffff",
      color: isDark ? "#f8fafc" : "#0f172a",
      customClass: {
        popup: "rounded-2xl shadow-xl",
      }
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
    <div className="pl-12 pt-8 pb-40 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 mr-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Utilisateurs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gérez les comptes standards de votre plateforme.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* BOUTON D'EXPORT */}
          <button
            onClick={handleExportCSV}
            disabled={isExportingUsers || !totalCount}
            className={`flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95 ${
              isExportingUsers || !totalCount ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <FontAwesomeIcon
              icon={isExportingUsers ? faSyncAlt : faDownload}
              className={isExportingUsers ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">Exporter CSV</span>
          </button>

          {/* BOUTON ACTUALISER */}
          <button
            onClick={() => listStandardUsers(currentPage)}
            disabled={isLoadingStandardUsers}
            className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95 ${
              isLoadingStandardUsers ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            <FontAwesomeIcon
              icon={faSyncAlt}
              className={isLoadingStandardUsers ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 p-5 mr-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Membres Standards <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">({totalCount || 0} total)</span>
          </h2>
        </div>

        {isLoadingStandardUsers && standardUserList?.length === 0 ? (
          <div className="py-20 text-center text-blue-500 dark:text-blue-400">
            <FontAwesomeIcon icon={faSyncAlt} className="animate-spin text-4xl mb-4 opacity-80" />
            <p className="font-medium">Chargement des utilisateurs...</p>
          </div>
        ) : standardUserListError ? (
          <div className="p-6 text-center text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800/30">
            <p className="font-semibold">Une erreur est survenue</p>
            <p className="text-sm mt-1">{standardUserListError}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Utilisateur</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rôle</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Inscription</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {standardUserList && standardUserList.length > 0 ? (
                    standardUserList.map((user) => {
                      const fullName = `${user.firstName} ${user.lastName}`;
                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors duration-150 group"
                        >
                          <td className="py-4 px-4 font-mono text-xs text-slate-400 dark:text-slate-500">
                            {user.id.substring(0, 8)}...
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                <FontAwesomeIcon icon={faUser} size="sm" />
                              </div>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {fullName}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 text-xs" />
                                {user.email}
                              </span>
                              <span className="text-xs text-slate-500 flex items-center gap-2">
                                <FontAwesomeIcon icon={faPhone} className="text-slate-400 text-xs" />
                                {user.phoneNumber || "Non renseigné"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {getRoleDisplay(user.role)}
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                              <FontAwesomeIcon icon={faCalendarAlt} className="text-slate-400" />
                              {formatDate(user.createdAt)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleChangeRole(user.id, fullName, user.role)}
                                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 transition-colors"
                                title="Changer le rôle"
                              >
                                <FontAwesomeIcon icon={faUserShield} />
                              </button>

                              <button
                                onClick={() => handleDeleteUser(user.id, fullName)}
                                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 transition-colors"
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
                      <td colSpan="6" className="py-12 text-center text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50">
                        Aucun utilisateur trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
              <div className="mb-4 sm:mb-0 text-slate-500 dark:text-slate-400">
                Affichage de <span className="font-semibold text-slate-700 dark:text-slate-200">{totalCount === 0 ? 0 : (page - 1) * 10 + 1}</span> à <span className="font-semibold text-slate-700 dark:text-slate-200">{Math.min(totalCount || 0, (page || 1) * 10)}</span> sur <span className="font-semibold text-slate-700 dark:text-slate-200">{totalCount || 0}</span> membres
              </div>
              
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/30 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={handlePreviousPage}
                  disabled={!hasPreviousPage || isLoadingStandardUsers}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                    !hasPreviousPage || isLoadingStandardUsers
                      ? "text-slate-400 dark:text-slate-500 cursor-not-allowed"
                      : "text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 hover:shadow-sm"
                  }`}
                  title="Page précédente"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                
                <div className="px-4 py-2 bg-white dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg font-bold shadow-sm border border-slate-200 dark:border-slate-600 min-w-[2.5rem] text-center">
                  {page || 1}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={!hasNextPage || isLoadingStandardUsers}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                    !hasNextPage || isLoadingStandardUsers
                      ? "text-slate-400 dark:text-slate-500 cursor-not-allowed"
                      : "text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 hover:shadow-sm"
                  }`}
                  title="Page suivante"
                >
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