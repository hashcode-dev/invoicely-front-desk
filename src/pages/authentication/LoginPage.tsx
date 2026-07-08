import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../common/context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);
    setIsLoading(true);

    // Simulate authentication — replace with real API call
    setTimeout(() => {
      if (email && password) {
        login({
          email,
          name: email.split('@')[0],
          avatar: email.slice(0, 2).toUpperCase(),
        });
        navigate('/dashboard');
      } else {
        setError('Please enter your email and password.');
        setIsLoading(false);
      }
    }, 900);
  }

  function handleGoogleSuccess(response: CredentialResponse) {
    const credential = response.credential;
    if (credential) {
      try {
        const payload = JSON.parse(atob(credential.split('.')[1]));
        login({
          email: payload.email ?? 'user@gmail.com',
          name: payload.name ?? 'Google User',
          avatar: (payload.name ?? 'GU').slice(0, 2).toUpperCase(),
          picture: payload.picture,
        });
      } catch {
        login({ email: 'user@gmail.com', name: 'Google User', avatar: 'GU' });
      }
      navigate('/dashboard');
    }
  }

  function handleGoogleError() {
    setError('Google sign-in failed. Please try again.');
  }

  return (
    <div className="login-root">
      {/* ── Left branding panel ── */}
      <div className="login-brand-panel">
        <div className="login-brand-inner">
          <div className="login-logo-wrap">
            <span className="material-symbols-outlined login-logo-icon">account_balance</span>
          </div>
          <h1 className="login-brand-name">Invoicely</h1>
          <p className="login-brand-tagline">Enterprise Suite</p>

          <div className="login-features">
            {[
              { icon: 'receipt_long', text: 'Smart invoice management' },
              { icon: 'analytics', text: 'Real-time financial insights' },
              { icon: 'group', text: 'Customer relationship hub' },
              { icon: 'shield', text: 'Bank-grade security' },
            ].map((f) => (
              <div className="login-feature-item" key={f.icon}>
                <div className="login-feature-icon-wrap">
                  <span className="material-symbols-outlined">{f.icon}</span>
                </div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          <div className="login-brand-orb login-brand-orb-1" />
          <div className="login-brand-orb login-brand-orb-2" />
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="login-form-panel">
        <button
          type="button"
          className="login-back-home"
          onClick={() => navigate('/')}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Home
        </button>
        <div className="login-form-card">
          <div className="login-form-header">
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-subtitle">Sign in to your Invoicely account</p>
          </div>

          {/* Google Login */}
          <div className="login-google-wrap">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="100%"
              text="signin_with"
              shape="rectangular"
            />
          </div>

          {/* Divider */}
          <div className="login-divider">
            <span className="login-divider-line" />
            <span className="login-divider-text">or continue with email</span>
            <span className="login-divider-line" />
          </div>

          {/* Email / Password Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field-group">
              <label className="login-label" htmlFor="login-email">
                Email address
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon material-symbols-outlined">mail</span>
                <input
                  id="login-email"
                  className="login-input"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field-group">
              <div className="login-label-row">
                <label className="login-label" htmlFor="login-password">
                  Password
                </label>
                <button type="button" className="login-forgot-link">
                  Forgot password?
                </button>
              </div>
              <div className="login-input-wrap">
                <span className="login-input-icon material-symbols-outlined">lock</span>
                <input
                  id="login-password"
                  className="login-input login-input-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error" role="alert">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            <button
              id="login-submit"
              className="login-submit-btn"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  Sign in
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <p className="login-register-prompt">
            Don&apos;t have an account?{' '}
            <button type="button" className="login-register-link">
              Request access
            </button>
          </p>

          <p className="login-register-prompt" style={{ marginTop: '12px' }}>
            <button
              type="button"
              className="login-register-link"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              onClick={() => navigate('/')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>home</span>
              Go back to homepage
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
