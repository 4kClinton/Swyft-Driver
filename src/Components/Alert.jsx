import React, { useRef, useState } from "react";
import soundFile from "../assets/this-one.wav";

const Alert = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSound = () => {
    setIsPlaying((prev) => {
      const newState = !prev;
      if (newState) {
        if (audioRef.current) {
          audioRef.current.loop = true; // Enable looping
          audioRef.current.play();
        }
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0; // Reset sound
        }
      }
      return newState;
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button
        onClick={toggleSound}
        style={{
          backgroundColor: "#2191FB",
          color: "#FFF",
          border: "none",
          borderRadius: "50%",
          width: "80px",
          height: "80px",
          fontSize: "12px",
          fontWeight: "bold",
          cursor: "pointer",
          animation: isPlaying ? "vibrate 0.3s infinite" : "none",
        }}
      >
        Incoming Order
      </button>
      <audio ref={audioRef} src={soundFile} preload="auto" />
      <style>
        {`
          @keyframes vibrate {
            0% { transform: translate(0px, 0px); }
            25% { transform: translate(2px, -2px); }
            50% { transform: translate(-2px, 2px); }
            75% { transform: translate(2px, 2px); }
            100% { transform: translate(0px, 0px); }
          }
        `}
      </style>
    </div>
  );
};

export default Alert;
