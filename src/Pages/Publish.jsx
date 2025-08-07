import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt, faMapPin, faCalendarAlt, faClock, faUsers,
  faMoneyBillWave, faInfoCircle, faCar, faPlusCircle, faRoute
} from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from 'react-hot-toast';
import useColorScheme from '../hooks/useColorScheme';
import useTrips from '../hooks/useTrips';
import useCars from '../hooks/useCar';
import useAuth from '../hooks/useAuth';

// Le composant Publish permet à l'utilisateur de créer et de publier un nouveau trajet.
const Publish = () => {
  // Récupération des hooks personnalisés pour le thème, les trajets, les voitures et l'authentification.
  const { theme } = useColorScheme();
  const { createTrip } = useTrips();
  const { cars, loading: loadingCars, error: carsError, fetchCars } = useCars();
  const { user } = useAuth();

  // Utilisation d'un seul objet d'état pour le formulaire pour une meilleure gestion.
  const [tripData, setTripData] = useState({
    departure: '',
    destination: '',
    date: '',
    time: '',
    availableSeats: '',
    pricePerSeat: '',
    luggageAllowed: false,
    description: '',
    selectedVehicleId: '',
  });

  // Fonction pour gérer les changements des champs du formulaire.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTripData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Chargement des véhicules de l'utilisateur au montage du composant.
  useEffect(() => {
    // On ne charge les voitures que si la liste est vide et qu'il n'y a pas d'erreur ou de chargement en cours.
    if (cars.length === 0 && !loadingCars && !carsError) {
      fetchCars();
    }
  }, [cars, loadingCars, carsError, fetchCars]);

  // Classes Tailwind conditionnelles pour le mode sombre.
  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const inputBorder = isDarkMode ? 'border-gray-600' : 'border-gray-300';
  const labelColor = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const shadow = isDarkMode ? 'shadow-lg' : 'shadow-md';

  // Gestion de la soumission du formulaire.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs obligatoires.
    const { departure, destination, date, time, availableSeats, pricePerSeat, selectedVehicleId } = tripData;
    if (!departure || !destination || !date || !time || !availableSeats || !pricePerSeat || !selectedVehicleId) {
      toast.error('Veuillez remplir tous les champs obligatoires.', { position: 'top-right' });
      return;
    }

    // Récupération de l'ID de l'utilisateur.
    const publisherId = user?.id;
    if (!publisherId) {
      toast.error('Vous devez être connecté pour publier un trajet.', { position: 'top-right' });
      return;
    }

    const newTrip = {
      departure,
      destination,
      date,
      time,
      availableSeats: parseInt(availableSeats, 10),
      pricePerSeat: parseFloat(pricePerSeat),
      luggageAllowed: tripData.luggageAllowed,
      description: tripData.description,
      vehicleId: selectedVehicleId,
      publisherId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    console.log('Données soumises par le formulaire :', newTrip);

    // Envoi des données du trajet via la fonction createTrip.
    const publishPromise = createTrip(newTrip);

    // Utilisation de react-hot-toast pour afficher l'état de la publication.
    toast.promise(publishPromise, {
      loading: 'Publication de votre trajet...',
      success: 'Trajet publié avec succès !',
      error: (err) => `Erreur: ${err.message || 'Échec de la publication du trajet.'}`,
    });

    // Réinitialisation du formulaire après une publication réussie.
    publishPromise.then((result) => {
      if (result) {
        setTripData({
          departure: '',
          destination: '',
          date: '',
          time: '',
          availableSeats: '',
          pricePerSeat: '',
          luggageAllowed: false,
          description: '',
          selectedVehicleId: '',
        });
      }
    });
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900' : ''}`}>
      <Toaster />

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
                name="departure"
                value={tripData.departure}
                onChange={handleChange}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500 transition-colors`}
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
                name="destination"
                value={tripData.destination}
                onChange={handleChange}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500 transition-colors`}
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
                name="date"
                value={tripData.date}
                onChange={handleChange}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500 transition-colors`}
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
                name="time"
                value={tripData.time}
                onChange={handleChange}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500 transition-colors`}
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
                name="availableSeats"
                value={tripData.availableSeats}
                onChange={handleChange}
                min="1"
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500 transition-colors`}
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
                name="pricePerSeat"
                value={tripData.pricePerSeat}
                onChange={handleChange}
                min="0"
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Ex: 5000"
                required
              />
            </div>

            {/* Sélection du Véhicule */}
            <div>
              <label htmlFor="selectedVehicleId" className={`block text-sm font-medium ${labelColor} mb-1`}>
                <FontAwesomeIcon icon={faCar} className="mr-2" />
                Véhicule Utilisé <span className="text-red-500">*</span>
              </label>
              <select
                id="selectedVehicleId"
                name="selectedVehicleId"
                value={tripData.selectedVehicleId}
                onChange={handleChange}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                required
              >
                <option value="">
                  {loadingCars ? 'Chargement des véhicules...' : 'Sélectionnez un véhicule'}
                </option>
                {carsError ? (
                  <option value="" disabled>Erreur de chargement des véhicules</option>
                ) : (
                  cars.map(v => (
                    <option key={v.id} value={v.id}>{v.marque} {v.modele}</option>
                  ))
                )}
              </select>
            </div>

            {/* Checkbox Bagages Autorisé */}
            <div className="md:col-span-2 flex items-center mt-2">
              <input
                type="checkbox"
                id="luggageAllowed"
                name="luggageAllowed"
                checked={tripData.luggageAllowed}
                onChange={handleChange}
                className={`mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500
                  ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
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
                name="description"
                rows="3"
                value={tripData.description}
                onChange={handleChange}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500 transition-colors`}
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
