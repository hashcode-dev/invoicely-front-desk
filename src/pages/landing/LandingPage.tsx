import { useNavigate } from 'react-router-dom';
import '../../resources/css/landing.css';

const features = [
  {
    icon: 'receipt_long',
    title: 'Smart Invoicing',
    desc: 'Create, send, and track professional invoices in seconds. Automate recurring billing and never miss a payment.',
  },
  {
    icon: 'analytics',
    title: 'Financial Intelligence',
    desc: 'Deep analytics dashboards reveal cash flow trends, overdue risks, and revenue forecasts at a glance.',
  },
  {
    icon: 'group',
    title: 'Customer CRM',
    desc: 'Manage enterprise relationships, track outstanding balances, and get instant risk signals per account.',
  },
  {
    icon: 'task_alt',
    title: 'Workflow Automation',
    desc: 'Set up auto-reminders, recurring invoices, and approval flows to eliminate manual follow-ups forever.',
  },
  {
    icon: 'lock',
    title: 'Bank-Grade Security',
    desc: 'OAuth 2.0 authentication, encrypted data at rest, and role-based access keep your financials safe.',
  },
  {
    icon: 'cloud_sync',
    title: 'Real-Time Sync',
    desc: 'All data syncs live across your team. Collaborate on invoices, quotes, and reports without refresh.',
  },
];

const stats = [
  { value: '$2.4B+', label: 'Invoices Processed' },
  { value: '50K+', label: 'Active Businesses' },
  { value: '96.2%', label: 'Collection Rate' },
  { value: '18 Days', label: 'Avg. Payment Time' },
];

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    highlight: false,
    features: ['Up to 5 invoices/month', '1 user', 'Basic dashboard', 'PDF export', 'Email support'],
    cta: 'Get Started Free',
  },
  {
    name: 'Growth',
    price: '$29',
    period: 'per month',
    highlight: true,
    badge: 'Most Popular',
    features: ['Unlimited invoices', '5 team members', 'Advanced analytics', 'Recurring billing', 'Priority support', 'Custom branding'],
    cta: 'Start 14-Day Trial',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    highlight: false,
    features: ['Unlimited everything', 'Unlimited users', 'Dedicated CSM', 'SLA guarantee', 'API access', 'SSO & RBAC'],
    cta: 'Talk to Sales',
  },
];

