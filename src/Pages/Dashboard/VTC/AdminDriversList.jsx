import React, { useEffect, useState } from 'react';
import { useAdminVtcDriver } from '../../../contexts/Admin/VTCcontexts/useAdminVtcDriver';

export const AdminDriversList = () => {
  const { getDrivers, validateDriver, isLoading, error } = useAdminVtcDriver();
  const [driversList, setDriversList] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const data = await getDrivers(1, 12);
      if (data && data.items) {
        setDriversList(data.items);
      }
    };
    
    fetchDrivers();
  }, [getDrivers]);

  const handleValidateClick = async (id) => {
    const isSuccess = await validateDriver(id);
    if (isSuccess) {
      alert("Le chauffeur a été validé avec succès.");
      setDriversList(prevList => 
        prevList.map(driver => driver.id === id ? { ...driver, isValidated: true } : driver)
      );
    }
  };

  if (isLoading && driversList.length === 0) {
    return <p>Chargement des chauffeurs en cours...</p>;
  }

  return (
    <div>
      <h2>Gestion des Chauffeurs VTC</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Erreur : {error.description || "Une erreur inattendue est survenue."}
        </div>
      )}

      <ul>
        {driversList.map((driver) => (
          <li key={driver.id} style={{ marginBottom: '15px' }}>
            <strong>{driver.firstName} {driver.lastName}</strong> - {driver.email}
            <br />
            Statut : {driver.isValidated ? "Validé ✅" : "En attente ⏳"}
            <br />
            {!driver.isValidated && (
              <button onClick={() => handleValidateClick(driver.id)}>
                Valider ce chauffeur
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};