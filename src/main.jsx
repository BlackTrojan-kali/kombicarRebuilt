import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Importations
import { AuthContextProvider } from './contexts/AuthContext.jsx';
import { ColorSchemeProvider } from './contexts/ColorSchemeContext.jsx';
import { SidebarProvider } from './contexts/SidebarContext.jsx';

// Contextes de données fondamentales/gestion des utilisateurs
import { UserContextProvider } from './contexts/UserContext.jsx';
import { RoleProvider } from './contexts/RoleContext.jsx';
import { PermissionProvider } from './contexts/PermissionContext.jsx';
import { CarContextProvider } from './contexts/carContext.jsx';
import { DrivingLicenceProvider } from './contexts/DrivingLicenceContext.jsx';
import { NotificationContextProvider } from './contexts/NotificationContext.jsx';

// Contextes de flux (Trips, Réservations, Map, Finances, Avis)
import { MapContextProvider } from './contexts/MapContext.jsx';
import { TripContextProvider } from './contexts/TripContext.jsx';
import { ReservationContextProvider } from './contexts/ReservationContext.jsx';
import { PromoCodeContextProvider } from './contexts/PromoCodeCotext.jsx';
import { WithdrawContextProvider } from './contexts/withdrawContext.jsx';
import { ReviewContextProvider } from './contexts/reviewContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    {/* 1. CONTEXTES FONDAMENTAUX (Authentification/Thème) */}
    <AuthContextProvider>
      <ColorSchemeProvider>

        {/* 2. CONTEXTES D'UTILISATEURS/RÔLES (Dépend de Auth) */}
        <RoleProvider>
          <PermissionProvider> {/* Dépend de Role */}
            <UserContextProvider>

              {/* 3. CONTEXTES D'ENTITÉS (Véhicules, Licences, Promotions) */}
              <CarContextProvider>
                <DrivingLicenceProvider>
                  <PromoCodeContextProvider> 

                    {/* 4. CONTEXTES DE FLUX/TRANSACTIONS (Map, Trips, Réservations, Retraits) */}
                    <MapContextProvider>
                      <TripContextProvider>
                        <ReservationContextProvider> {/* Dépend de Trip */}

                          {/* 5. CONTEXTES SECONDAIRES/FINAUX (Avis, Notifications, UI) */}
                          <ReviewContextProvider>
                            <WithdrawContextProvider>
                              <NotificationContextProvider>
                                <SidebarProvider> {/* Enveloppe final pour le layout */}
                                  <App />
                                </SidebarProvider>
                              </NotificationContextProvider>
                            </WithdrawContextProvider>
                          </ReviewContextProvider>

                      </ReservationContextProvider>
                    </TripContextProvider>
                    </MapContextProvider>

                  </PromoCodeContextProvider>
                </DrivingLicenceProvider>
              </CarContextProvider>

            </UserContextProvider>
          </PermissionProvider>
        </RoleProvider>

      </ColorSchemeProvider>
    </AuthContextProvider>
  </StrictMode>
);