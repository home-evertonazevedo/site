import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RaffleProvider } from './contexts/RaffleContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RaffleProvider>
      <App />
    </RaffleProvider>
  </StrictMode>,
)
