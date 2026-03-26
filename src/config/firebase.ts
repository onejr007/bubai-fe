// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3fuwk1w0dGJ5Ij7eKvY7dyzPI4Rr5guQ",
  authDomain: "bub-ai.firebaseapp.com",
  projectId: "bub-ai",
  storageBucket: "bub-ai.firebasestorage.app",
  messagingSenderId: "864909635750",
  appId: "1:864909635750:web:7887a89baddda127154467",
  measurementId: "G-C4M2ZMEGSL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Export config for reference
export { firebaseConfig };
