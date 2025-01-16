import { useState, useEffect, useRef } from 'react';
import '../Styles/OrderPopup.css';

//eslint-disable-next-line
const OrderPopup = ({ onAccept, onTimeout }) => {
  const [remainingTime, setRemainingTime] = useState(8); // 8-second timer
  const audioRef = useRef(null); // Reference to the audio element

  useEffect(() => {
    // Play alarm sound when the popup appears
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('Failed to play audio:', error);
      });
    }

    // Countdown logic
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          if (onTimeout) onTimeout(); // Call timeout handler
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup interval and stop audio on unmount
    return () => {
      clearInterval(timer);
      if (audioRef.current) {
        audioRef.current.pause();

        //eslint-disable-next-line
        audioRef.current.currentTime = 0; // Reset audio playback
      }
    };
  }, [onTimeout]);

  const handleAccept = () => {
    if (onAccept) onAccept(); // Call accept handler
    setRemainingTime(0); // Close popup immediately
  };

  return (
    remainingTime > 0 && (
      <div className="order-popup">
        <h3>New Order!</h3>
        <p>Time remaining: {remainingTime}s</p>
        <button onClick={handleAccept} style={{ marginRight: '10px' }}>
          Accept Order
        </button>
        <button onClick={() => setRemainingTime(0)}>Decline</button>

        {/* Hidden audio element */}
        <audio ref={audioRef} src="/sounds/alarm.mp3" loop />
      </div>
    )
  );
};

export default OrderPopup;
