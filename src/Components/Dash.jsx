import { useState, useEffect, useRef } from 'react';
import '../Styles/Dash.css';
import GoOnlineButton from '../Components/GoOnlineButton';
import { FaMoneyBillWave, FaStar, FaCar, FaLifeRing } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dash = () => {
  // Start closed by default.
  const [isOpen, setIsOpen] = useState(false);
  // dragOffset tracks the finger’s movement (in pixels)
  const [dragOffset, setDragOffset] = useState(0);
  // startY stores the initial touch position
  const [startY, setStartY] = useState(null);
  const dashRef = useRef(null);

  const currentCustomer = useSelector((state) => state.currentCustomer.value);
  const user = useSelector((state) => state.user.value);

  // Replace static earnings with state variable
  const [earnings, setEarnings] = useState('Loading...');

  // Fetch earnings from the database on component mount.
  useEffect(() => {
    async function fetchEarnings() {
      try {
        const response = await fetch(
          'https://swyft-backend-client-nine.vercel.app/process-payment'
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        // Use the fetched total_unpaid_earnings value.
        setEarnings(result.total_unpaid_earnings);
      } catch (error) {
        console.error('Error fetching earnings:', error);
        setEarnings('Error fetching earnings');
      }
    }
    fetchEarnings();
  }, []);

  // When the dash is open, clicking outside closes it.
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

  // Define how far down the dash sits when closed (adjust this value as needed)
  const closedOffset = 300;

  // Record initial touch position
  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  // Update dragOffset as the user moves their finger
  const handleTouchMove = (e) => {
    if (startY !== null) {
      const currentY = e.touches[0].clientY;
      const delta = currentY - startY;
      setDragOffset(delta);
    }
  };

  // On touch end, decide whether to open or close based on swipe distance
  const handleTouchEnd = () => {
    const threshold = 50; // Minimum swipe distance in pixels
    if (!isOpen && dragOffset < -threshold) {
      // In closed state: swiping up (negative offset) opens the dash.
      setIsOpen(true);
    } else if (isOpen && dragOffset > threshold) {
      // In open state: swiping down (positive offset) closes the dash.
      setIsOpen(false);
    }
    // Reset drag values after determining state.
    setDragOffset(0);
    setStartY(null);
  };

  // Calculate the current translateY value.
  // When closed, the dash sits at 'closedOffset' plus any drag offset.
  // When open, it starts at 0 and moves with the drag offset.
  const currentTransform = isOpen ? dragOffset : closedOffset + dragOffset;

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
            <p>{earnings}</p>
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
