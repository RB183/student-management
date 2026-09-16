import { Link } from 'react-router-dom';

const GraduationCap = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true" className="welcome-mark-icon">
    <path d="m6 18 18-9 18 9-18 9L6 18Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
    <path d="M12 21v9c5.8 4.7 18.2 4.7 24 0v-9M42 19v11" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
    <circle cx="42" cy="33" r="2" fill="currentColor" />
  </svg>
);

const PortalIcon = ({ type }) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" className="portal-icon">
    {type === 'admin' ? (
      <>
        <rect x="6" y="7" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 27h12M16 23v4M11 12h10M11 16h6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </>
    ) : (
      <>
        <circle cx="16" cy="11" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 26c.8-4.3 3.4-6.5 8-6.5s7.2 2.2 8 6.5M24 8l2 2-2 2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </>
    )}
  </svg>
);

const PortalArrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="portal-arrow">
    <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
  </svg>
);

const Welcome = () => {
  return (
    <main className="welcome-page">
      <div className="study-background" aria-hidden="true">
        <span className="study-dot study-dot-one" />
        <span className="study-dot study-dot-two" />
        <span className="study-dot study-dot-three" />
        <span className="study-book study-book-one" />
        <span className="study-book study-book-two" />
        <span className="study-pencil" />
      </div>
      <section className="welcome-shell welcome-shell-distinct" aria-labelledby="welcome-title">
        <aside className="welcome-rail">
          <div className="rail-brand"><GraduationCap /></div>
        </aside>

        <div className="welcome-workspace">
          <header className="workspace-header">
            <span className="workspace-name">Student Management</span>
          </header>

          <div className="workspace-copy">
            <p className="welcome-kicker">Good to see you</p>
            <h1 id="welcome-title">One campus.<br /><em>Two ways in.</em></h1>
            <p className="welcome-description">Choose the space that fits your day.</p>
          </div>

          <div className="portal-list">
            <Link to="/login" className="portal-card portal-card-admin">
              <span className="portal-card-number">01</span>
              <span className="portal-icon-wrap"><PortalIcon type="admin" /></span>
              <span className="portal-card-content">
                <span className="portal-label">Operations</span>
                <span className="portal-card-content-title">Admin Portal</span>
                <span className="portal-description">Run the records, people and rhythm of campus.</span>
              </span>
              <span className="portal-card-action" aria-label="Open Admin Portal"><PortalArrow /></span>
            </Link>

            <Link to="/student-portal" className="portal-card portal-card-student">
              <span className="portal-card-number">02</span>
              <span className="portal-icon-wrap"><PortalIcon type="student" /></span>
              <span className="portal-card-content">
                <span className="portal-label">Your space</span>
                <span className="portal-card-content-title">Student Portal</span>
                <span className="portal-description">Keep your academic life close and moving.</span>
              </span>
              <span className="portal-card-action" aria-label="Open Student Portal"><PortalArrow /></span>
            </Link>
          </div>

          <footer className="workspace-footer">A simpler start to every campus day <span>↗</span></footer>
        </div>
      </section>
    </main>
  );
};

export default Welcome;