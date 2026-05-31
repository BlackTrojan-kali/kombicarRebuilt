// src/pages/reviews/DriverReviewsPage.tsx
import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, User, Loader2, MessageSquare, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

import { reviewService } from '../../services/reviewService';
import type { ReviewDto } from '../../types/ReviewTypes';

export const DriverReviewsPage = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const navigate = useNavigate();

  // États pour les données
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // États de pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0
  });

  // États pour les statistiques calculées localement pour enrichir l'UI
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  });

  const fetchReviews = async () => {
    if (!driverId) return;
    setIsLoading(true);
    try {
      const response = await reviewService.getDriverReviews(driverId, currentPage);
      setReviews(response.items || []);
      setPaginationMeta({
        hasNextPage: response.hasNextPage,
        hasPreviousPage: response.hasPreviousPage,
        totalCount: response.totalCount
      });

      // Calculer des statistiques globales uniquement sur la page 1 pour la cohérence visuelle
      if (response.items && response.items.length > 0 && currentPage === 1) {
        const total = response.items.length;
        const sum = response.items.reduce((acc, curr) => acc + curr.note, 0);
        setAverageRating(sum / total);

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        response.items.forEach(item => {
          const roundedNote = Math.round(item.note) as keyof typeof distribution;
          if (distribution[roundedNote] !== undefined) {
            distribution[roundedNote]++;
          }
        });
        setRatingDistribution(distribution);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des avis.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverId, currentPage]);

  // Rendu des étoiles statiques
  const renderStars = (note: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < note ? "text-yellow-500 fill-yellow-500" : "text-border-main"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-base pb-24">
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-surface border-b border-border-main shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors shrink-0"
          >
            <ChevronLeft size={20} className="text-text-main" />
          </button>
          <h1 className="text-lg font-bold text-text-main">Avis et Évaluations</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-6">
        {isLoading && currentPage === 1 ? (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="text-kombi-orange-500 animate-spin" />
          </div>
        ) : reviews.length > 0 ? (
          <>
            {/* COMPOSANT RÉSUMÉ DES NOTES (TABLEAU DE BORD) */}
            <div className="bg-surface border border-border-main rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
              <div className="text-center sm:border-r sm:border-border-main sm:pr-8 shrink-0">
                <p className="text-5xl font-black text-text-main">
                  {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
                </p>
                <div className="flex items-center justify-center gap-0.5 mt-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <p className="text-xs text-text-muted mt-2 font-medium">
                  Sur la base des trajets récents
                </p>
              </div>

              {/* Barres de répartition */}
              <div className="flex-1 w-full space-y-2">
                {Object.entries(ratingDistribution)
                  .reverse()
                  .map(([stars, count]) => {
                    const percentage = paginationMeta.totalCount > 0 
                      ? (count / reviews.length) * 100 
                      : 0;
                    return (
                      <div key={stars} className="flex items-center gap-3 text-xs font-medium">
                        <span className="w-3 text-text-main font-bold">{stars}</span>
                        <Star size={12} className="text-yellow-500 fill-yellow-500 shrink-0" />
                        <div className="flex-1 h-2 bg-base rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="w-6 text-right text-text-muted">{count}</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* COMPTEUR TOTAL */}
            <h2 className="text-base font-extrabold text-text-main px-1">
              {paginationMeta.totalCount} témoignage{paginationMeta.totalCount > 1 ? 's' : ''} passager
            </h2>

            {/* LISTE DES COMMENTAIRES */}
            <div className="space-y-4">
              {reviews.map((review) => {
                const reviewDate = new Date(review.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                });

                return (
                  <div
                    key={review.id}
                    className="bg-surface border border-border-main rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-base border border-border-main flex items-center justify-center text-text-muted shrink-0">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-extrabold text-sm text-text-main">
                            {review.userName || "Passager Anonyme"}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {renderStars(review.note)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                        <Calendar size={12} /> {reviewDate}
                      </span>
                    </div>

                    {review.comment ? (
                      <p className="text-sm text-text-main leading-relaxed pl-1">
                        {review.comment}
                      </p>
                    ) : (
                      <p className="text-sm text-text-muted italic pl-1">
                        L'utilisateur a laissé une note sans commentaire.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CONTROLES DE PAGINATION */}
            {(paginationMeta.hasNextPage || paginationMeta.hasPreviousPage) && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={!paginationMeta.hasPreviousPage}
                  className="px-4 py-2 bg-surface border border-border-main rounded-xl text-sm font-bold text-text-main disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base transition-colors"
                >
                  Précédent
                </button>
                <span className="text-sm font-medium text-text-muted">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={!paginationMeta.hasNextPage}
                  className="px-4 py-2 bg-surface border border-border-main rounded-xl text-sm font-bold text-text-main disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base transition-colors"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        ) : (
          /* ÉTAT VIDE */
          <div className="bg-surface border border-border-main rounded-3xl p-10 text-center">
            <div className="w-16 h-16 bg-base rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
              <MessageSquare size={32} className="opacity-50" />
            </div>
            <h3 className="text-lg font-bold text-text-main mb-1">Aucun avis pour le moment</h3>
            <p className="text-text-muted text-sm max-w-sm mx-auto">
              Ce conducteur n'a pas encore reçu de commentaires de la part de la communauté.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};