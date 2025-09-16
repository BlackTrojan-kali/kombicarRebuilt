import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ColorSchemeProvider } from './contexts/ColorSchemeContext.jsx';
import { AuthContextProvider } from './contexts/AuthContext.jsx';
import { CarContextProvider } from './contexts/carContext.jsx';
import { TripContextProvider } from './contexts/TripContext.jsx'; // Importation de TripContextProvider
import { UserContextProvider } from './contexts/UserContext.jsx';
import { DrivingLicenceProvider } from './contexts/DrivingLicenceContext.jsx';
import { PromoCodeContextProvider } from './contexts/PromoCodeCotext.jsx';
import { ReservationContextProvider } from './contexts/ReservationContext.jsx';
import { MapContextProvider } from './contexts/MapContext.jsx';
import { WithdrawContextProvider } from './contexts/withdrawContext.jsx';
import { ReviewContextProvider } from './contexts/reviewContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <AuthContextProvider>
      <ReviewContextProvider>
    <WithdrawContextProvider>
      <ColorSchemeProvider>
        <CarContextProvider>
          <TripContextProvider> {/* TripContextProvider enveloppe App */}
            <UserContextProvider>
                <DrivingLicenceProvider>
                <PromoCodeContextProvider> 
                <ReservationContextProvider> 
                <MapContextProvider>
                <App />
               </MapContextProvider>
               </ReservationContextProvider>
            </PromoCodeContextProvider>
            </DrivingLicenceProvider>
            </UserContextProvider>
          </TripContextProvider>
        </CarContextProvider>
      </ColorSchemeProvider>

      </WithdrawContextProvider>
      </ReviewContextProvider>
    </AuthContextProvider>
  </StrictMode>,
);
