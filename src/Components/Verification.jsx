import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import '../Styles/Login.css';
import { addUser } from '../Redux/Reducers/UserSlice';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID library
import Cookies from 'js-cookie';

const Verification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve data from sessionStorage
  const storedData = JSON.parse(Cookies.get('signupData')) || {};
  const { name, phoneNumber, email, password } = storedData;

  // Generate a unique ID when the component mounts
  const [id] = useState(() => uuidv4());
  const [carType, setCarType] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Create refs for each input field
  const inputRefs = {
    carType: React.createRef(),
    licenseNumber: React.createRef(),
    idNumber: React.createRef(),
    licensePlate: React.createRef(),
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

    // Cleanup the event listeners when the component unmounts
    return () => {
      Object.values(inputRefs).forEach((inputRef) => {
        if (inputRef.current) {
          inputRef.current.removeEventListener('focus', handleFocus);
        }
      });
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!name) {
      // Redirect to signup if no data is in sessionStorage
      navigate('/signup');
    }
  }, [name, navigate]);

  const verifyAccount = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const sanitizedEmail = email.trim().toLowerCase();

    try {
      const response = await fetch(
        'https://swyft-backend-client-nine.vercel.app/driver/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            name,
            phone: phoneNumber,
            email: sanitizedEmail,
            carType,
            password,
            licenseNumber,
            idNumber,
            licensePlate,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          `Verification failed: ${responseData.error || 'Please try again.'}`
        );
      }
      const { access_token, user, message } = responseData;

      Cookies.set('authTokendr2', access_token, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
      }); // Set cookie with options
      dispatch(addUser(user));
      Cookies.set(
        'message',
        'message',
        message || 'Driver created successfully!',
        { expires: 7 }
      );

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('status', 'Driver created!');
      navigate('/dashboard');
    } catch (err) {
      console.error('An error occurred during verification:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-component">
      <Box className="verification-container">
        <SecurityIcon
          style={{ fontSize: '100px', color: '#18b700', marginBottom: '16px' }}
        />
        <header className="verification-header">
          {`Let’s verify your account, ${name}!`}
        </header>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={verifyAccount}>
          <div className="input-group">
            <div className="car-type">
              <label htmlFor="carType" className="car-type-label">
                Car Type
              </label>
              <div className="car-type-select">
                <select
                  id="carType"
                  ref={inputRefs.carType}
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                  required
                  className="car-type-dropdown"
                >
                  <option value="" disabled>
                    Select Car Type
                  </option>
                  <option value="pickup">Pickup</option>
                  <option value="miniTruck">Mini Truck</option>
                  <option value="lorry">Lorry</option>
                  <option value="flatbed">Flatbed</option>
                </select>
              </div>
            </div>

            <input
              ref={inputRefs.licenseNumber}
              placeholder="Driving License Number"
              className="login-input"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              ref={inputRefs.idNumber}
              placeholder="ID Number"
              className="login-input"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              ref={inputRefs.licensePlate}
              placeholder="License Plate Number"
              className="login-input"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              required
            />
          </div>
          <Button
            variant="contained"
            type="submit"
            className="verify-button"
            sx={{ mt: 2, backgroundColor: '#18b700', fontWeight: 'bold' }}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
          <Button
            variant="contained"
            type="button"
            className="verify-button"
            sx={{ mt: 2, backgroundColor: '#18b700', fontWeight: 'bold' }}
            onClick={() => navigate('/signup')}
          >
            Go back
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default Verification;
