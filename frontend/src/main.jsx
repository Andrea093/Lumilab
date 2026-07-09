import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AccessibilityProvider } from './context/AccessibilityContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AccessibilityProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AccessibilityProvider>
  </React.StrictMode>,
)
