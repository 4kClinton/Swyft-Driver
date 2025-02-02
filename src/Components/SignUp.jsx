import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Link } from '@mui/material';
import Cookies from 'js-cookie';

import '../Styles/Login.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const inputRefs = {
    name: React.createRef(),
    email: React.createRef(),
    phoneNumber: React.createRef(),
    password: React.createRef(),
    confirmPassword: React.createRef(),
  };

  useEffect(() => {
    const handleFocus = (e) => {
      const focusedElement = e.target;
      focusedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Adjust to "start" if you want the element at the top
      });
    };

    // Attach the focus event listener to each input field
    Object.values(inputRefs).forEach((inputRef) => {
      if (inputRef.current) {
        inputRef.current.addEventListener('focus', handleFocus);
      }
    });

    // Cleanup: Remove event listeners when the component unmounts
    return () => {
      Object.values(inputRefs).forEach((inputRef) => {
        if (inputRef.current) {
          inputRef.current.removeEventListener('focus', handleFocus);
        }
      });
    };
  }, []);

  //eslint-disable-next-line
  const [loading, setLoading] = useState(false);

  const handleSignUp = (event) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Temporarily store data in Cookies
    const formData = { name, email, phoneNumber, password };
    Cookies.set('signupData', JSON.stringify(formData), { expires: 7 });

    // Navigate to verification page
    navigate('/verification');
  };

  return (
    <div className="form-container">
      <Typography className="title">Create an Account</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form className="form" onSubmit={handleSignUp}>
        <div className="input-group">
          <input
            ref={inputRefs.name}
            placeholder="Name or Username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            ref={inputRefs.email}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            ref={inputRefs.phoneNumber}
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
            ref={inputRefs.password}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            ref={inputRefs.confirmPassword}
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
      {/* <div className="social-icons">
        <button className="icon">
          <Google />
        </button>
        <button className="icon">
          <Twitter />
        </button>
        <button className="icon">
          <GitHub />
        </button>
      </div> */}
      <div className="signup">
        <span>Already have an account? </span>
        <Link href="/">Log in</Link>
      </div>
    </div>
  );
};

export default SignUp;
