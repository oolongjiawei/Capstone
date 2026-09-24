import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import { installDemoApi, DEMO_USER } from './demo/demoApi.js'

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true'
if (DEMO) installDemoApi(axios)

const demoBanner = {
  position: 'fixed', left: '50%', bottom: 12, transform: 'translateX(-50%)', zIndex: 1000,
  background: 'rgba(20, 16, 12, 0.88)', color: '#f5ead7', padding: '8px 14px', borderRadius: 999,
  font: '13px/1.4 system-ui, sans-serif', whiteSpace: 'nowrap', maxWidth: 'calc(100vw - 24px)', overflow: 'hidden', textOverflow: 'ellipsis',
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {DEMO && (
      <div style={demoBanner} role="note">
        Live demo · log in with <b>{DEMO_USER.email}</b> / <b>{DEMO_USER.password}</b> · data stays in your browser
      </div>
    )}
  </React.StrictMode>,
)
