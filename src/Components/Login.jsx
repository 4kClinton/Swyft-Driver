import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Link } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { messaging } from '../firebase/firebase';
import 'firebase/messaging';

import { addUser } from '../Redux/Reducers/UserSlice';
import '../Styles/Login.css';
import Cookies from 'js-cookie';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const vapid_key = import.meta.env.VITE_VAPID_KEY;

  useEffect(() => {
    if (user.id) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const logIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Convert email to lowercase
    const sanitizedEmail = email.trim().toLowerCase();
    let storedFcmToken = Cookies.get('fcmToken');

    if (!storedFcmToken) {
      try {
        storedFcmToken = await messaging.getToken(messaging, {
          vapidKey: vapid_key,
        });
        Cookies.set('fcmToken', storedFcmToken);
      } catch (error) {
        console.error('Failed to get FCM token:', error);
      }
    }

    try {
      const response = await fetch(
        'https://swyft-backend-client-nine.vercel.app/driver/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: sanitizedEmail,
            password,
            fcm_token: storedFcmToken,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const { access_token, user, message } = data;

        Cookies.set('message', message || 'Login successful!', { expires: 7 });
        Cookies.set('authTokendr2', access_token, {
          expires: 7,
          secure: true,
          sameSite: 'Strict',
        });

        // Check if the driver is verified before navigating
        const verificationResponse = await fetch(
          'https://swyft-backend-client-nine.vercel.app/driver/check-verification',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: user.id }),
          }
        );

        const verificationData = await verificationResponse.json();

        if (verificationResponse.ok) {
          if (verificationData.verification) {
            dispatch(addUser(user));
            navigate('/dashboard'); // Allow access to the dashboard
          } else {
            navigate('/unverified'); // Redirect to unverified page
          }
        } else {
          setError(
            verificationData.error ||
              'Verification check failed. Please try again.'
          );
        }
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-component">
      <Box className="login-container">
        <header className="login-header">Log in to Swyft</header>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={logIn} className="login-form">
          <input
            placeholder="Email or Username"
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Link
            href="/forgotPassword"
            variant="body2"
            className="forgot-password"
          >
            Forgot password?
          </Link>
          <Button
            variant="contained"
            type="submit"
            className="login-button"
            sx={{ mt: 2, backgroundColor: '#18b700', fontWeight: 'bold' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Log In'}
          </Button>
        </form>
        <Button
          onClick={() => navigate('/signup')}
          variant="text"
          className="create-account"
          align="center"
          sx={{ mt: 2, color: '#18b700', fontWeight: 'bold' }}
        >
          Create account
        </Button>
      </Box>
    </div>
  );
};

export default Login;
