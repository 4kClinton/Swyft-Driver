import React, { useEffect } from "react";
import { messaging } from "../../firebase"; // Import the messaging instance from your firebase.js
import { getToken, onMessage } from "firebase/messaging"; // Explicitly import the required functions

const Notification = () => {
  const vapid_key = import.meta.env.VITE_VAPID_KEY;

  useEffect(() => {
    const requestPermission = async () => {
      try {
        // Check if the Notification API is available
        if ("Notification" in window) {
          console.log("IN");
          console.log("Requesting notification permission");

          // Use the new Notification.permission API
          if (Notification.permission === "default") {
            console.log("Prompting for permission");
            const permission = await navigator.permissions.query({ name: "notifications" });
            console.log("Notification permission status: ", permission.state);

            if (permission.state === "granted") {
              console.log("Notification permission granted.");

              // Get the FCM token
              const token = await getToken(messaging, { vapidKey: vapid_key });
              if (token) {
                console.log("FCM Token: ", token);
              } else {
                console.error("No token received.");
              }
            } else {
              console.error("Notification permission denied.");
            }
          } else {
            console.log("Notification permission already set to: ", Notification.permission);
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
