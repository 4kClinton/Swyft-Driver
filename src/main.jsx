import './index.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { store } from './Redux/Store.js';
import { routes } from './routes.jsx';
import { PushNotifications } from "@capacitor/push-notifications";

const router = createBrowserRouter(routes);
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// 🔥 Initialize Firebase Push Notifications
PushNotifications.requestPermissions().then((result) => {
  if (result.receive === "granted") {
    PushNotifications.register();
  }
});

// Listen for successful push registration
PushNotifications.addListener("registration", (token) => {
  console.log("Push registration success:", token.value);
  // Send the push token to your backend
});

// Listen for errors
PushNotifications.addListener("registrationError", (error) => {
  console.error("Push registration error:", error);
});

// Handle received push notifications
PushNotifications.addListener("pushNotificationReceived", (notification) => {
  console.log("Push received:", notification);
});

// Handle when user taps on the notification
PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
  console.log("User interacted with notification:", notification);
});
