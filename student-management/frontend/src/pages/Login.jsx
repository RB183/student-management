import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Pull the login function and loading state from our Context
  const { login, loading } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    // Basic frontend validation
    if (!email || !password) {
      return setError('Please fill in all fields.');
    }

    // Attempt to log in
    const result = await login(email, password);
    
    // If login fails, display the error message from the backend
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <main className="login-page">
      <div className="login-shell">
        <section className="login-teacher-panel" aria-label="Teacher workspace">
          <Link to="/" className="login-back-link">&larr; Back to portals</Link>
          <div className="teacher-note-mark">✦</div>
          <div className="teacher-panel-copy">
            <p className="login-eyebrow">The teacher's desk</p>
            <h1>Every student<br /><em>has a story.</em></h1>
            <p>Keep the details organized, the classroom moving, and every learner in view.</p>
          </div>
          <div className="teacher-panel-footer">
            <span>Admin workspace</span>
            <span>01</span>
          </div>
        </section>

        <section className="login-form-panel">
          <div className="login-form-heading">
            <p className="login-eyebrow">Welcome back</p>
            <h2>Sign in to your<br />workspace.</h2>
            <p>Manage student records with a little more ease.</p>
          </div>

        {error && (
            <div className="login-error">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
            </div>

            <div className="login-field">
              <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            </div>

            <button type="submit" disabled={loading} className="login-submit">
              <span>{loading ? 'Signing in...' : 'Open workspace'}</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </form>

          <p className="login-form-footer">Authorized administration access only.</p>
        </section>
      </div>
    </main>
  );
};

export default Login;