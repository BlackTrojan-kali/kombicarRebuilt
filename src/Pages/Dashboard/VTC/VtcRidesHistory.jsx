import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faMapMarkedAlt, faSearch, faFilter, faEye, 
    faChevronLeft, faChevronRight, faCalendarAlt, faCarSide
} from '@fortawesome/free-solid-svg-icons';
import { useAdminVtc } from '../../../contexts/Admin/VTCcontexts/useAdminVtc';

// Utilitaire pour le style et le libellé des statuts
const getStatusBadge = (status) => {
    switch (status) {
        case 0: return { label: 'Demandée', style: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
        case 1: return { label: 'Enchères', style: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' };
        case 2: return { label: 'Assignée', style: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
        case 3: return { label: 'Chauffeur arrivé', style: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' };
        case 4: return { label: 'En cours', style: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' };
        case 5: return { label: 'Terminée', style: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
        case 6: return { label: 'Annulée', style: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
        case 7: return { label: 'Expirée', style: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' };
        default: return { label: 'Inconnu', style: 'bg-gray-100 text-gray-600' };
    }
};

const VtcRidesHistory = () => {
    const { rides, loadingRides, pagination, fetchRides } = useAdminVtc();

    // États du formulaire de filtres
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
        driverId: '',
        passengerId: ''
    });
    const [currentPage, setCurrentPage] = useState(1);

    // Chargement initial et lors du changement de page
    useEffect(() => {
        loadData(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // Fonction d'appel avec les filtres actuels
    const loadData = (page) => {
        const queryParams = { page, pageSize: 12 };
        if (filters.status !== '') queryParams.status = parseInt(filters.status, 10);
        if (filters.startDate) queryParams.startDate = new Date(filters.startDate).toISOString();
        if (filters.endDate) queryParams.endDate = new Date(filters.endDate).toISOString();
        if (filters.driverId) queryParams.driverId = filters.driverId;
        if (filters.passengerId) queryParams.passengerId = filters.passengerId;

        fetchRides(queryParams);
    };

    // Gestion de la soumission du formulaire de filtres
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        if (currentPage === 1) {
            loadData(1);
        } else {
            setCurrentPage(1); // Retour à la page 1 qui déclenchera le useEffect
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const resetFilters = () => {
        setFilters({ status: '', startDate: '', endDate: '', driverId: '', passengerId: '' });
        setCurrentPage(1);
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
            {/* En-tête */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkedAlt} className="text-blue-600" />
                    Historique des Courses VTC
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Consultez, filtrez et analysez toutes les courses passées et en cours sur la plateforme.
                </p>
            </div>

            {/* Panneau de filtres */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6">
                <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
                    <FontAwesomeIcon icon={faFilter} /> Filtres de recherche
                </div>
                <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    
                    {/* Statut */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Statut de la course</label>
                        <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 outline-none">
                            <option value="">Tous les statuts</option>
                            <option value="0">0 - Demandée</option>
                            <option value="1">1 - Enchères en cours</option>
                            <option value="2">2 - Chauffeur assigné</option>
                            <option value="3">3 - Chauffeur arrivé</option>
                            <option value="4">4 - En cours (Trajet)</option>
                            <option value="5">5 - Terminée (Succès)</option>
                            <option value="6">6 - Annulée</option>
                            <option value="7">7 - Expirée</option>
                        </select>
                    </div>

                    {/* Date de début */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Depuis le</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-2.5 text-gray-400 text-sm" />
                            <input type="datetime-local" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 outline-none" />
                        </div>
                    </div>

                    {/* Date de fin */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Jusqu'au</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-2.5 text-gray-400 text-sm" />
                            <input type="datetime-local" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 outline-none" />
                        </div>
                    </div>

                    {/* Chauffeur */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">ID Chauffeur</label>
                        <input type="text" name="driverId" value={filters.driverId} onChange={handleFilterChange} placeholder="UUID..." className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex items-end gap-2">
                        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2">
                            <FontAwesomeIcon icon={faSearch} /> Filtrer
                        </button>
                        <button type="button" onClick={resetFilters} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors" title="Réinitialiser">
                            X
                        </button>
                    </div>
                </form>
            </div>

            {/* Tableau des résultats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                                <th className="p-4">Détails de la course</th>
                                <th className="p-4">Passager</th>
                                <th className="p-4">Chauffeur</th>
                                <th className="p-4">Tarif & Paiement</th>
                                <th className="p-4">Statut</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loadingRides ? (
                                <tr><td colSpan="6" className="p-10 text-center text-gray-500">Chargement de l'historique...</td></tr>
                            ) : rides.length === 0 ? (
                                <tr><td colSpan="6" className="p-10 text-center text-gray-500">Aucune course trouvée pour ces critères.</td></tr>
                            ) : (
                                rides.map((ride) => {
                                    const badge = getStatusBadge(ride.status);
                                    return (
                                        <tr key={ride.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/25 transition-colors">
                                            
                                            {/* Détails logistiques */}
                                            <td className="p-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]" title={ride.pickupAddress}>
                                                    A: {ride.pickupAddress || 'Non spécifié'}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]" title={ride.dropoffAddress}>
                                                    B: {ride.dropoffAddress || 'Non spécifié'}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {new Date(ride.orderedAt).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}
                                                </div>
                                            </td>

                                            {/* Passager */}
                                            <td className="p-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {ride.passengerFullName || 'Inconnu'}
                                                </div>
                                                <div className="text-xs text-gray-500">{ride.passengerPhone}</div>
                                            </td>

                                            {/* Chauffeur */}
                                            <td className="p-4">
                                                {ride.driverId ? (
                                                    <>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                                                            <FontAwesomeIcon icon={faCarSide} className="text-gray-400" />
                                                            {ride.driverFullName}
                                                        </div>
                                                        <div className="text-xs text-gray-500">Assigné</div>
                                                    </>
                                                ) : (
                                                    <span className="text-xs italic text-gray-400">En attente</span>
                                                )}
                                            </td>

                                            {/* Tarif */}
                                            <td className="p-4">
                                                <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {ride.finalPrice > 0 ? ride.finalPrice : ride.agreedPrice > 0 ? ride.agreedPrice : ride.estimatedPrice} FCFA
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {ride.paymentMethod === 0 ? 'Cash' : ride.paymentMethod === 1 ? 'Mobile Money' : 'Carte/Wallet'}
                                                </div>
                                            </td>

                                            {/* Statut */}
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badge.style}`}>
                                                    {badge.label}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4 text-right">
                                                <button 
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                    title="Voir les détails complets"
                                                    // TODO : Rediriger vers la page détails ou ouvrir une modale avec fetchRideDetails(ride.id)
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total : <span className="font-semibold text-gray-900 dark:text-white">{pagination.totalCount}</span> courses
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
        </div>
    );
};

export default VtcRidesHistory;