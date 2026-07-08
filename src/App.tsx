import { FormEvent } from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { atom } from 'jotai';
import { useAuth } from './common/context/AuthContext';
import { LoginPage } from './pages/authentication/LoginPage';
import { LandingPage } from './pages/landing/LandingPage';

type NavItem = {
  label: string;
  path: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Invoices', path: '/invoices', icon: 'receipt_long' },
  { label: 'Customers', path: '/customers', icon: 'group' },
  { label: 'Products', path: '/products', icon: 'inventory_2' },
  { label: 'Services', path: '/services', icon: 'design_services' },
  { label: 'Reports', path: '/reports', icon: 'analytics' },
  { label: 'Settings', path: '/settings', icon: 'settings' },
];

const invoices = [
  { id: 'INV-2026-041', customer: 'Vanguard Systems', amount: '$12,480', status: 'Paid', due: 'Apr 02, 2026' },
  { id: 'INV-2026-042', customer: 'Northline Retail', amount: '$8,190', status: 'Pending', due: 'Apr 14, 2026' },
  { id: 'INV-2026-043', customer: 'Orion Logistics', amount: '$17,950', status: 'Overdue', due: 'Mar 27, 2026' },
  { id: 'INV-2026-044', customer: 'Solaris Tech', amount: '$5,700', status: 'Draft', due: 'Apr 18, 2026' },
];

const customers = [
  { name: 'Vanguard Systems', owner: 'Riley Moore', outstanding: '$14,200', invoices: 22, status: 'Healthy' },
  { name: 'Orion Logistics', owner: 'Maya Bell', outstanding: '$31,600', invoices: 14, status: 'At Risk' },
  { name: 'Northline Retail', owner: 'Noah Clark', outstanding: '$7,920', invoices: 11, status: 'Healthy' },
  { name: 'Evo Manufacturing', owner: 'Sofia King', outstanding: '$19,450', invoices: 17, status: 'Review' },
];

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-logo">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <div>
            <h1>Invoicely</h1>
            <p>Enterprise Suite</p>
          </div>
        </div>

        <nav className="side-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')}
              to={item.path}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="primary-action" type="button">
          <span className="material-symbols-outlined">add</span>
          Create Invoice
        </button>
      </aside>

      <div className="main-pane">
        <header className="topbar">
          <label className="search-box" htmlFor="global-search">
            <span className="material-symbols-outlined">search</span>
            <input id="global-search" placeholder="Search invoices, customers, reports..." type="text" />
          </label>

          <div className="topbar-actions">
            <button className="icon-btn" type="button">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="icon-btn" type="button">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <div className="profile-chip">
              <div>
                <strong>{user?.name ?? 'User'}</strong>
                <small>{user?.email ?? ''}</small>
              </div>
              {user?.picture ? (
                <img src={user.picture} className="avatar" alt={user.name} style={{ objectFit: 'cover' }} />
              ) : (
                <div className="avatar">{user?.avatar ?? 'U'}</div>
              )}
            </div>
            <button className="icon-btn" type="button" title="Sign out" onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {actions ? <div className="header-actions">{actions}</div> : null}
    </div>
  );
}

