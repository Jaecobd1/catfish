import { useContext, useRef, useEffect, useState } from "react";
import { UserContext } from "@/lib/context";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { storage, firestore, STATE_CHANGED, auth } from "@/lib/firebase";
import styles from "@/styles/RightPanel/UserProfile.module.css";

function UserProfile() {
  const { user, username } = useContext(UserContext);
  const userDoc = firestore.doc(`users/${user.uid}`);
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const bioRef = useRef();
  const imageRef = useRef();
  const imageFileRef = useRef();
  const [firstName, setFirstName] = useState();
  const [bio, setBio] = useState();
  const [occupation, setOccupation] = useState();
  const [imageLink, setImageLink] = useState();
  const [isUserInGame, setIsUserInGame] = useState(false);
  const [gameID, setGameID] = useState();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    userDoc.get().then((doc) => {
      const profile = doc.data();
      console.log(profile);
      setFirstName(profile.firstName);
      setBio(profile.bio);
      setOccupation(profile.occupation);
      setImageLink(profile?.photoURL);
      setIsUserInGame(profile.isUserInGame);
      setGameID(profile.gameID);
    });
  }, [user]);

  useEffect(() => {
    toast(isUserInGame);
  }, [1000]);

  if (!isUserInGame) {
    return (
      <>
        <div className={styles.userProfileContainer}>
          <div class={styles.profileImage}>
            {imageLink ? (
              <Image
                src={imageLink}
                alt="profile image"
                height={100}
                width={100}
                className="object-cover h-full w-full"
              />
            ) : null}
          </div>
          <h1 className="font-lato font-bold italic">{firstName}</h1>
          <h2 className="font-raleway italic">{username}</h2>
          <h6 className="font-raleway">{bio}</h6>
          <p className="font-raleway italic">Occupation: {occupation}</p>
          <h3 className="font-lato font-bold italic">Interests:</h3>
        </div>
        <p>
          <SignOutButton />
        </p>
      </>
    );
  } else {
    return <>{!gameID ? null : <OtherUserProfile gameID={gameID} />}</>;
  }
}
export function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}
export default UserProfile;

function OtherUserProfile({ gameID }) {
  const [userList, setUserList] = useState();
  const [currentUser, setCurrentUser] = useState(0);

  // Moves up the array of users
  const right = () => {
    if (currentUser < userList.length - 1) {
      setCurrentUser(currentUser + 1);
    } else {
      setCurrentUser(0);
    }
  };

  // Moves down the array  of users
  const left = () => {
    if (currentUser > 0) {
      setCurrentUser(currentUser - 1);
    } else {
      setCurrentUser(userList.length - 1);
    }
  };

  useEffect(() => {
    firestore
      .collection("games")
      .doc(gameID)
      .get()
      .then((doc) => {
        const gameInfo = doc.data();
        setUserList(gameInfo.userList);
      });
  });
  return (
    <>
      <p>Blank</p>

      {userList ? <Profile currentUser={userList[currentUser]} /> : null}
      <p>{currentUser}</p>
      <button onClick={right}>Right</button>
      <button onClick={left}>Left</button>
      <SignOutButton />
    </>
  );
}

function Profile({ currentUser }) {
  const [firstName, setFirstName] = useState();
  const [username, setUsername] = useState();
  const [bio, setBio] = useState();
  const [occupation, setOccupation] = useState();
  const [image, setImage] = useState();

  firestore
    .collection("users")
    .doc(currentUser)
    .get()
    .then((doc) => {
      const userInfo = doc.data();

      setFirstName(userInfo?.firstName);
      setUsername(userInfo?.username);
      setBio(userInfo?.bio);
      setOccupation(userInfo?.occupation);
      setImage(userInfo?.photoURL);
    });
  return (
    <>
      <h1>{firstName}</h1>
      <p>{username}</p>
      <p>{bio}</p>
      <p>{occupation}</p>
      {image ? <Image src={image} height={100} width={100} /> : null}
    </>
  );
}
