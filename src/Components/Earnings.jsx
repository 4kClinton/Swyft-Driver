import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Earnings.css";

const Earnings = ({ totalCost }) => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const commission = (totalCost * 0.25).toFixed(2);

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
        body: JSON.stringify({ phoneNumber, amount: commission }),
      });

      if (!response.ok) {
        throw new Error("Payment failed. Please try again.");
      }

      alert(
        "Payment initiated successfully. Please complete the payment on your phone."
      );
    } catch (error) {
      alert(error.message || "An error occurred during payment.");
    }
  };

  return (
    <div className="earnings-container">
      <h1 className="earnings-heading">Earnings Overview</h1>
      <p className="earnings-text">
        Total Cost:{" "}
        <span className="earnings-highlight">Ksh{totalCost.toFixed(2)}</span>
      </p>
      <p className="earnings-text">
        Commission to Swyft (25%):{" "}
        <span className="earnings-highlight">Ksh{commission}</span>
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
        Pay Commission via Mpesa
      </button>

      <button className="go-back-button" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default Earnings;
