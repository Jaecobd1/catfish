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

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    userDoc.get().then((doc) => {
      const profile = doc.data();
      console.log(profile);
      setFirstName(profile.firstName);
      setBio(profile.bio);
      setOccupation(profile.occupation);
    });
  }, [user]);

  return (
    <>
      <div className={styles.userProfileContainer}>
        <div class={styles.profileImage}></div>
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
    // <>
    //   <div className="flex w-full h-full justify-between flex-col items-center">
    //     <h1 className="font-lato text-2xl mt-2 w-1/2 ">
    //       Hi <span className="capitalize">{username}</span>, would you like to
    //       update your profile?
    //     </h1>
    //     <p className="">
    //       Make your profile authentic, the catfish of the group will be selected
    //       at random
    //     </p>
    //     <div className="flex">
    //       <div className="w-20 h-20 overflow-hidden rounded-full">
    //         <Image
    //           alt="profile"
    //           ref={imageRef}
    //           src={downloadURL ? downloadURL : ""}
    //           height={100}
    //           width={100}
    //           className=" object-cover "
    //         />
    //       </div>
    //       <input
    //         type="file"
    //         onChange={addImage}
    //         ref={imageFileRef}
    //         accept="image/x-png,image/gif,image/jpeg"
    //       ></input>
    //     </div>
    //     <div className="flex flex-col">
    //       <h3>First Name</h3>
    //       <div className="flex">
    //         <input
    //           type="text"
    //           name="firstName"
    //           placeholder={!user.firstName ? `${user.firstName}` : "First Name"}
    //           ref={firstNameRef}
    //         />
    //         <button onClick={updateFirstName}>save</button>
    //       </div>
    //       <h3>Last Name</h3>
    //       <div className="flex">
    //         <input
    //           type="text"
    //           name="lastName"
    //           placeholder={!user.lastName ? user.lastName : "Last Name"}
    //           ref={lastNameRef}
    //         />
    //         <button onClick={updateLastName}>save</button>
    //       </div>
    //       <h3>Bio</h3>
    //       <div className="flex">
    //         <input
    //           type="text"
    //           name="Bio"
    //           placeholder={!user.bio || user.bio == "" ? user.bio : "Add a Bio"}
    //           ref={bioRef}
    //         />
    //         <button onClick={updateBio}>save</button>
    //       </div>
    //     </div>
    //     <SignOutButton />
    //   </div>
    // </>
  );
}
export function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}
export default UserProfile;
