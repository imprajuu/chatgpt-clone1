// To use Firebase authentication, uncomment and fill in your Firebase config below:
/*
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getReactNativePersistence,
  initializeAuth,
  signInWithEmailAndPassword
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Add authentication functions
export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}
*/

// DUMMY AUTH LOGIC FOR DEMO
// To use Firebase, restore the original code and add your config as shown below.
// const firebaseConfig = { apiKey: "...", ... };

// Dummy credentials (for demo only)
const DUMMY_EMAIL = "Prajakta@gmail.com";
const DUMMY_PASSWORD = "Prajakta@123";

// Dummy login function
export async function login(email, password) {
  if (
    typeof email === 'string' &&
    email.trim().toLowerCase() === DUMMY_EMAIL.toLowerCase() &&
    password === DUMMY_PASSWORD
  ) {
    return { user: { email: DUMMY_EMAIL, displayName: "Demo User" } };
  } else {
    throw new Error("Invalid email or password (dummy auth)");
  }
}

export async function signup(email, password) {
  throw new Error("Signup is disabled in demo mode. Use the demo credentials.");
}

// Dummy mode: auth is undefined
export const auth = undefined;