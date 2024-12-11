// src/components/GoOnlineButton.jsx

import React, { useState } from "react";
import { Button } from "@mui/material";

const GoOnlineButton = ({ onToggle }) => {
  const [isOnline, setIsOnline] = useState(false);

  const handleToggle = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);

    // Check if onToggle is a valid function before calling it
    if (typeof onToggle === "function") {
      onToggle(newStatus);
    } else {
      console.warn("onToggle prop is not provided or not a function.");
    }

    if (newStatus) {
      // Driver going online: Get and push location to the JSON server
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const response = await fetch("http://localhost:3000/Online", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  online: true,
                  location: {
                    latitude,
                    longitude,
                  },
                }),
              });

              if (response.ok) {
                console.log("Location pushed to DB:", { latitude, longitude });
              } else {
                console.error("Failed to push location to the database.");
              }
            } catch (error) {
              console.error("Network error while pushing location:", error);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    } else {
      // Driver going offline: Update online status to false
      try {
        const response = await fetch("http://localhost:3000/Online", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            online: false,
          }),
        });

        if (response.ok) {
          console.log("Driver is now offline.");
        } else {
          console.error("Failed to update online status to offline.");
        }
      } catch (error) {
        console.error("Network error while updating offline status:", error);
      }
    }
  };

  return (
    <Button
      variant="contained"
      // color={isOnline ? "success" : "primary"}
      onClick={handleToggle}
      sx={{ margin: "20px", width: "200px", backgroundColor: "#2AC352" }}
    >
      {isOnline ? "Go Offline" : "Go Online"}
    </Button>
  );
};

export default GoOnlineButton;
