import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user, logout, changeStudentPassword, loading: passwordLoading } = useContext(AuthContext);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await API.get('/students/me');
        setStudent(response.data.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load your student profile.');
      }
    };

    loadProfile();
  }, []);

  const profile = student || user;
  const initials = (profile?.fullName || profile?.name || 'Student')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match.');
      return;
    }

    const result = await changeStudentPassword(newPassword);
    setPasswordMessage(result.message);
    if (result.success) {
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <main className="student-dashboard-page">
      <header className="student-dashboard-topbar">
        <Link to="/student-dashboard" className="student-dashboard-brand">Student<span>Portal</span></Link>
        <div className="student-profile-menu">
          <button type="button" className="student-profile-trigger" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>
            {profile?.profileImage?.url ? (
              <img src={profile.profileImage.url} alt="Student profile" />
            ) : (
              <span>{initials}</span>
            )}
            <span className="student-profile-name">{profile?.fullName || profile?.name || 'Student'}</span>
          </button>
          {menuOpen && (
            <div className="student-profile-dropdown">
              <button type="button" onClick={() => { setProfileOpen(true); setMenuOpen(false); }}>Profile</button>
              <button type="button" onClick={() => { setPasswordOpen(true); setMenuOpen(false); setPasswordMessage(''); setNewPassword(''); setConfirmPassword(''); }}>Change password</button>
              <button type="button" onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      <section className="student-dashboard-content">
        <header className="student-dashboard-header">
        <div>
          <p className="student-dashboard-eyebrow">Student dashboard</p>
          <h1>Welcome, {profile?.name || profile?.fullName || 'Student'}.</h1>
        </div>
        </header>

        {error && <div className="student-dashboard-error">{error}</div>}

        <section className="student-dashboard-card">
        <div>
          <p className="student-dashboard-eyebrow">Your profile</p>
          <h2>{student?.fullName || user?.name || 'Student profile'}</h2>
          <p>{student?.course || 'Your course information will appear here.'}</p>
        </div>
        <div className="student-dashboard-details">
          <span><b>Email</b>{student?.email || user?.email}</span>
          <span><b>Phone</b>{student?.phoneNumber || 'Not available'}</span>
          <span><b>Status</b>{student?.status || 'Active'}</span>
        </div>
        </section>

        <p className="student-dashboard-hint">Open your profile from the top-right menu to view all your registered details.</p>

        <section className="student-quick-links" aria-label="Student services">
          <div className="student-quick-links-heading">
            <div>
              <p className="student-dashboard-eyebrow">Student services</p>
              <h2>Quick access</h2>
            </div>
            <span>Academic tools</span>
          </div>
          <div className="student-quick-links-grid">
            {['Assignments', 'CA Marks', 'PCA Marks', 'Admit Card'].map((item) => (
              <button type="button" className="student-service-tile" key={item} onClick={() => setError(`${item} will be available here soon.`)}>
                <span className="student-service-icon">▤</span>
                <span>{item}</span>
                <small>Open service</small>
              </button>
            ))}
          </div>
        </section>
      </section>

      {profileOpen && (
        <div className="student-profile-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setProfileOpen(false); }}>
          <section className="student-profile-modal" role="dialog" aria-modal="true" aria-labelledby="student-profile-title">
            <button type="button" className="student-profile-close" onClick={() => setProfileOpen(false)} aria-label="Close profile">&times;</button>
            <div className="student-profile-modal-avatar">
              {profile?.profileImage?.url ? <img src={profile.profileImage.url} alt="Student profile" /> : initials}
            </div>
            <p className="student-dashboard-eyebrow">Student profile</p>
            <h2 id="student-profile-title">{student?.fullName || user?.name}</h2>
            <div className="student-profile-details">
              <span><b>Email address</b>{student?.email || user?.email || 'Not available'}</span>
              <span><b>Phone number</b>{student?.phoneNumber || 'Not available'}</span>
              <span><b>Date of birth</b>{student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not available'}</span>
              <span><b>Gender</b>{student?.gender || 'Not available'}</span>
              <span><b>Course</b>{student?.course || 'Not available'}</span>
              <span><b>Address</b>{student?.address || 'Not available'}</span>
              <span><b>Status</b>{student?.status || 'Active'}</span>
            </div>
          </section>
        </div>
      )}

      {passwordOpen && (
        <div className="student-profile-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setPasswordOpen(false); }}>
          <section className="student-profile-modal student-password-modal" role="dialog" aria-modal="true" aria-labelledby="password-title">
            <button type="button" className="student-profile-close" onClick={() => setPasswordOpen(false)} aria-label="Close password form">&times;</button>
            <p className="student-dashboard-eyebrow">Account security</p>
            <h2 id="password-title">Change password</h2>
            <p className="student-password-note">Choose a new password for your student account.</p>
            {passwordMessage && <div className="student-password-message">{passwordMessage}</div>}
            <form onSubmit={handlePasswordChange} className="student-password-form">
              <label htmlFor="new-password">New password</label>
              <input id="new-password" type="password" minLength="6" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
              <label htmlFor="confirm-password">Confirm new password</label>
              <input id="confirm-password" type="password" minLength="6" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
              <button type="submit" disabled={passwordLoading}>{passwordLoading ? 'Saving...' : 'Save password'}</button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
};

export default StudentDashboard;