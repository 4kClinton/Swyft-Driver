import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Link } from '@mui/material';
import Cookies from 'js-cookie';

import '../Styles/Login.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    console.log('handleSignUp triggered');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    // Temporarily store data in Cookies
    const formData = { first_name, last_name, email, phoneNumber, password };
    Cookies.set('signupData', JSON.stringify(formData), { expires: 7 });

    console.log('Navigating to /verification');
    setLoading(false);
    navigate('/verification');
  };

  return (
    <div className="form-container">
      <Typography className="title">Create an Account</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form className="form" onSubmit={handleSignUp}>
        <div className="input-group">
          <input
            ref={firstNameRef}
            placeholder="First Name"
            type="text"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            ref={lastNameRef}
            placeholder="Last Name"
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            ref={emailRef}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            ref={phoneRef}
            placeholder="Phone Number"
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit phone number."
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            ref={passwordRef}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <div className="input-group">
          <input
            ref={confirmPasswordRef}
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <button type="submit" className="sign" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <div className="social-message">
        <span className="line"></span>
        <span className="message">Or sign up with</span>
        <span className="line"></span>
      </div>
      <div className="signup">
        <span>Already have an account? </span>
        <Link href="/">Log in</Link>
      </div>
    </div>
  );
};

export default SignUp;
