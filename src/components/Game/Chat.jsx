import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/lib/context";
import { firestore } from "@/lib/firebase";
function Chat({ gameId }) {
  const { user, username } = useContext(UserContext);
  const { userData, setUserData } = useState({});
  useEffect(() => {
    console.log("gameid" + gameId);
    const userDoc = firestore.doc(`users/${user.uid}`);

    userDoc.get().then((doc) => {
      const userData = doc.data();
    });
  });

  //   const messagesRef = firestore.collection(gameId);
  //   const query = messagesRef.orderBy("createdAt").limit(25);
  //   const [messages] = useCollectionData(query, {});

  return <div>Chat</div>;
}

export default Chat;
