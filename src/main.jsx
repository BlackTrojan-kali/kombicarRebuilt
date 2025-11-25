import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthContextProvider } from './contexts/AuthContext.jsx';
import { ColorSchemeProvider } from './contexts/ColorSchemeContext.jsx';
import { NotificationContextProvider } from './contexts/NotificationContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
        <AuthContextProvider>
          <ColorSchemeProvider>
    
                                  <NotificationContextProvider>
                                  <App />
                        </NotificationContextProvider>
      </ColorSchemeProvider>
    </AuthContextProvider>
  </StrictMode>
);