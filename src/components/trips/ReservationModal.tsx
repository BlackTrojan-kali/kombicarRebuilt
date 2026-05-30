// src/components/trips/ReservationModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Users, Phone, Loader2, AlertTriangle, ShieldCheck, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../features/auth/AuthContext';
import { reservationService } from '../../services/reservationService';

interface ReservationModalProps {
  tripId: number;
  pricePerPlace: number;
  maxPlaces: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  tripId,
  pricePerPlace,
  maxPlaces,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  
  // États du formulaire
  const [places, setPlaces] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState<number>(1); // 1 = Orange, 2 = MTN
  const [promoCode, setPromoCode] = useState('');
  
  // États de simulation de prix
  const [simulatedPrice, setSimulatedPrice] = useState<number>(pricePerPlace);
  const [isSimulating, setIsSimulating] = useState(false);
  const [promoError, setPromoError] = useState('');

  // États de soumission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vérification de la méthode de paiement (V1 pour CM/GA, V2 pour autres)
  const isV1Payment = user?.country === 237 || user?.country === 241;

  // Effet pour simuler le prix à chaque changement
  useEffect(() => {
    if (!isOpen) return;

    const simulatePrice = async () => {
      setIsSimulating(true);
      setPromoError('');
      try {
        const response = await reservationService.getPriceSimulation(tripId, places, promoCode);
        setSimulatedPrice(response.price);
      } catch (error: any) {
        // En cas d'erreur (souvent code promo invalide), on remet le prix standard
        setSimulatedPrice(places * pricePerPlace);
        if (promoCode && error.response?.status === 404) {
          setPromoError('Code promo invalide ou expiré');
        }
      } finally {
        setIsSimulating(false);
      }
    };

    // Debounce simple pour éviter de spammer l'API quand l'utilisateur tape le code promo
    const timeoutId = setTimeout(() => {
      simulatePrice();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [places, promoCode, tripId, pricePerPlace, isOpen]);

  // Nettoyage à la fermeture
  useEffect(() => {
    if (!isOpen) {
      setPlaces(1);
      setPhoneNumber('');
      setOperator(1);
      setPromoCode('');
      setPromoError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isV1Payment) {
        // --- MÉTHODE V1 : Cameroun / Gabon ---
        if (!phoneNumber || phoneNumber.length < 9) {
          toast.error("Veuillez saisir un numéro de téléphone valide.");
          setIsSubmitting(false);
          return;
        }

        await reservationService.addReservation({
          tripId,
          numberReservedPlaces: places,
          operator,
          phoneNumber,
          promoCode
        });

        toast.success("Réservation effectuée ! Vérifiez votre téléphone pour confirmer le paiement.");
        onSuccess();
        onClose();

      } else {
        // --- MÉTHODE V2 : Cinetpay (Autres pays) ---
        const returnUrl = `${window.location.origin}/covoiturage/mes-trajets?status=success`;
        
        const response = await reservationService.addReservationV2({
          tripId,
          numberReservedPlaces: places,
          returnUrl,
          promoCode
        });

        // Redirection vers l'interface de paiement Cinetpay
        toast.loading("Redirection vers la plateforme de paiement sécurisée...", { duration: 3000 });
        if (response.cinetpayRedirectUrl) {
           window.location.href = response.cinetpayRedirectUrl;
        } else {
           toast.error("Erreur : Lien de paiement introuvable.");
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.description || error.response?.data || "Erreur lors de la réservation.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Overlay sombre avec effet blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      ></div>

      {/* Contenu de la modal */}
      <div className="relative bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-border-main bg-base/50">
          <div>
            <h3 className="text-xl font-bold text-text-main">Réserver votre place</h3>
            <p className="text-sm text-text-muted mt-1 flex items-center gap-1">
              <ShieldCheck size={14} className="text-kombi-green-500" /> Paiement 100% sécurisé
            </p>
          </div>
          <button 
            onClick={!isSubmitting ? onClose : undefined}
            className="w-10 h-10 rounded-full bg-surface border border-border-main flex items-center justify-center text-text-muted hover:bg-base transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Nombre de places */}
          <div className="bg-base border border-border-main rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-kombi-orange-500 flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-text-main">Nombre de places</p>
                <p className="text-xs text-text-muted">Max. {maxPlaces} disponible{maxPlaces > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                type="button" 
                onClick={() => setPlaces(Math.max(1, places - 1))}
                className="w-8 h-8 rounded-full border border-border-main flex items-center justify-center hover:bg-surface transition-colors disabled:opacity-30"
                disabled={places <= 1 || isSubmitting}
              >
                -
              </button>
              <span className="font-bold text-lg w-4 text-center">{places}</span>
              <button 
                type="button" 
                onClick={() => setPlaces(Math.min(maxPlaces, places + 1))}
                className="w-8 h-8 rounded-full border border-border-main flex items-center justify-center hover:bg-surface transition-colors disabled:opacity-30"
                disabled={places >= maxPlaces || isSubmitting}
              >
                +
              </button>
            </div>
          </div>

          {/* Formulaire spécifique V1 (Cameroun / Gabon) */}
          {isV1Payment && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Numéro Mobile Money</label>
                <div className="flex items-center border border-border-main rounded-xl px-3 py-2.5 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all">
                  <Phone size={18} className="text-text-muted mr-2 shrink-0" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="ex: 690123456"
                    disabled={isSubmitting}
                    className="w-full bg-transparent outline-none text-text-main placeholder-text-muted font-medium"
                  />
                </div>
              </div>

              {/* Sélection Opérateur (Uniquement si Cameroun) */}
              {user?.country === 237 && (
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Opérateur</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOperator(1)}
                      disabled={isSubmitting}
                      className={`py-3 rounded-xl border font-bold text-sm transition-all ${
                        operator === 1 
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-sm' 
                          : 'border-border-main bg-base text-text-muted hover:bg-surface'
                      }`}
                    >
                      Orange Money
                    </button>
                    <button
                      type="button"
                      onClick={() => setOperator(2)}
                      disabled={isSubmitting}
                      className={`py-3 rounded-xl border font-bold text-sm transition-all ${
                        operator === 2 
                          ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 shadow-sm' 
                          : 'border-border-main bg-base text-text-muted hover:bg-surface'
                      }`}
                    >
                      MTN MoMo
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Formulaire spécifique V2 (Cinetpay) */}
          {!isV1Payment && (
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4 flex gap-3 text-blue-800 dark:text-blue-300">
              <ShieldCheck className="shrink-0 mt-0.5" size={20} />
              <div className="text-sm">
                <p className="font-bold mb-1">Paiement sécurisé Cinetpay</p>
                <p className="opacity-90">Vous serez redirigé vers notre partenaire de paiement pour finaliser la transaction en toute sécurité (Carte, Mobile Money, etc.).</p>
              </div>
            </div>
          )}

          {/* Code Promo */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1 flex items-center justify-between">
              <span>Code Promo (Optionnel)</span>
              {promoError && <span className="text-red-500 lowercase normal-case">{promoError}</span>}
            </label>
            <div className={`flex items-center border rounded-xl px-3 py-2.5 transition-all ${
              promoError ? 'border-red-500 focus-within:ring-red-500' : 'border-border-main focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500'
            }`}>
              <Tag size={18} className="text-text-muted mr-2 shrink-0" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Avez-vous un code ?"
                disabled={isSubmitting}
                className="w-full bg-transparent outline-none text-text-main placeholder-text-muted font-medium uppercase"
              />
            </div>
          </div>

          {/* Résumé du prix et Bouton */}
          <div className="pt-6 border-t border-border-main mt-6">
            <div className="flex items-end justify-between mb-4">
              <span className="font-bold text-text-main">Total à payer</span>
              <div className="text-right flex items-center gap-2">
                {isSimulating && <Loader2 size={16} className="animate-spin text-text-muted" />}
                <span className="text-3xl font-extrabold text-kombi-orange-500">
                  {simulatedPrice.toLocaleString('fr-FR')}
                </span>
                <span className="text-sm font-bold text-text-muted">XAF</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSimulating || (isV1Payment && phoneNumber.length < 9)}
              className="w-full bg-text-main hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-surface dark:text-black font-bold text-lg py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Traitement...
                </>
              ) : (
                isV1Payment ? "Payer et Réserver" : "Continuer vers le paiement"
              )}
            </button>
            
            {isV1Payment && (
              <p className="text-center text-[11px] text-text-muted mt-3 flex items-center justify-center gap-1">
                <AlertTriangle size={12} />
                Gardez votre téléphone à proximité pour valider le paiement
              </p>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};