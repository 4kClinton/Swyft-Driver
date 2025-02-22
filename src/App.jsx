import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from './Components/BottomNav';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from './Redux/Reducers/UserSlice';
import { supabase } from './supabase';
import 'firebase/messaging';
import { alertOn } from './Redux/Reducers/alertSlice';
import { removeOrder, saveOrder } from './Redux/Reducers/CurrentOrderSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { removeCustomer, saveCustomer } from './Redux/Reducers/CurrentCustomerSlice';
import { clearOrders, saveOrders } from './Redux/Reducers/ordersHistorySlice';
import Alert from './Components/Alert';
import Cookies from 'js-cookie';
import { addIncomingOrder, removeIncomingOrder } from './Redux/Reducers/incomingOrderSlice.js';
import Message from './Components/Message.jsx';

function App() {
  const navigate = useNavigate();
  const driver = useSelector((state) => state.user.value);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
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
          if (payload?.new?.driver_id === driver.id) {
            const updatedStatus = payload?.new?.status;
            if (updatedStatus === 'cancelled') {
              toast.error('Order has been cancelled', {
                position: 'bottom-center',
                autoClose: 5000,
                onClose: () => {
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

    return () => {
      if (ordersChannel) {
        supabase
          .removeChannel(ordersChannel)
          .then(() => console.log('Channel successfully removed'))
          .catch((error) => console.error('Error removing channel:', error));
      }
    };
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
  }, []);

  useEffect(() => {
    const token = Cookies.get('authTokendr2');
    if (token) {
      fetch(' http://127.0.0.1:5000/orders', {
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
  }, [driver]);

  useEffect(() => {
    fetch('https://swyft-backend-client-nine.vercel.app/orders/total_cost')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setData({ earnings: 2500 });
      });
  }, []);

  if (data === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Alert />
      <Outlet />
      {location.pathname !== '/' &&
        location.pathname !== '/signup' &&
        location.pathname !== '/verification' && (
          <BottomNav />
        )}
      <ToastContainer />
    </div>
  );
}

export default App;
