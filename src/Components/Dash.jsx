import { useState, useEffect, useRef } from 'react';
import '../Styles/Dash.css';

import { FaMoneyBillWave, FaStar, FaCar, FaLifeRing } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';

const Dash = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dashRef = useRef(null);
  const currentCustomer = useSelector((state) => state.currentCustomer.value);
  console.log(currentCustomer);

  const user = useSelector((state) => state.user.value);

  // Simulated data for the cards
  const data = {
    earnings: 'Ksh 15,000',
    activityScore: '85%',
    ratings: '4.5/5',
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dashRef.current && !dashRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const toggleDash = () => setIsOpen(!isOpen);

  return (
    <div ref={dashRef} className={`Dash ${isOpen ? 'open' : ''}`}>
      <div className="notch" onClick={toggleDash}>
        <div className="notch-indicator"></div>
      </div>

      <h2 className="catch" onClick={toggleDash}>
        Your Performance Overview
      </h2>

      <div className="dash-content">
        <Link to="/earnings" className="card-link">
          <div className="card">
            <FaMoneyBillWave size={24} className="card-icon" />
            <h3>Earnings</h3>
            <p>{data.earnings}</p>
          </div>
        </Link>
        <Link to="/deliveryDetails" className="card-link">
          <div className="card">
            <FaCar size={24} className="card-icon" />
            <h3>Current Order</h3>
            <p>{currentCustomer.id ? currentCustomer.name : 'No orders'}</p>
          </div>
        </Link>
        {/* <div className="card">
          <FaChartLine size={24} className="card-icon" />
          <h3>Activity Score</h3>
          <p>{data.activityScore}</p>
        </div> */}
        <div className="card">
          <FaStar size={24} className="card-icon" />
          <h3>Rating</h3>
          <p>{user.rating && user.rating.toFixed(1)}</p>
        </div>

        <Link to="/support" className="card-link">
          <div className="card">
            <FaLifeRing size={24} className="card-icon" />

            <p>Contact support for help</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dash;
