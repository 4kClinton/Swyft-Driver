import React, { useEffect } from "react";
import { messaging } from "../../firebase";
import { getToken, onMessage } from "firebase/messaging";

const Notification = () => {
  const vapidKey = import.meta.env.VITE_VAPID_KEY;

  useEffect(() => {
    const requestPermission = async () => {
      if (!("Notification" in window)) {
        console.error("Notification API is not supported by this browser.");
        return;
      }

      try {
        const permissionStatus = await navigator.permissions.query({ name: "notifications" });
        console.log("Notification permission status: ", permissionStatus.state);

        if (permissionStatus.state === "granted") {
          console.log("Notification permission already granted.");
        } else if (permissionStatus.state === "prompt") {
          console.log("Prompting for permission");
          const permissionResult = await new Promise((resolve, reject) => {
            Notification.requestPermission().then(resolve).catch(reject);
          });

          if (permissionResult === "granted") {
            console.log("Notification permission granted.");
          } else {
            console.error("Notification permission denied.");
            return;
          }
        } else {
          console.error("Notification permission denied.");
          return;
        }

        // Get the FCM token
        const token = await getToken(messaging, { vapidKey });
        if (token) {
          console.log("FCM Token: ", token);
        } else {
          console.error("No token received.");
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
  }, [vapidKey]);

  return <div>Notification Component</div>;
};

export default Notification;
