import './index.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { store } from './Redux/Store.js';
import { routes } from './routes.jsx';
import OneSignal from 'onesignal-cordova-plugin';

const router = createBrowserRouter(routes);
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

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

const onesignal_id = import.meta.env.VITE_ONESIGNAL_APP_ID;

// Initialize OneSignal
OneSignal.setAppId(onesignal_id);

// Ask for permission (only needed once)
OneSignal.promptForPushNotificationsWithUserResponse((accepted) => {
  console.log("User accepted notifications: " + accepted);
});

// Handle incoming notifications
OneSignal.setNotificationOpenedHandler((event) => {
  console.log("New order received: ", event);
});
