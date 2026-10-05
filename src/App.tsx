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
  const isMiniSidebar = Boolean(reactSettings.show_mini_sidebar);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sideNavRef = React.useRef<HTMLElement>(null);

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
          className="mobile-overlay md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={classNames('sidebar', {
          mini: isMiniSidebar,
          'mobile-open': mobileOpen,
        })}
        onWheel={handleSidebarWheel}
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
            <CompanySwitcher />
          </div>
        )}

        <nav ref={sideNavRef} className="side-nav">
          {navigation.map((item) => {
            if (!item.visible) return null;
            const isItemActive =
              location.pathname === item.href ||
              location.pathname.startsWith(item.href + '/');

            const itemNode = (
              <div key={item.href} className="side-nav-group">
                <div className="side-link-wrapper">
                  <NavLink
                    className={({ isActive }) =>
                      isActive || isItemActive
                        ? 'side-link active'
                        : 'side-link'
                    }
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileOpen(false);
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
                            onClick={() => setMobileOpen(false)}
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
            setMobileOpen(false);
          }}
        >
          <span className="material-symbols-outlined">add</span>
          {!isMiniSidebar && <span>Create Invoice</span>}
        </button>

        <div className="sidebar-footer">
          <HelpSidebarIcons />
        </div>
      </aside>

      <div className={classNames('main-pane', { mini: isMiniSidebar })}>
        <header className="topbar">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              className="icon-btn md:hidden"
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
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
