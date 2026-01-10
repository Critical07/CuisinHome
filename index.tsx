import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log("%c Cuisin'Home AI %c Système en cours de démarrage...", "background: #C5A358; color: white; padding: 4px; border-radius: 4px;", "color: #C5A358; font-weight: bold;");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Élément racine 'root' introuvable dans le DOM.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Application montée avec succès.");
  } catch (error) {
    console.error("Erreur lors du montage de l'application :", error);
    if (rootElement) {
      rootElement.innerHTML = `<div style="padding: 20px; color: #ef4444; font-family: sans-serif; text-align: center;">
        <h2 style="font-weight: 800; margin-bottom: 8px;">Erreur de lancement</h2>
        <p style="font-size: 14px; opacity: 0.8;">${error instanceof Error ? error.message : String(error)}</p>
      </div>`;
    }
  }
}
