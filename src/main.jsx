import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ColorSchemeProvider } from './contexts/ColorSchemeContext.jsx';
import { AuthContextProvider } from './contexts/AuthContext.jsx';
import { CarContextProvider } from './contexts/carContext.jsx';
import { TripContextProvider } from './contexts/TripContext.jsx'; // Importation de TripContextProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <ColorSchemeProvider>
        <CarContextProvider>
          <TripContextProvider> {/* TripContextProvider enveloppe App */}
            <App />
          </TripContextProvider>
        </CarContextProvider>
      </ColorSchemeProvider>
    </AuthContextProvider>
  </StrictMode>,
);
