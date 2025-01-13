import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import "../Styles/GoOnline.css";
import { useSelector } from "react-redux";
const GoOnlineButton = () => {
  const driver = useSelector((state) => state.user.value);
  const [isOnline, setIsOnline] = useState(() => {
    // Retrieve the online status from localStorage
    const savedStatus = localStorage.getItem("isOnline");
    return savedStatus === "true"; // Convert string back to boolean
  });
  console.log(isOnline);
  

  // Get uniqueId from sessionStorage

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
                `http://127.0.0.1:5000/online/${driver.id}`,
                {
                  method: "PUT",
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
      // Notify the driver they are now offline
      toast("You are now offline.");

      // Driver going offline
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/online/${driver.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
            
              online: false,
            }),
          }
        );
        // Check response
        const responseData = await response.json();
        console.log(responseData); // Log the response from the server

        if (!response.ok) {
          throw new Error(
            `update failed: ${responseData.message || "Please try again."}`
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
      <Toaster
        className="online-toast"
        style={{
          position: "absolute",
          top: "10vh",
          marginTop: "20px",
          inset: "50px",
        }}
      />
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
          border: "none !important",
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
