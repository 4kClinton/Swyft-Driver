import React, { useState, useEffect, useRef } from "react";
import "../Styles/Dash.css";
import GoOnlineButton from "../Components/GoOnlineButton.jsx";
import { FaMoneyBillWave, FaChartLine, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";


const Dash = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dashRef = useRef(null);

  // Simulated data for the cards
  const data = {
    earnings: "Ksh 15,000",
    activityScore: "85%",
    ratings: "4.5/5",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dashRef.current && !dashRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const toggleDash = () => setIsOpen(!isOpen);

  return (
    <div ref={dashRef} className={`Dash ${isOpen ? "open" : ""}`}>
      <div className="notch" onClick={toggleDash}>
        <div className="notch-indicator"></div>
      </div>
      <GoOnlineButton onClick={toggleDash} />
      <h2 className="catch" onClick={toggleDash}>
        Your Performance Overview
      </h2>

      <div className="dash-content" >
        <Link to="/earnings" className="card-link">
          <div className="card">
            <FaMoneyBillWave size={24} className="card-icon" />
            <h3>Earnings</h3>
            <p>{data.earnings}</p>
          </div>
        </Link>
        {/* <div className="card">
          <FaChartLine size={24} className="card-icon" />
          <h3>Activity Score</h3>
          <p>{data.activityScore}</p>
        </div> */}
        <div className="card">
          <FaStar size={24} className="card-icon" />
          <h3>Ratings</h3>
          <p>{data.ratings}</p>
        </div>
      </div>
    </div>
  );
};

export default Dash;
