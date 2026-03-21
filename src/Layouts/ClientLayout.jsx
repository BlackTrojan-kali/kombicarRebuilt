import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Components/page-components/Header'
import { Footer } from '../Components/page-components/Footer'
import BackToTop from '../Components/ui/BackToTop' // <-- Importez votre nouveau composant

// Contextes de données fondamentales/gestion des utilisateurs
import { UserContextProvider } from '../contexts/UserContext.jsx';
import { CarContextProvider } from '../contexts/carContext.jsx';
import { NotificationContextProvider } from '../contexts/NotificationContext.jsx';

// Contextes de flux (Trips, Réservations, Map, Finances, Avis)
import { MapContextProvider } from '../contexts/MapContext.jsx';
import { TripContextProvider } from '../contexts/TripContext.jsx';
import { ReservationContextProvider } from '../contexts/ReservationContext.jsx';
import { SuggestTripContextProvider } from '../contexts/SuggestTripContext.jsx';
import { DrivingLicenceProvider } from '../contexts/DrivingLicenceContext.jsx';

const ClientLayout = () => {
  return (
    <UserContextProvider>
      <CarContextProvider>
        <MapContextProvider>
          <TripContextProvider> 
            <ReservationContextProvider> 
              <DrivingLicenceProvider>
                <SuggestTripContextProvider>
                  <div className='TheBody relative'> {/* Ajout de 'relative' au cas où */}
                    <Header/>
                    <br />
                    <Outlet/>
                    <br /><br />
                    <Footer/>
                    
                    {/* Le bouton sera affiché par-dessus toutes les pages de ce layout */}
                    <BackToTop />
                  </div>
                </SuggestTripContextProvider>
              </DrivingLicenceProvider>
            </ReservationContextProvider>
          </TripContextProvider>
        </MapContextProvider>
      </CarContextProvider>
    </UserContextProvider>
  )
}

export default ClientLayout