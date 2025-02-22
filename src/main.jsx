import './index.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { store } from './Redux/Store.js';
import { routes } from './routes.jsx';

const router = createBrowserRouter(routes);
const root = ReactDOM.createRoot(document.getElementById('root'));

// Function to register the Service Worker
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
  return null;
}

// Function to request permission and subscribe for push notifications
async function requestNotificationPermission() {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    console.log("Notifications or Service Worker not supported in this browser.");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Notification permission denied!");
    return;
  }

  console.log("Notification permission granted!");
  const registration = await registerServiceWorker();
  if (registration) {
    subscribeToPush(registration);
  }
}

// Function to subscribe for push notifications
async function subscribeToPush(registration) {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
    });

    await fetch("http://localhost:5000/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: { "Content-Type": "application/json" }
    });

    console.log("Successfully subscribed for push notifications!");
  } catch (error) {
    console.error("Push Subscription failed:", error);
  }
}

// Call functions on page load
requestNotificationPermission();

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
