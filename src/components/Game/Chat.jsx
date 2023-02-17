import { useContext, useEffect, useState, useRef } from "react";
import { GameContext, UserContext } from "@/lib/context";
import { auth, firestore } from "@/lib/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase/app";
import styles from "../../styles/LeftPanel/Chat.module.css";
import Image from "next/image";
import { toast } from "react-hot-toast";
function Chat({ gameId }) {
  const { user, username, photoURL, gameID } = useContext(UserContext);
  const { isUserInGame } = useContext(GameContext);
  const { userData, setUserData } = useState({});
  const ChatRef = firestore.collection(gameId);
  const query = ChatRef.orderBy("createdAt").limit(50);
  const [message] = useCollectionData(query, { idField: "id" });
  const inputRef = useRef();

  const [formValue, setFormValue] = useState("");
  useEffect(() => {
    if (gameID) {
      console.log("user is in game");
    } else {
      console.log("user is not in game");
    }
  }, [gameID]);
  //   const messagesRef = firestore.collection(gameId);
  //   const query = messagesRef.orderBy("createdAt").limit(25);
  //   const [messages] = useCollectionData(query, {});

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, catfishUID } = user;
    // If the user is catfish, change it to their catfish UID
    const _uid = catfishUID ? catfishUID : uid;

    await ChatRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      _uid,
      photoURL,
    }).then(() => {
      setFormValue("");
      inputRef.current.value = "";
    });
  };

  return (
    <div className="">
      <div className="flex-col">
        {message &&
          message.map((msg) => (
            <ChatMessage key={msg.id} message={msg} photoURL={photoURL} />
          ))}
      </div>
      <div className="">
        <form onSubmit={sendMessage} className="flex ">
          <input
            type="text"
            ref={inputRef}
            onChange={(e) => setFormValue(e.target.value)}
            className="bg-blue-200"
            placeholder="Message"
          />
          <button type="submit" className="p-2 bg-purple-400">
            🎣 send
          </button>
        </form>
      </div>
    </div>
  );
}

function ChatMessage(props) {
  const { user, username, catfishUID } = useContext(UserContext);
  const { text, uid, photoURL } = props.message;

  // Create Message class if sent from user, then show as sent, if otherwise, show recieved

  const messageClass = uid === user.uid ? "sent" : "recieved";

  useEffect(() => {});

  switch (messageClass) {
    case "sent":
      return (
        <div className="w-[200px] flex flex-row-reverse h-min items-center justify-start mb-2">
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <Image
              src={photoURL ? photoURL : ""}
              alt="userImage"
              height={50}
              width={50}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col p-2">
            <p className="text">{text}</p>
          </div>
        </div>
      );
    case "recieved":
      return (
        <div className="w-1/2 flex h-min items-center justify-evenly">
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <Image
              src={photoURL ? photoURL : ""}
              alt="userImage"
              height={50}
              width={50}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <p className="text">{text}</p>
          </div>
        </div>
      );
  }
}
export default Chat;
