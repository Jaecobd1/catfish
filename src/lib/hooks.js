import { useEffect, useState, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-hot-toast";
import { auth, firestore } from "./firebase";
import { UserContext } from "./context";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [gameID, setGameID] = useState(null);
  const [catfishUID, setCatfishUID] = useState(false);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      const ref = firestore.collection("users").doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
        setPhotoURL(doc.data()?.photoURL);
        // firestore
        //   .collection("games")
        //   .where("games", "==", doc.data().gameID)
        //   .get((games) => {
        //     console.log(games);
        //     if (games) {
        //       ref.update({ gameID: "" });
        //     }
        //   });

        setCatfishUID(doc.data?.catfishUID);
      });
    } else {
      setUsername(null);
      setPhotoURL(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username, photoURL, gameID, catfishUID };
}

export function useGameData() {
  const { user, username } = useContext(UserContext);
  const [isUserInGame, setIsUserInGame] = useState(false);
  const [userProfile, setUserProfile] = useState();
  const [isGameActive, setIsGameActive] = useState();
  const [test, setTest] = useState();
  // const gameRef = firestore.collection(user?.uid);
  // const [game] = useCollectionData(gameRef);

  useEffect(() => {
    const userDoc = firestore.doc(`users/${user?.uid}`);

    userDoc.get().then((doc) => {
      const userDetails = doc.data();
      // get the length of the game

      if (userDetails?.gameID) {
        console.log(userDetails.gameID);
        setGameID(userDetails.gameID);
        setIsUserInGame(true);

        // Check if Game is active
        gameDBRef
          .doc(userDetails.gameID)
          .get()
          .then((game) => {
            const active = game.data().isGameActive;
            console.log(active);
            if (active) {
              setIsGameActive(true);
            } else {
              setIsGameActive(false);
            }

            const length = game.data().userList.length;
            toast.success(length);
            setLobbyCount(length);
          });
      } else {
        setIsUserInGame(false);
      }
    });

    console.log(user);
  }, [user, isUserInGame]);

  return { userProfile, isUserInGame, test };
}
