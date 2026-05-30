import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwpaoyvhUPJm27Fe3x4h1nP7a2EkuVEIA",
  authDomain: "growth-redar-version2.firebaseapp.com",
  projectId: "growth-redar-version2",
  storageBucket: "growth-redar-version2.firebasestorage.app",
  messagingSenderId: "51721678437",
  appId: "1:51721678437:web:4139bbe615dd0145b6208c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const databaseId = (firebaseConfig as any).firestoreDatabaseId || "(default)";
export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);
export default app;
