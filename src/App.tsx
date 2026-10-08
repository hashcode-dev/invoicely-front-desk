import React, { useState } from 'react';
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import classNames from 'classnames';
import { atom } from 'jotai';
import { useAuth } from './common/context/AuthContext';
import { useAuthenticated } from './common/hooks/useAuthenticated';
import {
  useFetchReactSettings,
  useReactSettings,
} from './common/hooks/useReactSettings';
import { CompanySwitcher } from './components/CompanySwitcher';
import { HelpSidebarIcons } from './components/HelpSidebarIcons';
import { Notifications } from './components/Notifications';
import { Tooltip } from './components/Tooltip';
import { useNavigation } from './components/layouts/common/navigation';
import { LoginPage } from './pages/authentication/LoginPage';
import { LandingPage } from './pages/landing/LandingPage';
import { routes } from './common/routes';
import { Toaster } from 'react-hot-toast';

export const refreshEntityDataBannerAtom = atom({
  refetchEntityId: '',
  refetchEntity: 'recurring_invoices' as 'invoices' | 'recurring_invoices',
  visible: false,
});

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate replace to="/login" />;
}

function Shell({ children }: { children: React.ReactNode }) {
  useAuthenticated();
  useFetchReactSettings();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();
  const reactSettings = useReactSettings();
  const [isCompactViewport, setIsCompactViewport] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 920px)').matches
  );
  const isMiniSidebar =
    Boolean(reactSettings.show_mini_sidebar) && !isCompactViewport;
  const [mobileOpen, setMobileOpen] = useState(false);
  const sideNavRef = React.useRef<HTMLElement>(null);
  const sidebarRef = React.useRef<HTMLElement>(null);
  const mobileToggleRef = React.useRef<HTMLButtonElement>(null);

  function closeMobileNavigation() {
    setMobileOpen(false);

    if (isCompactViewport) {
      mobileToggleRef.current?.focus();
    }
  }

  React.useEffect(() => {
    const compactViewport = window.matchMedia('(max-width: 920px)');
    const handleViewportChange = () =>
      setIsCompactViewport(compactViewport.matches);

    compactViewport.addEventListener('change', handleViewportChange);

    return () =>
      compactViewport.removeEventListener('change', handleViewportChange);
  }, []);

  React.useEffect(() => {
    if (isCompactViewport && !mobileOpen) {
      sidebarRef.current?.setAttribute('inert', '');
    } else {
      sidebarRef.current?.removeAttribute('inert');
    }
  }, [isCompactViewport, mobileOpen]);

  React.useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    sideNavRef.current?.querySelector<HTMLElement>('a[href]')?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        mobileToggleRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleSidebarWheel(e: React.WheelEvent<HTMLElement>) {
    if (sideNavRef.current && !sideNavRef.current.contains(e.target as Node)) {
      sideNavRef.current.scrollTop += e.deltaY;
    }
  }

  return (
    <div className="app-shell">
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={closeMobileNavigation}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className={classNames('sidebar', {
          mini: isMiniSidebar,
          'mobile-open': mobileOpen,
        })}
        onWheel={handleSidebarWheel}
        aria-hidden={isCompactViewport && !mobileOpen}
      >
        <div className="brand-block">
          <div className="brand-logo">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          {!isMiniSidebar && (
            <div className="brand-text">
              <h1>Invoicely</h1>
              <p>Enterprise Suite</p>
            </div>
          )}
        </div>

        {!isMiniSidebar && (
          <div className="company-switcher-container">
            <CompanySwitcher isCompactViewport={isCompactViewport} />
          </div>
        )}

        <nav
          ref={sideNavRef}
          className="side-nav"
          id="primary-navigation"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => {
            if (!item.visible) return null;
            const isItemActive =
              location.pathname === item.href ||
              location.pathname.startsWith(item.href + '/');

            const itemNode = (
              <div key={item.href} className="side-nav-group">
                <div
                  className={classNames('side-link-wrapper', {
                    'has-quick-add':
                      item.rightButton &&
                      !isMiniSidebar &&
                      item.rightButton.visible,
                  })}
                >
                  <NavLink
                    className={({ isActive }) =>
                      isActive || isItemActive
                        ? 'side-link active'
                        : 'side-link'
                    }
                    to={item.href}
                    onClick={closeMobileNavigation}
                  >
                    <span className="nav-icon">
                      <item.icon size="1.25rem" />
                    </span>
                    {!isMiniSidebar && (
                      <span className="nav-label">{item.name}</span>
                    )}
                  </NavLink>

                  {item.rightButton &&
                    !isMiniSidebar &&
                    item.rightButton.visible && (
                      <NavLink
                        to={item.rightButton.to}
                        className="quick-add-btn"
                        title={
                          item.rightButton.tooltipLabel ||
                          item.rightButton.label
                        }
                        aria-label={item.rightButton.label}
                        onClick={(e) => {
                          e.stopPropagation();
                          closeMobileNavigation();
                        }}
                      >
                        <item.rightButton.icon size="0.95rem" />
                      </NavLink>
                    )}
                </div>

                {item.subOptions && isItemActive && !isMiniSidebar && (
                  <div className="side-sub-nav">
                    {item.subOptions.map(
                      (sub) =>
                        sub.visible && (
                          <NavLink
                            key={sub.href}
                            to={sub.href}
                            className={({ isActive }) =>
                              isActive || location.pathname.startsWith(sub.href)
                                ? 'side-sub-link active'
                                : 'side-sub-link'
                            }
                            onClick={closeMobileNavigation}
                          >
                            <span>{sub.name}</span>
                          </NavLink>
                        )
                    )}
                  </div>
                )}
              </div>
            );

            if (isMiniSidebar) {
              return (
                <Tooltip
                  key={item.href}
                  message={item.name as string}
                  width="auto"
                  placement="right"
                  withoutArrow
                  withoutWrapping
                >
                  {itemNode}
                </Tooltip>
              );
            }

            return itemNode;
          })}
        </nav>

        <button
          className="primary-action"
          type="button"
          onClick={() => {
            navigate('/invoices/create');
            closeMobileNavigation();
          }}
        >
          <span className="material-symbols-outlined">add</span>
          {!isMiniSidebar && <span>Create Invoice</span>}
        </button>

        <div className="sidebar-footer">
          <HelpSidebarIcons isCompactViewport={isCompactViewport} />
        </div>
      </aside>

      <div className={classNames('main-pane', { mini: isMiniSidebar })}>
        <header className="topbar">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              ref={mobileToggleRef}
              className="icon-btn sidebar-toggle"
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="primary-navigation"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            <label className="search-box" htmlFor="global-search">
              <span className="material-symbols-outlined">search</span>
              <input
                id="global-search"
                placeholder="Search invoices, customers, reports..."
                type="text"
              />
            </label>
          </div>

          <div className="topbar-actions">
            <Notifications />
            <button
              className="icon-btn"
              type="button"
              aria-label="Help"
              onClick={() =>
                window.open('https://invoiceninja.github.io', '_blank')
              }
            >
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <div className="profile-chip">
              <div>
                <strong>{user?.name ?? 'User'}</strong>
                <small>{user?.email ?? ''}</small>
              </div>
              {user?.picture ? (
                <img
                  src={user.picture}
                  className="avatar"
                  alt={user.name}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="avatar">{user?.avatar ?? 'U'}</div>
              )}
            </div>
            <button
              className="icon-btn"
              type="button"
              title="Sign out"
              onClick={handleLogout}
              aria-label="Sign out"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Landing page — public marketing route */}
        <Route element={<LandingPage />} path="/" />

        {/* Auth routes */}
        <Route element={<LoginPage />} path="/login" />

        {/* Protected app routes — wrapped in Shell + RequireAuth */}
        <Route
          path="/*"
          element={
            <RequireAuth>
              <Shell>{routes}</Shell>
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}
