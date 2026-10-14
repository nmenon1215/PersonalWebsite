import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import githubIcon from '../Icons/Github_icon.svg';
import linkedInIcon from '../Icons/LinkedIn_icon.svg';
import personalLogo from '../Icons/Menon_Nikhil_icon.svg';
import profilePhoto from '../Icons/Professional_Profile_Picture.jpg';
import stravaIcon from '../Icons/Strava_icon.svg';
import { Icon } from './components/Icon';
import {
  certifications,
  featuredProjects,
  profile,
  quotePool,
  socials,
  toolGroups,
  workExperience,
  type Project
} from './data/siteContent';

const contactEmail = 'menon.nik@northeastern.edu';

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
  const location = useLocation();

  useEffect(() => {
    const shouldLockScroll = location.pathname === '/';
    document.body.style.overflow = shouldLockScroll ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [location.pathname]);

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
  const [quoteIndex, setQuoteIndex] = useState(0);
  const iconMap = {
    github: githubIcon,
    linkedin: linkedInIcon,
    strava: stravaIcon
  } as const;

  const handleEmailClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.href = `mailto:${contactEmail}`;
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % quotePool.length);
    }, 30000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="page page-portfolio">
      <div className="portfolio-layout">
        <aside className="portfolio-sidebar" aria-label="Profile panel">
          <div className="portfolio-profile-bubble">
            <img src={profilePhoto} alt={profile.name} className="portfolio-avatar" />

            <div className="portfolio-logo-badge" aria-label="Brand logo">
              <img src={personalLogo} alt={`${profile.name} logo`} className="portfolio-brand-logo" />
            </div>

            <p className="profile-summary">{profile.summary}</p>

            <div className="portfolio-quote" aria-live="polite">
              <span className="eyebrow">Quotes</span>
              <p>“{quotePool[quoteIndex]}”</p>
            </div>

            <nav className="portfolio-social-row" aria-label="Social links">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.icon === 'email' ? `mailto:${contactEmail}` : social.href}
                  className="portfolio-social-link"
                  target={social.icon === 'email' ? undefined : '_blank'}
                  rel={social.icon === 'email' ? undefined : 'noreferrer'}
                  onClick={social.icon === 'email' ? handleEmailClick : undefined}
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
          </div>
        </aside>

        <div className="portfolio-main">
          <div className="section-heading">
            <span className="eyebrow">Portfolio</span>
          </div>

          <section className="portfolio-section">
            <div className="section-header">
              <h2>Projects</h2>
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
                      <h3>{project.title}</h3>
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
                <span className="eyebrow">Project details</span>
                <h3>{selectedProject.title}</h3>
                <p className="detail-lead">{selectedProject.details}</p>
                <p className="detail-impact">{selectedProject.impact}</p>

                <div className="tag-row tag-row-wide">
                  {selectedProject.tags.map((tag) => (
                    <span key={tag} className="tag">
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

          <section className="portfolio-section">
            <div className="section-header">
              <h2>Experience</h2>
            </div>

            <div className="experience-list">
              {workExperience.map((role) => (
                <article key={role.title} className="experience-item">
                  <div className="experience-meta">
                    <span>{role.period}</span>
                    <span>{role.company}</span>
                  </div>
                  <div className="experience-body">
                    <h3>{role.title}</h3>
                    <p>{role.summary}</p>
                    <ul>
                      {role.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="portfolio-section">
            <div className="section-header">
              <h2>Skills</h2>
            </div>

            <div className="tool-grid">
              {toolGroups.map((group) => (
                <div key={group.category} className="tool-group">
                  <h3>{group.category}</h3>
                  <div className="tool-row">
                    {group.tools.map((tool) => (
                      <span key={tool} className="tool-tag">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="portfolio-section">
            <div className="section-header">
              <h2>Certifications</h2>
            </div>

            <div className="certification-list">
              {certifications.map((cert) => (
                <article key={cert.title} className="certification-item">
                  <div className="certification-meta">
                    <span>{cert.year}</span>
                    <span>{cert.issuer}</span>
                  </div>
                  <div className="certification-body">
                    <h3>{cert.title}</h3>
                    <p>{cert.details}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="portfolio-section">
            <div className="section-header">
              <h2>Contact</h2>
            </div>

            <div className="contact-card">
              <p>
                I’m open to product, software, and sports-tech opportunities where curiosity, systems thinking, and execution
                matter.
              </p>
              <div className="contact-actions">
                <a className="button button-primary" href={`mailto:${contactEmail}`} onClick={handleEmailClick}>
                  Email me
                </a>
                <a className="button button-secondary" href={profile.resumeHref} target="_blank" rel="noreferrer">
                  Resume
                </a>
              </div>
            </div>
          </section>
        </div>
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
