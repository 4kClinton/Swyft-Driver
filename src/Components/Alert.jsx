import { useEffect, useRef } from 'react';
import soundFile from '../assets/this-one.wav';
import '../Styles/Alert.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { alertOff } from '../Redux/Reducers/alertSlice';
import { declineOrder, saveOrder } from '../Redux/Reducers/CurrentOrderSlice';
import {
  saveCustomer,
  saveDestination,
} from '../Redux/Reducers/CurrentCustomerSlice';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { removeIncomingOrder } from '../Redux/Reducers/incomingOrderSlice';

const Alert = () => {
  const audioRef = useRef(null);

  const alertValue = useSelector((state) => state.alert.value);
  const incomingOrder = useSelector((state) => state.incomingOrder.value);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('authTokendr2');
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
              order_id: incomingOrder.id,
              accepted: false,
            }),
          });
        }, 15000);

        // Cleanup the timer when the component unmounts or alert changes
        return () => clearTimeout(timer);
      }
    }
    //eslint-disable-next-line
  }, [alertValue, incomingOrder.id]);

  const AcceptOrder = () => {
    const token = Cookies.get('authTokendr2');

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
      body: JSON.stringify({ order_id: incomingOrder.id, accepted: true }),
    });
    fetch(
      `https://swyft-backend-client-nine.vercel.app/customer/${incomingOrder.customer_id}`,
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
        dispatch(
          saveDestination({
            lat: incomingOrder.user_lat,
            lng: incomingOrder.user_lng,
          })
        );

        Cookies.set(
          'currentOrder',
          JSON.stringify({ ...incomingOrder, status: 'Accepted' })
        );
        dispatch(saveOrder({ ...incomingOrder, status: 'Accepted' }));
      })
      .then(() => {
        dispatch(removeIncomingOrder());
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
