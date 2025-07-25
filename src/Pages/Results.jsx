import React, { useState } from 'react';
import ResultCard from '../Components/Cards/ResultCard';

// Importations pour DatePicker de MUI
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faLocationDot, faUserGroup } from '@fortawesome/free-solid-svg-icons';

// Petit composant pour une section de filtre réutilisable
const FilterSection = ({ title, children }) => (
  <div className="mb-6 p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border dark:border-gray-700">
    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">{title}</h3>
    {children}
  </div>
);

// SearchBar intégrée directement dans Results (ajustée pour la pleine largeur)
const IntegratedSearchBar = () => {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(dayjs());
  const [passengers, setPassengers] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      departure,
      destination,
      date: date.format('YYYY-MM-DD'),
      passengers,
    });
    // Logique de recherche à implémenter ici
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form
        onSubmit={handleSubmit}
        className='w-full mt-10
                   flex flex-col lg:flex-row items-stretch
                   bg-white rounded-none shadow-md overflow-hidden
                   text-gray-800 border-y border-gray-100
                   dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100'
      >
        <div className='flex flex-col lg:flex-row w-full lg:flex-grow'>
          <div className='relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 hover:bg-gray-50 flex-grow cursor-pointer
                          dark:border-gray-700 dark:hover:bg-gray-700'>
            <FontAwesomeIcon icon={faLocationDot} className='text-xl text-blue-500 mr-3' />
            <input
              type="text"
              placeholder='Départ'
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className='flex-grow outline-none bg-transparent placeholder-gray-500 text-lg py-1 dark:placeholder-gray-400 dark:text-gray-100'
              aria-label="Lieu de départ"
            />
          </div>

          <div className='relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 hover:bg-gray-50 flex-grow cursor-pointer
                          dark:border-gray-700 dark:hover:bg-gray-700'>
            <FontAwesomeIcon icon={faLocationDot} className='text-xl text-green-500 mr-3' />
            <input
              type="text"
              placeholder='Destination'
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className='flex-grow outline-none bg-transparent placeholder-gray-500 text-lg py-1 dark:placeholder-gray-400 dark:text-gray-100'
              aria-label="Lieu de destination"
            />
          </div>

          <div className='relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 hover:bg-gray-50 flex-grow cursor-pointer
                          dark:border-gray-700 dark:hover:bg-gray-700'>
            <FontAwesomeIcon icon={faCalendarDays} className='text-xl text-purple-500 mr-3' />
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              className='flex-grow w-full'
              slotProps={{
                textField: {
                  variant: 'standard',
                  InputProps: {
                    disableUnderline: true,
                    className: 'text-lg dark:text-gray-100',
                  },
                  sx: {
                    '& .MuiInputBase-input': {
                      padding: '8px 0 !important',
                      color: 'inherit',
                    },
                     '& .MuiInputLabel-root': {
                        color: 'rgb(156 163 175) !important',
                     },
                     '& .MuiInputLabel-root.Mui-focused': {
                        color: 'rgb(147 51 234) !important',
                     },
                     '& .MuiSvgIcon-root': {
                        color: 'rgb(168 85 247) !important',
                     },
                  },
                },
              }}
            />
          </div>

          <div className='relative flex items-center p-3 sm:p-4 hover:bg-gray-50 flex-grow cursor-pointer
                          dark:hover:bg-gray-700'>
            <FontAwesomeIcon icon={faUserGroup} className='text-xl text-orange-500 mr-3' />
            <input
              type="number"
              min="1"
              max="10"
              placeholder='Nb Personnes'
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className='flex-grow outline-none bg-transparent placeholder-gray-500 text-lg py-1 dark:placeholder-gray-400 dark:text-gray-100'
              aria-label="Nombre de personnes"
            />
          </div>
        </div>

        <button
          type="submit"
          className='w-full lg:w-32 bg-green-500 hover:bg-green-600 text-white font-bold
                     py-4 lg:py-0 px-6 rounded-b-xl lg:rounded-bl-none lg:rounded-r-xl
                     flex-shrink-0 transition-colors duration-200
                     flex items-center justify-center'
        >
          Rechercher
        </button>
      </form>
    </LocalizationProvider>
  );
};


