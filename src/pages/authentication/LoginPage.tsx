import { FormEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../common/context/AuthContext';
import { request } from '../../common/helpers/request';
import { endpoint } from '../../common/helpers';

interface Props {
  initialMode?: 'organization' | 'employee';
}

export function LoginPage(props: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const defaultMode =
    props.initialMode ||
    (searchParams.get('mode') === 'employee' ? 'employee' : 'organization');

  const [loginMode, setLoginMode] = useState<'organization' | 'employee'>(defaultMode);

  // Organization Login State
  const [email, setEmail] = useState('admin@invoicely.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);

  // Employee Login State (pre-filled with default test credentials)
  const [organizationId, setOrganizationId] = useState('550e8400-e29b-41d4-a716-446655440000');
  const [employeeId, setEmployeeId] = useState('employee@invoicely.com');
  const [employeePassword, setEmployeePassword] = useState('password');
  const [showEmployeePassword, setShowEmployeePassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function handleOrgSubmit(e: FormEvent<HTMLFormElement>) {
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
    }, 600);
  }

  async function handleEmployeeSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);

    if (!organizationId.trim()) {
      setError('Please provide your Organization ID.');
      return;
    }
    if (!employeeId.trim()) {
      setError('Please provide your Employee ID or Email.');
      return;
    }
    if (!employeePassword) {
      setError('Please provide your password.');
      return;
    }

    setIsLoading(true);

    try {
      await request('POST', endpoint('/api/v1/auth/employee_login'), {
        organization_id: organizationId.trim(),
        employee_id: employeeId.trim(),
        password: employeePassword,
      });

      login({
        email: employeeId.trim(),
        name: employeeId.includes('@') ? employeeId.split('@')[0] : `Employee (${employeeId})`,
        avatar: 'EM',
      });
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        // Fallback for standalone frontend simulation
        login({
          email: employeeId.trim(),
          name: employeeId.includes('@') ? employeeId.split('@')[0] : `Employee (${employeeId})`,
          avatar: 'EM',
        });
        navigate('/dashboard');
      } else {
        setError('Invalid Organization ID, Employee ID, or password.');
      }
    } finally {
      setIsLoading(false);
    }
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
          <div
            className="login-brand-header"
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          >
            <div className="login-brand-icon">
              <span className="material-symbols-outlined">account_balance</span>
            </div>
            <span className="login-brand-name">Invoicely</span>
          </div>

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
        <div className="login-form-card">
          <div className="login-form-header">
            <h2 className="login-form-title">
              {loginMode === 'organization' ? 'Welcome back' : 'Employee Portal'}
            </h2>
            <p className="login-form-subtitle">
              {loginMode === 'organization'
                ? 'Sign in to your Invoicely account'
                : 'Sign in to your team workspace'}
            </p>
          </div>

          {/* ── Dual Mode Toggle Tabs ── */}
          <div className="login-tabs">
            <button
              type="button"
              className={`login-tab-btn ${loginMode === 'organization' ? 'active' : ''}`}
              onClick={() => {
                setLoginMode('organization');
                setError(undefined);
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                corporate_fare
              </span>
              Organization Login
            </button>
            <button
              type="button"
              className={`login-tab-btn ${loginMode === 'employee' ? 'active' : ''}`}
              onClick={() => {
                setLoginMode('employee');
                setError(undefined);
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                badge
              </span>
              Employee Login
            </button>
          </div>

          {/* ── Mode Container with fixed space & smooth fade ── */}
          <div className="login-mode-container">
            {loginMode === 'organization' ? (
              <div key="org" className="login-mode-content">
                {/* Google Login */}
                <div className="login-google-wrap">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
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
                <form className="login-form" onSubmit={handleOrgSubmit} noValidate>
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
              </div>
            ) : (
              <div key="emp" className="login-mode-content">
                {/* Employee Login Form */}
                <form className="login-form" onSubmit={handleEmployeeSubmit} noValidate>
                  <div className="login-field-group">
                    <label className="login-label" htmlFor="login-org-id">
                      Organization ID
                    </label>
                    <div className="login-input-wrap">
                      <span className="login-input-icon material-symbols-outlined">corporate_fare</span>
                      <input
                        id="login-org-id"
                        className="login-input"
                        type="text"
                        placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                        value={organizationId}
                        onChange={(e) => setOrganizationId(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="login-field-group">
                    <label className="login-label" htmlFor="login-employee-id">
                      Employee ID or Email
                    </label>
                    <div className="login-input-wrap">
                      <span className="login-input-icon material-symbols-outlined">badge</span>
                      <input
                        id="login-employee-id"
                        className="login-input"
                        type="text"
                        placeholder="e.g. EMP-101 or alice@company.com"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="login-field-group">
                    <div className="login-label-row">
                      <label className="login-label" htmlFor="login-emp-password">
                        Password
                      </label>
                    </div>
                    <div className="login-input-wrap">
                      <span className="login-input-icon material-symbols-outlined">lock</span>
                      <input
                        id="login-emp-password"
                        className="login-input login-input-password"
                        type={showEmployeePassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={employeePassword}
                        onChange={(e) => setEmployeePassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="login-toggle-password"
                        onClick={() => setShowEmployeePassword((v) => !v)}
                        aria-label={showEmployeePassword ? 'Hide password' : 'Show password'}
                      >
                        <span className="material-symbols-outlined">
                          {showEmployeePassword ? 'visibility_off' : 'visibility'}
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
                    id="login-emp-submit"
                    className="login-submit-btn"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="login-spinner" />
                    ) : (
                      <>
                        Sign in to Workspace
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* ── Fixed Footer Prompts ── */}
          <div className="login-form-footer">
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
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                  home
                </span>
                Go back to homepage
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
