import { useEffect, useState } from 'react';
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
} from '@react-google-maps/api';
import axios from 'axios';

const OrderMap = () => {
  const [orders, setOrders] = useState([]);
  const [directions, setDirections] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Replace with your API key
  });

  useEffect(() => {
    // Fetch orders from the server
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/receive-order');
        setOrders(response.data || []); // Safeguard for undefined response
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0 && isLoaded) {
      const { userLocation, userDestination } = orders[0] || {}; // Destructure safely
      if (userLocation && userDestination) {
        convertCoordinatesAndGetDirections(userLocation, userDestination);
      } else {
        console.error('Order data is incomplete.');
      }
    }

    //eslint-disable-next-line
  }, [orders, isLoaded]);

  const convertCoordinatesAndGetDirections = async (
    originCoords,
    destinationCoords
  ) => {
    try {
      const originPlace = await convertCoordinatesToPlace(originCoords);
      const destinationPlace =
        await convertCoordinatesToPlace(destinationCoords);

      getDirections(originPlace, destinationPlace);
    } catch (error) {
      console.error('Error converting coordinates:', error);
    }
  };

  const convertCoordinatesToPlace = async (coords) => {
    if (
      !coords ||
      typeof coords.lat === 'undefined' ||
      typeof coords.lng === 'undefined'
    ) {
      throw new Error('Invalid coordinates provided.');
    }

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
      coords.lat
    },${coords.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await axios.get(geocodeUrl);
      const results = response.data.results;
      if (results && results.length > 0) {
        return results[0].formatted_address;
      } else {
        throw new Error('Failed to convert coordinates to place');
      }
    } catch (error) {
      console.error('Geocoding API error:', error);
      throw error;
    }
  };

  const getDirections = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Error fetching directions:', status);
        }
      }
    );
  };

  return isLoaded ? (
    <div style={{ height: '500px', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={{ height: '100%', width: '100%' }}
        zoom={12}
        center={{ lat: -1.286389, lng: 36.817223 }} // Default center (e.g., Nairobi)
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  ) : (
    <p>Loading map...</p>
  );
};

export default OrderMap;
