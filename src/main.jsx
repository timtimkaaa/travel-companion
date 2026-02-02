import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerServiceWorker } from './pwa/registerSW'
import { setupInstallPrompt } from './pwa/install'


registerServiceWorker();
setupInstallPrompt();


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
