import React, { useEffect } from "react";
import { messaging } from "../../firebase"; // Import the messaging instance from your firebase.js
import { getToken, onMessage } from "firebase/messaging"; // Explicitly import the required functions

const Notification = () => {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        // Check if the Notification API is available
        if ("Notification" in window) {
          console.log("Requesting notification permission");

          // Request permission
          const permission = await Notification.requestPermission();

          console.log("Notification permission status: ", permission);

          if (permission === "granted") {
            console.log("Notification permission granted.");

            // Get the FCM token
            const token = await getToken(messaging, { vapidKey: import.meta.env.VAPID_KEY }); // Replace with your actual VAPID key
            if (token) {
              console.log("FCM Token: ", token);
            } else {
              console.error("No token received.");
            }
          } else {
            console.error("Notification permission denied.");
          }
        } else {
          console.error("Notification API is not supported by this browser.");
        }
      } catch (error) {
        console.error("Error requesting permission or getting token: ", error);
      }
    };

    requestPermission();

    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received in the foreground: ", payload);
    });

    // Cleanup the listener on unmount
    return () => {
      console.log("Cleaning up message listener");
      unsubscribe();
    };
  }, []);

  return <div>Notification</div>;
};

export default Notification;
