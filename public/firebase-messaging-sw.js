// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAnVi5xKuQ28khhmZHxthf0q6cN9IYuEyA",
    authDomain: "swyft-38122.firebaseapp.com",
    projectId: "swyft-38122",
    storageBucket: "swyft-38122.firebasestorage.app",
    messagingSenderId: "673548770885",
    appId: "1:673548770885:web:70ab19c1a0f60a0e550d2c",
    measurementId: "G-MRL2YDHJPR"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
