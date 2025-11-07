import React, { useState, useEffect } from "react";
import { useRole } from "../../../contexts/RoleContext";
import Swal from "sweetalert2";

// Liste complète des permissions disponibles
const ALL_PERMISSIONS = [
  "ApplicationSettingsCanUpdate",
  "ApplicationSettingsCanRead",
  "LicenceDrivingCanChangeVerificationState",
  "LicenceCanDrivingList",
  "LicenceDrivingCanReadDetails",
  "NotificationsCanPublish",
  "NotificationsCanList",
  "NotificationsCanReadDetails",
  "NotificationsCanUpdate",
  "NotificationsCanDelete",
  "PromoCodeCanReadDetails",
  "PromoCodeCanUpdate",
  "PromoCodeCanDelete",
  "ReviewCanAdd",
  "StatisticsCanRead",
  "TripsCanChangeStatus",
  "TripsCanDelete",
  "UsersCanChangeRole",
  "UsersCanAdd",
  "UsersCanDelete",
  "UsersCanListAdmin",
  "UsersCanListDrivers",
  "UsersCanListUsers",
  "UsersCanUpdateAdminAccessAccess",
  "VehiculeCanUpdateVerificationState",
  "VehiculeCanList",
  "VehiculeCanReadDetails",
  "VehiculeCanUpdateInfos",
  "VehiculeCanDelete",
  "WithdrawRequestsCanReadPending",
  "WithdrawRequestsCanUpdateStatus",
  "WithdrawRequestsCanList",
  "RoleCanRead",
];

const CreateOrEditRole = ({ roleToEdit = null, onSuccess }) => {
  const { addRole, updateRole } = useRole();
  const [name, setName] = useState(roleToEdit?.name || "");
  const [permissions, setPermissions] = useState(roleToEdit?.permissions || []);
  const [loading, setLoading] = useState(false);

  // Ajouter ou retirer une permission
  const togglePermission = (perm) => {
    setPermissions((prev) =>
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
          roleId: roleToEdit.id,
          name,
          permissions,
        });
        Swal.fire("Succès", "Le rôle a été mis à jour !", "success");
      } else {
        // Création
        await addRole({ name, permissions });
        Swal.fire("Succès", "Le rôle a été créé !", "success");
        setName("");
        setPermissions([]);
      }
      onSuccess?.(); // rafraîchir la liste si besoin
    } catch (err) {
      Swal.fire("Erreur", "Impossible de sauvegarder le rôle", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pl-12  pt-6 pb-40 bg-white rounded shadow">
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
            placeholder="Ex: Administrateur"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Permissions */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Permissions</label>
          <div className="flex flex-wrap gap-2">
            {ALL_PERMISSIONS.map((perm) => (
              <span
                key={perm}
                onClick={() => togglePermission(perm)}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium border transition ${
                  permissions.includes(perm)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {perm}
              </span>
            ))}
          </div>
        </div>

        {/* Bouton */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 font-semibold text-white rounded ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? (roleToEdit ? "Mise à jour..." : "Création...") : roleToEdit ? "Mettre à jour" : "Créer le rôle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrEditRole;
