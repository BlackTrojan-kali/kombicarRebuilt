import React, { useEffect, useState } from 'react';
import useReviews from '../../hooks/useReviews';
import { useParams } from 'react-router-dom';

const Reviews = () => {
    const { reviews, fetchReviewPerTrip, isLoading, error, hasNextPage, hasPreviousPage, totalCount, page } = useReviews();
    const { tripId } = useParams();

    // Ajout d'un état local pour la page courante.
    const [currentPage, setCurrentPage] = useState(1);

    // useEffect mis à jour pour appeler la récupération avec la page courante.
    useEffect(() => {
        if (tripId) {
            fetchReviewPerTrip(tripId, currentPage);
        }
    }, [tripId, currentPage]); // Ajout de currentPage comme dépendance.

    // Affichez un message d'erreur si la requête a échoué.
    if (error) {
        return (
            <div className='w-full mt-20 mx-10 text-center'>
                <p className="text-red-500 text-lg font-semibold">
                    Erreur lors du chargement des avis : {error}
                </p>
            </div>
        );
    }

    // Affichez un indicateur de chargement pendant la requête.
    if (isLoading) {
        return (
            <div className='w-full mt-20 mx-10 text-center'>
                <p className="text-gray-500 text-lg">Chargement des avis...</p>
            </div>
        );
    }

    // Gestion de la page suivante.
    const handleNextPage = () => {
        if (hasNextPage) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    // Gestion de la page précédente.
    const handlePreviousPage = () => {
        if (hasPreviousPage) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className='w-full mt-20 mx-10'>
            <h1 className="text-2xl font-bold mb-4">Avis</h1>
            {reviews.length === 0 && !isLoading ? (
                <p className="text-gray-500 text-lg">Aucun avis n'a été trouvé pour ce trajet.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-gray-100 p-6 rounded-lg shadow-md">
                                <p className="text-xl font-semibold">{review.userName}</p>
                                <p className="text-gray-600 mt-2">Note: {review.note}/5</p>
                                <p className="mt-4 italic">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                    {/* Contrôles de pagination */}
                    <div className="flex justify-center mt-6 space-x-4">
                        <button
                            onClick={handlePreviousPage}
                            disabled={!hasPreviousPage || isLoading}
                            className={`px-4 py-2 rounded-md ${!hasPreviousPage || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                            Précédent
                        </button>
                        <span className="self-center font-medium text-lg">
                             Page {page}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={!hasNextPage || isLoading}
                            className={`px-4 py-2 rounded-md ${!hasNextPage || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                            Suivant
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Reviews;