import './index.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { store } from './Redux/Store.js';
import { routes } from './routes.jsx';
import Cookies from 'js-cookie';

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
    console.log(
      'Notifications or Service Worker not supported in this browser.'
    );
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.log('Notification permission denied!');
    return;
  }

  console.log('Notification permission granted!');
  const registration = await registerServiceWorker();
  if (registration) {
    subscribeToPush(registration);
  }
}

// Helper function to convert VAPID public key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Function to subscribe for push notifications
async function subscribeToPush() {
  try {
    const registration = await navigator.serviceWorker.ready;

    const vapidPublicKey =
      'BEnXIZVqgwNk9ucbtr5XzyohjtS-tIN7BJFPAqJNgnrm9m_Brj-g2i5b73_Odwg5jEXmPIjTgRXQ8RI2nXD5HWE';
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    await fetch('https://swyft-backend-client-nine.vercel.app/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('authTokendr2')}`,
      },
    });

    console.log('Successfully subscribed for push notifications!');
  } catch (error) {
    console.error('Push Subscription failed:', error);
  }
}

// Call functions on page load
requestNotificationPermission();

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
