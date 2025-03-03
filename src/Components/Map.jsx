// Define the libraries array outside the component
const libraries = ['places'];

import { useState, useEffect } from 'react';
import {
  GoogleMap,
  useLoadScript,
  DirectionsRenderer,
  Marker,
} from '@react-google-maps/api';
import CircularProgress from '@mui/material/CircularProgress';
import '../Styles/Map.css';
import Dash from './Dash';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Map = () => {
  const order = useSelector((state) => state.currentOrder.value);
  const onlineStatus = useSelector((state) => state.goOnline.value);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries, // use the constant defined outside
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState(0);
  const [destination, setDestination] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const user = useSelector((state) => state.user.value);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.id) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Get user's current location
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrentLocation(userLocation);
          },
          (error) => {
            console.error('Error obtaining location:', error);
            alert(
              'Unable to retrieve your location. Please check your settings.'
            );
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    };
    if (isLoaded && onlineStatus) {
      getCurrentLocation();
    }
  }, [isLoaded, onlineStatus]);

  useEffect(() => {
    // Set customer and destination locations when order data is available
    if (order?.id) {
      setCustomerLocation({
        lat: order.user_lat,
        lng: order.user_lng,
      });
      setDestination({
        lat: order.dest_lat,
        lng: order.dest_lng,
      });
    }
  }, [order]);

  useEffect(() => {
    // Calculate route when everything is ready
    if (isLoaded && currentLocation && customerLocation && destination) {
      calculateRoute();
    }
    // eslint-disable-next-line
  }, [isLoaded, currentLocation, customerLocation, destination]);

  const calculateRoute = async () => {
    if (!window.google || !currentLocation || !customerLocation || !destination)
      return;

    const directionsService = new window.google.maps.DirectionsService();
    const distanceMatrixService =
      new window.google.maps.DistanceMatrixService();

    try {
      const directionsResult = await directionsService.route({
        origin: currentLocation,
        destination: destination,
        waypoints: [{ location: customerLocation, stopover: true }],
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(directionsResult);

      const distanceMatrixResult =
        await distanceMatrixService.getDistanceMatrix({
          origins: [currentLocation],
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
        });

      const distanceElement = distanceMatrixResult.rows[0].elements[0];

      if (distanceElement && distanceElement.status === 'OK') {
        const calculatedDistance = distanceElement.distance.value / 1000;
        setDistance(calculatedDistance);
      } else {
        console.error('Distance calculation failed:', distanceElement);
      }
    } catch (error) {
      console.error('Error fetching directions or distance matrix:', error);
    }
  };

  if (!isLoaded) {
    return (
      <div>
        <CircularProgress size={40} />
      </div>
    );
  }

  return (
    <>
      <div className="map-container">
        <GoogleMap
          mapContainerClassName="google-map"
          center={
            destination || currentLocation || { lat: -1.286389, lng: 36.817223 }
          }
          zoom={12}
        >
          {customerLocation && (
            <Marker
              position={customerLocation}
              label="Customer"
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              }}
            />
          )}
          {destination && (
            <Marker
              position={destination}
              label="Destination"
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
              }}
            />
          )}
          {currentLocation && (
            <Marker
              position={currentLocation}
              label="Driver"
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              }}
            />
          )}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
        <Dash
          distance={Number(distance)}
          userLocation={currentLocation}
          destination={destination}
        />
      </div>
    </>
  );
};

export default Map;
