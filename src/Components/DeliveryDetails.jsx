import { useEffect, useState } from 'react';
import styles from '../Styles/deliveryDetails.module.css';
import { useSelector } from 'react-redux';
import { useLoadScript } from '@react-google-maps/api';

export default function DeliveryDetails() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Load API key from .env
    libraries: ['places'],
  });

  const customer = useSelector((state) => state.currentCustomer.value);
  const order = useSelector((state) => state.currentOrder.value);
  const [customerAddress, setCustomerAddress] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    if (isLoaded) {
      handleGetCustomerLocation();
    }
    // eslint-disable-next-line
  }, [isLoaded, order.id]);

  const handleGetCustomerLocation = () => {
    if (order.id && window.google && window.google.maps) {
      console.log(order);

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

          <div className={styles.loaders}>{order.loaders}</div>

          <div className={styles.separator}></div>

          <div className={styles.commission}>
            Commission : <span className={styles.price}>Ksh 345</span>
          </div>
        </div>
        <div className={styles['card-footer']}>
          <button className={`${styles.button} ${styles['button-secondary']}`}>
            <a href="tel:0722812732">0722812732</a>
          </button>

          <button className={`${styles.button} ${styles['button-primary']}`}>
            Go To Client
          </button>
          <button className={`${styles.button} ${styles['button-secondary']}`}>
            Continue to Destination
          </button>
        </div>
      </div>
    </div>
  );
}
