import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-hot-toast";
import { auth, firestore } from "./firebase";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    let unsubscribe;

    if (user) {
      const ref = firestore.collection("users").doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
        setPhotoURL(doc.data()?.photoURL);
      });
    } else {
      setUsername(null);
      setPhotoURL(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username, photoURL };
}

export function useGameData() {
  const { user, username } = useContext(UserContext);
  const [isUserInGame, setIsUserInGame] = useState(false);
  const [userProfile, setUserProfile] = useState();
  const [isGameActive, setIsGameActive] = useState();

  useEffect(() => {
    let unsubscribe;
    if (user) {
      const userDoc = firestore.doc(`users/${user.uid}`);
      unsubscribe = userDoc.get().then((doc) => {
        const userDetails = doc.data();
        setUserProfile(userDetails);
        console.log(userDetails);
        if (userDetails.gameID) {
          setIsUserInGame(true);

          // Check if Game is active or in lobby
          firestore.doc(`game/${userDetails.gameID}`);
        } else {
          setIsUserInGame(false);
        }
      });
    } else {
      toast.error("Please try to sign out and sign back in");
    }

    return unsubscribe;
  }, [user, isUserInGame]);

  return { userProfile, isUserInGame };
}
