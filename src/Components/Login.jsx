import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Link } from '@mui/material';

import CircularProgress from '@mui/material/CircularProgress'; // For loader
import '../Styles/Login.css';
import { addUser } from '../Redux/Reducers/UserSlice';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    if (user.id) {
      navigate('/dashboard');
    }
    //eslint-disable-next-line
  }, [user]);

  const logIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://swyft-backend-client-nine.vercel.app/driver/login',

        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        // Assuming the server sends a token on successful login

        const { access_token, user, message } = data;

        sessionStorage.setItem('message', message || 'Login successful!');
        sessionStorage.setItem('authToken', access_token);
        dispatch(addUser(user));
        navigate('/dashboard'); // Redirect to Dashboard on successful login
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.log(err);

      setError('An error occurred. Please try again.', err);
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
          <Link href="#" variant="body2" className="forgot-password">
            Forgot password?
          </Link>
          <Button
            variant="contained"
            type="submit"
            className="login-button"
            sx={{ mt: 2, backgroundColor: '#18b700', fontWeight: 'bold' }}
            disabled={loading}
          >
            {loading ? <CircularProgress /> : 'Log In'}
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

        {/* <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Or log in with
        </Typography>
        <Box
          className="socials-container"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
            mt: 2,
          }}
        >
          <Button
            className="social-icon"
            color="primary"
            startIcon={<Google />}
            fullWidth
            sx={{ mr: 1 }}
          />
          <Button
            className="social-icon"
            color="primary"
            startIcon={<Twitter />}
            fullWidth
            sx={{ mx: 1 }}
          />
          <Button
            className="social-icon"
            color="primary"
            startIcon={<GitHub />}
            fullWidth
            sx={{ ml: 1 }}
          />
        </Box> */}
      </Box>
    </div>
  );
};

export default Login;
