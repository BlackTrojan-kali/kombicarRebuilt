import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import usePromoCode from '../../../hooks/usePromoCode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faEdit, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import CreatePromoCodeModal from '../../../Components/Modals/CreatePromoCodeModal';

const PromoCode = () => {
  // Utilisation du hook pour accéder aux fonctions du contexte
  const { listAllPromoCodes, deletePromoCode } = usePromoCode();
  
  // États pour stocker les données et l'état de chargement
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour la modale de création
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fonction pour charger les données des codes promo
  const fetchPromoCodes = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAllPromoCodes(page);
      setPromoCodes(data.items);
      setTotalPages(Math.ceil(data.totalCount / 10)); // Supposons 10 items par page
      setTotalCount(data.totalCount);
    } catch (err) {
      setError("Impossible de charger les codes promotionnels.");
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial et re-chargement lors du changement de page
  useEffect(() => {
    fetchPromoCodes(currentPage);
  }, [currentPage]);

  // Fonctions de gestion de la modale de création
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    fetchPromoCodes(currentPage); // Rafraîchit la liste après la création
  };

  // 🆕 Gestion de la suppression sans modale de confirmation
  const handleDelete = async (id) => {
    try {
      await deletePromoCode(id);
      fetchPromoCodes(currentPage); // Recharger les données
    } catch (err) {
      setError("Échec de la suppression du code.");
    }
  };
  
  if (loading) {
    return <div className="p-4 text-center"><FontAwesomeIcon icon={faSpinner} spin className="mr-2"/> Chargement des codes promotionnels...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Erreur : {error}</div>;
  }

  return (
    <div className="p-4">
      {/* Titre et bouton d'ajout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Codes Promotionnels</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Créer un code promo
        </button>
      </div>

      {/* Tableau des codes promo */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="px-5 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-xs font-semibold uppercase tracking-wider">Nom</th>
              <th className="px-5 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-xs font-semibold uppercase tracking-wider">Réduction</th>
              <th className="px-5 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-xs font-semibold uppercase tracking-wider">Disponibilité</th>
              <th className="px-5 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-xs font-semibold uppercase tracking-wider">Expiration</th>
              <th className="px-5 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.map((code) => (
              <tr key={code.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">{code.name}</td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">{code.reductionPercent}%</td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">{code.availability}</td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                  {new Date(code.expiredAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm text-right">
                  <Link to={`/admin/promocodes/details/${code.id}`} className="text-blue-600 hover:text-blue-800 mr-3">
                    <FontAwesomeIcon icon={faEye} />
                  </Link>
                  <Link to={`/admin/promocodes/details/${code.id}`} className="text-green-600 hover:text-green-800 mr-3">
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                  <button onClick={() => handleDelete(code.id)} className="text-red-600 hover:text-red-800">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contrôles de pagination */}
      <div className="flex justify-between items-center mt-6">
        <span>Page {currentPage} de {totalPages} ({totalCount} codes au total)</span>
        <div>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border dark:border-gray-600 disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage >= totalPages}
            className="ml-2 px-4 py-2 rounded-lg border dark:border-gray-600 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
      {/* Modales */}
      <CreatePromoCodeModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />
    </div>
  );
};

export default PromoCode;