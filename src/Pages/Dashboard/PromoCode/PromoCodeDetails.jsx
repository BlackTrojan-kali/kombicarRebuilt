import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import usePromoCode from '../../../hooks/usePromoCode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faEdit, faInfoCircle, faPercent, faTag, faCalendarTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import EditPromoCodeModal from '../../../Components/Modals/EditPromoCodeModal'; // Import de la modale d'édition

const PromoCodeDetails = () => {
  // Récupère l'ID depuis les paramètres de l'URL
  const { id } = useParams();
  // Accède à la fonction de récupération par ID depuis le contexte
  const { getPromoCodeById } = usePromoCode();

  // États pour les détails, le chargement et les erreurs
  const [promoCode, setPromoCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Clé pour forcer le re-rendu/re-fetch

  const fetchPromoCode = async () => {
    setLoading(true);
    try {
      const data = await getPromoCodeById(id);
      setPromoCode(data);
    } catch (err) {
      setError("Impossible de charger les détails du code promotionnel.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Si un ID est présent, lance la récupération des données
    if (id) {
      fetchPromoCode();
    }
  }, [id, getPromoCodeById, refreshKey]); // Ajout de refreshKey aux dépendances pour rafraîchir les données

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setRefreshKey(prevKey => prevKey + 1); // Incrémente la clé pour déclencher un re-fetch
  };

  if (loading) {
    return <div className="p-4 text-center"><FontAwesomeIcon icon={faSpinner} spin className="mr-2" />Chargement des détails...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Erreur : {error}</div>;
  }
  
  if (!promoCode) {
    return <div className="p-4 text-center text-gray-600">Code promotionnel non trouvé.</div>;
  }

  return (
    <div className="p-4">
      {/* Boutons de navigation et d'action */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/admin/promocodes/list/all" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <FontAwesomeIcon icon={faChevronLeft} /> Retour à la liste
        </Link>
        <button 
          onClick={openEditModal}
          className="bg-green-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
        >
          <FontAwesomeIcon icon={faEdit} />
          Modifier
        </button>
      </div>

      {/* Carte des détails du code promo */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Détails du Code Promo</h1>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <FontAwesomeIcon icon={faTag} className="text-blue-500" />
            <span className="font-medium">Nom :</span>
            <span className="flex-1 text-right">{promoCode.name}</span>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <FontAwesomeIcon icon={faPercent} className="text-blue-500" />
            <span className="font-medium">Réduction :</span>
            <span className="flex-1 text-right">{promoCode.reductionPercent}%</span>
          </div>
          
          <div className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />
            <span className="font-medium">Disponibilité :</span>
            <span className="flex-1 text-right">{promoCode.availability}</span>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <FontAwesomeIcon icon={faCalendarTimes} className="text-blue-500" />
            <span className="font-medium">Date d'expiration :</span>
            <span className="flex-1 text-right">{new Date(promoCode.expiredAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      {/* Intégration de la modale d'édition */}
      <EditPromoCodeModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        promoCodeId={id}
      />
    </div>
  );
};

export default PromoCodeDetails;