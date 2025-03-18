import { useState, useEffect, useRef } from 'react';
import '../Styles/Dash.css';
import GoOnlineButton from '../Components/GoOnlineButton';
import { FaMoneyBillWave, FaStar, FaCar, FaLifeRing } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dash = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startY, setStartY] = useState(null);
  const dashRef = useRef(null);

  const currentCustomer = useSelector((state) => state.currentCustomer.value);
  const user = useSelector((state) => state.user.value);
  const driver = useSelector((state) => state.user.value);

  // We'll store a numeric value here; start with null or 0
  const [earnings, setEarnings] = useState(null);

  useEffect(() => {
    async function fetchEarnings() {
      try {
        if (!driver.id) return; // Ensure we have a valid driver ID
        const response = await fetch(
          `https://swyft-backend-client-nine.vercel.app/earnings/${driver.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // Convert to a number (in case the server returns a string)
        const numericValue = Number(result.total_unpaid_earnings);
        if (isNaN(numericValue)) {
          throw new Error('Earnings is not a valid number');
        }
        setEarnings(numericValue);
      } catch (error) {
        console.error('Error fetching earnings:', error);
        // Set to null or some error state
        setEarnings(null);
      }
    }

    fetchEarnings();
  }, [driver.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dashRef.current && !dashRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const toggleDash = () => {
    setIsOpen((prev) => !prev);
    setDragOffset(0);
  };

  const closedOffset = 300;

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (startY !== null) {
      const currentY = e.touches[0].clientY;
      const delta = currentY - startY;
      setDragOffset(delta);
    }
  };

  const handleTouchEnd = () => {
    const threshold = 50;
    if (!isOpen && dragOffset < -threshold) {
      setIsOpen(true);
    } else if (isOpen && dragOffset > threshold) {
      setIsOpen(false);
    }
    setDragOffset(0);
    setStartY(null);
  };

  const currentTransform = isOpen ? dragOffset : closedOffset + dragOffset;

  // Decide what to display for the earnings text
  let earningsText = 'Loading...';
  if (earnings === null) {
    earningsText = 'Error fetching earnings';
  } else if (typeof earnings === 'number') {
    // Format with commas for thousands and two decimal places
    earningsText = `Ksh ${earnings.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return (
    <div
      ref={dashRef}
      className={`Dash ${isOpen ? 'open' : 'closed'}`}
      style={{ transform: `translateY(${currentTransform}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="notch" onClick={toggleDash}>
        <div className="notch-indicator"></div>
      </div>

      <GoOnlineButton onClick={toggleDash} />
      <h2 className="catch" onClick={toggleDash}>
        Your Performance Overview
      </h2>

      <div className="dash-content">
        <Link to="/earnings" className="card-link">
          <div className="card">
            <FaMoneyBillWave size={24} className="card-icon" />
            <h3>Earnings</h3>
            <p>{earningsText}</p>
          </div>
        </Link>
        <Link to="/deliveryDetails" className="card-link">
          <div className="card">
            <FaCar size={24} className="card-icon" />
            <h3>Current Order</h3>
            <p>{currentCustomer.id ? currentCustomer.name : 'No orders'}</p>
          </div>
        </Link>
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
