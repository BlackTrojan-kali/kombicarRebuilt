import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt, faCalendarAlt, faClock, faMoneyBillWave, faUserTie, faCar,
    faEye, faEdit, faTrash, faPlusCircle, faCheckCircle, faHourglassHalf, faBan, faArrowLeft, faArrowRight, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';
import { toast } from 'sonner';

// Import de useNavigate et useParams
import { useParams, useNavigate } from 'react-router-dom';

// 🚨 REMPLACEMENT : Importation du nouveau hook d'administration
// Assurez-vous que le chemin est correct pour votre projet
import { useTripAdmin } from '../../contexts/Admin/TripAdminContext'; 
import useColorScheme from '../../hooks/useColorScheme';


const Trajets = () => {
    // 1. Initialisation de useNavigate et des hooks
    const navigate = useNavigate();
    const { theme } = useColorScheme();
    const { type } = useParams(); // type est le statut du trajet à filtrer
    
    // Récupération des fonctions du TripAdminContext
    // NOTE : trips, loading, error, changeTripStatusAsAdmin, deleteTripAsAdmin viennent du contexte
    const { 
        trips, 
        setTrips, // Ajout de setTrips si vous voulez mettre à jour l'état directement après une action
        loading, 
        error, 
        deleteTripAsAdmin, 
        changeTripStatusAsAdmin ,
        listAdminTrips,
        // NOTE: Vous aurez besoin d'une fonction de liste pour admin, que j'appelle ici "listAdminTrips"
        // Si elle n'existe pas, vous pouvez temporairement utiliser une fonction mock ou la créer dans le contexte.
        // Pour l'instant, je vais utiliser une fonction fictive car elle n'était pas dans le contexte fourni.
        // Si vous utilisez listPublicTrips, elle DOIT être accessible via useTripAdmin.
    } = useTripAdmin();
    
    // 🚨 Pour l'exemple, nous allons créer une fonction de mock pour le listing car elle n'est pas dans votre contexte
    // Elle devrait être implémentée dans TripAdminContext : GET /api/v1/trips/admin/list-trips?page={page}&status={status}
    // Je suppose que vous avez listAdminTrips ou que vous utilisez un autre hook pour cela (ce qui n'est pas idéal).
    // Si la fonction de liste était dans useTrips, elle devrait être déplacée dans useTripAdmin.
    const [totalRows, setTotalRows] = useState(0); 
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10); 
    
    // Supposons une fonction de listing Admin dans le contexte
   
    const fetchTrips = async (page, status) => {
        // Vous devez utiliser la fonction de listing ADMIN ici.
        // Je suppose qu'elle s'appelle listAdminTrips et qu'elle a été ajoutée à useTripAdmin.
        // Si vous n'avez pas cette fonction, vous devez l'ajouter au TripAdminContext.
        try {
            // 🚨 Correction : Le statut dans l'URL (type) est converti en entier
            const data = await listAdminTrips({ page: page, tripStatus: parseInt(status) }); 
            if (data && data.items) {
                // Mise à jour de l'état des voyages dans le contexte si nécessaire
                // Sinon, vous pouvez simplement stocker le résultat de la requête ici
                setTrips(data.items); // Mise à jour de l'état global du contexte
                setTotalRows(data.totalCount);
                // Le perPage pourrait venir du backend, sinon il est calculé par la longueur des items
                setPerPage(data.items.length > 0 ? data.items.length : 10);
            } else {
                 setTrips([]); // Gérer le cas où il n'y a pas d'items
            }
        } catch (err) {
            // Le hook gère l'erreur
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTrips(1, type);
        setCurrentPage(1); 
    }, [type]);

    useEffect(() => {
        // Appel de la fonction de fetch lorsque la page ou le type change
        fetchTrips(currentPage, type); 
    }, [currentPage, type]); 
    
    // Correction de l'utilisation de perPage qui est mis à jour dans fetchTrips
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
        
    const handleDeleteTrip = (trip) => {
        const tripId = trip.trip.id;
        const tripDescription = `${trip.departureArea.homeTownName} → ${trip.arrivalArea.homeTownName} le ${new Date(trip.trip.departureDate).toLocaleDateString('fr-CM')}`;

        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Vous êtes sur le point de supprimer le trajet "${tripDescription}". Cette action est irréversible !`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DC2626',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler',
            background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
            color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteTripAsAdmin(tripId);
                    // 🚨 IMPORTANT : Au lieu de recharger la page, on met à jour la liste localement
                    setTrips(prevTrips => prevTrips.filter(t => t.trip.id !== tripId));
                    setTotalRows(prevTotal => prevTotal > 0 ? prevTotal - 1 : 0);
                    // Si l'état du contexte a déjà une logique de filtre, elle doit être utilisée à la place
                } catch (err) {
                    // Géré par le toast dans le contexte
                }
            }
        });
    };

    // Nouvelle fonction pour valider un trajet
    const handleValidateTrip = (trip) => {
        const tripId = trip.trip.id;
        const tripDescription = `${trip.departureArea.homeTownName} → ${trip.arrivalArea.homeTownName} le ${new Date(trip.trip.departureDate).toLocaleDateString('fr-CM')}`;
    
        Swal.fire({
            title: 'Valider ce trajet ?',
            text: `Voulez-vous valider le trajet "${tripDescription}" ?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563EB',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Oui, valider !',
            cancelButtonText: 'Annuler',
            background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
            color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // 0 = Published/Validé (statut d'exemple)
                    await changeTripStatusAsAdmin(tripId, 0); 
                    // 🚨 IMPORTANT : On ne recharge pas toute la page, mais on rafraîchit la liste
                    fetchTrips(currentPage, type);
                } catch (err) {
                    // Le hook gère déjà le toast d'erreur
                }
            }
        });
    };

    const handleAddTrip = () => {
        // Redirection vers le formulaire d'ajout
        navigate('/admin/trajets/new'); 
        toast('Ouverture du formulaire pour ajouter un nouveau trajet.', {
            icon: '🗺️',
            duration: 3000,
            position: 'top-right',
        });
    };
    
    // Fonction de redirection vers les détails
    const handleViewDetails = (tripId) => {
        navigate(`/admin/trajets/details/${tripId}`); 
    };

    // Mapping des statuts (inchangé, fonctionne bien)
    const getStatusInfo = (status) => {
        const statusMap = {
            0: { text: 'Published', icon: faCalendarAlt, classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
            1: { text: 'Cancelled', icon: faTimesCircle, classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
            2: { text: 'Finished', icon: faCheckCircle, classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
            3: { text: 'OnValidating', icon: faHourglassHalf, classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
            4: { text: 'Prévu', icon: faCalendarAlt, classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
        };
        return statusMap[status] || { text: 'Inconnu', icon: faBan, classes: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' };
    };

    // Rendu du composant (inchangé, sauf pour la logique de rechargement)
    return (
        <div className='pl-12 pt-6 pb-40 bg-gray-50 dark:bg-gray-900 min-h-full'>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                    Liste des Trajets
                </h1>
                <button
                    onClick={handleAddTrip}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                    <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                    Ajouter un Trajet
                </button>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
                <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>Trajets Enregistrés</h2>
                
                {loading && trips.length === 0 ? (
                    <div className="p-4 text-center text-blue-500 dark:text-blue-400">Chargement des trajets...</div>
                ) : error ? (
                    <div className="p-4 text-center text-red-500 dark:text-red-400">
                        Une erreur est survenue lors du chargement des trajets : {error.message || 'Vérifiez la console pour plus de détails.'}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg">
                            <table className={`w-full table-auto ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                <thead>
                                    <tr className={`uppercase text-sm font-semibold text-left ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                        <th className="py-3 px-4 rounded-tl-lg">ID</th>
                                        <th className="py-3 px-4">Départ</th>
                                        <th className="py-3 px-4">Destination</th>
                                        <th className="py-3 px-4">Date</th>
                                        <th className="py-3 px-4">Heure</th>
                                        <th className="py-3 px-4 text-right">Prix</th>
                                        <th className="py-3 px-4">Chauffeur</th>
                                        <th className="py-3 px-4">Véhicule</th>
                                        <th className="py-3 px-4">Statut</th>
                                        <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trips?.length > 0 ? (
                                        trips?.map(tripData => {
                                            const statusInfo = getStatusInfo(tripData.trip.status);
                                            return (
                                                <tr key={tripData.trip.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} last:border-b-0`}>
                                                    <td className="py-4 px-4">{tripData.trip.id}</td>
                                                    <td className="py-4 px-4">
                                                        <span className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                                                            {tripData.departureArea.homeTownName}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                                                            {tripData.arrivalArea.homeTownName}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                                            {new Date(tripData.trip.departureDate).toLocaleDateString('fr-CM')}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                                                            {new Date(tripData.trip.departureDate).toLocaleTimeString('fr-CM', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right font-semibold text-green-500">
                                                        <span className="flex items-center justify-end gap-1">
                                                            <FontAwesomeIcon icon={faMoneyBillWave} />
                                                            {tripData.trip.pricePerPlace.toLocaleString('fr-CM')} FCFA
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faUserTie} className="text-gray-400" />
                                                            {`${tripData.driver.firstName} ${tripData.driver.lastName}`}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faCar} className="text-gray-400" />
                                                            {`${tripData.vehicule.brand} ${tripData.vehicule.model} (${tripData.vehicule.color})`}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center justify-center gap-1 ${statusInfo.classes}`}>
                                                            <FontAwesomeIcon icon={statusInfo.icon} />
                                                            {statusInfo.text}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex justify-center gap-2">
                                                            {/* Bouton de validation (uniquement pour le statut 'OnValidating' = 3) */}
                                                            {tripData.trip.status === 3 && (
                                                                <button
                                                                    onClick={() => handleValidateTrip(tripData)}
                                                                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                                                                    title="Valider le trajet"
                                                                >
                                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                                </button>
                                                            )}
                                                            
                                                            {/* Bouton "Voir les détails" mis à jour pour naviguer */}
                                                            <button
                                                                onClick={() => handleViewDetails(tripData.trip.id)}
                                                                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                                                                title="Voir les détails"
                                                            >
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </button>
                                                            
                                                            <button
                                                                onClick={() => toast(`Modification du trajet ${tripData.trip.id} (à implémenter)...`, { icon: '✍️' })}
                                                                className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200"
                                                                title="Modifier"
                                                            >
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTrip(tripData)}
                                                                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
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
                                            <td colSpan="10" className="py-8 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-4xl mb-2" />
                                                    <p>Aucun trajet à afficher pour le moment.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination personnalisée */}
                        <div className={`mt-4 flex flex-col sm:flex-row justify-between items-center text-sm p-4 rounded-md shadow ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                            <div className="mb-2 sm:mb-0">
                                Affichage de {Math.min(totalRows, (currentPage - 1) * perPage + 1)} à {Math.min(totalRows, currentPage * perPage)} sur {totalRows} trajets.
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1 || loading}
                                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${currentPage === 1 || loading ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                    Précédent
                                </button>
                                <span className={`px-4 py-2 rounded-md font-bold ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                    Page {currentPage} sur {effectiveTotalPages || 1}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage >= effectiveTotalPages || loading}
                                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${currentPage >= effectiveTotalPages || loading ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    Suivant
                                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
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