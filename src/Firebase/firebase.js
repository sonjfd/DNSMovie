// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_uNN-hSs7tLZMDDHImOLwFG48KWTWNmM",
  authDomain: "fer201m-2c8b4.firebaseapp.com",
  projectId: "fer201m-2c8b4",
  storageBucket: "fer201m-2c8b4.firebasestorage.app",
  messagingSenderId: "482282764946",
  appId: "1:482282764946:web:801a67b33e9f0f7279044b",
  measurementId: "G-P8C8X5646M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth =getAuth(app)

export {auth}
