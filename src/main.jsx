import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ColorSchemeProvider } from './contexts/ColorSchemeContext.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
    <ColorSchemeProvider>
    <App />
    </ColorSchemeProvider>
    </AuthContextProvider>
  </StrictMode>,
)
