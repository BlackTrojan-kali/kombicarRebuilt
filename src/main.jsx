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
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <GoogleOAuthProvider clientId="246979621166-sah339sh5nge2n3epsdbj1kegv60htqb.apps.googleusercontent.com">
    
      <ColorSchemeProvider>
        <CarContextProvider>
          <TripContextProvider> {/* TripContextProvider enveloppe App */}
            <UserContextProvider>
              <DrivingLicenceProvider>
              <PromoCodeContextProvider> 
              <ReservationContextProvider> 
               <App />
               </ReservationContextProvider>
            </PromoCodeContextProvider>
            </DrivingLicenceProvider>
            </UserContextProvider>
          </TripContextProvider>
        </CarContextProvider>
      </ColorSchemeProvider>
      </GoogleOAuthProvider>
    </AuthContextProvider>
  </StrictMode>,
);
