import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'; // Import useLocation

import BottomNav from './Components/BottomNav';

import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from './Redux/Reducers/UserSlice';
import { supabase } from './supabase';
import 'firebase/messaging';

import { messaging } from './firebase/firebase.js';
import { alertOn } from './Redux/Reducers/alertSlice';
import { removeOrder, saveOrder } from './Redux/Reducers/CurrentOrderSlice';
import { toast, ToastContainer } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import { getToken, onMessage } from 'firebase/messaging';
import {
  removeCustomer,
  saveCustomer,
} from './Redux/Reducers/CurrentCustomerSlice';
import { clearOrders, saveOrders } from './Redux/Reducers/ordersHistorySlice';
import Alert from './Components/Alert';
import Cookies from 'js-cookie';
import {
  addIncomingOrder,
  removeIncomingOrder,
} from './Redux/Reducers/incomingOrderSlice.js';
import Message from './Components/Message.jsx';

function App() {
  const updateFcmTokenOnBackend = async (token) => {
    console.log(Cookies.get('authTokendr2'));

    try {
      const response = await fetch(
        'https://swyft-backend-client-nine.vercel.app/update-fcm-token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('authTokendr2')}`,
          },
          body: JSON.stringify({ fcm_token: token }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send FCM token to backend');
      }

      console.log('✅ FCM token updated on backend');
    } catch (error) {
      console.error('❌ Error updating FCM token on backend:', error);
    }
  };

  const VITE_FCM_VAPID_KEY = import.meta.env.VITE_FCM_VAPID_KEY;

  async function registerServiceWorker() {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js'
        );
        console.log('✅ Service worker registered:', registration);

        const token = await getToken(messaging, {
          vapidKey: VITE_FCM_VAPID_KEY,
          serviceWorkerRegistration: registration, // Firebase 11+ requires explicit registration
        });

        if (token) {
          console.log('🔥 FCM Token:', token);
          Cookies.set('fcmToken', token);
          await updateFcmTokenOnBackend(token);
        } else {
          console.warn('⚠️ No FCM token received. Notifications may not work.');
        }
      } else {
        console.warn('🚫 Service workers are not supported in this browser.');
      }
    } catch (error) {
      console.error('❌ Error registering service worker:', error);
    }
  }

  async function requestNotificationPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('🔔 Notification permission granted.');
        await registerServiceWorker();
      } else {
        console.warn('🚫 Notification permission denied.');
      }
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
    }
  }

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('📩 Foreground Notification Received:', payload);
      toast(<Message notification={payload.notification} />);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

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
            dispatch(addIncomingOrder(payload.new));

            dispatch(alertOn());
          }
        }
      )

      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          console.log(payload);
          console.log(driver);

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

                  dispatch(removeOrder());
                  dispatch(removeCustomer());
                  navigate('/dashboard');
                },
              });

              dispatch(removeOrder());
              dispatch(removeIncomingOrder());
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
    const token = Cookies.get('authTokendr2');
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
        })

        .catch((error) => {
          console.error('Token verification failed:', error);
        });
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const token = Cookies.get('authTokendr2');
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
          console.log(data);

          if (data?.message === 'No orders found') {
            dispatch(clearOrders());
          } else {
            dispatch(saveOrders(data));

            const currentOrder = data.filter(
              (order) =>
                order.status !== 'completed' &&
                order.status !== 'cancelled' &&
                order.status !== 'Pending'
            );

            dispatch(saveOrder(currentOrder[0]));
            if (currentOrder.length > 0) {
              fetch(
                `https://swyft-backend-client-nine.vercel.app/customer/${currentOrder[0]?.customer_id}`,
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
                });
            }
          }
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
