// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import{getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-ECeM3JUI-K7eXCan44YfjN5Tyal4tIA",
  authDomain: "pantrytracker-6f407.firebaseapp.com",
  projectId: "pantrytracker-6f407",
  storageBucket: "pantrytracker-6f407.appspot.com",
  messagingSenderId: "944146378556",
  appId: "1:944146378556:web:b37affba536d8b62053839",
  measurementId: "G-3DN1JJGREM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)
export {firestore}