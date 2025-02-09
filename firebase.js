import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Declare and assign environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API;
const authDomain = import.meta.env.VITE_AUTHDOMAIN;
const projectId = import.meta.env.VITE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_MESSAGINGSENDERID;
const appId = import.meta.env.VITE_APP_ID;
const measurementId = import.meta.env.VITE_MEASUREMENT_ID;


// Firebase configuration object
const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId,
};




// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
export const messaging = getMessaging(firebaseApp);



// Export the initialized Firebase app
export default firebaseApp;
