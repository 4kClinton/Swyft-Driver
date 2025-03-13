import { useEffect, useState } from 'react';
import styles from '../Styles/deliveryDetails.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useLoadScript } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { removeOrder, saveOrder } from '../Redux/Reducers/CurrentOrderSlice';
import { removeCustomer } from '../Redux/Reducers/CurrentCustomerSlice';
import Cookies from 'js-cookie';
import { removeIncomingOrder } from '../Redux/Reducers/incomingOrderSlice';

// Import a relevant icon from MUI
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

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

  /**
   * Sync local state with the Redux order status.
   */
  useEffect(() => {
    if (order?.status) {
      setOrderStatus(order.status);

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
      }
    }
  }, [order]);

  // For debugging, safely log the order status
  useEffect(() => {
    console.log('Order status:', order?.status);
    console.log('Full order object:', order);
  }, [order]);

  /**
   * Once Google Maps is loaded, fetch addresses if order is valid.
   */
  useEffect(() => {
    if (isLoaded && order?.id) {
      handleGetCustomerLocation();
    }
    // eslint-disable-next-line
  }, [isLoaded, order?.id]);

  const handleGetCustomerLocation = () => {
    if (!order?.id || !window.google?.maps) {
      console.error('Google Maps API is not available or order is invalid.');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    // Customer location
    const latlng = {
      lat: order.user_lat,
      lng: order.user_lng,
    };
    // Destination location
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
  };

  /**
   * Handle updating the order status in the backend and Redux.
   */
  const handleArrivedAtCustomer = async () => {
    setOrderStatus('arrived_at_customer');
    setButtonText('Go to Destination');
    const token = Cookies.get('authTokendr2');

    try {
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
      console.log('Order status updated:', data);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const handleGoToDestination = async () => {
    setOrderStatus('on_the_way_to_destination');
    setButtonText('Complete Ride');
    const token = Cookies.get('authTokendr2');

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
      console.log('Order status updated:', data);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const handleCompleteRide = async () => {
    setOrderStatus('completed');
    setButtonText('Ride Completed');
    const token = Cookies.get('authTokendr2');

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

      // Clear Redux store
      dispatch(removeOrder());
      dispatch(removeIncomingOrder());
      dispatch(removeCustomer());

      // Go back to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  /**
   * 1) If there's no order or status is missing:
   *    Show "You currently don't have an order" fallback with an MUI icon.
   */
  if (!order?.id || !order?.status) {
    return (
      <div className={styles.container}>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <RemoveShoppingCartIcon sx={{ fontSize: 64, color: 'gray' }} />
          <h2>You currently don’t have an order</h2>
          <button
            className={styles.button}
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /**
   * 2) If addresses are not loaded yet, show a loading message.
   */
  if (!customer?.id || !customerAddress || !destination) {
    return <div>Loading order details...</div>;
  }

  /**
   * 3) Render the normal UI if we have a valid order, status, and addresses.
   */
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
            <span>{customerAddress}</span>
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
            <span>{destination}</span>
          </div>

          <div className={styles.details}>
            <div className={styles.distance}>{order.distance} km</div>
            <div className={styles.price}>Ksh {order.total_cost}</div>
          </div>

          <div className={styles.loaders}>Loaders: {order.loaders}</div>

          <div className={styles.separator}></div>

          <div className={styles.commission}>
            Commission:{' '}
            <span className={styles.price}>
              Ksh {Math.round(order.total_cost - order.loaderCost)}
            </span>
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
