// main.jsx — Entry point for the React app
// This is the first file that runs. It mounts the App component
// into the HTML div with id="root" in index.html

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode helps catch bugs during development
// createRoot is the modern React 18 way to render the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)