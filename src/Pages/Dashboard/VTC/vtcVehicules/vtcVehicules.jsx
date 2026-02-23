import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCheckCircle, faTimesCircle, faClock, faCar, 
    faChevronLeft, faChevronRight, faIdCard 
} from '@fortawesome/free-solid-svg-icons'; // Ajustez le chemin
import { useVtcVehicles } from '../../../../contexts/Admin/VTCcontexts/useVtcVehicles';

const VtcVehicules = () => {
    // Utilisation de notre hook personnalisé
    const { vehicles, loading, pagination, fetchVtcVehicles, validateVtcVehicle } = useVtcVehicles();

    // États locaux pour l'interface
    const [filterVerified, setFilterVerified] = useState('all'); // 'all', 'true', 'false'
    const [currentPage, setCurrentPage] = useState(1);
    
    // États pour la modale de validation
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    // Catégories VTC fictives pour l'exemple (à remplacer par un appel API si vous avez un endpoint pour lister les catégories)
    const vtcCategories = [
        { id: 1, name: 'Standard' },
        { id: 2, name: 'Premium / Berline' },
        { id: 3, name: 'Van / XL' }
    ];

    // Chargement initial et rechargement lors du changement de filtres ou de page
    useEffect(() => {
        let isVerifiedParam = undefined;
        if (filterVerified === 'true') isVerifiedParam = true;
        if (filterVerified === 'false') isVerifiedParam = false;

        fetchVtcVehicles({ 
            page: currentPage, 
            isVerified: isVerifiedParam 
        });
    }, [filterVerified, currentPage, fetchVtcVehicles]);

    // Gestion du changement de filtre
    const handleFilterChange = (value) => {
        setFilterVerified(value);
        setCurrentPage(1); // On revient à la première page quand on change de filtre
    };

    // Ouverture de la modale
    const openValidationModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        setSelectedCategoryId(vehicle.vtcVehicleTypeId || ''); // Pré-sélectionne la catégorie existante si elle existe
        setIsModalOpen(true);
    };

    // Soumission de la validation
    const handleValidationSubmit = async (e) => {
        e.preventDefault();
        const categoryId = selectedCategoryId ? parseInt(selectedCategoryId) : null;
        
        const success = await validateVtcVehicle(selectedVehicle.id, categoryId);
        if (success) {
            setIsModalOpen(false);
            setSelectedVehicle(null);
        }
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
            {/* En-tête de la page */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FontAwesomeIcon icon={faCar} className="text-blue-600" />
                        Flotte VTC
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Gérez les véhicules et validez les chauffeurs pour le service VTC.
                    </p>
                </div>

                {/* Filtres de statut */}
                <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    {['all', 'true', 'false'].map((status) => (
                        <button
                            key={status}
                            onClick={() => handleFilterChange(status)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                filterVerified === status
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            {status === 'all' && 'Tous'}
                            {status === 'true' && 'Vérifiés'}
                            {status === 'false' && 'En attente'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tableau des véhicules */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                                <th className="p-4">Chauffeur</th>
                                <th className="p-4">Véhicule</th>
                                <th className="p-4">Immatriculation</th>
                                <th className="p-4">Catégorie VTC</th>
                                <th className="p-4">Statut</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        Chargement des véhicules...
                                    </td>
                                </tr>
                            ) : vehicles.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        Aucun véhicule trouvé pour ces critères.
                                    </td>
                                </tr>
                            ) : (
                                vehicles.map((vehicle) => (
                                    <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/25 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {vehicle.driverPhotoUrl ? (
                                                    <img src={vehicle.driverPhotoUrl} alt="Chauffeur" className="w-10 h-10 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                                        <FontAwesomeIcon icon={faIdCard} />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                        {vehicle.driverFirstName} {vehicle.driverLastName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Note: {vehicle.driverRating} ★</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                                            <span className="font-medium">{vehicle.brand}</span> {vehicle.model}
                                            <span className="block text-xs text-gray-500">{vehicle.color}</span>
                                        </td>
                                        <td className="p-4 text-sm font-mono text-gray-700 dark:text-gray-300">
                                            {vehicle.registrationCode}
                                        </td>
                                        <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                                            {vehicle.vtcVehicleTypeName || <span className="text-gray-400 italic">Non assignée</span>}
                                        </td>
                                        <td className="p-4">
                                            {vehicle.isVerified ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                                    <FontAwesomeIcon icon={faCheckCircle} /> Validé
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                                                    <FontAwesomeIcon icon={faClock} /> En attente
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {!vehicle.isVerified && (
                                                <button
                                                    onClick={() => openValidationModal(vehicle)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                                >
                                                    Valider
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total : <span className="font-semibold text-gray-900 dark:text-white">{pagination.totalCount}</span> véhicules
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={!pagination.hasPreviousPage}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Page {pagination.page}
                        </span>
                        <button
                            disabled={!pagination.hasNextPage}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modale de validation */}
            {isModalOpen && selectedVehicle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Valider le véhicule</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Vous êtes sur le point de valider le véhicule <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedVehicle.brand} {selectedVehicle.model}</span> de {selectedVehicle.driverFirstName}.
                            </p>

                            <form onSubmit={handleValidationSubmit}>
                                <div className="mb-6">
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Catégorie VTC (Optionnel)
                                    </label>
                                    <select
                                        id="category"
                                        value={selectedCategoryId}
                                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    >
                                        <option value="">-- Conserver la catégorie actuelle --</option>
                                        {vtcCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
                                    >
                                        Confirmer la validation
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VtcVehicules;