import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Log de diagnostic visible dans la console F12
console.log("%c Cuisin'Home AI %c Booting React engine...", "background: #C5A358; color: white; padding: 4px; border-radius: 4px;", "color: #C5A358; font-weight: bold;");

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log("React mount: Success");
    } catch (err) {
      console.error("React mount: Failed", err);
      const debug = document.getElementById('debug-error');
      if (debug) {
        debug.style.display = 'block';
        debug.innerText += '\nMount Error: ' + err;
      }
    }
  } else {
    console.error("Critical: #root element not found in DOM");
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}