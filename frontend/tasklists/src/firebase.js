import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "task-manager-58dbf.firebaseapp.com",
  projectId: "task-manager-58dbf",
  storageBucket: "task-manager-58dbf.appspot.com",
  messagingSenderId: "1088923380233",
  appId: "1:1088923380233:web:90468a6048ee0aacdba6d8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);