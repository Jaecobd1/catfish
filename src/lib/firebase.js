import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
