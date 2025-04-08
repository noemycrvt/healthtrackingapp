// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
/* import { getAnalytics } from "firebase/analytics"; */
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqAVSM4vxhwf1vfQxEm8R6ZGXyhJxrIWI",
  authDomain: "healthtrackingapp-c0592.firebaseapp.com",
  projectId: "healthtrackingapp-c0592",
  storageBucket: "healthtrackingapp-c0592.firebasestorage.app",
  messagingSenderId: "448977952305",
  appId: "1:448977952305:web:e0e18d668963f5f5d1bf10",
  measurementId: "G-6YYWXZMDC3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
/* const analytics = getAnalytics(app); */
export const auth = getAuth(app);
export const db = getFirestore(app);