const apiKey = import.meta.env.VITE_FIREBASE_API;
const authDomain = import.meta.env.VITE_AUTHDOMAIN;
const projectId = import.meta.env.VITE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_MESSAGINGSENDERID;
const appId = import.meta.env.VITE_APP_ID;
const measurementId = import.meta.env.VITE_MEASUREMENT_ID;

export const firebaseConfig = {
    apiKEY: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId,
};