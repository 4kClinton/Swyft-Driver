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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
// import Message from './Components/Message.jsx';
import CancelIcon from '@mui/icons-material/Cancel';
import Block from '@mui/icons-material/Cancel';

function App() {
  const navigate = useNavigate();
  const driver = useSelector((state) => state.user.value);
  const [data, setData] = useState(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
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
              // Instead of using a toast, we now display a popup.
              setShowCancelPopup(true);
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
  });

  useEffect(() => {
    const token = Cookies.get('authTokendr2');
    if (token) {
      fetch(' https://swyft-backend-client-nine.vercel.app/orders', {
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
        location.pathname !== '/verification' && <BottomNav />}
      <ToastContainer />
      {showCancelPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 12000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              width: '300px',
              height: '300px',
              display: 'flex',
              borderRadius: '30px',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            <Block style={{ fontSize: 90, color: 'red' }} />
            <h2 style={{ color: 'red' }}>Order has been cancelled</h2>
            <button
              onClick={() => {
                setShowCancelPopup(false);
                dispatch(removeOrder());
                dispatch(removeIncomingOrder());
                dispatch(removeCustomer());
                navigate('/dashboard');
              }}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <CancelIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
