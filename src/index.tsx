import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import mitt from 'mitt';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './common/context/AuthContext';
import { store } from './common/stores/store';
import { ScrollToTop } from './components/ScrollToTop';
import { Events } from './common/events';
import { App } from './App';
import en from './resources/lang/en/en.json';

import './resources/css/app.css';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

const Router =
  import.meta.env.VITE_ROUTER === 'hash' ? HashRouter : BrowserRouter;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      networkMode: 'offlineFirst',
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
});

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '000000000000-placeholder.apps.googleusercontent.com';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

createRoot(container).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <Router>
              <ScrollToTop>
                <App />
              </ScrollToTop>
            </Router>
          </AuthProvider>
        </GoogleOAuthProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);

export const emitter = mitt<Events>();
