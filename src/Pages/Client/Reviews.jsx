import React, { useEffect } from 'react';
import useReviews from '../../hooks/useReviews';

const Reviews = () => {
    // Utilisez le hook useReviews pour accéder aux données et fonctions du contexte.
    const { reviews, fetchReviewPerTrip } = useReviews();

    // Utilisez useEffect pour déclencher la récupération des avis lorsque le composant se monte.
    useEffect(() => {
        // Remplacez '1' par l'ID de trajet réel et '0' par le numéro de page souhaité.
        const tripId = 1; 
        const page = 0; 
        fetchReviewPerTrip(tripId, page);
    }, [fetchReviewPerTrip]); // La dépendance s'assure que la fonction est appelée correctement.

    return (
        <div className='w-full mt-20 mx-10'>
            <h1 className="text-2xl font-bold mb-4">Avis</h1>
            {reviews.length === 0 ? (
                <p>Chargement des avis...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-gray-100 p-6 rounded-lg shadow-md">
                            <p className="text-xl font-semibold">{review.userName}</p>
                            <p className="text-gray-600 mt-2">Note: {review.note}/5</p>
                            <p className="mt-4 italic">"{review.comment}"</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Reviews;