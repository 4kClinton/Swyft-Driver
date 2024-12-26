import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import "../Styles/GoOnline.css";

const GoOnlineButton = () => {
  const [isOnline, setIsOnline] = useState(() => {
    // Retrieve the online status from localStorage
    const savedStatus = localStorage.getItem("isOnline");
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
      // Notify the driver they are now online
      toast.success("You are now online!");

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
      // Notify the driver they are now offline
      toast("You are now offline.");

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
        // Check response
        const responseData = await response.json();
        console.log(responseData); // Log the response from the server

        if (!response.ok) {
          throw new Error(
            `update failed: ${
              responseData.message || "Please try again."
            }`
          );
        }
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
    <div style={{ width: "100%", padding: "5px" }}>
      <Toaster />
      <Button
      className="btn-online"
        variant="contained"
        onClick={handleToggle}
        sx={{
          position: "absolute",
          top: "100px",
          // right: "20px",
          // backgroundColor: "#2AC352",
          // color: "white",
          // fontSize: "20px",
          border:"none !important",
          borderRadius: "40px",
          // padding: "10px 20px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          width: "80%",
          height: "50px",
          
          marginRight: "2px",
          backgroundColor: isOnline ? "#FF3E3E" : "#2AC352",
          color: "white",
          fontSize: "25px",
        }}
      >
        {isOnline ? "Go Offline" : "Go Online"}
      </Button>
    </div>
  );
};

export default GoOnlineButton;
