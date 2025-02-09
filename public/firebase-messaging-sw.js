// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Firebase Configuration
const firebaseConfig = {
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/default_icon.png', // Add a default icon if none is provided
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Handle push events (foreground messages) directly in the Service Worker
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received', event);
  const data = event.data.json();
  const notificationOptions = {
    body: data.body,
    title: data.title,
    icon: data.icon || '/default_icon.png',
  };

  event.waitUntil(
    self.registration.showNotification(data.title, notificationOptions)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received', event);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(windowClients => {
      for (const windowClient of windowClients) {
        if (windowClient.url === urlToOpen) {
          return windowClient.focus();
        }
      }
      return self.clients.openWindow(urlToOpen);
    })
  );
});
