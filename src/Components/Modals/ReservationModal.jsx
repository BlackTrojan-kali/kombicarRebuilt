import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faSpinner, faCalendar, faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from '../ui/Button';
import useReservation from '../../hooks/useReservation';
import useAuth from '../../hooks/useAuth';
import useColorScheme from '../../hooks/useColorScheme';
import PaymentStatusComponent from '../WebHook/PaymentStatusComponent';

const COUNTRY_REFERENCES = [
    { code: 'OTHERS', value: 0, name: "Autre / International" },
    { code: 'CM', value: 237, name: "Cameroun" },
    { code: 'CI', value: 225, name: "Côte d'Ivoire" },
    { code: 'SN', value: 221, name: "Sénégal" },
    { code: 'CD', value: 243, name: "R.D. Congo" },
    { code: 'ML', value: 223, name: "Mali" },
    { code: 'BJ', value: 229, name: "Bénin" },
    { code: 'TG', value: 228, name: "Togo" },
    { code: 'GN', value: 224, name: "Guinée" },
    { code: 'BF', value: 226, name: "Burkina Faso" },
];

const ReservationModal = ({ trip, onClose }) => {
    const { user } = useAuth();
    const { addReservation, getPrice, isLoading: isReserving } = useReservation();
    const { theme } = useColorScheme();

    // 🔹 Déterminer le pays actif à partir du code utilisateur
    const userCountryCode = user?.country || 'OTHERS';
    const activeCountry = COUNTRY_REFERENCES.find(c => c.value === userCountryCode) || COUNTRY_REFERENCES[0];
    const isCameroon = activeCountry.code === 'CM';
    const [numberReservedPlaces, setNumberReservedPlaces] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [promoCode, setPromoCode] = useState('');
    const [operator, setOperator] = useState(1);
    const [isPaymentPending, setIsPaymentPending] = useState(false);
    const [currentReservationId, setCurrentReservationId] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isPricing, setIsPricing] = useState(false);

    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

    const calculatePrice = async () => {
        if (numberReservedPlaces > 0) {
            setIsPricing(true);
            try {
                const finalPrice = await getPrice(trip.trip.id, numberReservedPlaces, promoCode);
                setTotalPrice(finalPrice);
            } catch (err) {
                setTotalPrice(trip.trip.pricePerPlace * numberReservedPlaces);
            } finally {
                setIsPricing(false);
            }
        } else {
            setTotalPrice(0);
        }
    };

    useEffect(() => {
        calculatePrice();
    }, [numberReservedPlaces, promoCode, trip.trip.id]);

    const handleReservation = async () => {
        if (!user) {
            toast.error("Veuillez vous connecter pour réserver.");
            return;
        }

        if (numberReservedPlaces <= 0 || numberReservedPlaces > trip?.trip.placesLeft) {
            toast.error("Le nombre de places n'est pas valide.");
            return;
        }

        let reservationData = {};

        if (isCameroon) {
            // 🟠 Cas Cameroun (Trustpayway)
            if (!phoneNumber) {
                toast.error("Veuillez entrer votre numéro de téléphone.");
                return;
            }
            if (!operator) {
                toast.error("Veuillez sélectionner un opérateur de paiement.");
                return;
            }

            reservationData = {
                tripId: trip.trip.id,
                numberReservedPlaces,
                phoneNumber,
                promoCode,
                operator,
            };
        } else {
            // 🟢 Cas Autres pays (Cinetpay ou international)
            const returnUrl = `${window.location.origin}/reservation/success`;
            reservationData = {
                tripId: trip.trip.id,
                numberReservedPlaces,
                returnUrl,
                promoCode,
            };
        }

        try {
            const reservationResponse = await addReservation(reservationData);

            if (reservationResponse?.isRedirect && reservationResponse.redirectUrl) {
                // 🟢 Cas Cinetpay (redirection)
                localStorage.setItem('pendingReservationId', reservationResponse.id);
                toast.success("Redirection vers la plateforme de paiement...", { duration: 3000 });
                window.location.href = reservationResponse.redirectUrl;
            } else if (reservationResponse) {
                // 🟠 Cas Trustpayway (Cameroun)
                toast.success("Réservation créée. Veuillez payer.");
                setIsPaymentPending(true);
                setCurrentReservationId(reservationResponse.id);
            }
        } catch (err) {
            console.error("Échec de la réservation:", err);
            toast.error(err.message || "Échec de la réservation. Veuillez réessayer.");
        }
    };

    const handlePaymentResult = (isSuccess) => {
        if (isSuccess) {
            onClose(true);
        } else {
            setIsPaymentPending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 bg-opacity-50">
            <div className={`${cardBg} rounded-xl shadow-lg p-6 w-full max-w-lg mx-4 my-8 max-h-[90vh] overflow-y-auto relative`}>
                <button
                    onClick={() => onClose(false)}
                    className={`absolute top-4 right-4 text-xl ${textColorSecondary} hover:text-red-500`}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                {!isPaymentPending ? (
                    <>
                        <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4`}>
                            Réserver ce trajet
                        </h2>

                        <div className={`flex justify-between items-center py-2 border-b ${borderColor}`}>
                            <p className={`text-lg ${textColorSecondary}`}>Prix par passager</p>
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                {trip.trip.pricePerPlace} XAF
                            </p>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <p className={`text-lg ${textColorSecondary}`}>Places restantes</p>
                            <p className={`text-xl font-bold ${textColorPrimary}`}>{trip.trip.placesLeft}</p>
                        </div>

                        <div className={`flex justify-between items-center py-4 border-t ${borderColor} mt-4`}>
                            <p className={`text-lg ${textColorSecondary}`}>Nombre de places</p>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setNumberReservedPlaces(prev => Math.max(1, prev - 1))}
                                    disabled={numberReservedPlaces <= 1}
                                    className={`p-2 rounded-full ${numberReservedPlaces <= 1
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                        } text-white transition-colors duration-200`}
                                >
                                    <FontAwesomeIcon icon={faMinus} />
                                </button>
                                <p className={`text-xl font-bold ${textColorPrimary}`}>{numberReservedPlaces}</p>
                                <button
                                    onClick={() => setNumberReservedPlaces(prev => Math.min(trip.trip.placesLeft, prev + 1))}
                                    disabled={numberReservedPlaces >= trip.trip.placesLeft}
                                    className={`p-2 rounded-full ${numberReservedPlaces >= trip.trip.placesLeft
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                        } text-white transition-colors duration-200`}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                        </div>

                        {/* 🚩 Champs spécifiques Cameroun */}
                        {isCameroon && (
                            <>
                                <div className={`py-4 border-t ${borderColor} mt-4`}>
                                    <label htmlFor="operator" className={`block mb-2 text-lg font-medium ${textColorSecondary}`}>
                                        Opérateur de paiement
                                    </label>
                                    <select
                                        id="operator"
                                        value={operator}
                                        onChange={(e) => setOperator(parseInt(e.target.value))}
                                        className={`w-full p-2.5 rounded-lg border focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-gray-50 border-gray-300 text-gray-900'
                                            }`}
                                    >
                                        <option value={1}>Orange Money</option>
                                        <option value={2}>MTN MoMo</option>
                                    </select>
                                </div>

                                <div className={`py-4 border-t ${borderColor} mt-4`}>
                                    <label htmlFor="phoneNumber" className={`block mb-2 text-lg font-medium ${textColorSecondary}`}>Numéro de téléphone</label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className={`w-full p-2.5 rounded-lg border focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-gray-50 border-gray-300 text-gray-900'
                                            }`}
                                        placeholder="Ex: 699123456"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* Code promo (toujours visible) */}
                        <div className={`py-4 border-t ${borderColor} mt-4`}>
                            <label htmlFor="promoCode" className={`block mb-2 text-lg font-medium ${textColorSecondary}`}>Code promo (facultatif)</label>
                            <input
                                type="text"
                                id="promoCode"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className={`w-full p-2.5 rounded-lg border focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-gray-50 border-gray-300 text-gray-900'
                                    }`}
                                placeholder="Entrez votre code"
                            />
                        </div>

                        <div className={`flex justify-between items-center py-4 border-t ${borderColor} mt-4`}>
                            <p className={`text-lg ${textColorSecondary}`}>Prix total</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {isPricing ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : `${totalPrice} XAF`}
                            </p>
                        </div>

                        <Button
                            className="w-full py-4 text-xl font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                            onClick={handleReservation}
                            disabled={isReserving || isPricing || numberReservedPlaces <= 0}
                        >
                            {isReserving ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Réservation en cours...
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faCalendar} className="mr-2" /> Demander à réserver
                                </>
                            )}
                        </Button>
                    </>
                ) : (
                    <PaymentStatusComponent
                        reservationId={currentReservationId}
                        userId={user.id}
                        onPaymentComplete={handlePaymentResult}
                    />
                )}
            </div>
        </div>
    );
};

export default ReservationModal;
