import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faExclamationTriangle, faSearch, faEye, 
    faFilter, faChevronLeft, faChevronRight, faUserShield
} from '@fortawesome/free-solid-svg-icons';
import { useAdminVtcSupport } from '../../../contexts/Admin/VTCcontexts/useAdminVtcSupport';

// Dictionnaire pour l'affichage lisible des statuts de litiges
const DISPUTE_STATUS_MAP = {
    0: { label: 'Ouvert', style: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    1: { label: 'En cours d\'examen', style: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    2: { label: 'Résolu', style: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    3: { label: 'Fermé / Rejeté', style: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }
};

export default function VtcAdminDisputes() {
    const { disputes, disputesPagination, isLoadingDisputes, fetchDisputes } = useAdminVtcSupport();
    const navigate = useNavigate();

    // États locaux
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Chargement des données à l'initialisation et au changement de page
    useEffect(() => {
        loadData(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // Fonction centralisée d'appel API
    const loadData = (pageIndex) => {
        fetchDisputes({
            page: pageIndex,
            pageSize: 12,
            status: statusFilter !== '' ? parseInt(statusFilter, 10) : undefined
        });
    };

    // Soumission du filtre
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        if (currentPage === 1) {
            loadData(1);
        } else {
            setCurrentPage(1); // Déclenchera le useEffect
        }
    };

    // Réinitialisation des filtres
    const resetFilters = () => {
        setStatusFilter('');
        setCurrentPage(1);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-full transition-colors duration-200">
            {/* --- EN-TÊTE --- */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 dark:text-red-400" />
                    Gestion des Litiges VTC
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Consultez et traitez les réclamations signalées par les passagers ou les chauffeurs.
                </p>
            </div>

            {/* --- PANNEAU DE FILTRES --- */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 transition-colors duration-200">
                <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
                    <FontAwesomeIcon icon={faFilter} className="text-gray-400 dark:text-gray-500" /> Filtrer les réclamations
                </div>
                
                <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Statut du litige</label>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)} 
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        >
                            <option value="">Tous les statuts</option>
                            {Object.entries(DISPUTE_STATUS_MAP).map(([val, { label }]) => (
                                <option key={val} value={val}>{val} - {label}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                        <button type="submit" className="flex-1 md:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2">
                            <FontAwesomeIcon icon={faSearch} /> Filtrer
                        </button>
                        <button type="button" onClick={resetFilters} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors" title="Réinitialiser">
                            X
                        </button>
                    </div>
                </form>
            </div>

            {/* --- TABLEAU DES LITIGES --- */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                                <th className="p-4">Date du signalement</th>
                                <th className="p-4">Plaignant</th>
                                <th className="p-4 w-1/3">Motif de la plainte</th>
                                <th className="p-4 text-center">Statut</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {isLoadingDisputes ? (
                                <tr><td colSpan="5" className="p-10 text-center text-gray-500 dark:text-gray-400">Chargement des litiges...</td></tr>
                            ) : disputes.length === 0 ? (
                                <tr><td colSpan="5" className="p-10 text-center text-gray-500 dark:text-gray-400">Aucun litige trouvé.</td></tr>
                            ) : (
                                disputes.map((dispute) => {
                                    const badge = DISPUTE_STATUS_MAP[dispute.status] || { label: 'Inconnu', style: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' };
                                    return (
                                        <tr 
                                            key={dispute.id} 
                                            onClick={() => navigate(`/admin/vtc/support/disputes/${dispute.id}`)}
                                            className="hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer group"
                                        >
                                            {/* Date */}
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {new Date(dispute.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(dispute.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>

                                            {/* Plaignant */}
                                            <td className="p-4">
                                                <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faUserShield} className="text-gray-400 dark:text-gray-500" />
                                                    {dispute.reporterName || 'Utilisateur inconnu'}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[150px]" title={`Ride ID: ${dispute.rideId}`}>
                                                    Course: {dispute.rideId.substring(0, 8)}...
                                                </div>
                                            </td>

                                            {/* Motif */}
                                            <td className="p-4">
                                                <div className="text-sm text-gray-800 dark:text-gray-200 font-medium line-clamp-2" title={dispute.reason}>
                                                    {dispute.reason}
                                                </div>
                                            </td>

                                            {/* Statut */}
                                            <td className="p-4 text-center whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badge.style}`}>
                                                    {badge.label}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4 text-right whitespace-nowrap">
                                                <button 
                                                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                    title="Examiner le litige"
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

                {/* --- PAGINATION --- */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total : <span className="font-semibold text-gray-900 dark:text-white">{disputesPagination.totalCount}</span> litiges
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={!disputesPagination.hasPreviousPage}
                            onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => prev - 1); }}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Page {disputesPagination.page}
                        </span>
                        <button
                            disabled={!disputesPagination.hasNextPage}
                            onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => prev + 1); }}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}