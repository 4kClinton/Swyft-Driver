import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dash from "./Components/Dash";
import Map from "./Components/Map";
import BottomNav from "./Components/BottomNav";
import RidesHistory from "./Components/Rides";
import Notifications from "./Components/Notifications";
import Profile from "./Components/Profile";
import Login from "./Components/Login";
import Signup from "./Components/SignUp";
import Verification from "./Components/Verification";
import GoOnlineButton from "./Components/GoOnlineButton";
import Earnings from "./Components/Earnings";
import OrderMap from "./Components/ReceivedOrder";
import "./App.css";

import { useDispatch, useSelector } from "react-redux";
import { addUser } from "./Redux/Reducers/UserSlice";
import { supabase } from "./supabase";
import { alertOn } from "./Redux/Reducers/alertSlice";
import { saveOrder } from "./Redux/Reducers/CurrentOrderSlice";


function App() {
  const [count, setCount] = useState(0);

  const driver = useSelector((state) => state.user.value);
  const [data, setData] = useState(null); // State for data
  const dispatch = useDispatch();
 
  
    useEffect(() => {
      // Subscribe to changes in the 'orders' table
      const ordersChannel = supabase
        .channel('orders')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
          if (payload?.new?.driver_id === driver.id) {
            dispatch(saveOrder(payload.new));
            dispatch(alertOn());
          }
        })
        .subscribe();

      // Cleanup the subscription on component unmount
      return () => {
        if (ordersChannel) {
          supabase.removeChannel(ordersChannel)
            .then(() => console.log('Channel successfully removed'))
            .catch((error) => console.error('Error removing channel:', error));
        }
      };
    }, [driver.id, dispatch]);

 
  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    

    if (token) {
      fetch("https://swyft-backend-client-nine.vercel.app/check_session", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to verify token");
          }
          return response.json();
        })

        .then((userData) => {
          dispatch(addUser(userData));
        })
        .catch((error) => {
          console.error("Token verification failed:", error);
        });
    }
  }, [dispatch]);

  useEffect(() => {
    // Fetch totalPrice data from the given endpoint

    fetch("https://swyft-backend-client-nine.vercel.app/orders/total_cost")

  
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setData(data); // Set the fetched data to the state
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Set dummy data in case of an error
        setData({ earnings: 2500 }); // Replace with appropriate dummy data as needed
      });
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleToggleStatus = (status) => {
    setIsOnline(status);
    
  };

  if (data === null) {
    return <div>Loading...</div>; // Display loading state if data is not yet available
  }

  return (
  
      <Router>
        <div className="app">
          <Routes>
            <Route
              path="/"
              element={<Login onLogin={() => setIsLoggedIn(true)} />}
            />
            <Route
              path="/dashboard"
              element={
                <>
                  {/* <Dash /> */}
                  <Map />
                  <BottomNav value={count} onChange={setCount} />
                
                </>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/order" element={<OrderMap />} />
            <Route
              path="/rides"
              element={
                <>
                  <RidesHistory />
                  <BottomNav value={count} onChange={setCount} />
                </>
              }
            />
            <Route
              path="/notifications"
              element={
                <>
                  <Notifications />
                  <BottomNav value={count} onChange={setCount} />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <Profile />
                  <BottomNav value={count} onChange={setCount} />
                </>
              }
            />
            <Route
              path="/earnings"
              element={<Earnings totalCost={data.earnings} />}
            />
          </Routes>
        </div>
      </Router>
 
  );
}

export default App;
