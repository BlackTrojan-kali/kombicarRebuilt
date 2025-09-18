import React, { useEffect } from 'react';
import useReviews from '../../hooks/useReviews';
import { useParams } from 'react-router-dom';

const Reviews = () => {
    // Utilisez le hook useReviews pour accéder aux données et fonctions du contexte.
    const { reviews, fetchReviewPerTrip, isLoading, error } = useReviews();
    
    // Utilisez useParams pour récupérer l'ID de trajet depuis l'URL.
    // Par exemple, si l'URL est /trip/123/reviews, tripId sera '123'.
    // Si votre route n'inclut pas de paramètre, vous pouvez conserver la ligne const tripId = 1;
    const { tripId } = useParams();

    useEffect(() => {
        // Déclenche la récupération des avis lorsque le composant se monte
        // et lorsque l'ID de trajet change.
        if (tripId) {
            const page = 0; // Remplacez par le numéro de page souhaité.
            fetchReviewPerTrip(tripId, page);
        }
    }, [tripId]);

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

    return (
        <div className='w-full mt-20 mx-10'>
            <h1 className="text-2xl font-bold mb-4">Avis</h1>
            {reviews.length === 0 ? (
                <p className="text-gray-500 text-lg">Aucun avis n'a été trouvé pour ce trajet.</p>
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