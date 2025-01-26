import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'; // Import useLocation

import BottomNav from './Components/BottomNav';

import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from './Redux/Reducers/UserSlice';
import { supabase } from './supabase';
import { alertOn } from './Redux/Reducers/alertSlice';
import { removeOrder, saveOrder } from './Redux/Reducers/CurrentOrderSlice';
import { toast, ToastContainer } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

import {
  removeCustomer,
  saveCustomer,
} from './Redux/Reducers/CurrentCustomerSlice';
import { saveOrders } from './Redux/Reducers/ordersHistorySlice';
import Alert from './Components/Alert';

function App() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const driver = useSelector((state) => state.user.value);
  const [data, setData] = useState(null); // State for data
  const dispatch = useDispatch();

  const location = useLocation(); // Get the current location

  useEffect(() => {
    // Subscribe to changes in the 'orders' table
    const ordersChannel = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload?.new?.driver_id === driver.id) {
            dispatch(saveOrder(payload.new));

            dispatch(alertOn());
          }
        }
      )

      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload?.new?.driver_id === driver.id) {
            const updatedStatus = payload?.new?.status;
            console.log(payload.new);
            if (updatedStatus === 'cancelled') {
              console.log(updatedStatus);

              toast.error('Order has been cancelled', {
                position: 'bottom-center',
                autoClose: 5000, // Set the time it stays visible
                onClose: () => {
                  // Optionally navigate or remove items once the toast is acknowledged
                  localStorage.removeItem('currentOrder');
                  localStorage.removeItem('customerData');
                  dispatch(removeOrder());
                  dispatch(removeCustomer());
                  navigate('/dashboard');
                },
              });

              localStorage.removeItem('currentOrder');
              localStorage.removeItem('customerData');
              dispatch(removeOrder());
              dispatch(removeCustomer());
              navigate('/dashboard');
            }
          }
        }
      )
      .subscribe();

    // Cleanup the subscription on component unmount
    return () => {
      if (ordersChannel) {
        supabase
          .removeChannel(ordersChannel)
          .then(() => console.log('Channel successfully removed'))
          .catch((error) => console.error('Error removing channel:', error));
      }
    };
    //eslint-disable-next-line
  }, [driver.id, dispatch]);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');

    if (token) {
      fetch('https://swyft-backend-client-nine.vercel.app/check_session', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to verify token');
          }
          return response.json();
        })
        .then((userData) => {
          dispatch(addUser(userData));
          const storedCustomerData = localStorage.getItem('customerData');

          const storedOrderData = localStorage.getItem('currentOrder');

          if (storedCustomerData && storedOrderData) {
            const order = JSON.parse(storedOrderData);
            if (
              order.status !== 'completed' &&
              order.status !== 'cancelled' &&
              order.status !== 'Pending'
            ) {
              dispatch(saveCustomer(JSON.parse(storedCustomerData)));
              dispatch(saveOrder(order));
            }
          }
        })

        .catch((error) => {
          console.error('Token verification failed:', error);
        });
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      fetch('https://swyft-backend-client-nine.vercel.app/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch rides history');
          }
          return response.json();
        })
        .then((data) => {
          dispatch(saveOrders(data));
        });
    }
    //eslint-disable-next-line
  }, [driver]);

  useEffect(() => {
    // Fetch totalPrice data from the given endpoint

    fetch('https://swyft-backend-client-nine.vercel.app/orders/total_cost')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        setData(data); // Set the fetched data to the state
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        // Set dummy data in case of an error
        setData({ earnings: 2500 }); // Replace with appropriate dummy data as needed
      });
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  if (data === null) {
    return <div>Loading...</div>; // Display loading state if data is not yet available
  }

  return (
    <div>
      <Alert />
      <Outlet />
      {/* Conditionally render BottomNav based on current location */}
      {location.pathname !== '/' &&
        location.pathname !== '/signup' &&
        location.pathname !== '/verification' && (
          <BottomNav value={count} onChange={setCount} />
        )}
      <ToastContainer />
    </div>
  );
}

export default App;
