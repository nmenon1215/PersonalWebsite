import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import githubIcon from '../Icons/Github_icon.svg';
import linkedInIcon from '../Icons/LinkedIn_icon.svg';
import personalLogo from '../Icons/Menon_Nikhil_icon.svg';
import stravaIcon from '../Icons/Strava_icon.svg';
import { Icon } from './components/Icon';
import { featuredProjects, profile, socials, type Project } from './data/siteContent';

type AuthUser = {
  username: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const storageKey = 'personal-website-session';

function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(storageKey));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      if (!token) {
        if (active) {
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch('/api/session', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Session expired');
        }

        const data = (await response.json()) as { user: AuthUser };
        if (active) {
          setUser(data.user);
        }
      } catch {
        localStorage.removeItem(storageKey);
        if (active) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadSession();

    return () => {
      active = false;
    };
  }, [token]);

  const auth = useMemo<AuthState>(
    () => ({
      token,
      user,
      loading,
      login: async ({ username, password }) => {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const data = (await response.json()) as { token: string; user: AuthUser };
        localStorage.setItem(storageKey, data.token);
        setToken(data.token);
        setUser(data.user);
      },
      logout: async () => {
        if (token) {
          await fetch('/api/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }

        localStorage.removeItem(storageKey);
        setToken(null);
        setUser(null);
      }
    }),
    [loading, token, user]
  );

  return auth;
}

export default function App() {
  const auth = useAuth();

  if (auth.loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="site-shell">
      <header className="landing-topbar" aria-label="Landing navigation">
        <div className="landing-topbar-spacer" />
        <nav className="landing-nav" aria-label="Quick navigation">
          <Link to="/portfolio" className="landing-topbar-link" aria-label="Open portfolio">
            <Icon name="spark" className="nav-icon" />
            Portfolio
          </Link>
          <Link to={auth.user ? '/admin' : '/login'} className="landing-topbar-link" aria-label="Admin access">
            <Icon name="lock" className="nav-icon" />
            Admin
          </Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/login" element={<LoginPage auth={auth} />} />
          <Route
            path="/admin"
            element={<ProtectedRoute authenticated={Boolean(auth.user)}>{<AdminPage auth={auth} />}</ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-card">
        <span className="eyebrow">Loading</span>
        <p>Preparing the field.</p>
      </div>
    </div>
  );
}

function LandingPage() {
  const iconMap = {
    github: githubIcon,
    linkedin: linkedInIcon,
    strava: stravaIcon
  } as const;

  return (
    <section className="page page-landing simple-landing">
      <div className="landing-center" role="main">
        <img src={personalLogo} alt={`${profile.name} logo`} className="landing-logo" />

        <div className="social-row landing-social-row" aria-label="Quick links">
          <Link to="/portfolio" className="social-link landing-social-link" aria-label="Portfolio">
            <Icon name="spark" className="social-icon" />
          </Link>

          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="social-link landing-social-link"
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
            >
              {social.icon === 'email' ? (
                <Icon name="email" className="social-icon" />
              ) : (
                <img src={iconMap[social.icon]} alt="" className="social-image" />
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project>(featuredProjects[0]);
  const iconMap = {
    github: githubIcon,
    linkedin: linkedInIcon,
    strava: stravaIcon
  } as const;

  return (
    <section className="page page-portfolio">
      <header className="portfolio-topbar" aria-label="Portfolio header">
        <div className="portfolio-brand" aria-label="Nikhil Menon logo">
          <img src={personalLogo} alt={`${profile.name} logo`} className="portfolio-brand-logo" />
        </div>

        <nav className="portfolio-social-row" aria-label="Social links">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="portfolio-social-link"
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
            >
              {social.icon === 'email' ? (
                <Icon name="email" className="social-icon" />
              ) : (
                <img src={iconMap[social.icon]} alt="" className="social-image" />
              )}
            </a>
          ))}
        </nav>
      </header>

      <div className="section-heading">
        <span className="eyebrow">Portfolio</span>
        <h1>Selected work, tuned for depth.</h1>
        <p>
          Tap a project to open a blurb, context, and a direct link. The goal here is a concise showcase that can grow into
          full case studies later.
        </p>
      </div>

      <div className="portfolio-grid">
        <div className="project-list">
          {featuredProjects.map((project) => {
            const isActive = project.title === selectedProject.title;

            return (
              <button
                key={project.title}
                className={`project-card ${isActive ? 'is-active' : ''}`}
                onClick={() => setSelectedProject(project)}
                type="button"
              >
                <div className="project-card-top">
                  <span className="project-season">{project.season}</span>
                  <Icon name="spark" className="card-icon" />
                </div>
                <h2>{project.title}</h2>
                <p>{project.shortDescription}</p>
                <div className="tag-row">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <article className="project-detail">
          <span className="eyebrow">Project detail</span>
          <h2>{selectedProject.title}</h2>
          <p className="detail-lead">{selectedProject.details}</p>
          <p className="detail-impact">{selectedProject.impact}</p>

          <div className="tag-row tag-row-wide">
            {selectedProject.tags.map((tag) => (
              <span key={tag} className="tag tag-accent">
                {tag}
              </span>
            ))}
          </div>

          <a className="button button-primary button-inline" href={selectedProject.linkHref} target="_blank" rel="noreferrer">
            {selectedProject.linkLabel}
            <Icon name="arrow" className="button-icon" />
          </a>
        </article>
      </div>
    </section>
  );
}

function LoginPage({ auth }: { auth: AuthState }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await auth.login({ username, password });
      navigate('/admin');
    } catch {
      setError('That login did not match the current admin credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page page-login">
      <div className="section-heading section-heading-narrow">
        <span className="eyebrow">Admin access</span>
        <h1>Quiet entry only.</h1>
        <p>This area is intentionally hidden from the main path and will expand into private tools later.</p>
      </div>

      <form className="login-card" onSubmit={handleSubmit}>
        <label>
          <span>Username</span>
          <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="button button-primary" type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Enter admin'}
        </button>

        <p className="fine-print">The backend is already wired for token-based auth and can grow into a private dashboard.</p>
      </form>
    </section>
  );
}

function AdminPage({ auth }: { auth: AuthState }) {
  return (
    <section className="page page-admin">
      <div className="section-heading">
        <span className="eyebrow">Protected area</span>
        <h1>Private dashboard shell.</h1>
        <p>For now, this acts as the starting point for private tracking, notes, or content management.</p>
      </div>

      <div className="admin-grid">
        <article className="admin-card">
          <span className="eyebrow">Session</span>
          <h2>{auth.user?.username ?? 'Unknown'}</h2>
          <p>You are logged in through the backend session layer.</p>
        </article>

        <article className="admin-card">
          <span className="eyebrow">Next build</span>
          <h2>Private tracking</h2>
          <p>Notes, metrics, drafts, or whatever the second function becomes.</p>
        </article>

        <article className="admin-card admin-actions">
          <span className="eyebrow">Control</span>
          <button className="button button-secondary" type="button" onClick={() => void auth.logout()}>
            Log out
          </button>
        </article>
      </div>
    </section>
  );
}

function ProtectedRoute({ authenticated, children }: { authenticated: boolean; children: ReactNode }) {
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