const testimonials = [
  {
    quote: 'Invoicely cut our billing cycle from 5 days to same-day. The analytics alone paid for itself in the first week.',
    name: 'Riley Moore',
    title: 'CFO, Vanguard Systems',
    avatar: 'RM',
    color: '#004bca',
  },
  {
    quote: 'We went from chasing overdue invoices manually to having automated reminders that just work. It\'s like hiring a full-time AR team.',
    name: 'Maya Bell',
    title: 'Finance Director, Orion Logistics',
    avatar: 'MB',
    color: '#007f57',
  },
  {
    quote: 'The enterprise dashboard gives our CFO instant visibility. We closed our last funding round with Invoicely reports.',
    name: 'Noah Clark',
    title: 'CEO, Northline Retail',
    avatar: 'NC',
    color: '#6344d5',
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="lp-root">
      {/* ── NAV ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-brand">
            <div className="lp-brand-icon">
              <span className="material-symbols-outlined">account_balance</span>
            </div>
            <span className="lp-brand-name">Invoicely</span>
          </div>
          <div className="lp-nav-links">
            <a href="#features" className="lp-nav-link">Features</a>
            <a href="#stats" className="lp-nav-link">Stats</a>
            <a href="#pricing" className="lp-nav-link">Pricing</a>
            <a href="#testimonials" className="lp-nav-link">Customers</a>
          </div>
          <div className="lp-nav-actions">
            <button className="lp-btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
            <button className="lp-btn-primary" onClick={() => navigate('/login')}>Start Free Trial</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        {/* Background orbs */}
        <div className="lp-orb lp-orb-1" />
        <div className="lp-orb lp-orb-2" />
        <div className="lp-orb lp-orb-3" />

        <div className="lp-hero-inner">
          <div className="lp-hero-badge">
            <span className="material-symbols-outlined">bolt</span>
            New: AI-powered cash flow forecasting
          </div>

          <h1 className="lp-hero-title">
            Enterprise Invoicing,
            <br />
            <span className="lp-gradient-text">Reimagined.</span>
          </h1>

          <p className="lp-hero-subtitle">
            Invoicely is the all-in-one financial command center for modern businesses. Create, send, and collect invoices with intelligence — while real-time analytics give you total financial visibility.
          </p>

          <div className="lp-hero-actions">
            <button className="lp-btn-hero-primary" onClick={() => navigate('/login')}>
              <span className="material-symbols-outlined">rocket_launch</span>
              Get Started Free
            </button>
            <button className="lp-btn-hero-ghost" onClick={() => navigate('/login')}>
              <span className="material-symbols-outlined">play_circle</span>
              Watch Demo
            </button>
          </div>

          <div className="lp-hero-trust">
            <span className="lp-trust-dot" />
            <span>No credit card required</span>
            <span className="lp-trust-sep">·</span>
            <span>14-day free trial</span>
            <span className="lp-trust-sep">·</span>
            <span>Cancel anytime</span>
          </div>

          {/* Dashboard Preview */}
          <div className="lp-dashboard-preview">
            <div className="lp-preview-bar">
              <div className="lp-preview-dots">
                <span /><span /><span />
              </div>
              <div className="lp-preview-url">app.invoicely.io/dashboard</div>
            </div>
            <div className="lp-preview-body">
              {/* Mini dashboard mock */}
              <div className="lp-preview-sidebar">
                <div className="lp-preview-logo" />
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`lp-preview-nav-item ${i === 0 ? 'active' : ''}`} />
                ))}
              </div>
              <div className="lp-preview-content">
                <div className="lp-preview-topbar">
                  <div className="lp-preview-search" />
                  <div className="lp-preview-avatar" />
                </div>
                <div className="lp-preview-kpis">
                  {['$452K', '$89K', '14', '96.2%'].map((val, i) => (
                    <div key={i} className={`lp-preview-kpi lp-preview-kpi-${i}`}>
                      <div className="lp-preview-kpi-val">{val}</div>
                      <div className="lp-preview-kpi-label" />
                    </div>
                  ))}
                </div>
                <div className="lp-preview-chart">
                  {[38, 50, 42, 62, 71, 58, 80, 74].map((h, i) => (
                    <div key={i} className="lp-preview-bar" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="lp-stats" id="stats">
        <div className="lp-container">
          <div className="lp-stats-grid">
            {stats.map((s) => (
              <div key={s.value} className="lp-stat-card">
                <div className="lp-stat-value">{s.value}</div>
                <div className="lp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-features" id="features">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-section-badge">Everything you need</div>
            <h2 className="lp-section-title">Built for the way finance teams actually work</h2>
            <p className="lp-section-subtitle">
              From one-click invoice creation to deep AR analytics, Invoicely covers your entire billing workflow — so your team can focus on growth, not admin.
            </p>
          </div>

          <div className="lp-features-grid">
            {features.map((f) => (
              <div key={f.title} className="lp-feature-card">
                <div className="lp-feature-icon-wrap">
                  <span className="material-symbols-outlined lp-feature-icon">{f.icon}</span>
                </div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW SPOTLIGHT ── */}
      <section className="lp-spotlight">
        <div className="lp-container lp-spotlight-inner">
          <div className="lp-spotlight-text">
            <div className="lp-section-badge">Invoice Workflow</div>
            <h2 className="lp-section-title lp-left">Create & send invoices in under 60 seconds</h2>
            <p className="lp-section-subtitle lp-left">
              Fill in client details, add line items, apply taxes — then send with one click. Your client gets a beautifully branded PDF and a payment link instantly.
            </p>
            <ul className="lp-checklist">
              <li><span className="material-symbols-outlined">check_circle</span>Auto-fill customer info from your CRM</li>
              <li><span className="material-symbols-outlined">check_circle</span>Line item catalog with tax presets</li>
              <li><span className="material-symbols-outlined">check_circle</span>Custom branding: your logo, colors, domain</li>
              <li><span className="material-symbols-outlined">check_circle</span>Send via email, link, or WhatsApp</li>
            </ul>
            <button className="lp-btn-primary lp-spotlight-cta" onClick={() => navigate('/login')}>
              Try Invoice Creation →
            </button>
          </div>
          <div className="lp-spotlight-visual">
            <div className="lp-invoice-card">
              <div className="lp-invoice-header">
                <div>
                  <div className="lp-invoice-company">Invoicely</div>
                  <div className="lp-invoice-sub">Enterprise Suite</div>
                </div>
                <div className="lp-invoice-badge-paid">PAID</div>
              </div>
              <div className="lp-invoice-divider" />
              <div className="lp-invoice-to">
                <div className="lp-invoice-to-label">Bill To</div>
                <div className="lp-invoice-to-name">Vanguard Systems</div>
                <div className="lp-invoice-to-sub">Riley Moore · CFO</div>
              </div>
              <div className="lp-invoice-items">
                <div className="lp-invoice-item">
                  <span>Design System Implementation</span><span>$5,700</span>
                </div>
                <div className="lp-invoice-item">
                  <span>Consulting (40 hrs × $150)</span><span>$6,000</span>
                </div>
                <div className="lp-invoice-item lp-invoice-tax">
                  <span>GST 18%</span><span>$2,106</span>
                </div>
              </div>
              <div className="lp-invoice-divider" />
              <div className="lp-invoice-total">
                <span>Total Due</span><span>$13,806</span>
              </div>
              <div className="lp-invoice-actions">
                <button className="lp-invoice-btn-pay">Pay Now</button>
                <button className="lp-invoice-btn-dl">Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="lp-testimonials" id="testimonials">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-section-badge">Customer Stories</div>
            <h2 className="lp-section-title">Trusted by finance leaders worldwide</h2>
          </div>
          <div className="lp-testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.name} className="lp-testimonial-card">
                <div className="lp-testimonial-stars">★★★★★</div>
                <p className="lp-testimonial-quote">"{t.quote}"</p>
                <div className="lp-testimonial-author">
                  <div className="lp-testimonial-avatar" style={{ background: t.color }}>{t.avatar}</div>
                  <div>
                    <div className="lp-testimonial-name">{t.name}</div>
                    <div className="lp-testimonial-title">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="lp-pricing" id="pricing">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-section-badge">Pricing</div>
            <h2 className="lp-section-title">Simple, transparent pricing</h2>
            <p className="lp-section-subtitle">Start free. Scale as you grow. No hidden fees, ever.</p>
          </div>
          <div className="lp-pricing-grid">
            {plans.map((plan) => (
              <div key={plan.name} className={`lp-plan-card ${plan.highlight ? 'lp-plan-highlight' : ''}`}>
                {plan.badge && <div className="lp-plan-badge">{plan.badge}</div>}
                <div className="lp-plan-name">{plan.name}</div>
                <div className="lp-plan-price">
                  {plan.price}
                  {plan.price !== 'Custom' && <span className="lp-plan-period">/{plan.period.split(' ')[0]}</span>}
                </div>
                <div className="lp-plan-period-label">{plan.period}</div>
                <ul className="lp-plan-features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <span className="material-symbols-outlined">check</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={plan.highlight ? 'lp-btn-hero-primary lp-plan-cta' : 'lp-btn-ghost-dark lp-plan-cta'}
                  onClick={() => navigate('/login')}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="lp-cta-banner">
        <div className="lp-cta-orb lp-cta-orb-1" />
        <div className="lp-cta-orb lp-cta-orb-2" />
        <div className="lp-container lp-cta-inner">
          <h2 className="lp-cta-title">Ready to transform your billing?</h2>
          <p className="lp-cta-subtitle">Join 50,000+ businesses already using Invoicely to get paid faster.</p>
          <div className="lp-cta-actions">
            <button className="lp-btn-cta-white" onClick={() => navigate('/login')}>
              <span className="material-symbols-outlined">rocket_launch</span>
              Start Free — No Card Needed
            </button>
            <button className="lp-btn-cta-outline" onClick={() => navigate('/login')}>
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-container lp-footer-inner">
          <div className="lp-footer-brand">
            <div className="lp-brand">
              <div className="lp-brand-icon">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <span className="lp-brand-name">Invoicely</span>
            </div>
            <p className="lp-footer-tagline">Enterprise invoicing for the modern era.</p>
          </div>
          <div className="lp-footer-links">
            <div className="lp-footer-col">
              <div className="lp-footer-col-title">Product</div>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#stats">Integrations</a>
            </div>
            <div className="lp-footer-col">
              <div className="lp-footer-col-title">Company</div>
              <a href="#testimonials">Customers</a>
              <a href="#stats">About</a>
              <a href="#stats">Careers</a>
            </div>
            <div className="lp-footer-col">
              <div className="lp-footer-col-title">Legal</div>
              <a href="#stats">Privacy</a>
              <a href="#stats">Terms</a>
              <a href="#stats">Security</a>
            </div>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <div className="lp-container">
            <span>© 2026 Invoicely. All rights reserved.</span>
            <span>Built with ❤️ for finance teams</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
