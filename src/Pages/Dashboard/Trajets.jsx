// src/pages/admin/Trajets.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt, faCalendarAlt, faClock, faMoneyBillWave, faUserTie, faCar,
    faEye, faEdit, faTrash, faPlusCircle, faCheckCircle, faHourglassHalf, faBan, 
    faArrowLeft, faArrowRight, faTimesCircle, faSyncAlt, faDownload
} from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';
import { toast } from 'sonner';

// Import de useNavigate et useParams
import { useParams, useNavigate } from 'react-router-dom';

// Importation du hook d'administration
import { useTripAdmin } from '../../contexts/Admin/TripAdminContext'; 
import useColorScheme from '../../hooks/useColorScheme';

const Trajets = () => {
    const navigate = useNavigate();
    const { theme } = useColorScheme();
    const isDark = theme === 'dark';
    const { type } = useParams(); // type est le statut du trajet à filtrer
    
    // Récupération des fonctions du TripAdminContext
    const { 
        trips, 
        setTrips, 
        loading, 
        error, 
        deleteTripAsAdmin, 
        changeTripStatusAsAdmin,
        listAdminTrips,
        exportTrips,       // <--- Récupération de la fonction d'export
        isExportingTrips   // <--- État de chargement de l'export
    } = useTripAdmin();
    
    const [totalRows, setTotalRows] = useState(0); 
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10); 
    
    const fetchTrips = async (page, status) => {
        try {
            const data = await listAdminTrips({ page: page, tripStatus: parseInt(status) }); 
            if (data && data.items) {
                setTrips(data.items);
                setTotalRows(data.totalCount);
                setPerPage(data.items.length > 0 ? data.items.length : 10);
            } else {
                 setTrips([]); 
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTrips(1, type);
        setCurrentPage(1); 
    }, [type]);

    useEffect(() => {
        fetchTrips(currentPage, type); 
    }, [currentPage, type]); 
    
    const totalPages = Math.ceil(totalRows / (perPage > 0 ? perPage : 10));
    const effectiveTotalPages = totalPages;

    const handleNextPage = () => {
        if (currentPage < effectiveTotalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // --- FONCTION D'EXPORT ---
    const handleExportCSV = async () => {
        if (!exportTrips) {
            toast.error("La fonction d'exportation n'est pas encore implémentée dans le contexte Trajet.");
            return;
        }
        try {
            await exportTrips();
        } catch (error) {
            console.error("L'exportation a échoué", error);
        }
    };
        
    const handleDeleteTrip = (trip) => {
        const tripId = trip.trip.id;
        const tripDescription = `${trip.departureArea.homeTownName} → ${trip.arrivalArea.homeTownName} le ${new Date(trip.trip.departureDate).toLocaleDateString('fr-CM')}`;

        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Vous êtes sur le point de supprimer le trajet "${tripDescription}". Cette action est irréversible.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: isDark ? '#4b5563' : '#9ca3af',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f8fafc' : '#0f172a',
            customClass: {
                popup: "rounded-2xl shadow-xl",
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteTripAsAdmin(tripId);
                    setTrips(prevTrips => prevTrips.filter(t => t.trip.id !== tripId));
                    setTotalRows(prevTotal => prevTotal > 0 ? prevTotal - 1 : 0);
                    toast.success("Trajet supprimé avec succès.");
                } catch (err) {
                    // Géré par le toast dans le contexte
                }
            }
        });
    };

    const handleValidateTrip = (trip) => {
        const tripId = trip.trip.id;
        const tripDescription = `${trip.departureArea.homeTownName} → ${trip.arrivalArea.homeTownName}`;
    
        Swal.fire({
            title: 'Valider ce trajet ?',
            text: `Voulez-vous approuver le trajet "${tripDescription}" ?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981', // Emerald green
            cancelButtonColor: isDark ? '#4b5563' : '#9ca3af',
            confirmButtonText: 'Oui, valider',
            cancelButtonText: 'Annuler',
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f8fafc' : '#0f172a',
            customClass: {
                popup: "rounded-2xl shadow-xl",
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await changeTripStatusAsAdmin(tripId, 0); // 0 = Published
                    fetchTrips(currentPage, type);
                    toast.success("Le trajet a été validé et publié.");
                } catch (err) {
                    // Géré par le toast d'erreur
                }
            }
        });
    };

    const handleAddTrip = () => {
        navigate('/admin/trajets/new'); 
        toast('Ouverture du formulaire pour ajouter un nouveau trajet.', {
            icon: '🗺️',
            duration: 3000,
        });
    };
    
    const handleViewDetails = (tripId) => {
        navigate(`/admin/trajets/details/${tripId}`); 
    };

    // Mapping des statuts
    const getStatusInfo = (status) => {
        const statusMap = {
            0: { text: 'Published', icon: faCalendarAlt, classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500 border border-blue-200 dark:border-blue-800' },
            1: { text: 'Cancelled', icon: faTimesCircle, classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500 border border-red-200 dark:border-red-800' },
            2: { text: 'Finished', icon: faCheckCircle, classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-800' },
            3: { text: 'OnValidating', icon: faHourglassHalf, classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 border border-amber-200 dark:border-amber-800' },
            4: { text: 'Prévu', icon: faCalendarAlt, classes: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-500 border border-indigo-200 dark:border-indigo-800' },
        };
        return statusMap[status] || { text: 'Inconnu', icon: faBan, classes: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700' };
    };

    return (
        <div className="pl-12 pt-8 pb-40 bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* HEADER SECTION */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 mr-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Trajets
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Gérez, suivez et validez les annonces de covoiturage.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* BOUTON D'EXPORT */}
                    <button
                        onClick={handleExportCSV}
                        disabled={isExportingTrips || !totalRows}
                        className={`flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95 ${
                            isExportingTrips || !totalRows ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                    >
                        <FontAwesomeIcon
                            icon={isExportingTrips ? faSyncAlt : faDownload}
                            className={isExportingTrips ? "animate-spin" : ""}
                        />
                        <span className="hidden sm:inline">Exporter CSV</span>
                    </button>

                    {/* BOUTON ACTUALISER */}
                    <button
                        onClick={() => fetchTrips(currentPage, type)}
                        disabled={loading}
                        className={`flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white font-medium py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95 ${
                            loading ? "opacity-80 cursor-not-allowed" : ""
                        }`}
                    >
                        <FontAwesomeIcon
                            icon={faSyncAlt}
                            className={loading ? "animate-spin" : ""}
                        />
                        <span className="hidden sm:inline">Actualiser</span>
                    </button>

                    {/* BOUTON NOUVEAU TRAJET */}
                    <button
                        onClick={handleAddTrip}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95"
                    >
                        <FontAwesomeIcon icon={faPlusCircle} />
                        <span className="hidden sm:inline">Nouveau Trajet</span>
                    </button>
                </div>
            </div>

            {/* MAIN CARD */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 p-5 mr-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        Liste des Trajets <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">({totalRows || 0} total)</span>
                    </h2>
                </div>
                
                {loading && trips?.length === 0 ? (
                    <div className="py-20 text-center text-blue-500 dark:text-blue-400">
                        <FontAwesomeIcon icon={faSyncAlt} className="animate-spin text-4xl mb-4 opacity-80" />
                        <p className="font-medium">Chargement des trajets...</p>
                    </div>
                ) : error ? (
                    <div className="p-6 text-center text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800/30">
                        <p className="font-semibold">Une erreur est survenue</p>
                        <p className="text-sm mt-1">{error.message || 'Vérifiez la console pour plus de détails.'}</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                        <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                                        <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Itinéraire</th>
                                        <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Heure</th>
                                        <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Prix</th>
                                        <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Infos Chauffeur</th>
                                        <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Statut</th>
                                        <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                    {trips?.length > 0 ? (
                                        trips.map(tripData => {
                                            const statusInfo = getStatusInfo(tripData.trip.status);
                                            // Sécurisation de l'affichage de l'ID
                                            const displayId = String(tripData.trip.id);
                                            
                                            return (
                                                <tr key={tripData.trip.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors duration-150 group">
                                                    <td className="py-4 px-4 font-mono text-xs text-slate-400 dark:text-slate-500">
                                                        {displayId.length > 8 ? `${displayId.substring(0, 8)}...` : displayId}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                                                                {tripData.departureArea.homeTownName}
                                                            </span>
                                                            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                                                                {tripData.arrivalArea.homeTownName}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                                                <FontAwesomeIcon icon={faCalendarAlt} className="text-slate-400 text-xs" />
                                                                {new Date(tripData.trip.departureDate).toLocaleDateString('fr-CM')}
                                                            </span>
                                                            <span className="text-xs text-slate-500 flex items-center gap-2">
                                                                <FontAwesomeIcon icon={faClock} className="text-slate-400 text-xs" />
                                                                {new Date(tripData.trip.departureDate).toLocaleTimeString('fr-CM', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-bold bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
                                                            {tripData.trip.pricePerPlace.toLocaleString('fr-CM')} FCFA
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                                <FontAwesomeIcon icon={faUserTie} className="text-blue-500" />
                                                                {`${tripData.driver.firstName} ${tripData.driver.lastName}`}
                                                            </span>
                                                            <span className="text-xs text-slate-500 flex items-center gap-2">
                                                                <FontAwesomeIcon icon={faCar} className="text-slate-400" />
                                                                {`${tripData.vehicule.brand} ${tripData.vehicule.model}`}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusInfo.classes}`}>
                                                            <FontAwesomeIcon icon={statusInfo.icon} />
                                                            {statusInfo.text}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                            {/* Bouton de validation si 'OnValidating' */}
                                                            {tripData.trip.status === 3 && (
                                                                <button
                                                                    onClick={() => handleValidateTrip(tripData)}
                                                                    className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400 transition-colors"
                                                                    title="Valider le trajet"
                                                                >
                                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                                </button>
                                                            )}
                                                            
                                                            <button
                                                                onClick={() => handleViewDetails(tripData.trip.id)}
                                                                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 transition-colors"
                                                                title="Voir les détails"
                                                            >
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </button>
                                                            
                                                            <button
                                                                onClick={() => toast(`Modification du trajet ${displayId}...`, { icon: '✍️' })}
                                                                className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-400 transition-colors"
                                                                title="Modifier"
                                                            >
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </button>
                                                            
                                                            <button
                                                                onClick={() => handleDeleteTrip(tripData)}
                                                                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 transition-colors"
                                                                title="Supprimer"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="py-12 text-center text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50">
                                                <div className="flex flex-col items-center">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-4xl mb-3 opacity-50" />
                                                    <p>Aucun trajet à afficher pour le moment.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
                            <div className="mb-4 sm:mb-0 text-slate-500 dark:text-slate-400">
                                Affichage de <span className="font-semibold text-slate-700 dark:text-slate-200">{Math.min(totalRows, (currentPage - 1) * perPage + 1)}</span> à <span className="font-semibold text-slate-700 dark:text-slate-200">{Math.min(totalRows, currentPage * perPage)}</span> sur <span className="font-semibold text-slate-700 dark:text-slate-200">{totalRows}</span> trajets
                            </div>
                            
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/30 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1 || loading}
                                    className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                                        currentPage === 1 || loading
                                            ? "text-slate-400 dark:text-slate-500 cursor-not-allowed"
                                            : "text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 hover:shadow-sm"
                                    }`}
                                    title="Page précédente"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </button>
                                
                                <div className="px-4 py-2 bg-white dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg font-bold shadow-sm border border-slate-200 dark:border-slate-600 min-w-[2.5rem] text-center whitespace-nowrap">
                                    Page {currentPage} / {effectiveTotalPages || 1}
                                </div>

                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage >= effectiveTotalPages || loading}
                                    className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                                        currentPage >= effectiveTotalPages || loading
                                            ? "text-slate-400 dark:text-slate-500 cursor-not-allowed"
                                            : "text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 hover:shadow-sm"
                                    }`}
                                    title="Page suivante"
                                >
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Trajets;