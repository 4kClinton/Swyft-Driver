import { useEffect, useState } from 'react';
import styles from '../Styles/deliveryDetails.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useLoadScript } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { removeOrder, saveOrder } from '../Redux/Reducers/CurrentOrderSlice';
import { removeCustomer } from '../Redux/Reducers/CurrentCustomerSlice';
import Cookies from 'js-cookie';

export default function DeliveryDetails() {
  const dispatch = useDispatch();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Load API key from .env
    libraries: ['places'],
  });

  const customer = useSelector((state) => state.currentCustomer.value);
  const order = useSelector((state) => state.currentOrder.value);
  const [customerAddress, setCustomerAddress] = useState('');
  const [destination, setDestination] = useState('');
  const [buttonText, setButtonText] = useState('Arrived at Customer Location');
  const [orderStatus, setOrderStatus] = useState('on_the_way');
  const navigate = useNavigate();

  useEffect(() => {
    // Update orderStatus state with the current order status
    if (order && order.status) {
      setOrderStatus(order.status);

      // Update the button text based on the order status
      switch (order.status) {
        case 'arrived_at_customer':
          setButtonText('Go to Destination');
          break;
        case 'on_the_way_to_destination':
          setButtonText('Complete Ride');
          break;
        case 'completed':
          setButtonText('Ride Completed');
          break;
        case 'cancelled':
          setButtonText('Order Cancelled');
          break;
        default:
          setButtonText('Arrived at Customer Location');
          break;
      }
    }
  }, [order]);
  console.log(order.status);
  useEffect(() => {
    console.log(order);
  }, [order]);

  useEffect(() => {
    if (isLoaded) {
      handleGetCustomerLocation();
    }
    // eslint-disable-next-line
  }, [isLoaded, order.id]);

  const handleGetCustomerLocation = () => {
    if (order.id && window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      const latlng = {
        lat: order.user_lat,
        lng: order.user_lng,
      };
      const newDestination = {
        lat: order.dest_lat,
        lng: order.dest_lng,
      };

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
          setCustomerAddress(results[0].formatted_address);
        } else {
          console.error('Error retrieving address:', status);
        }
      });

      geocoder.geocode({ location: newDestination }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
          setDestination(results[0].formatted_address);
        } else {
          console.error('Error retrieving address:', status);
        }
      });
    } else {
      console.error('Google Maps API is not available.');
    }
  };

  const handleArrivedAtCustomer = async () => {
    setOrderStatus('arrived_at_customer');
    setButtonText('Go to Destination');
    const token = Cookies.get('authToken');

    try {
      // Update the order status to 'arrived_at_customer' via fetch
      const response = await fetch(
        `https://swyft-backend-client-nine.vercel.app/orders/${order.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'arrived_at_customer' }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const data = await response.json();
      dispatch(saveOrder(data?.order));

      localStorage.setItem('currentOrder', JSON.stringify(data?.order));
      console.log('Order status updated:', data);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const handleGoToDestination = async () => {
    setOrderStatus('on_the_way_to_destination');
    setButtonText('Complete Ride');
    const token = Cookies.get('authToken');

    try {
      const response = await fetch(
        `https://swyft-backend-client-nine.vercel.app/orders/${order.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'on_the_way_to_destination' }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const data = await response.json();
      dispatch(saveOrder(data?.order));

      localStorage.setItem('currentOrder', JSON.stringify(data?.order));
      console.log('Order status updated:', data);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const handleCompleteRide = async () => {
    setOrderStatus('completed');
    setButtonText('Ride Completed');
    const token = Cookies.get('authToken');

    try {
      const response = await fetch(
        `https://swyft-backend-client-nine.vercel.app/orders/${order.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'completed' }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const data = await response.json();
      console.log('Order status updated:', data);

      Cookies.remove('currentOrder');
      Cookies.remove('customerData');
      dispatch(removeOrder());
      dispatch(removeCustomer());
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  if (!customer?.id) return null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles['card-content']}>
          <div className={styles['user-info']}>
            <div className={styles.avatar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className={styles.username}>{customer.name}</h2>
          </div>

          <div className={styles.route}>
            <span>{customerAddress && customerAddress}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
            <span>{destination && destination}</span>
          </div>

          <div className={styles.details}>
            <div className={styles.distance}>{order.distance} km</div>
            <div className={styles.price}>Ksh {order.total_cost}</div>
          </div>

          <div className={styles.loaders}>Loaders: {order.loaders}</div>

          <div className={styles.separator}></div>

          <div className={styles.commission}>
            Commission: <span className={styles.price}>Ksh 345</span>
          </div>
        </div>

        <div className={styles['card-footer']}>
          <button className={`${styles.button} ${styles['button-secondary']}`}>
            <a href="tel:0722812732">0722812732</a>
          </button>

          <button
            className={`${styles.button} ${styles['button-primary']}`}
            onClick={() => navigate('/dashboard')}
          >
            Go To Map
          </button>

          <button
            className={`${styles.button} ${styles['button-primary']}`}
            onClick={
              orderStatus === 'Accepted'
                ? handleArrivedAtCustomer
                : orderStatus === 'arrived_at_customer'
                  ? handleGoToDestination
                  : handleCompleteRide
            }
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
