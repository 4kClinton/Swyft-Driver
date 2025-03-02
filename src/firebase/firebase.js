import firebase from "firebase/app";
import "firebase/messaging";

// Firebase Config values imported from .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Initialize Firebase (Only if it hasn't been initialized before)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Messaging Service
export const messaging = firebase.messaging();

export default firebase;
