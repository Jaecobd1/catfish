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
    return (
      <>
        <OtherUserProfile />
      </>
    );
  }
}
export function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}
export default UserProfile;

function OtherUserProfile() {
  return (
    <>
      <SignOutButton />
    </>
  );
}
