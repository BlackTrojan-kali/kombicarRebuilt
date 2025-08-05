import React, { useEffect, useState } from 'react'; // Importez useEffect
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt, faMapPin, faCalendarAlt, faClock, faUsers,
  faEuroSign, faInfoCircle, faCar, faMoneyBillWave, faPlusCircle, faRoute
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../hooks/useColorScheme'; // Assurez-vous que le chemin est correct
import { Toaster, toast } from 'react-hot-toast'; // Pour les notifications
import useTrips from '../hooks/useTrips'; // Importez le hook useTrips
import useCars from '../hooks/useCar'; // Importez le hook useCars
import  useAuth  from '../hooks/useAuth'; // Importez le hook d'authentification pour l'ID utilisateur

const Publish = () => {
  const { theme } = useColorScheme();
  const { createTrip } = useTrips(); // Récupérez la fonction createTrip du contexte
  const { cars, loading: loadingCars, error: carsError, fetchCars } = useCars(); // Récupérez les véhicules et leur état du contexte
  const { user } = useAuth(); // Récupérez l'utilisateur connecté pour son ID

  // États pour les champs du formulaire
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [pricePerSeat, setPricePerSeat] = useState('');
  const [luggageAllowed, setLuggageAllowed] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState(''); // Pour stocker l'ID du véhicule sélectionné

  // Charger les véhicules de l'utilisateur au montage du composant
  useEffect(() => {
    fetchCars();
  }, []);

  // Couleurs conditionnelles pour le dark mode
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const shadow = theme === 'dark' ? 'shadow-lg' : 'shadow-md';

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation basique des champs
    if (!departure || !destination || !date || !time || !availableSeats || !pricePerSeat || !selectedVehicleId) {
      toast.error('Veuillez remplir tous les champs obligatoires.', { position: 'top-right' });
      return;
    }

    // Récupérer l'ID de l'utilisateur connecté
    const publisherId = user?.id; // Utilisez l'ID de l'utilisateur du AuthContext
    if (!publisherId) {
      toast.error('Vous devez être connecté pour publier un trajet.', { position: 'top-right' });
      return;
    }

    const newTrip = {
      departure,
      destination,
      date,
      time,
      availableSeats: parseInt(availableSeats),
      pricePerSeat: parseFloat(pricePerSeat),
      luggageAllowed,
      description,
      vehicleId: selectedVehicleId, // Utilise l'ID du véhicule sélectionné
      publisherId: publisherId, // Utilise l'ID de l'utilisateur connecté
      status: 'pending', // Statut initial du trajet (à confirmer par votre API)
      createdAt: new Date().toISOString(), // Date de création
    };

    console.log('Données soumises par le formulaire :', newTrip); // Console.log des données soumises

    // Appel à la fonction createTrip du contexte
    const publishPromise = createTrip(newTrip);

    toast.promise(publishPromise, {
      loading: 'Publication de votre trajet...',
      success: 'Trajet publié avec succès !',
      error: (err) => `Erreur: ${err.message || 'Échec de la publication du trajet.'}`,
    });

    // Réinitialiser le formulaire après un succès (la promesse gère le toast)
    publishPromise.then((result) => {
      if (result) { // Si la publication a réussi
        setDeparture('');
        setDestination('');
        setDate('');
        setTime('');
        setAvailableSeats('');
        setPricePerSeat('');
        setLuggageAllowed(false);
        setDescription('');
        setSelectedVehicleId('');
      }
    });
  };

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : ''}`}>
      <Toaster /> {/* Composant Toaster pour afficher les notifications */}

      <div className="max-w-4xl mx-auto py-8">
        <h1 className={`text-4xl font-extrabold mb-8 text-center ${textColor}`}>
          <FontAwesomeIcon icon={faRoute} className="mr-3 text-kombigreen-500" />
          Publier un Nouveau Trajet
        </h1>

        <div className={`${cardBg} ${shadow} rounded-lg p-6 md:p-8 border ${inputBorder}`}>
          <p className={`${labelColor} mb-6 text-center`}>
            Remplissez les informations ci-dessous pour proposer votre trajet en covoiturage.
          </p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Champ Départ */}
            <div>
              <label htmlFor="departure" className={`block text-sm font-medium ${labelColor} mb-1`}>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                Lieu de Départ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="departure"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Ex: Yaoundé"
                required
              />
            </div>

            {/* Champ Destination */}
            <div>
              <label htmlFor="destination" className={`block text-sm font-medium ${labelColor} mb-1`}>
                <FontAwesomeIcon icon={faMapPin} className="mr-2" />
                Lieu d'Arrivée <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Ex: Douala"
                required
              />
            </div>

            {/* Champ Date */}
            <div>
              <label htmlFor="date" className={`block text-sm font-medium ${labelColor} mb-1`}>
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Date du Trajet <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500`}
                required
              />
            </div>

            {/* Champ Heure */}
            <div>
              <label htmlFor="time" className={`block text-sm font-medium ${labelColor} mb-1`}>
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                Heure de Départ <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500`}
                required
              />
            </div>

            {/* Champ Nombre de places */}
            <div>
              <label htmlFor="availableSeats" className={`block text-sm font-medium ${labelColor} mb-1`}>
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Places Disponibles <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="availableSeats"
                value={availableSeats}
                onChange={(e) => setAvailableSeats(e.target.value)}
                min="1"
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Ex: 3"
                required
              />
            </div>

            {/* Champ Prix par place */}
            <div>
              <label htmlFor="pricePerSeat" className={`block text-sm font-medium ${labelColor} mb-1`}>
                <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                Prix par Place (XAF) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="pricePerSeat"
                value={pricePerSeat}
                onChange={(e) => setPricePerSeat(e.target.value)}
                min="0"
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Ex: 5000"
                required
              />
            </div>

            {/* Sélection du Véhicule */}
            <div>
              <label htmlFor="vehicle" className={`block text-sm font-medium ${labelColor} mb-1`}>
                <FontAwesomeIcon icon={faCar} className="mr-2" />
                Véhicule Utilisé <span className="text-red-500">*</span>
              </label>
              <select
                id="vehicle"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500`}
                required
              >
                <option value="">
                  {loadingCars ? 'Chargement des véhicules...' : 'Sélectionnez un véhicule'}
                </option>
                {carsError ? (
                  <option value="" disabled>Erreur de chargement des véhicules</option>
                ) : (
                  cars.map(v => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.registrationCode})</option>
                  ))
                )}
              </select>
            </div>

            {/* Checkbox Bagages Autorisé */}
            <div className="md:col-span-2 flex items-center mt-2">
              <input
                type="checkbox"
                id="luggageAllowed"
                checked={luggageAllowed}
                onChange={(e) => setLuggageAllowed(e.target.checked)}
                className={`mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
              />
              <label htmlFor="luggageAllowed" className={`text-sm font-medium ${labelColor}`}>
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                Bagages acceptés
              </label>
            </div>

            {/* Champ Description (textarea) */}
            <div className="md:col-span-2">
              <label htmlFor="description" className={`block text-sm font-medium ${labelColor} mb-1`}>
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                Informations supplémentaires (facultatif)
              </label>
              <textarea
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Ex: Je peux vous déposer près du stade..."
              ></textarea>
            </div>

            {/* Bouton de Soumission */}
            <div className="md:col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-kombigreen-500 text-white font-semibold rounded-lg shadow-md
                           hover:bg-kombigreen-600 focus:outline-none focus:ring-2 focus:ring-kombigreen-500 focus:ring-offset-2
                           dark:focus:ring-offset-gray-900 transition-colors duration-300 text-lg"
              >
                <FontAwesomeIcon icon={faPlusCircle} />
                Publier le Trajet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Publish;
