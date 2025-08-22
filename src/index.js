import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { Analytics } from '@vercel/analytics/react'; // 👈 agregado

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Analytics /> {/* 👈 agregado */}
  </React.StrictMode>
);

serviceWorkerRegistration.unregister();