function DashboardPage() {
  return (
    <>
      <SectionHeader
        actions={
          <>
            <button className="ghost-btn" type="button">Last 30 Days</button>
            <button className="ghost-btn" type="button">Export</button>
          </>
        }
        subtitle="Financial health overview for the current quarter."
        title="Executive Dashboard"
      />

      <section className="kpi-grid">
        <article className="kpi-card">
          <p>Total Revenue</p>
          <h3>$452,000</h3>
          <span className="badge success">+12.5%</span>
        </article>
        <article className="kpi-card">
          <p>Outstanding Payments</p>
          <h3>$89,400</h3>
          <span className="badge neutral">Pending</span>
        </article>
        <article className="kpi-card">
          <p>Overdue Invoices</p>
          <h3>14</h3>
          <span className="badge danger">Attention</span>
        </article>
        <article className="kpi-card">
          <p>Collection Rate</p>
          <h3>96.2%</h3>
          <span className="badge success">+2.1%</span>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel wide">
          <div className="panel-header">
            <h4>Revenue Trends</h4>
            <span className="badge success">+12.4%</span>
          </div>
          <div className="bar-chart" aria-label="Revenue trend bars" role="img">
            {[38, 50, 42, 62, 71, 58, 80].map((height) => (
              <div key={height} className="bar" style={{ height: `${height}%` }} />
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h4>Cash Flow</h4>
          </div>
          <ul className="list-metrics">
            <li><span>Incoming</span><strong>$124,800</strong></li>
            <li><span>Outgoing</span><strong>$61,300</strong></li>
            <li><span>Net</span><strong>$63,500</strong></li>
          </ul>
        </article>
      </section>
    </>
  );
}

function InvoiceListPage() {
  return (
    <>
      <SectionHeader
        actions={
          <>
            <button className="ghost-btn" type="button">CSV</button>
            <button className="ghost-btn" type="button">PDF</button>
          </>
        }
        subtitle="Track payment status, due dates, and customer balances."
        title="Invoice Management"
      />

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.customer}</td>
                  <td>{invoice.amount}</td>
                  <td><span className={`badge ${invoice.status.toLowerCase()}`}>{invoice.status}</span></td>
                  <td>{invoice.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function NewInvoicePage() {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <SectionHeader
        actions={
          <>
            <button className="ghost-btn" type="button">Save Draft</button>
            <button className="primary-btn" type="button">Send Invoice</button>
          </>
        }
        subtitle="Create and send invoices with line items and tax details."
        title="Create New Invoice"
      />

      <form className="invoice-form" onSubmit={onSubmit}>
        <section className="panel">
          <h4>Client Information</h4>
          <div className="form-grid">
            <label>
              Client Name
              <input defaultValue="Vanguard Systems" type="text" />
            </label>
            <label>
              Invoice Number
              <input defaultValue="INV-2026-045" type="text" />
            </label>
            <label>
              Billing Date
              <input defaultValue="2026-04-10" type="date" />
            </label>
            <label>
              Due Date
              <input defaultValue="2026-04-24" type="date" />
            </label>
          </div>
        </section>

        <section className="panel">
          <h4>Line Items</h4>
          <div className="form-grid">
            <label>
              Description
              <input defaultValue="Design system implementation" type="text" />
            </label>
            <label>
              Quantity
              <input defaultValue="1" type="number" />
            </label>
            <label>
              Rate
              <input defaultValue="5700" type="number" />
            </label>
            <label>
              Tax
              <input defaultValue="18" type="number" />
            </label>
          </div>
        </section>
      </form>
    </>
  );
}

function CustomersPage() {
  return (
    <>
      <SectionHeader
        actions={<button className="primary-btn" type="button">Add Customer</button>}
        subtitle="Manage enterprise relationships and receivable risk."
        title="Customer Management"
      />

      <section className="content-grid">
        <article className="panel wide">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Owner</th>
                  <th>Outstanding</th>
                  <th>Invoices</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.name}>
                    <td>{customer.name}</td>
                    <td>{customer.owner}</td>
                    <td>{customer.outstanding}</td>
                    <td>{customer.invoices}</td>
                    <td><span className={`badge ${customer.status.toLowerCase().replace(' ', '-')}`}>{customer.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel">
          <h4>Customer Insights</h4>
          <ul className="list-metrics">
            <li><span>Total Customers</span><strong>1,284</strong></li>
            <li><span>Avg. Payment Time</span><strong>18 days</strong></li>
            <li><span>Past Due Accounts</span><strong>14</strong></li>
          </ul>
        </article>
      </section>
    </>
  );
}

function ReportsPage() {
  return (
    <>
      <SectionHeader
        actions={
          <>
            <button className="ghost-btn" type="button">Last 30 Days</button>
            <button className="primary-btn" type="button">Export Report</button>
          </>
        }
        subtitle="Performance metrics for the ongoing fiscal year."
        title="Financial Intelligence"
      />

      <section className="kpi-grid">
        <article className="kpi-card"><p>Gross Revenue</p><h3>$2.4M</h3><span className="badge success">+15%</span></article>
        <article className="kpi-card"><p>Net Profit</p><h3>$986K</h3><span className="badge success">+9%</span></article>
        <article className="kpi-card"><p>Expenses</p><h3>$1.4M</h3><span className="badge neutral">Stable</span></article>
        <article className="kpi-card"><p>Overdue Share</p><h3>3.2%</h3><span className="badge danger">Watch</span></article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h4>Monthly Performance Snapshot</h4>
        </div>
        <div className="bar-chart" aria-label="Monthly performance bars" role="img">
          {[45, 57, 53, 66, 78, 72, 84, 88].map((height) => (
            <div key={height} className="bar" style={{ height: `${height}%` }} />
          ))}
        </div>
      </section>
    </>
  );
}

function ProductsPage() {
  return (
    <section className="panel">
      <h4>Products</h4>
      <p>Manage your product catalog — add, edit, and organise physical or digital products used in invoices.</p>
    </section>
  );
}

function ServicesPage() {
  return (
    <section className="panel">
      <h4>Services</h4>
      <p>Define billable services and hourly rates to quickly attach them to invoices and quotes.</p>
    </section>
  );
}

function SettingsPage() {
  return (
    <section className="panel">
      <h4>Settings</h4>
      <p>Invoicely configuration workspace is ready for further integration from the `ui-main` modules.</p>
    </section>
  );
}

export function App() {
  return (
    <Routes>
      {/* Landing page — public marketing route */}
      <Route element={<LandingPage />} path="/" />

      {/* Auth routes */}
      <Route element={<LoginPage />} path="/login" />

      {/* Protected routes — wrapped in Shell + RequireAuth */}
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Shell>
              <Routes>
                <Route element={<Navigate replace to="/dashboard" />} path="/" />
                <Route element={<DashboardPage />} path="/dashboard" />
                <Route element={<InvoiceListPage />} path="/invoices" />
                <Route element={<NewInvoicePage />} path="/invoices/new" />
                <Route element={<CustomersPage />} path="/customers" />
                <Route element={<ProductsPage />} path="/products" />
                <Route element={<ServicesPage />} path="/services" />
                <Route element={<ReportsPage />} path="/reports" />
                <Route element={<SettingsPage />} path="/settings" />
              </Routes>
            </Shell>
          </RequireAuth>
        }
      />
    </Routes>
  );
}
