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
import Earnings from "./Components/Earnings";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [isOnline, setIsOnline] = useState(false);
  const [data, setData] = useState(null); // State for data

  useEffect(() => {
    // Fetch totalPrice data from the given endpoint
    fetch("http://localhost:3000/orders/totalPrice")
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
    console.log("Driver status changed:", status ? "Online" : "Offline");
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
