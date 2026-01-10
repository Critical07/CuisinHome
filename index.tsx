import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log("%c Cuisin'Home AI %c System starting...", "background: #C5A358; color: white; padding: 4px; border-radius: 4px;", "color: #C5A358; font-weight: bold;");

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Mounting failed", err);
    const debug = document.getElementById('debug-error');
    if (debug) {
      debug.style.display = 'block';
      debug.innerText += '\nMount Error: ' + err;
    }
  }
}