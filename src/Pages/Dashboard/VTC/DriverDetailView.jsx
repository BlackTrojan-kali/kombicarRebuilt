import React, { useEffect, useState } from 'react';
import { useAdminVtcDriver } from '../../../contexts/Admin/VTCcontexts/useAdminVtcDriver';

export const DriverDetailView = ({ driverId, onBack }) => {
  const { 
    getDriverDetails, 
    getDriverDocuments, 
    validateDriver, 
    blockDriver, 
    isLoading, 
    error 
  } = useAdminVtcDriver();

  const [driver, setDriver] = useState(null);
  const [documents, setDocuments] = useState([]);

  // Chargement simultané des détails du profil et des documents
  useEffect(() => {
    if (!driverId) return;

    const fetchData = async () => {
      const fetchedDetails = await getDriverDetails(driverId);
      const fetchedDocs = await getDriverDocuments(driverId);
      
      if (fetchedDetails) setDriver(fetchedDetails);
      if (fetchedDocs) setDocuments(fetchedDocs);
    };

    fetchData();
  }, [driverId, getDriverDetails, getDriverDocuments]);

  // Actions d'administration
  const handleValidate = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir valider ce chauffeur ?")) {
      const isSuccess = await validateDriver(driverId);
      if (isSuccess) {
        alert("Chauffeur validé avec succès !");
        setDriver((prev) => ({ ...prev, isValidated: true }));
      }
    }
  };

  const handleBlock = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir bloquer ce chauffeur ?")) {
      const isSuccess = await blockDriver(driverId);
      if (isSuccess) {
        alert("Chauffeur bloqué !");
        setDriver((prev) => ({ ...prev, isValidated: false })); // Ou isBlocked selon votre logique métier
      }
    }
  };

  // Gestion de l'état de chargement initial
  if (isLoading && !driver) {
    return <p>Chargement des informations du chauffeur...</p>;
  }

  // Si le chauffeur n'a pas pu être chargé
  if (!driver) {
    return (
      <div>
        <button onClick={onBack}>⬅ Retour à la liste</button>
        <p style={{ color: 'red' }}>Impossible de charger les données du chauffeur.</p>
        {error && <p>Détail de l'erreur : {error.description}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <button onClick={onBack} style={{ marginBottom: '20px' }}>⬅ Retour à la liste</button>
      
      {/* 1. EN-TÊTE DU PROFIL */}
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {driver.pictureProfileUrl ? (
            <img 
              src={driver.pictureProfileUrl} 
              alt="Profil" 
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#eee' }} />
          )}
          
          <div style={{ flexGrow: 1 }}>
            <h2 style={{ margin: '0 0 5px 0' }}>{driver.firstName} {driver.lastName}</h2>
            <p style={{ margin: '0', color: '#666' }}>{driver.email} • {driver.phoneNumber}</p>
            <p style={{ margin: '5px 0 0 0' }}>
              <strong>Statut : </strong> 
              {driver.isValidated ? "✅ Validé" : "⏳ En attente"} | 
              {driver.isOnline ? " 🟢 En ligne" : " 🔴 Hors ligne"}
            </p>
          </div>

          {/* Boutons d'action rapides */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {!driver.isValidated && (
              <button onClick={handleValidate} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px' }}>
                Approuver
              </button>
            )}
            <button onClick={handleBlock} style={{ backgroundColor: '#f44336', color: 'white', padding: '10px' }}>
              Bloquer
            </button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
          <div><strong>Note :</strong> {driver.rating} ⭐ ({driver.reviewsCount} avis)</div>
          <div><strong>Solde :</strong> {driver.balance} €</div>
        </div>
      </div>

      {/* 2. VÉHICULES */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Véhicules associés ({driver.vehicules?.length || 0})</h3>
        {driver.vehicules?.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {driver.vehicules.map((vehicule) => (
              <div key={vehicule.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{vehicule.brand} {vehicule.model}</h4>
                <p style={{ margin: '0' }}><strong>Immatriculation :</strong> {vehicule.registrationCode}</p>
                <p style={{ margin: '0' }}><strong>Couleur :</strong> {vehicule.color} • <strong>Places :</strong> {vehicule.numberPlaces}</p>
                <p style={{ margin: '0' }}><strong>Catégorie :</strong> {vehicule.vtcVehicleType?.name || 'Standard'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun véhicule enregistré.</p>
        )}
      </div>

      {/* 3. DOCUMENTS */}
      <div>
        <h3>Documents soumis ({documents?.length || 0})</h3>
        {documents?.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '10px' }}>Nom du document</th>
                <th style={{ padding: '10px' }}>Date de soumission</th>
                <th style={{ padding: '10px' }}>Véhicule lié</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{doc.name}</td>
                  <td style={{ padding: '10px' }}>{new Date(doc.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '10px' }}>{doc.vehiculeId ? `ID: ${doc.vehiculeId}` : 'Général'}</td>
                  <td style={{ padding: '10px' }}>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc' }}>
                      👁️ Voir le fichier
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun document soumis pour le moment.</p>
        )}
      </div>
    </div>
  );
};