import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt, faMapPin, faCalendarAlt, faClock, faUsers,
  faMoneyBillWave, faInfoCircle, faCar, faEdit, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from 'react-hot-toast';
import useColorScheme from '../../hooks/useColorScheme';
import useTrips from '../../hooks/useTrips';
import useCars from '../../hooks/useCar';
import useAuth from '../../hooks/useAuth';

// Le composant EditTripModal est une modale pour modifier un trajet existant.
// Il reçoit des props pour contrôler sa visibilité et les données du trajet à éditer.
const EditTripModal = ({ isOpen, onClose, tripToEdit }) => {
  const { theme } = useColorScheme();
  const { updateTrip } = useTrips(); // Utilisation de la fonction updateTrip du contexte.
  const { cars, loading: loadingCars, error: carsError, fetchUserCars } = useCars();
const {user} = useAuth()
  // État local pour gérer les données du formulaire de modification.
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

  // Utilisation de useEffect pour pré-remplir le formulaire lorsque la modale est ouverte
  // ou que les données du trajet à éditer changent.
  useEffect(() => {
    if (tripToEdit) {
      setTripData({
        // Mise à jour de la logique de pré-remplissage pour les nouvelles propriétés
        departure: tripToEdit.departureArea?.homeTownName || '',
        destination: tripToEdit.arrivalArea?.homeTownName || '',
        date: tripToEdit.trip?.departureDate ? new Date(tripToEdit.trip.departureDate).toISOString().slice(0, 10) : '',
        time: tripToEdit.trip?.departureDate ? new Date(tripToEdit.trip.departureDate).toISOString().slice(11, 16) : '',
        availableSeats: tripToEdit.trip?.placesLeft || '',
        pricePerSeat: tripToEdit.trip?.pricePerPlace || '',
        luggageAllowed: tripToEdit.trip?.isLuggageAllowed || false,
        description: tripToEdit.trip?.aditionalInfo || '',
        selectedVehicleId: tripToEdit.vehicule?.id || '',
      });
    }
  }, [tripToEdit]);

  // Chargement des véhicules de l'utilisateur au montage du composant.
  useEffect(() => {
    if (isOpen && cars.length === 0 && !loadingCars && !carsError) {
      fetchUserCars();
    }
  }, [isOpen, cars, loadingCars, carsError, fetchUserCars]);

  // Ne pas afficher la modale si elle n'est pas ouverte.
  if (!isOpen) {
    return null;
  }

  // Fonction pour gérer les changements des champs du formulaire.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTripData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gestion de la soumission du formulaire de mise à jour.
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation des champs obligatoires.
    const { departure, destination, date, time, availableSeats, pricePerSeat, selectedVehicleId } = tripData;
    if (!departure || !destination || !date || !time || !availableSeats || !pricePerSeat || !selectedVehicleId) {
      toast.error('Veuillez remplir tous les champs obligatoires.', { position: 'top-right' });
      return;
    }
    
    // Création de l'objet DTO pour l'API
    const updatedTripDto = {
        tripId: tripToEdit.trip.id,
        startArea: {
            homeTownName: tripToEdit.departureArea.homeTownName,
            name: departure,
            latitude: tripToEdit.departureArea.latitude, 
            longitude: tripToEdit.departureArea.longitude,
            id: tripToEdit.departureArea.id,
            order: tripToEdit.departureArea.order,
            type: tripToEdit.departureArea.type
        },
        arivalArea: {
            homeTownName: tripToEdit.arrivalArea.homeTownName,
            name: destination,
            latitude: tripToEdit.arrivalArea.latitude,
            longitude: tripToEdit.arrivalArea.longitude,
            id: tripToEdit.arrivalArea.id,
            order: tripToEdit.arrivalArea.order,
            type: tripToEdit.arrivalArea.type
        },
        departureDate: new Date(`${date}T${time}`).toISOString(),
        vehiculeId: selectedVehicleId,
        placesLeft: parseInt(availableSeats, 10),
        pricePerPlace: parseFloat(pricePerSeat),
        isLuggageAllowed: tripData.luggageAllowed,
        aditionalInfo: tripData.description,
        // Ces champs sont maintenant inclus dans l'objet DTO
        luggageSize: tripToEdit.trip.luggageSize,
        luggageNumberPerPassenger: tripToEdit.trip.luggageNumberPerPassenger,
        stopovers: tripToEdit.stopOvers || []
    };

    // Appel de la fonction de mise à jour du contexte avec l'objet DTO
    const updatePromise = updateTrip(updatedTripDto);

    toast.promise(updatePromise, {
      loading: 'Mise à jour du trajet...',
      success: 'Trajet mis à jour avec succès !',
      error: (err) => `Erreur: ${err.message || 'Échec de la mise à jour du trajet.'}`,
    });

    updatePromise.then((result) => {
      if (result) {
        onClose(); // Ferme la modale en cas de succès
      }
    });
  };

  // Classes Tailwind conditionnelles pour le mode sombre.
  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const inputBorder = isDarkMode ? 'border-gray-600' : 'border-gray-300';
  const labelColor = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const shadow = isDarkMode ? 'shadow-lg' : 'shadow-md';

  return (
    // Changement ici pour permettre le défilement
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 bg-opacity-50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className={`${cardBg} ${shadow} mt-[500px] md:mt-24  rounded-lg p-6 md:p-8 w-full max-w-2xl border ${inputBorder} transform transition-all scale-100 my-8`}>
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className={`text-2xl font-bold ${textColor}`}>
            <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-500" />
            Modifier le Trajet
          </h2>
          <button onClick={onClose} className={`text-gray-500 hover:text-gray-800 ${isDarkMode ? 'dark:hover:text-gray-200' : ''} transition-colors`}>
            <FontAwesomeIcon icon={faTimes} size="xl" />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Champs de formulaire pour la modification */}
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
              required
            />
          </div>

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
              required
            />
          </div>

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
          </div>

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
            ></textarea>
          </div>

          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         dark:focus:ring-offset-gray-900 transition-colors duration-300 text-lg"
            >
              <FontAwesomeIcon icon={faEdit} />
              Mettre à Jour le Trajet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTripModal;
