// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Import additional Firebase services as needed
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxRnSL3l20AxZMTPlS5Q5eONP7_ceQmPs",
  authDomain: "vads-aa917.firebaseapp.com",
  projectId: "vads-aa917",
  storageBucket: "vads-aa917.firebasestorage.app",
  messagingSenderId: "1033997810593",
  appId: "1:1033997810593:web:45c3ed5e3aacbce01869e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (Auth, Firestore, Storage)
export const auth = initializeAuth(app)
export const db = getFirestore(app);
export const storage = getStorage(app);
