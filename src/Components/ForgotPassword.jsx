import { useState } from 'react';
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ForgotPassword = () => {
  const [step, setStep] = useState('email'); // 'email' or 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Send OTP to the user's email
  const handleSendOTP = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // Replace with your actual endpoint for sending OTP
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP.');
      }
      setMessage('OTP sent to your email. Please check your inbox.');
      setStep('reset');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset password using the OTP
  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // Replace with your actual endpoint for resetting password
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword: password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }
      setMessage('Your password has been reset successfully.');
      setStep('email');
      setEmail('');
      setOtp('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        p: 3,
        mt: 5,
        backgroundColor: 'var(--primary-color)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: 'var(--text-color)' }}
      >
        Forgot Password
      </Typography>

      {step === 'email' && (
        <form onSubmit={handleSendOTP}>
          <TextField
            label="Email Address"
            type="email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              backgroundColor: 'var(--input-background)',
              borderRadius: 'var(--border-radius)',
              input: { color: 'var(--text-color)' },
              label: { color: 'var(--text-color)' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'var(--text-color)' },
                '&:hover fieldset': { borderColor: 'var(--secondary-color)' },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--secondary-color)',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              backgroundColor: 'var(--secondary-color)',
              color: 'var(--primary-color)',
              borderRadius: 'var(--border-radius)',
              '&:hover': { backgroundColor: 'var(--secondary-color)' },
            }}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetPassword}>
          <TextField
            label="OTP"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{
              backgroundColor: 'var(--input-background)',
              borderRadius: 'var(--border-radius)',
              input: { color: 'var(--text-color)' },
              label: { color: 'var(--text-color)' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'var(--text-color)' },
                '&:hover fieldset': { borderColor: 'var(--secondary-color)' },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--secondary-color)',
                },
              },
            }}
          />
          <TextField
            label="New Password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {passwordVisible ? (
                      <VisibilityOff sx={{ color: 'var(--text-color)' }} />
                    ) : (
                      <Visibility sx={{ color: 'var(--text-color)' }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: 'var(--input-background)',
              borderRadius: 'var(--border-radius)',
              input: { color: 'var(--text-color)' },
              label: { color: 'var(--text-color)' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'var(--text-color)' },
                '&:hover fieldset': { borderColor: 'var(--secondary-color)' },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--secondary-color)',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              backgroundColor: 'var(--secondary-color)',
              color: 'var(--primary-color)',
              borderRadius: 'var(--border-radius)',
              '&:hover': { backgroundColor: 'var(--secondary-color)' },
            }}
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>
      )}

      {message && (
        <Typography
          variant="body1"
          sx={{ mt: 2, color: 'var(--secondary-color)' }}
        >
          {message}
        </Typography>
      )}
      {error && (
        <Typography
          variant="body1"
          sx={{ mt: 2, color: 'var(--secondary-color)' }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ForgotPassword;
