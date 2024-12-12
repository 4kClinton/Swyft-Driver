import React, { useState } from "react";
import { Button } from "@mui/material";

const GoOnlineButton = ({ driverId }) => {
  const [isOnline, setIsOnline] = useState(false);

  const handleToggle = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);

    if (newStatus) {
      // Driver going online: Get and push location to the JSON server
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const response = await fetch(
                `https://swyft-server-t7f5.onrender.com/online/${driverId}`,
                {
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
                }
              );

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
      // Driver going offline
      try {
        const response = await fetch(
          `https://swyft-server-t7f5.onrender.com/online/${driverId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              online: false,
            }),
          }
        );

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
      onClick={handleToggle}
      sx={{ margin: "20px", width: "200px", backgroundColor: "#2AC352" }}
    >
      {isOnline ? "Go Offline" : "Go Online"}
    </Button>
  );
};

export default GoOnlineButton;
