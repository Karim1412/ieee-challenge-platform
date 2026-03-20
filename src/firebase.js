// ============================================================
// FIREBASE CONFIGURATION
// ============================================================
// Replace these values with your own Firebase project config.
// Go to: https://console.firebase.google.com
// Create a project → Add web app → Copy config below
// ============================================================

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbIWmqFuEXzermm5CiZ4W__0bZmyFfLno",
  authDomain: "ieee-member.firebaseapp.com",
  projectId: "ieee-member",
  storageBucket: "ieee-member.firebasestorage.app",
  messagingSenderId: "727570911288",
  appId: "1:727570911288:web:ee7215c9fbdaf3d73296cd",
  measurementId: "G-99K70Q1R6C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth & Firestore exports
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
