// RidesHistory.js
import { Truck } from 'lucide-react';
import styles from '../Styles/Rides.module.css';
import { useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import RideDetailsModal from './RideDetailsModal';
import { useNavigate } from 'react-router-dom';
import { cacheAddress } from '../Redux/Reducers/rideSlice';

export default function RidesHistory() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rides, setRides] = useState([]);
  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);

  const user = useSelector((state) => state.user.value);
  const ordersHistory = useSelector((state) => state.ordersHistory.value);
  const addrCache = useSelector((state) => state.rides?.addrCache || {}); // Add fallback to an empty object
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-GB', options);
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  useEffect(() => {
    if (ordersHistory.length && isLoaded) {
      fetchAddresses(ordersHistory);
    } else if (!ordersHistory.length) {
      setLoading(false);
    }
  }, [ordersHistory, isLoaded]);

  const fetchAddresses = async (data) => {
    const geocoder = new window.google.maps.Geocoder();
    try {
      const ridesWithAddresses = await Promise.all(
        data.map(async (ride) => {
          const userAddress = await cachedGeocode(geocoder, {
            lat: ride.user_lat,
            lng: ride.user_lng,
          });
          const destAddress = await cachedGeocode(geocoder, {
            lat: ride.dest_lat,
            lng: ride.dest_lng,
          });
          return { ...ride, userAddress, destAddress };
        })
      );
      ridesWithAddresses.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setRides(ridesWithAddresses);
      setAddressesLoaded(true);
      setLoading(false);
    } catch {
      setError('Error loading addresses');
      setLoading(false);
    }
  };

  const cachedGeocode = (geocoder, latlng) => {
    const key = `${latlng.lat},${latlng.lng}`;
    const cached = addrCache[key];
    if (cached) {
      console.log(`[CACHE] Hit for ${key}: ${cached}`);
      return Promise.resolve(cached);
    }
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
          const addr = results[0].formatted_address;
          console.log(`[CACHE] Miss for ${key}, fetched: ${addr}`);
          dispatch(cacheAddress({ key, addr }));
          resolve(addr);
        } else {
          reject('Error retrieving address');
        }
      });
    });
  };

  if (loading && !addressesLoaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgress className="login-loader" size={34} color="#0000" />
        <span>Loading rides history...</span>
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;
  if (!rides.length) return <div>No rides found</div>;

  const completedRides = rides.filter((r) => r.status === 'completed');
  const handleViewEarnings = () =>
    navigate('/earnings', { state: { completedRides } });

  const groupedRides = rides.reduce((acc, ride) => {
    const d = formatDate(ride.created_at);
    acc[d] = acc[d] || [];
    acc[d].push(ride);
    return acc;
  }, {});

  return (
    <>
      <div className={`${styles.app} ${selectedRide ? styles.blur : ''}`}>
        <div className={styles.title}>
          <h1>Moves History</h1>
        </div>
        <div className={styles.topCard}>
          <span
            className={
              user?.commissionStatus === 'cleared'
                ? styles.statusCleared
                : styles.statusDue
            }
          >
            {user?.commissionStatus === 'cleared'
              ? 'Cleared'
              : 'Commission Due'}
          </span>
          <button className={styles.viewButton} onClick={handleViewEarnings}>
            View Earnings
          </button>
        </div>
        <main>
          {Object.entries(groupedRides).map(([date, ridesOnDate]) => (
            <section key={date} className={styles.day_section}>
              <h2 className={styles.h2}>{date}</h2>
              {ridesOnDate.map((ride, i) => (
                <div
                  key={i}
                  className={styles.ride_entry}
                  onClick={() => setSelectedRide(ride)}
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
                      Ksh {ride.total_cost ?? '0.00'}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          ))}
        </main>
      </div>

      {selectedRide && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedRide(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <RideDetailsModal
              ride={selectedRide}
              onClose={() => setSelectedRide(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}