const Results = () => {
  const trips = [
    {
      thumbnail: "/default/city-1.jpg", depart: "Yaoundé", arrive: "Douala", prix: 4000,
      heure_depart: "10h00", heure_arrive: "13h00", desc: "Climatisé, pas de surcharge",
      chauffeur: { nom: "Yassine", trajets_effectues: 20, profile: "/default/person.jpg", stars: 4.5 }, distance: 240
    },
    {
      thumbnail: "/default/city-2.jpg", depart: "Douala", arrive: "Yaoundé", prix: 4500,
      heure_depart: "08h30", heure_arrive: "12h00", desc: "Wifi à bord",
      chauffeur: { nom: "Fatima", trajets_effectues: 15, profile: "/default/person-2.jpg", stars: 4.8 }, distance: 240
    },
    {
      thumbnail: "/default/city-3.jpg", depart: "Yaoundé", arrive: "Kribi", prix: 5500,
      heure_depart: "14h00", heure_arrive: "16h30", desc: "Sièges inclinables",
      chauffeur: { nom: "Jean", trajets_effectues: 10, profile: "/default/person-3.jpg", stars: 4.2 }, distance: 180
    },
    {
      thumbnail: "/default/city-4.jpg", depart: "Bafoussam", arrive: "Douala", prix: 3800,
      heure_depart: "09h00", heure_arrive: "13h00", desc: "Musique au choix",
      chauffeur: { nom: "Chantal", trajets_effectues: 25, profile: "/default/person-4.jpg", stars: 4.7 }, distance: 280
    },
    {
      thumbnail: "/default/city-5.jpg", depart: "Douala", arrive: "Limbe", prix: 2000,
      heure_depart: "16h00", heure_arrive: "17h30", desc: "Bagages inclus",
      chauffeur: { nom: "Marc", trajets_effectues: 8, profile: "/default/person-5.jpg", stars: 4.0 }, distance: 60
    },
    {
      thumbnail: "/default/city-6.jpg", depart: "Yaoundé", arrive: "Ebolowa", prix: 3000,
      heure_depart: "07h00", heure_arrive: "09h30", desc: "Départ immédiat",
      chauffeur: { nom: "Sandrine", trajets_effectues: 12, profile: "/default/person-6.jpg", stars: 4.3 }, distance: 160
    },
  ];

  return (
    <div className='text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen'>

      {/* La SearchBar est maintenant sans padding latéral propre */}
      <div className="mb-12">
        <IntegratedSearchBar />
      </div>

      <main className='px-4 sm:px-6 lg:px-12 xl:px-24 py-10 max-w-7xl mx-auto'>
        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-12 text-gray-800 dark:text-gray-100'>
          Résultats de votre recherche
        </h1>

        <div className='flex flex-col md:flex-row gap-8'>
          {/* Sidebar de Filtres */}
          <aside className='w-full md:w-1/4 lg:w-1/5 flex-shrink-0'>
            <FilterSection title="Filtres">
              {/* Contenu des filtres */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Prix Max.</h4>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  value="10000"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-green-500"
                />
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <span>1000 XAF</span>
                  <span>10000 XAF</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Heure de Départ</h4>
                <select className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                  <option value="">Toutes</option>
                  <option value="matin">Matin (avant 12h)</option>
                  <option value="apres-midi">Après-midi (12h-18h)</option>
                  <option value="soir">Soir (après 18h)</option>
                </select>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Options du Trajet</h4>
                <label className="flex items-center mb-2">
                  <input type="checkbox" className="form-checkbox text-green-500 rounded dark:bg-gray-600 dark:border-gray-500" />
                  <span className="ml-2 text-gray-700 dark:text-gray-200">Climatisé</span>
                </label>
                <label className="flex items-center mb-2">
                  <input type="checkbox" className="form-checkbox text-green-500 rounded dark:bg-gray-600 dark:border-gray-500" />
                  <span className="ml-2 text-gray-700 dark:text-gray-200">Bagages inclus</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox text-green-500 rounded dark:bg-gray-600 dark:border-gray-500" />
                  <span className="ml-2 text-gray-700 dark:text-gray-200">Chauffeur noté 4+ étoiles</span>
                </label>
              </div>
            </FilterSection>

            <FilterSection title="Type de Véhicule">
                <label className="flex items-center mb-2">
                    <input type="radio" name="vehicle_type" value="sedan" className="form-radio text-blue-500 dark:bg-gray-600 dark:border-gray-500" />
                    <span className="ml-2 text-gray-700 dark:text-gray-200">Berline</span>
                </label>
                <label className="flex items-center mb-2">
                    <input type="radio" name="vehicle_type" value="suv" className="form-radio text-blue-500 dark:bg-gray-600 dark:border-gray-500" />
                    <span className="ml-2 text-gray-700 dark:text-gray-200">SUV</span>
                </label>
                <label className="flex items-center">
                    <input type="radio" name="vehicle_type" value="van" className="form-radio text-blue-500 dark:bg-gray-600 dark:border-gray-500" />
                    <span className="ml-2 text-gray-700 dark:text-gray-200">Van / Minibus</span>
                </label>
            </FilterSection>
          </aside>

          {/* Section des Résultats de Recherche */}
          <section className='w-full md:w-3/4 lg:w-4/5'>
            {trips.length > 0 ? (
              <div className='flex flex-col gap-6'>
                {trips.map((trip, index) => (
                  <ResultCard key={index} trip={trip} />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <p className="text-xl text-gray-700 dark:text-gray-300">Aucun résultat trouvé pour votre recherche.</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Essayez d'ajuster vos filtres ou de modifier votre recherche.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Results;