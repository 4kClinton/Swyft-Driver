import { useEffect, useRef } from 'react';
import soundFile from '../assets/this-one.wav';
import '../Styles/Alert.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { alertOff } from '../Redux/Reducers/alertSlice';
import { declineOrder } from '../Redux/Reducers/CurrentOrderSlice';
import { saveCustomer } from '../Redux/Reducers/CurrentCustomerSlice';
import { useNavigate } from 'react-router-dom';

const Alert = () => {
  const audioRef = useRef(null);

  const alertValue = useSelector((state) => state.alert.value);
  const currentOrder = useSelector((state) => state.currentOrder.value);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (alert) {
      if (audioRef.current) {
        audioRef.current.loop = true; // Enable looping
        audioRef.current.play();

        // Stop playing after 10 seconds and dispatch declineOrder
        const timer = setTimeout(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0; // Reset sound
          dispatch(alertOff());
          dispatch(declineOrder());
          fetch('https://swyft-backend-client-nine.vercel.app/order-response', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              order_id: currentOrder.id,
              accepted: false,
            }),
          });
        }, 10000);

        // Cleanup the timer when the component unmounts or alert changes
        return () => clearTimeout(timer);
      }
    }
    //eslint-disable-next-line
  }, [alertValue, currentOrder.id]);

  const AcceptOrder = () => {
    const token = sessionStorage.getItem('authToken');

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset sound
      dispatch(alertOff());
    }
    fetch('https://swyft-backend-client-nine.vercel.app/order-response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ order_id: currentOrder.id, accepted: true }),
    });
    fetch(
      `https://swyft-backend-client-nine.vercel.app/customer/${currentOrder.customer_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application',
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch customer data');
        }
        return response.json();
      })
      .then((customerData) => {
        dispatch(saveCustomer(customerData));
        localStorage.setItem('customerData', JSON.stringify(customerData));
        localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
        console.log(customerData, currentOrder);
      })
      .then(() => {
        navigate('/deliveryDetails');
      });
  };

  if (alertValue) {
    return (
      <div style={{ textAlign: 'center' }}>
        <button
          className="Alert"
          onClick={AcceptOrder}
          style={{
            backgroundColor: alert ? '#2AC352' : '#404040',
            border: alert ? 'none' : 'none',
            animation: alert ? 'vibrate 0.3s infinite' : 'none',
          }}
        >
          Incoming Order
        </button>

        <audio ref={audioRef} src={soundFile} preload="auto" />
        <style>
          {`
              @keyframes vibrate {
                0% { transform: translate(0px, 0px); }
                25% { transform: translate(2px, -2px); }
                50% { transform: translate(-2px, 2px); }
                75% { transform: translate(2px, 2px); }
                100% { transform: translate(0px, 0px); }
              }
            `}
        </style>
      </div>
    );
  }
};

export default Alert;
