import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDL229qUIN2z_cNGodAZYJDLyIVS8kt5Qk",
  authDomain: "rent-time-bd.firebaseapp.com",
  projectId: "rent-time-bd",
  storageBucket: "rent-time-bd.firebasestorage.app",
  messagingSenderId: "660730160004",
  appId: "1:660730160004:web:94ddcdb2b4b748259433d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);