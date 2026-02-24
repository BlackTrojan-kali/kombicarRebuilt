import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faStar, faSearch, faFilter, faChevronLeft, 
    faChevronRight, faArrowRight, faInfoCircle 
} from '@fortawesome/free-solid-svg-icons';
import { useAdminVtcSupport } from '../../../contexts/Admin/VTCcontexts/useAdminVtcSupport';

// Composant utilitaire pour afficher les étoiles
const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon 
                    key={star} 
                    icon={faStar} 
                    className={`text-xs ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                />
            ))}
            <span className="ml-1 text-xs font-bold text-gray-700 dark:text-gray-300">{rating}/5</span>
        </div>
    );
};

export default function VtcAdminReviews() {
    const { reviews, reviewsPagination, isLoadingReviews, fetchReviews } = useAdminVtcSupport();
    const navigate = useNavigate();

    // États des filtres
    const [minRating, setMinRating] = useState('');
    const [maxRating, setMaxRating] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Chargement initial et au changement de page
    useEffect(() => {
        loadData(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const loadData = (pageIndex) => {
        fetchReviews({
            page: pageIndex,
            pageSize: 12,
            minRating: minRating !== '' ? parseInt(minRating, 10) : undefined,
            maxRating: maxRating !== '' ? parseInt(maxRating, 10) : undefined
        });
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        if (currentPage === 1) {
            loadData(1);
        } else {
            setCurrentPage(1); // Retour à la page 1, ce qui déclenchera le useEffect
        }
    };

    const resetFilters = () => {
        setMinRating('');
        setMaxRating('');
        setCurrentPage(1);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-full transition-colors duration-200">
            {/* --- EN-TÊTE --- */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-500 dark:text-yellow-400" />
                    Modération des Avis VTC
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Surveillez la qualité du service en analysant les évaluations laissées après chaque course.
                </p>
            </div>

            {/* --- PANNEAU DE FILTRES --- */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 transition-colors duration-200">
                <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
                    <FontAwesomeIcon icon={faFilter} className="text-gray-400 dark:text-gray-500" /> Filtrer par notes
                </div>
                
                <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Note minimale</label>
                        <select 
                            value={minRating} 
                            onChange={(e) => setMinRating(e.target.value)} 
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                        >
                            <option value="">Peu importe</option>
                            {[1, 2, 3, 4, 5].map(val => <option key={val} value={val}>{val} étoile{val > 1 ? 's' : ''} ou plus</option>)}
                        </select>
                    </div>

                    <div className="flex-1 w-full">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Note maximale</label>
                        <select 
                            value={maxRating} 
                            onChange={(e) => setMaxRating(e.target.value)} 
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                        >
                            <option value="">Peu importe</option>
                            {[1, 2, 3, 4, 5].map(val => <option key={val} value={val}>{val} étoile{val > 1 ? 's' : ''} ou moins</option>)}
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

            {/* --- TABLEAU DES AVIS --- */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                                <th className="p-4">Date</th>
                                <th className="p-4">Évaluation</th>
                                <th className="p-4 w-2/5">Commentaire</th>
                                <th className="p-4">Note attribuée</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {isLoadingReviews ? (
                                <tr><td colSpan="5" className="p-10 text-center text-gray-500 dark:text-gray-400">Chargement des avis...</td></tr>
                            ) : reviews.length === 0 ? (
                                <tr><td colSpan="5" className="p-10 text-center text-gray-500 dark:text-gray-400">Aucun avis trouvé pour ces critères.</td></tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                                        
                                        {/* Date */}
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                                            </div>
                                        </td>

                                        {/* Acteurs de l'évaluation */}
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]" title={review.authorName}>
                                                    {review.authorName}
                                                </span>
                                                <FontAwesomeIcon icon={faArrowRight} className="text-gray-400 text-xs" />
                                                <span className="font-medium text-gray-600 dark:text-gray-300 truncate max-w-[120px]" title={review.targetName}>
                                                    {review.targetName}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Course : {review.vtcRideId.substring(0, 8)}...
                                            </div>
                                        </td>

                                        {/* Commentaire */}
                                        <td className="p-4">
                                            {review.comment ? (
                                                <div className="text-sm text-gray-700 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded border border-gray-100 dark:border-gray-700">
                                                    "{review.comment}"
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 dark:text-gray-500 italic">Aucun commentaire textuel.</span>
                                            )}
                                        </td>

                                        {/* Note Etoiles */}
                                        <td className="p-4 whitespace-nowrap">
                                            <StarRating rating={review.rating} />
                                        </td>

                                        {/* Action */}
                                        <td className="p-4 text-right whitespace-nowrap">
                                            <button 
                                                onClick={() => navigate(`/admin/vtc/rides/${review.vtcRideId}`)}
                                                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ml-auto"
                                                title="Voir la course associée"
                                            >
                                                <FontAwesomeIcon icon={faInfoCircle} /> Voir la course
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- PAGINATION --- */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total : <span className="font-semibold text-gray-900 dark:text-white">{reviewsPagination.totalCount}</span> avis
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={!reviewsPagination.hasPreviousPage}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Page {reviewsPagination.page}
                        </span>
                        <button
                            disabled={!reviewsPagination.hasNextPage}
                            onClick={() => setCurrentPage(prev => prev + 1)}
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