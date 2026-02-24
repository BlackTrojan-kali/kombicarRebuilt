import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminVtc } from '../../../contexts/Admin/VTCcontexts/useAdminVtc';

// Dictionnaire pour l'affichage lisible des statuts avec mode sombre
const STATUS_MAP = {
    0: { label: 'Demandé', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
    1: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
    2: { label: 'Assigné', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    3: { label: 'Arrivé', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' },
    4: { label: 'En cours', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    5: { label: 'Terminé', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
    6: { label: 'Annulé', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    7: { label: 'Expiré', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' }
};

export default function AdminRidesPage() {
    const { rides, loadingRides, pagination, fetchRides } = useAdminVtc();
    const navigate = useNavigate();

    // États locaux pour les filtres
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
        driverId: '',
        passengerId: ''
    });

    // Chargement initial et réaction au changement de page
    useEffect(() => {
        loadData(pagination.page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page]);

    // Fonction centralisée pour appeler le hook avec les bons paramètres
    const loadData = (pageIndex) => {
        const queryParams = { page: pageIndex, pageSize: 12 };
        
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
        loadData(1); // On reset à la page 1 lors d'une nouvelle recherche
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-full transition-colors duration-200">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Historique des Courses VTC</h1>

            {/* --- SECTION FILTRES --- */}
            <form onSubmit={handleFilterSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 transition-colors duration-200">
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                    <select 
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                        <option value="">Tous les statuts</option>
                        {Object.entries(STATUS_MAP).map(([val, { label }]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">ID Chauffeur</label>
                    <input type="text" placeholder="UUID..." className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        value={filters.driverId} onChange={(e) => setFilters({...filters, driverId: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">ID Passager</label>
                    <input type="text" placeholder="UUID..." className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        value={filters.passengerId} onChange={(e) => setFilters({...filters, passengerId: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Date de début</label>
                    <input type="datetime-local" className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Date de fin</label>
                    <input type="datetime-local" className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} />
                </div>
                <div className="flex items-end">
                    <button type="submit" className="w-full bg-blue-600 text-white font-medium rounded-lg p-2 text-sm hover:bg-blue-700 transition-colors shadow-sm">
                        Filtrer
                    </button>
                </div>
            </form>

            {/* --- SECTION TABLEAU --- */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto transition-colors duration-200">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Statut</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Passager</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chauffeur</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trajet</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prix</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                        {loadingRides ? (
                            <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">Chargement des courses...</td></tr>
                        ) : rides.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">Aucune course trouvée.</td></tr>
                        ) : (
                            rides.map((ride) => (
                                <tr 
                                    key={ride.id} 
                                    onClick={() => navigate(`/admin/vtc/rides/${ride.id}`)}
                                    className="hover:bg-blue-50 dark:hover:bg-gray-700/40 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white font-medium">{new Date(ride.orderedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}</div>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mt-1 ${STATUS_MAP[ride.status]?.color || 'bg-gray-100 dark:bg-gray-700'}`}>
                                            {STATUS_MAP[ride.status]?.label || ride.statusLabel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{ride.passengerFullName || 'N/A'}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{ride.passengerPhone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{ride.driverFullName || 'Non assigné'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-gray-900 dark:text-gray-300 truncate max-w-xs" title={ride.pickupAddress}>
                                            <span className="font-bold text-green-600 dark:text-green-400">A:</span> {ride.pickupAddress}
                                        </div>
                                        <div className="text-xs text-gray-900 dark:text-gray-300 truncate max-w-xs mt-1" title={ride.dropoffAddress}>
                                            <span className="font-bold text-red-600 dark:text-red-400">B:</span> {ride.dropoffAddress}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-bold">
                                        {ride.finalPrice > 0 ? ride.finalPrice : ride.estimatedPrice} CFA
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <span className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 group-hover:underline">Détails</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- SECTION PAGINATION --- */}
            <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    Total : <span className="font-medium dark:text-white">{pagination.totalCount}</span> courses
                </span>
                <div className="flex gap-2">
                    <button 
                        disabled={!pagination.hasPreviousPage}
                        onClick={() => loadData(pagination.page - 1)}
                        className={`px-4 py-2 text-sm border rounded-lg transition-colors ${!pagination.hasPreviousPage ? 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        Précédent
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Page {pagination.page}
                    </span>
                    <button 
                        disabled={!pagination.hasNextPage}
                        onClick={() => loadData(pagination.page + 1)}
                        className={`px-4 py-2 text-sm border rounded-lg transition-colors ${!pagination.hasNextPage ? 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
}