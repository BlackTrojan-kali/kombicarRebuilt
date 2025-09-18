import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import useReviews from '../../hooks/useReviews';
import useTrips from '../../hooks/useTrips';
import useColorScheme from '../../hooks/useColorScheme';
import dayjs from 'dayjs';

const SubmitReview = () => {
    const { tripId } = useParams();
    const { submitReview, loading: submittingReview } = useReviews();
    const { getTripById, loading: loadingTrip } = useTrips();
    const { theme } = useColorScheme();

    const [tripDetail, setTripDetail] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        // Fonction asynchrone pour charger les détails du trajet
        const fetchTripDetails = async () => {
            if (tripId) {
                
                    const res = await getTripById(tripId);
                    setTripDetail(res);
                
            }
        };

        fetchTripDetails();
    }, [tripId, getTripById, theme]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            Swal.fire({
                title: 'Note requise',
                text: 'Veuillez sélectionner une note pour le trajet.',
                icon: 'warning',
                confirmButtonText: 'OK',
                background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
            });
            return;
        }

        const reviewData = {
            tripId: tripId,
            rating: rating,
            comment: comment,
        };

        try {
            await submitReview(reviewData);
            Swal.fire({
                title: 'Succès !',
                text: 'Votre avis a été soumis avec succès.',
                icon: 'success',
                confirmButtonText: 'OK',
                background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
            }).then(() => {
                navigate('/profile');
            });
        } catch (error) {
            Swal.fire({
                title: 'Erreur !',
                text: `Échec de la soumission de l'avis : ${error.message || 'Veuillez réessayer.'}`,
                icon: 'error',
                confirmButtonText: 'OK',
                background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
            });
        }
    };

    const pageBgColor = theme === 'dark' ? 'bg-gray-900' : '';
    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

    if (loadingTrip || !tripDetail) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${pageBgColor} ${textColorPrimary}`}>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p className="ml-4 text-xl">Chargement des détails du trajet...</p>
            </div>
        );
    }

    return (
        <div className={`${pageBgColor} min-h-screen pt-20 pb-10 transition-colors duration-300`}>
            <main className='max-w-xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className={`${cardBg} rounded-2xl shadow-xl p-8 border ${borderColor}`}>
                    <h1 className={`text-2xl sm:text-3xl font-bold ${textColorPrimary} mb-4 text-center`}>
                        <FontAwesomeIcon icon={faStar} className='mr-2 text-yellow-500' />
                        Donnez votre avis sur ce trajet
                    </h1>
                    <div className={`${textColorSecondary} text-center mb-6`}>
                        <p className="text-xl font-semibold">{tripDetail?.departureArea?.homeTownName} → {tripDetail?.arrivalArea?.homeTownName}</p>
                        <p>Trajet avec {tripDetail?.driver?.firstName} {tripDetail?.driver?.lastName}</p>
                        <p>{dayjs(tripDetail?.trip?.departureDate).format('DD MMMM YYYY à HH:mm')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className={`block text-lg font-medium ${textColorPrimary} mb-2`}>Votre note</label>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-4xl transition-colors duration-200 ${rating >= star ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'} hover:text-yellow-400`}
                                        aria-label={`${star} étoile sur 5`}
                                    >
                                        <FontAwesomeIcon icon={faStar} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="comment" className={`block text-lg font-medium ${textColorPrimary} mb-2`}>Votre commentaire</label>
                            <textarea
                                id="comment"
                                name="comment"
                                rows="4"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className={`w-full p-3 rounded-lg border ${borderColor} ${cardBg} ${textColorPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Partagez votre expérience du trajet..."
                                required
                            ></textarea>
                        </div>
                        
                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={submittingReview}
                                className={`w-full px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 ${
                                    submittingReview ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                            >
                                {submittingReview ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Soumettre l\'avis'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default SubmitReview;
