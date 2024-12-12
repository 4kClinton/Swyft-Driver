import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";

const GoOnlineButton = () => {
  const [isOnline, setIsOnline] = useState(() => {
    // Retrieve the online status from localStorage
    const savedStatus = localStorage.getItem("isOnline,uniqueId");
    return savedStatus === "true"; // Convert string back to boolean
  });

  // Get uniqueId from sessionStorage
  const uniqueId = sessionStorage.getItem("uniqueId");

  useEffect(() => {
    // Save the online status to localStorage whenever it changes
    localStorage.setItem("isOnline", isOnline.toString());
  }, [isOnline]);

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
                `https://swyft-server-t7f5.onrender.com/online/${uniqueId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    uniqueId, // Including the uniqueId in the body
                    online: true,
                    location: {
                      latitude,
                      longitude,
                    },
                  }),
                }
              );
              console.log(uniqueId);
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
          `https://swyft-server-t7f5.onrender.com/online/${uniqueId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uniqueId, // Including the uniqueId in the body
              online: false,
            }),
          }
        );
        console.log(uniqueId);
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
