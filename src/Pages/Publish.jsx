import React, { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt, faMapPin, faCalendarAlt, faClock, faUsers,
  faMoneyBillWave, faInfoCircle, faCar, faPlusCircle, faRoute, faLuggageCart, faBoxOpen
} from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from 'react-hot-toast';
import useColorScheme from '../hooks/useColorScheme';
import useTrips from '../hooks/useTrips';
import useCars from '../hooks/useCar';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
// 🎯 Importation du MapContext
import useMape from "../hooks/useMap"
const Publish = () => {
  const { theme } = useColorScheme();
  const { createTrip } = useTrips();
  const { cars, loading: loadingCars, error: carsError, fetchUserCars } = useCars();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🎯 Récupération des données du MapContext
  const { places, searchPlaces, loading: loadingPlaces, error: placesError } = useMape();

  useEffect(() => {
    if (!user) {
      toast.error('Veuillez vous connecter pour publier un trajet.');
      navigate('/auth/signin');
    } else {
      fetchUserCars();
    }
  }, [user, navigate]);

  const [tripData, setTripData] = useState({
    departure: '',
    destination: '',
    date: '',
    time: '',
    availableSeats: '',
    pricePerSeat: '',
    isLuggageAllowed: false,
    luggageSize: '1',
    luggageNumberPerPassenger: '1',
    aditionalInfo: '',
    selectedVehicleId: '',
  });

  // 🎯 États pour les suggestions et pour le debounce
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // 🎯 Fonction de recherche avec debounce
  const debouncedSearch = (query) => {
    clearTimeout(debounceTimeout);
    const newTimeout = setTimeout(() => {
      if (query.trim().length > 2) {
        searchPlaces(query);
      }
    }, 500); // Délai de 500ms
    setDebounceTimeout(newTimeout);
  };

  // 🎯 Gère les changements du champ de départ
  const handleDepartureChange = (e) => {
    const { value } = e.target;
    setTripData(prevData => ({ ...prevData, departure: value }));
    debouncedSearch(value);
    setShowDepartureSuggestions(true);
    setShowDestinationSuggestions(false);
  };

  // 🎯 Gère les changements du champ de destination
  const handleDestinationChange = (e) => {
    const { value } = e.target;
    setTripData(prevData => ({ ...prevData, destination: value }));
    debouncedSearch(value);
    setShowDestinationSuggestions(true);
    setShowDepartureSuggestions(false);
  };

  // 🎯 Gère la sélection d'une suggestion de départ
  const handleSelectDeparture = (place) => {
    setTripData(prevData => ({
      ...prevData,
      departure: place.description,
      // Ici vous stockerez toutes les informations nécessaires pour l'API
      startArea: {
        homeTownName: place.description,
        name: place.description,
        latitude: place.latitude, // Assurez-vous que l'API renvoie ces champs
        longitude: place.longitude, // Assurez-vous que l'API renvoie ces champs
        order: 0,
        type: 0,
      }
    }));
    setShowDepartureSuggestions(false);
  };

  // 🎯 Gère la sélection d'une suggestion d'arrivée
  const handleSelectDestination = (place) => {
    setTripData(prevData => ({
      ...prevData,
      destination: place.description,
      // Ici vous stockerez toutes les informations nécessaires pour l'API
      arivalArea: {
        homeTownName: place.description,
        name: place.description,
        latitude: place.latitude, // Assurez-vous que l'API renvoie ces champs
        longitude: place.longitude, // Assurez-vous que l'API renvoie ces champs
        order: 0,
        type: 0,
      }
    }));
    setShowDestinationSuggestions(false);
  };

  // Fonction pour gérer les autres changements des champs du formulaire.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTripData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Cache les suggestions lorsque d'autres champs changent
    setShowDepartureSuggestions(false);
    setShowDestinationSuggestions(false);
  };

  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const inputBorder = isDarkMode ? 'border-gray-600' : 'border-gray-300';
  const labelColor = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const shadow = isDarkMode ? 'shadow-lg' : 'shadow-md';

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { departure, destination, date, time, availableSeats, pricePerSeat, selectedVehicleId } = tripData;
    if (!departure || !destination || !date || !time || !availableSeats || !pricePerSeat || !selectedVehicleId) {
      toast.error('Veuillez remplir tous les champs obligatoires.', { position: 'top-right' });
      return;
    }

    const publisherId = user?.id;
    if (!publisherId) {
      toast.error('Vous devez être connecté pour publier un trajet.', { position: 'top-right' });
      return;
    }

    // Création de l'objet de trajet
    const newTrip = {
      // 🎯 Utilisation des données complètes du lieu sélectionné
      startArea: tripData.startArea || {
        homeTownName: tripData.departure,
        name: tripData.departure,
        latitude: 0,
        longitude: 0,
        order: 0,
        type: 0
      },
      arivalArea: tripData.arivalArea || {
        homeTownName: tripData.destination,
        name: tripData.destination,
        latitude: 0,
        longitude: 0,
        order: 0,
        type: 0
      },
      departureDate: `${tripData.date}T${tripData.time}:00.000Z`,
      vehicleId: parseInt(tripData.selectedVehicleId, 10),
      placesLeft: parseInt(tripData.availableSeats, 10),
      pricePerPlace: parseFloat(tripData.pricePerSeat),
      isLuggageAllowed: tripData.isLuggageAllowed,
      luggageSize: parseInt(tripData.luggageSize, 10),
      luggageNumberPerPassenger: parseInt(tripData.luggageNumberPerPassenger, 10),
      aditionalInfo: tripData.aditionalInfo,
      stopovers: []
    };

    console.log('Données soumises par le formulaire :', newTrip);

    const publishPromise = createTrip(newTrip);

    toast.promise(publishPromise, {
      loading: 'Publication de votre trajet...',
      success: 'Trajet publié avec succès !',
      error: (err) => `Erreur: ${err.message || 'Échec de la publication du trajet.'}`,
    });

    publishPromise.then((result) => {
      if (result) {
        setTripData({
          departure: '',
          destination: '',
          date: '',
          time: '',
          availableSeats: '',
          pricePerSeat: '',
          isLuggageAllowed: false,
          luggageSize: '1',
          luggageNumberPerPassenger: '1',
          aditionalInfo: '',
          selectedVehicleId: '',
        });
      }
    });
  };

  if (user === undefined) {
    return null;
  }

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

            {/* 🎯 Champ Départ avec suggestions */}
            <div className="relative">
              <label htmlFor="departure" className={`block text-sm font-medium ${labelColor} mb-1`}>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                Lieu de Départ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="departure"
                name="departure"
                value={tripData.departure}
                onChange={handleDepartureChange}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Ex: Yaoundé"
                required
                onFocus={() => setShowDepartureSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDepartureSuggestions(false), 200)}
              />
              {showDepartureSuggestions && places.length > 0 && (
                <ul className={`absolute z-10 w-full ${cardBg} border ${inputBorder} rounded-md mt-1 max-h-48 overflow-y-auto ${shadow}`}>
                  {loadingPlaces ? (
                    <li className={`p-3 text-center ${labelColor}`}>Chargement...</li>
                  ) : placesError ? (
                    <li className={`p-3 text-center text-red-500`}>Erreur de recherche</li>
                  ) : places.map((place) => (
                    <li
                      key={place.placeId}
                      className={`p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${textColor}`}
                      onClick={() => handleSelectDeparture(place)}
                    >
                      {place.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 🎯 Champ Destination avec suggestions */}
            <div className="relative">
              <label htmlFor="destination" className={`block text-sm font-medium ${labelColor} mb-1`}>
                <FontAwesomeIcon icon={faMapPin} className="mr-2" />
                Lieu d'Arrivée <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={tripData.destination}
                onChange={handleDestinationChange}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Ex: Douala"
                required
                onFocus={() => setShowDestinationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
              />
              {showDestinationSuggestions && places.length > 0 && (
                <ul className={`absolute z-10 w-full ${cardBg} border ${inputBorder} rounded-md mt-1 max-h-48 overflow-y-auto ${shadow}`}>
                  {loadingPlaces ? (
                    <li className={`p-3 text-center ${labelColor}`}>Chargement...</li>
                  ) : placesError ? (
                    <li className={`p-3 text-center text-red-500`}>Erreur de recherche</li>
                  ) : places.map((place) => (
                    <li
                      key={place.placeId}
                      className={`p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${textColor}`}
                      onClick={() => handleSelectDestination(place)}
                    >
                      {place.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Reste du formulaire inchangé... */}
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
                    <option key={v.id} value={v.id}>{v.brand} {v.model}</option>
                  ))
                )}
              </select>
              <Link to="/profile/car">
                <p className='text-blue-600'>cliquez ici pour ajouter un vehicule</p>
              </Link>
            </div>
            <div>
              <label htmlFor="luggageSize" className={`block text-sm font-medium ${labelColor} mb-1`}>
                <FontAwesomeIcon icon={faBoxOpen} className="mr-2" />
                Taille des bagages
              </label>
              <select
                id="luggageSize"
                name="luggageSize"
                value={tripData.luggageSize}
                onChange={handleChange}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              >
                <option value="0">Aucun</option>
                <option value="1">Petit</option>
                <option value="2">Moyen</option>
                <option value="3">Grand</option>
              </select>
            </div>
            <div>
              <label htmlFor="luggageNumberPerPassenger" className={`block text-sm font-medium ${labelColor} mb-1`}>
                <FontAwesomeIcon icon={faLuggageCart} className="mr-2" />
                Bagages par personne
              </label>
              <input
                type="number"
                id="luggageNumberPerPassenger"
                name="luggageNumberPerPassenger"
                value={tripData.luggageNumberPerPassenger}
                onChange={handleChange}
                min="0"
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Ex: 1"
              />
            </div>
            <div className="md:col-span-2 flex items-center mt-2">
              <input
                type="checkbox"
                id="isLuggageAllowed"
                name="isLuggageAllowed"
                checked={tripData.isLuggageAllowed}
                onChange={handleChange}
                className={`mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500
                  ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
              />
              <label htmlFor="isLuggageAllowed" className={`text-sm font-medium ${labelColor}`}>
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                Bagages acceptés
              </label>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="aditionalInfo" className={`block text-sm font-medium ${labelColor} mb-1`}>
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                Informations supplémentaires (facultatif)
              </label>
              <textarea
                id="aditionalInfo"
                name="aditionalInfo"
                rows="3"
                value={tripData.aditionalInfo}
                onChange={handleChange}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Ex: Je peux vous déposer près du stade..."
              ></textarea>
            </div>

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