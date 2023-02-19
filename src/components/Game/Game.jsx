import { useContext, useEffect, useId, useState } from "react";
import { GameContext, UserContext } from "@/lib/context";
import { toast } from "react-hot-toast";
import { firestore } from "@/lib/firebase";
import Chat from "./Chat";
import firebase from "firebase/app";
import StartScreen from "./StartScreen";
import styles from "@/styles/LeftPanel/Game.module.css";

const gameDBRef = firestore.collection("games");

function Game() {
  // Get user
  const [gameID, setGameID] = useState(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isUserInGame, setIsUserInGame] = useState(false);
  const [lobbyCount, setLobbyCount] = useState(0);
  const { user, username } = useContext(UserContext);
  const { test, userProfile } = useContext(GameContext);
  const [game, setGame] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().getTime() / 1000);

  useEffect(() => {
    const userDoc = firestore.doc(`users/${user.uid}`);
    userDoc.get().then((doc) => {
      const userDetails = doc.data();

      // Check if user is in game, set gameID
      if (userDetails?.gameID) {
        setGameID(userDetails.gameID);
        setIsUserInGame(true);
        console.log(game?.startTime);

        // Check if the startTime is longer than 1 hour
        if (game?.startTime > game?.startTime.seconds + 3600000) {
          // Clear Game  & users Game ID from firestore
          firestore
            .collection("games")
            .doc(userDetails.gameID)
            .delete()
            .then(() => {
              toast.error("Game Expired");
              firestore
                .collection("games")
                .add({ isGameActive: false, userList: [] });
            });
          firestore.doc(`users/${user.uid}`).update({ gameID: "" });
          setGame(null);
          setIsUserInGame(false);
        }

        // Check if Game is active
        gameDBRef
          .doc(userDetails.gameID)
          .get()
          .then((_game) => {
            const active = _game.data()?.isGameActive;
            setGame(_game.data());
            if (active) {
              setIsGameActive(true);
            } else {
              setIsGameActive(false);
            }
            // get the length of the game
            const length = _game.data()?.userList.length;
            toast.success(length);
            setLobbyCount(length);
          });
      } else {
        setIsUserInGame(false);
      }
    });
  }, [user, isUserInGame]);

  useEffect(() => {
    setCurrentTime(new Date().getTime() / 1000);
  }, [currentTime]);

  // useEffect(() => {
  //   const timestamp = new Date(game?.startTime.seconds);
  //   setStartTime(timestamp);
  // }, [game]);

  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        {!isUserInGame ? (
          <Start onClick={() => setIsUserInGame(true)} />
        ) : // check if user is in loby or if game is active
        isGameActive ? (
          <div className="flex flex-col">
            <p>{"Current:" + currentTime}</p>
            <p>Start:{game.startTime.seconds}</p>
            <p>End{game.startTime.seconds + 3600000}</p>
            <Chat gameId={gameID} />
          </div>
        ) : (
          <div className="flex flex-col text-center">
            <div>Player count:</div>
            <div className="">{lobbyCount} /10</div>
          </div>
        )}
      </div>
    </>
  );
}

function Start() {
  const [isSearching, setIsSearching] = useState(false);
  const { user, username } = useContext(UserContext);
  const [game, setGame] = useState(null);
  const [userListWithCatfish, setUserListWithCatfish] = useState(null);
  const [catFishUID1, setCatFishUID1] = useState(null);
  const [catFishUID2, setCatFishUID2] = useState(null);

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
            setGame(game.id);
            const data = game.data();
            let userList = data.userList;
            //Check if room is full
            console.log(userList);
            if (userList.length > 0) {
              // Create a new room for next player
              gameDBRef.add({ isGameActive: false, userList: [] });

              // Game Start time
              gameDBRef
                .doc(game.id)
                .update({
                  isGameActive: true,
                  startTime: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                  // Once the game is active
                  // Create Two catfish players at random and add the catfish UID to their profile
                  let random1 = Math.random(0, 1) * 10;
                  let random2 = Math.random(0, 1) * 10;
                  // get userID for random 1 and 2
                  const gameUID1 = userList[random1];
                  const gameUID2 = userList[random2];
                  // Get random profiles that aren't in game

                  firestore
                    .collection("users")
                    .where("gameID", "!=", game.id, 2)
                    .get()
                    .then((querySnapshot) => {
                      const Cfusers = querySnapshot;
                      console.log(Cfusers);
                      //forEach((user) => {
                      //   const uid = user.id;
                      //   setCfList([uid, ...cfList]);
                      // });

                      firestore
                        .collection("games")
                        .doc(game.id)
                        .get()
                        .then((doc) => {
                          const gameInfo = doc.data();
                          const gameUsers = gameInfo.userList;
                          gameUsers.forEach((user, index) => {
                            if (random1 == index) {
                              firestore
                                .collection("users")
                                .doc(user)
                                .update({ catfishUID: user1 });
                            } else if (random2 == index) {
                              firestore
                                .collection("users")
                                .doc(user)
                                .update({ catfishUID: user2 });
                            }
                          });
                        });
                    });
                })
                .catch((error) => {
                  toast.error(error.message);
                });
            } else {
            }

            // Add UID to userList
            userList.push(user.uid);
            console.log({ userList });
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
          });
        });
    }
  }, [isSearching]);

  if (!isSearching) {
    return (
      <div className={styles.startContainer}>
        <StartScreen />
        <button onClick={searchForMatch} className="font-lato">
          Start Game
        </button>
      </div>
    );
  } else {
    return <p>Refresh Page</p>;
  }
}

export default Game;
