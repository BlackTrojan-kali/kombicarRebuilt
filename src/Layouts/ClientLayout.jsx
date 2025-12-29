import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Components/page-components/Header'
import { Footer } from '../Components/page-components/Footer'

// Contextes de données fondamentales/gestion des utilisateurs
import { UserContextProvider } from '../contexts/UserContext.jsx';
import { CarContextProvider } from '../contexts/carContext.jsx';
import { NotificationContextProvider } from '../contexts/NotificationContext.jsx';

// Contextes de flux (Trips, Réservations, Map, Finances, Avis)
import { MapContextProvider } from '../contexts/MapContext.jsx';
import { TripContextProvider } from '../contexts/TripContext.jsx';
import { ReservationContextProvider } from '../contexts/ReservationContext.jsx';
import { SuggestTripContextProvider } from '../contexts/SuggestTripContext.jsx';
const ClientLayout = () => {
  return (
    
                <UserContextProvider>
                  <CarContextProvider>
                        <MapContextProvider>
                          <TripContextProvider> 
                            <ReservationContextProvider> 
                                 <SuggestTripContextProvider>
                                      <div className='TheBody'>
                                      <Header/>
                                      <br />
                                      <Outlet/>
                                      
                                      <br /><br />
                                      <Footer/>
                                      
                                      </div>
                                      </SuggestTripContextProvider>
                      </ReservationContextProvider>
                    </TripContextProvider>
                    </MapContextProvider>
              </CarContextProvider>
            </UserContextProvider>
  )
}

export default ClientLayout