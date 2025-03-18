import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../Styles/Earnings.css';
import Cookies from 'js-cookie';

const Earnings = () => {
  const navigate = useNavigate();
  const driver = useSelector((state) => state.user.value);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [earningsData, setEarningsData] = useState(null);

  useEffect(() => {
    if (!driver.id) return; // Only proceed if driver.id is available

    fetch(`https://swyft-backend-client-nine.vercel.app/earnings/${driver.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Ensure numerical data is converted to numbers
        data.total_payments_made = Number(data.total_payments_made);
        data.total_unpaid_earnings = Number(data.total_unpaid_earnings);
        data.commission = Number(data.commission);
        setEarningsData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setEarningsData({ error: error.message }); // Set an error state
      });
  }, [driver.id]); // Add driver.id as a dependency

  if (earningsData === null) {
    return <div>Loading...</div>;
  }

  if (earningsData.error) {
    return <div>Error: {earningsData.error}</div>; // Display an error message
  }

  const { total_payments_made, total_unpaid_earnings, commission } =
    earningsData;

  const handleGoBack = () => {
    navigate(-1); // Navigate one step back in the history stack
  };

  const handleMpesaPayment = async () => {
    // Ensure phone number is in international format
    const formattedPhoneNumber = phoneNumber.replace(/^0/, '254');

    if (!formattedPhoneNumber.match(/^2547\d{8}$/)) {
      setError('Please enter a valid phone number starting with 2547.');
      return;
    }

    setError(''); // Clear any existing errors

    try {
      const token = Cookies.get('authTokendr2'); // Assuming the token is stored in session storage

      const response = await fetch(
        'https://swyft-backend-client-nine.vercel.app/process-payment',
        {
          // Adjusted endpoint to match the backend
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the JWT token in the headers
          },
          body: JSON.stringify({
            Amount: commission,
            phoneNumber: formattedPhoneNumber,
          }), // Ensure the payload keys match the backend requirements
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
        Total Payments Made:{' '}
        <span className="earnings-highlight">
          Ksh{total_payments_made.toFixed(2)}
        </span>
      </p>
      <p className="earnings-text">
        Total Earnings:{' '}
        <span className="earnings-highlight">
          Ksh{total_unpaid_earnings.toFixed(2)}
        </span>
      </p>
      <p className="earnings-text">
        Unpaid Commission (18%):{' '}
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
