import React, { useState } from 'react';
import user_icon from '../assets/user-icon.png';
import './styles/Account.css';
import { useAuth } from './AuthProvider';
import { useUser } from './UserContext';

export const Account: React.FC = () => {
  const [showStats, setShowStats] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const auth = useAuth();
  const { userData, setUserData } = useUser();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleViewStats = () => {
    setShowStats((prev) => !prev);
    if (!showStats) {
      setShowLogin(false);
      setIsSignup(false);
    }
  };

  const handleShowLogin = () => {
    setShowLogin((prev) => !prev);
    if (!showLogin) {
      setShowStats(false);
      setIsSignup(false);
    }
  };

  const handleShowSignup = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setIsSignup(true);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const newUserData = {
      email: registerEmail,
      username: registerName,
      profilePic: '',
      total_flight_time: 0,
      highest_altitude: 0,
      total_distance: 0,
      top_speed: 0
    };

    try {
      await auth.register(registerEmail, registerPassword);
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User created:', data);
        alert('Account created successfully');
        setIsSignup(false);
        setShowLogin(false);
        setUserData(data);
      } else {
        alert('Unable to create an account');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Unable to create an account');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.login(loginEmail, loginPassword);
      alert('Logged in successfully');
      setShowLogin(false);
      const response = await fetch(`http://localhost:5000/api/user/${loginEmail}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (err) {
      alert('Unable to log in');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
      alert('Logged out successfully');
      setUserData(null);
      setLoginEmail('');
      setLoginPassword('')
    } catch (err) {
      alert('Unable to log out');
    }
  };

  return (
    <div style={{ position: 'relative', width: '25%', zIndex: 99, background: '#444444'}}>
      <div style={{ backgroundColor: '#444444', position: 'absolute', width: '105%', height: '100%', zIndex: -1, top: -8, borderTop: '8px solid white' }}></div>
      <div style={{ display: "flex", flexDirection: 'column', backgroundColor: '#D9D9D9', width: '100%', height: '95%', margin: '7px 0px 7px 7px', borderRadius: '0px 20px 20px 0px', justifyContent: 'space-around' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: "center", margin: '0px 0px 0px -15px' }}>
          <img src={userData?.profilePic || user_icon} alt="placeholder user pic" width={'90px'} height={'90px'} style={{ marginLeft: '30px', borderRadius: '50%', border: '2px solid black' }} />
          <p style={{ fontFamily: 'Roboto Mono', fontWeight: 700, fontSize: '32px', marginLeft: '20px'}}>Hello {userData?.username || 'Guest'}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginBottom: '10px' }}>
          <button 
            onClick={auth.user ? handleLogout : handleShowLogin} 
            style={{ backgroundColor: 'white', border: '2px solid black', width: '150px', height: '65px', fontWeight: '600', fontSize: '25px', borderRadius: 10, fontFamily: 'Roboto Mono', marginLeft: '6px', cursor: 'pointer' }}>
            {auth.user ? 'Logout' : 'Login'}
          </button>
          <button onClick={handleViewStats} style={{ backgroundColor: 'white', border: '2px solid black', width: '175px', height: '65px', fontWeight: '600', fontSize: '25px', borderRadius: 10, fontFamily: 'Roboto Mono', marginRight: '10px', cursor: 'pointer' }}>View Stats</button>
        </div>
      </div>

      <div className={`stats-panel ${showStats ? 'slide-up' : 'slide-down'}`}>
        <h2 style={{ fontFamily: 'Roboto Mono', fontWeight: 700, fontSize: '38px', marginTop: 0, marginBottom: 20 }}>Your Stats</h2>
        <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center" }}>
          <img src={userData?.profilePic || user_icon} alt="placeholder user pic" width={'100px'} height={'100px'} style={{ borderRadius: '50%', border: '2px solid black' }} />
          <h2>{userData?.username}</h2>
        </div>
        <div className="flight-data" style={{ width: '340px', height: '200px', border: '2px solid black', backgroundColor: 'white', alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
          <p>Total Flight Time: {userData?.total_flight_time || 0}</p>
          <p>Highest Altitude: {userData?.highest_altitude || 0} </p>
          <p>Total Distance Flown: {userData?.total_distance || 0}</p>
          <p>Top Speed Reached: {userData?.top_speed || 0}</p>
        </div>
      </div>
      <div className={`login-panel ${showLogin ? 'slide-up' : 'slide-down'}`}>
        {isSignup ? (
          <>
            <h2 style={{ fontFamily: 'Roboto Mono', fontWeight: 700, fontSize: '38px', marginTop: 0, marginBottom: 20 }}>Signup</h2>
            <div style={{ width: '340px', height: '340px', border: '2px solid black', backgroundColor: 'white', alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
              <form style={{ display: "flex", flexDirection: 'column', gap: 10, marginTop: 25 }} onSubmit={handleSignup}>
                <input
                  type="email"
                  placeholder="Email"
                  className="login-input"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="login-input"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="login-input"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
                <button type="submit" className="login-button" disabled={loading}>
                  {loading ? 'Signing up...' : 'Signup'}
                </button>
              </form>
              <p style={{ marginTop: '10px', fontFamily: 'Roboto Mono', fontSize: '16px', width: '230px', textAlign: "center" }}>
                Already have an account? <a href="#login" className="signup-link" onClick={() => setIsSignup(false)}>Login Here</a>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: 'Roboto Mono', fontWeight: 700, fontSize: '38px', marginTop: 0, marginBottom: 20 }}>Login</h2>
            <div style={{ width: '340px', height: '340px', border: '2px solid black', backgroundColor: 'white', alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
              <form style={{ display: "flex", flexDirection: 'column', gap: 15, marginTop: 25 }} onSubmit={handleLogin}>
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="login-input" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  required 
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="login-input" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  required 
                />
                <button type="submit" className="login-button" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <p style={{ marginTop: '10px', fontFamily: 'Roboto Mono', fontSize: '16px', width: '230px', textAlign: "center" }}>
                Don't have an account? <a href="#signup" className="signup-link" onClick={handleShowSignup}>Signup Here</a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
