import { useContext, useEffect, useId, useState } from "react";
import { UserContext } from "@/lib/context";
import { toast } from "react-hot-toast";
import { firestore } from "@/lib/firebase";
import Chat from "./Chat";

const gameDBRef = firestore.collection("games");

function Game() {
  // Get user
  const [gameID, setGameID] = useState(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isUserInGame, setIsUserInGame] = useState(false);
  const [lobbyCount, setLobbyCount] = useState(0);
  const { user, username } = useContext(UserContext);
  useEffect(() => {
    const userDoc = firestore.doc(`users/${user.uid}`);
    userDoc.get().then((doc) => {
      const userDetails = doc.data();
      // get the length of the game

      if (userDetails.gameID) {
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
  }, [user, isUserInGame]);

  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        {!isUserInGame ? (
          <Start onClick={() => setIsUserInGame(true)} />
        ) : // check if user is in loby or if game is active
        isGameActive ? (
          <Chat gameId={gameID} />
        ) : (
          <div className="flex flex-col text-center">
            <div>Player count:</div>
            <div className="">{lobbyCount} /11</div>
          </div>
        )}
      </div>
    </>
  );
}

function Start() {
  const [isSearching, setIsSearching] = useState(false);
  const { user, username } = useContext(UserContext);

  const searchForMatch = () => {
    toast.success("looking for match...");
    setIsSearching(true);
  };
  const userDoc = firestore.doc(`users/${user.uid}`);
  useEffect(() => {
    if (isSearching) {
      gameDBRef
        .where("isGameActive", "==", false)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((game) => {
            const data = game.data();
            let userList = data.userList;
            //Check if room is full
            console.log(userList);
            if (userList.length > 9) {
              // Create a new room for next player
              gameDBRef
                .add({ isGameActive: false, userList: [] })
                .then((doc) => {});
              // Game Start time
              const startTime = new Date();
              gameDBRef
                .doc(game.id)
                .update({ isGameActive: true, startTime: startTime });
            } else {
            }

            // Add UID to userList
            console.log(data.userList);
            console.log(user.uid);
            userList.push(user.uid);
            console.log(userList);
            gameDBRef.doc(game.id).update({ userList: userList });
            // Update user's profile to be in game
            userDoc
              .update({
                gameID: game.id,
              })
              .then(() => {
                console.log(user);
              })
              .catch((err) => {
                toast.error(err.message);
              });

            setIsSearching(false);
          });
        });
    }
  }, [isSearching]);

  if (!isSearching) {
    return (
      <button
        onClick={searchForMatch}
        className="p-2 rounded-xl bg-gradient-to-tr from-[#00bfff] to-[#ba55d3] via-[#8a2be2] text-white font-lato text-3xl "
      >
        Start Game
      </button>
    );
  } else {
    return null;
  }
}

export default Game;
