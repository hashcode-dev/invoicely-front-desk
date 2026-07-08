import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import mitt from 'mitt';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './common/context/AuthContext';
import { App } from './App';
import './resources/css/app.css';

// Replace with your actual Google OAuth Client ID from console.cloud.google.com
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '000000000000-placeholder.apps.googleusercontent.com';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

createRoot(container).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

export const emitter: any = mitt();
