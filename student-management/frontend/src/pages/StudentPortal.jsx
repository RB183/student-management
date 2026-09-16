import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const StudentPortal = () => {
  const { studentLogin, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', fullName: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const result = await studentLogin(formData.email, formData.fullName, formData.password);
    if (!result.success) setError(result.message);
  };

  return (
    <main className="student-portal-page">
      <div className="student-portal-panel">
        <p className="welcome-kicker">Student portal</p>
        <h1>Welcome back.</h1>
        <p>Use the details provided during registration. Your password is your date of birth in DDMMYYYY format.</p>

        {error && <div className="student-login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="student-login-form">
          <label>
            Email address
            <input
              type="email"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Full name
            <input
              type="text"
              value={formData.fullName}
              onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
              placeholder="Your registered full name"
              required
            />
          </label>
          <label>
            Password (DDMMYYYY)
            <input
              type="password"
              inputMode="numeric"
              maxLength="8"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value.replace(/[^0-9]/g, '') })}
              placeholder="11072005"
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Checking details...' : 'Open student dashboard'}
          </button>
        </form>

        <Link to="/" className="student-portal-link">Back to portal selection</Link>
      </div>
    </main>
  );
};

export default StudentPortal;