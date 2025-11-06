
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import apiFetch from './src/utils/api';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
// quick backend health check on startup (logs to console). Uses the Vite proxy during dev.
(async function checkBackendAndRender() {
  try {
    const res = await apiFetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      console.info('Backend health:', data);
    } else {
      console.warn('Backend health check returned non-OK status', res.status);
    }
  } catch (err) {
    console.error('Backend health check failed:', err);
  } finally {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
})();
