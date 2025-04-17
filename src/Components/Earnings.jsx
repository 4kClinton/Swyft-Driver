import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../Styles/Earnings.css';
import Cookies from 'js-cookie';
import MpesaIcon from '../assets/Mpesa-Logo.png';

const Earnings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const completedOrders = location.state?.completedRides || [];

  useEffect(() => {
    console.log('Completed Orders:', completedOrders);
  }, [completedOrders]);

  const totalNetEarnings = completedOrders.reduce(
    (sum, order) => sum + (Number(order.net_earnings) || 0),
    0
  );

  const commission = totalNetEarnings * 0.15;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleMpesaPayment = async () => {
    const formattedPhoneNumber = phoneNumber.replace(/^0/, '254');

    if (!formattedPhoneNumber.match(/^2547\d{8}$/)) {
      setError('Please enter a valid phone number starting with 2547.');
      return;
    }

    setError('');

    const payload = {
      Amount: commission.toFixed(2),
      phoneNumber: formattedPhoneNumber,
    };

    console.log('Payment Payload:', payload);

    try {
      const token = Cookies.get('authTokendr2');

      const response = await fetch(
        'https://swyft-backend-client-nine.vercel.app/process-payment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('Payment failed. Please try again.');
      }

      alert(
        'Payment initiated successfully. Please complete the payment on your phone.'
      );
    } catch (error) {
      alert(error.message || 'An error occurred during payment.');
    }
  };

  return (
    <div className="earnings-container">
      <h1 className="earnings-heading">Earnings Overview</h1>
      <p className="earnings-text">
        Total Net Earnings:{' '}
        <span className="earnings-highlight">
          Ksh{totalNetEarnings.toFixed(2)}
        </span>
      </p>
      <p className="earnings-text">
        Unpaid Commission (15%):{' '}
        <span className="earnings-highlight">Ksh{commission.toFixed(2)}</span>
      </p>

      <div className="phone-input-container">
        <label htmlFor="phoneNumber" className="phone-label">
          Phone Number:
        </label>
        <input
          type="text"
          id="phoneNumber"
          className="phone-input"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
      </div>
      <div className="mpesa-img">
        <img src={MpesaIcon} alt="Mpesa" />
      </div>

      <button className="payment-button" onClick={handleMpesaPayment}>
        Pay via Mpesa
      </button>

      <button className="go-back-button" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default Earnings;
