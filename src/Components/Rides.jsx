import { Truck } from 'lucide-react';
import styles from '../Styles/Rides.module.css';
import { useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import RideDetailsModal from './RideDetailsModal';

export default function RidesHistory() {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.value);
  const [error, setError] = useState(null);
  const [rides, setRides] = useState([]);
  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null); // State to track selected ride for the modal
  const ordersHistory = useSelector((state) => state.ordersHistory.value);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'arrived_at_customer':
        return (
          <span className={styles.statusArrived}>Arrived at Customer</span>
        );
      case 'on_the_way_to_destination':
        return (
          <span className={styles.statusOnTheWay}>
            On the Way to Destination
          </span>
        );
      case 'Accepted':
        return <span className={styles.statusAccepted}>Accepted</span>;
      case 'completed':
        return <span className={styles.statusCompleted}>Ride Completed</span>;
      case 'Pending':
        return <span className={styles.statusPending}>Pending</span>;
      case 'cancelled':
        return <span className={styles.statusCanceled}>Cancelled</span>;
      default:
        return <span className={styles.statusUnknown}>Unknown Status</span>;
    }
  };

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    let formattedDate = date.toLocaleDateString('en-GB', options);

    const day = date.getDate();
    const suffix = getDaySuffix(day);
    formattedDate = formattedDate.replace(day, `${day}${suffix}`);

    return formattedDate;
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Group rides by date with formatted date
  const groupedRides = rides.reduce((acc, ride) => {
    const date = formatDate(new Date(ride.created_at));
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(ride);
    return acc;
  }, {});

  useEffect(() => {
    if (ordersHistory.length > 0) {
      if (isLoaded) {
        fetchAddresses(ordersHistory);
      }
    } else {
      setLoading(false);
    }
    //eslint-disable-next-line
  }, [ordersHistory, isLoaded]);

  const fetchAddresses = async (data) => {
    const geocoder = new window.google.maps.Geocoder();
    try {
      const ridesWithAddresses = await Promise.all(
        data.map(async (ride) => {
          const userLatLng = { lat: ride.user_lat, lng: ride.user_lng };
          const destLatLng = { lat: ride.dest_lat, lng: ride.dest_lng };

          const userAddress = await geocodeLatLng(geocoder, userLatLng);
          const destAddress = await geocodeLatLng(geocoder, destLatLng);

          return {
            ...ride,
            userAddress,
            destAddress,
          };
        })
      );
      // Sort rides by created_at in descending order (latest first)
      ridesWithAddresses.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setRides(ridesWithAddresses);
      setAddressesLoaded(true);

      setLoading(false);
    } catch (error) {
      setError('Error loading addresses', error);
      setLoading(false);
    }
  };

  const geocodeLatLng = (geocoder, latlng) => {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject('Error retrieving address');
        }
      });
    });
  };

  if (loading === true && addressesLoaded === false)
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgress className="login-loader" size={34} color="#0000" />
        <span>Loading rides history...</span>
      </div>
    );

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (rides.length === 0) {
    return <div>No rides found</div>;
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1
          className={styles.h1}
          style={{
            fontSize: '24px',
            color: '#00d46a',
            marginTop: '3vh',
            fontFamily: 'Montserrat',
          }}
        >
          Moves History
        </h1>
        <span
          style={{
            color: user?.commissionStatus === 'cleared' ? 'green' : 'red',
            marginLeft: '10px',
            fontSize: '1rem',
            fontFamily: 'Montserrat',
          }}
        >
          {user?.commissionStatus === 'cleared' ? 'Cleared' : 'Commission Due'}
        </span>
      </header>

      <main>
        {Object.keys(groupedRides).map((date) => (
          <section key={date} className={styles.day_section}>
            <h2 className={styles.h2}>{date}</h2>
            {groupedRides[date].map((ride, index) => (
              <div
                key={index}
                className={styles.ride_entry}
                onClick={() => setSelectedRide(ride)}
                style={{ cursor: 'pointer', padding: '5px' }}
              >
                <Truck className={styles.ride_icon} />
                <div className={styles.ride_details}>
                  <div className={styles.ride_time}>
                    {new Date(ride.created_at).toLocaleTimeString()}
                    <span className={styles.status}>
                      {getStatusLabel(ride.status)}
                    </span>
                  </div>
                  <div className={styles.ride_location}>
                    {ride.userAddress} to {ride.destAddress}
                  </div>
                  <div className={styles.ride_price}>
                    {ride.total_cost ? `Ksh ${ride.total_cost}` : 'Ksh 0.00'}
                  </div>
                </div>
                <hr style={{ border: '1px solid gray' }} />
              </div>
            ))}
            <br />
          </section>
        ))}
      </main>

      {selectedRide && (
        <RideDetailsModal
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
        />
      )}
    </div>
  );
}
