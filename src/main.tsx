import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './app/App';
import './index.css';

// Keep PWA automatically synced with the latest Vercel deployment
if ('serviceWorker' in navigator) {
  const hadController = Boolean(navigator.serviceWorker.controller);
  let hasReloadedForUpdate = false;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    const isOAuthCallback =
      window.location.search.includes('code=') ||
      window.location.hash.includes('access_token=');

    if (hadController && !hasReloadedForUpdate && !isOAuthCallback) {
      hasReloadedForUpdate = true;
      window.location.reload();
    }
  });
}

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true);
  },
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;

    // Check immediately for a newer service worker on load
    registration.update().catch(() => {});

    // Also check whenever the user switches back to the app/tab
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        registration.update().catch(() => {});
      }
    });
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
