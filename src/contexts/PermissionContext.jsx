// src/context/PermissionContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);

  // Vérifie si l'utilisateur possède une permission
  const hasPermission = useCallback(
    (perm) => {
      if (!permissions || !Array.isArray(permissions)) return false;
      return permissions.includes(perm);
    },
    [permissions]
  );

  return (
    <PermissionContext.Provider value={{ permissions, setPermissions, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => useContext(PermissionContext);
