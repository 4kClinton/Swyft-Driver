import { useEffect, useRef } from 'react';
import soundFile from '../assets/this-one.wav';
import '../Styles/Alert.css';
import { useSelector, useDispatch } from 'react-redux';
import { alertOff } from '../Redux/Reducers/alertSlice';
import { declineOrder, saveOrder } from '../Redux/Reducers/CurrentOrderSlice';
import {
  saveCustomer,
  saveDestination,
} from '../Redux/Reducers/CurrentCustomerSlice';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import caller from '../assets/swyft-logo2.png';
import { removeIncomingOrder } from '../Redux/Reducers/incomingOrderSlice';

const Alert = () => {
  // Removed unused loading state
  const audioRef = useRef(null);

  const alertValue = useSelector((state) => state.alert.value);
  const incomingOrder = useSelector((state) => state.incomingOrder.value);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('authTokendr2');
    if (alertValue && audioRef.current) {
      audioRef.current.loop = true;
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: `New Order From ${incomingOrder.customer ? incomingOrder.customer.name : ''}`,
          artist: 'Swyft Driver',
          album: 'Incoming Order',
          artwork: [
            {
              src: 'https://example.com/path/to/artwork256x256.jpg',
              sizes: '256x256',
              type: 'image/jpeg',
            },
            {
              src: 'https://example.com/path/to/artwork512x512.jpg',
              sizes: '512x512',
              type: 'image/jpeg',
            },
          ],
        });
        navigator.mediaSession.setActionHandler('play', () =>
          audioRef.current.play()
        );
        navigator.mediaSession.setActionHandler('pause', () =>
          audioRef.current.pause()
        );
      }
      audioRef.current.play();
      if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500, 200, 500]);
      }
      const timer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        if (navigator.vibrate) {
          navigator.vibrate(0);
        }
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
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [alertValue, incomingOrder.id]);

  const AcceptOrder = () => {
    const token = Cookies.get('authTokendr2');

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
    dispatch(alertOff());
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
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  if (alertValue) {
    return (
      <div className="Alert">
        <img src={caller} alt="Caller" />
        <div className="text">
          <div className="name">Incoming Order</div>
          <div className="call-text">Get Ready...</div>
        </div>
        <div className="buttons">
          <button className="answer" onClick={AcceptOrder}>
            Accept
          </button>
        </div>
        <audio ref={audioRef} src={soundFile} preload="auto" />
      </div>
    );
  }

  return null;
};

export default Alert;
