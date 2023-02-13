// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgiQw_5_I_v35oUUmwS2fKbBSKZxUf6qM",
  authDomain: "catfish-97e19.firebaseapp.com",
  projectId: "catfish-97e19",
  storageBucket: "catfish-97e19.appspot.com",
  messagingSenderId: "503535155140",
  appId: "1:503535155140:web:63da5b6087805e1ddf9691",
  measurementId: "G-8P4T88QLF3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
