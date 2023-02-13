import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebase = {
  apiKey: "AIzaSyCgiQw_5_I_v35oUUmwS2fKbBSKZxUf6qM",
  authDomain: "catfish-97e19.firebaseapp.com",
  projectId: "catfish-97e19",
  storageBucket: "catfish-97e19.appspot.com",
  messagingSenderId: "503535155140",
  appId: "1:503535155140:web:63da5b6087805e1ddf9691",
  measurementId: "G-8P4T88QLF3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = firebase.auth();

export const googleAuthProvider = new firebase.auth.googleAuthProvider();
const analytics = getAnalytics(app);

const firestore = firebase.firestore();
const storage = firebase.storage();
