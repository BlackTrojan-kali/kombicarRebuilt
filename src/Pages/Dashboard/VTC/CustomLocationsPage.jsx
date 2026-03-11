import React, { useEffect, useState } from 'react';
import { useCustomLocation } from '../../../contexts/Admin/VTCcontexts/useCustomLocations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../../hooks/useAuth';
import CreateCustomLocation from '../../../Components/Modals/CreateCustomLocation';

const CustomLocationsPage = () => {
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  
  // États pour la modale
  const [openCreateCustomLocationModal, setOpenCreateCustomLocationModal] = useState(false);
  const [locationToEdit, setLocationToEdit] = useState(null);

  const { 
    isLoading, 
    locations, 
    fetchLocations, 
    pagination,
    deleteLocation
  } = useCustomLocation();

  // Chargement des données. 
  // Attention: On ne met surtout pas 'pagination' dans le tableau de dépendances pour éviter une boucle infinie.
  useEffect(() => {
    fetchLocations(page, 20, user?.country);
  }, [page, user?.country, fetchLocations]);

  // Actions pour ouvrir/fermer la modale
  const handleOpenCreateModal = () => {
    setLocationToEdit(null);
    setOpenCreateCustomLocationModal(true); // Correction : c'était à false dans votre code
  };

  const handleOpenEditModal = (location) => {
    setLocationToEdit(location);
    setOpenCreateCustomLocationModal(true);
  };

  const handleCloseModal = () => {
    setOpenCreateCustomLocationModal(false);
    setLocationToEdit(null);
    // On rafraîchit la liste après la fermeture de la modale
    fetchLocations(page, 20, user?.country);
  };

  // Suppression d'un lieu
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet emplacement ?")) {
      await deleteLocation(id);
      fetchLocations(page, 20, user?.country);
    }
  };

  // Affichage du loader
  if (isLoading && (!locations || locations.length === 0)) {
    return (
      <div className='flex justify-center min-h-screen text-slate-900 dark:text-white'>
        <div className='mt-[20%] flex gap-2 '>
          <FontAwesomeIcon icon={faSpinner} spin className='text-4xl' />
          <p className='text-2xl'>Chargement ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Lieux Personnalisés</h1>
          <p>Gérez vos lieux personnalisés</p>
        </div>
        <div className='flex gap-2'>
          <button 
            onClick={handleOpenCreateModal}
            className='mt-3 bg-green-500 hover:bg-green-600 transition p-2 rounded-md text-white'
          >
            Créer un Lieu
          </button>
        </div>
      </div>

      <div className='border-2 p-6 rounded-md bg-white dark:bg-gray-200/5 mt-5 shadow'>
        <h1 className='flex gap-2 font-bold text-xl items-center'>
          Lieux 
          <span className='font-light text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full ml-2'>
            {/* Sécurisation pour éviter l'erreur "undefined" */}
            ({pagination?.totalCount || locations?.length || 0})
          </span>
        </h1>

        <div className='border-2 border-gray-200 dark:border-gray-700 rounded-md mt-4 w-full overflow-x-auto'>
          <table className='w-full border-collapse text-left'>
            <thead className='bg-gray-100 dark:bg-gray-800'>
              <tr>
                <th className='p-3 border-b'>Nom</th>
                <th className='p-3 border-b'>Adresse</th>
                <th className='p-3 border-b'>Pays</th>
                <th className='p-3 border-b'>Alias</th>
                <th className='p-3 border-b text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations && locations.length > 0 ? (
                locations.map((location) => (
                  <tr key={location.id} className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'>
                    <td className='p-3'>{location.name}</td>
                    <td className='p-3'>{location.address}</td>
                    <td className='p-3'>{location.country}</td>
                    <td className='p-3'>{location.aliases || '-'}</td>
                    <td className='p-3 flex justify-center gap-4'>
                      <button 
                        onClick={() => handleOpenEditModal(location)}
                        className='text-blue-500 hover:text-blue-700'
                        title="Modifier"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        onClick={() => handleDelete(location.id)}
                        className='text-red-500 hover:text-red-700'
                        title="Supprimer"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    Aucun emplacement trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale */}
      <CreateCustomLocation 
        isOpen={openCreateCustomLocationModal} 
        onClose={handleCloseModal}
        locationToEdit={locationToEdit}
      />
    </div>
  );
};

export default CustomLocationsPage;