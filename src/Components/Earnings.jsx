import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import "../Styles/Earnings.css";

const Earnings = () => {
  const navigate = useNavigate();
  const driver = useSelector((state) => state.user.value);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [earningsData, setEarningsData] = useState(null);

  useEffect(() => {
    if (!driver.id) return; // Only proceed if driver.id is available

    fetch(`https://swyft-backend-client-nine.vercel.app/earnings/${driver.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setEarningsData(data))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setEarningsData({ error: error.message }); // Set an error state
      });
  }, [driver.id]); // Add driver.id as a dependency

  if (earningsData === null) {
    return <div>Loading...</div>;
  }

  if (earningsData.error) {
    return <div>Error: {earningsData.error}</div>; // Display an error message
  }

  const { outstanding_balance, total_payments_made, total_unpaid_earnings } = earningsData;

  const handleGoBack = () => {
    navigate(-1); // Navigate one step back in the history stack
  };

  const handleMpesaPayment = async () => {
    if (!phoneNumber.match(/^07\d{8}$/)) {
      setError("Please enter a valid phone number starting with 07.");
      return;
    }

    setError(""); // Clear any existing errors

    try {
      // Simulate triggering Mpesa API
      const response = await fetch("/api/mpesa/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, amount: total_unpaid_earnings }),
      });

      if (!response.ok) {
        throw new Error("Payment failed. Please try again.");
      }

      alert("Payment initiated successfully. Please complete the payment on your phone.");
    } catch (error) {
      alert(error.message || "An error occurred during payment.");
    }
  };

  return (
    <div className="earnings-container">
      <h1 className="earnings-heading">Earnings Overview</h1>
      <p className="earnings-text">
        Outstanding Balance:{" "}
        <span className="earnings-highlight">Ksh{outstanding_balance}</span>
      </p>
      <p className="earnings-text">
        Total Payments Made:{" "}
        <span className="earnings-highlight">Ksh{total_payments_made}</span>
      </p>
      <p className="earnings-text">
        Total Unpaid Earnings:{" "}
        <span className="earnings-highlight">Ksh{total_unpaid_earnings}</span>
      </p>

      <div className="phone-input-container">
        <label htmlFor="phoneNumber" className="phone-label">
          Phone Number:
        </label>
        <input
          type="text"
          id="phoneNumber"
          className="phone-input"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
      </div>

      <button className="payment-button" onClick={handleMpesaPayment}>
        Pay via Mpesa
      </button>

      <button className="go-back-button" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default Earnings;
