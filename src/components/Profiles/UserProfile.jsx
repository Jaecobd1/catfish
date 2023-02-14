import { useContext, useRef, useEffect, useState } from "react";
import { UserContext } from "@/lib/context";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { storage, firestore, STATE_CHANGED, auth } from "@/lib/firebase";

function UserProfile() {
  const { user, username } = useContext(UserContext);
  const userDoc = firestore.doc(`users/${user.uid}`);
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const bioRef = useRef();
  const imageRef = useRef();
  const imageFileRef = useRef();

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const userStorageRef = storage.ref().child(user.uid);
  useEffect(() => {
    userDoc.get().then((userProfile) => {
      if (userProfile.exists) {
        let profile = userProfile.data();
        firstNameRef.current.value = profile.firstName;
        lastNameRef.current.value = profile.lastName;
        bioRef.current.value = profile.bio;
        imageRef.current.src = profile.photoURL;
      }
    });
  }, []);

  const updateFirstName = () => {
    if (firstNameRef.current.value == "") {
      toast.error("Enter your first name");
    } else {
      userDoc
        .update({
          firstName: firstNameRef.current.value,
        })
        .then(() => {
          toast.success("First Name Saved!");
        })
        .catch((error) => {
          toast.error(error.code + " : " + error.message);
        });
    }
  };
  const updateLastName = () => {
    if (lastNameRef.current.value == "") {
      toast.error("Please enter a valid last name");
    } else {
      userDoc
        .update({
          lastName: lastNameRef.current.value,
        })
        .then(() => {
          toast.success("Last Name Saved!");
        })
        .catch((error) => {
          toast.error(error.code + " : " + error.message);
        });
    }
  };

  const updateBio = () => {
    if (bioRef.current.value == "") {
      toast.error("pleast enter a valid bio");
    } else {
      userDoc
        .update({
          bio: bioRef.current.value,
        })
        .then(() => {
          toast.success("Bio Saved!");
        })
        .catch((error) => {
          toast.error(error.code + " : " + error.message);
        });
    }
  };

  const addImage = async (e) => {
    // Get storage bucket, Add Image to storage bucket
    // Create URL for Image and change image front end
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split("/")[1];
    // ref to upload
    const ref = storage.ref(`uploads/${user.uid}/${Date.now()}.${extension}`);
    setUploading(true);

    // Start upload
    const task = ref.put(file);

    task.on(STATE_CHANGED, (snapshot) => {
      task
        .then((d) => ref.getDownloadURL())
        .then((url) => {
          setDownloadURL(url);
          setUploading(false);
          toast.success("Image Uploaded");
          imageRef.current.src = url;
          userDoc
            .update({
              photoURL: url,
            })
            .then(() => {
              toast.success("Image Saved!");
            })
            .catch((error) => {
              toast.error(error.code + " : " + error.message);
            });
        });
    });
  };
  return (
    <>
      <div className="flex w-full h-full justify-between flex-col items-center">
        <h1 className="font-lato text-2xl mt-2 w-1/2 ">
          Hi <span className="capitalize">{username}</span>, would you like to
          update your profile?
        </h1>
        <p className="">
          Make your profile authentic, the catfish of the group will be selected
          at random
        </p>
        <div className="flex">
          <div className="w-20 h-20 overflow-hidden rounded-full">
            <Image
              alt="profile"
              ref={imageRef}
              src=""
              height={100}
              width={100}
              className=" object-cover "
            />
          </div>
          <input
            type="file"
            onChange={addImage}
            ref={imageFileRef}
            accept="image/x-png,image/gif,image/jpeg"
          ></input>
        </div>
        <div className="flex flex-col">
          <h3>First Name</h3>
          <div className="flex">
            <input
              type="text"
              name="firstName"
              placeholder={!user.firstName ? `${user.firstName}` : "First Name"}
              ref={firstNameRef}
            />
            <button onClick={updateFirstName}>save</button>
          </div>
          <h3>Last Name</h3>
          <div className="flex">
            <input
              type="text"
              name="lastName"
              placeholder={!user.lastName ? user.lastName : "Last Name"}
              ref={lastNameRef}
            />
            <button onClick={updateLastName}>save</button>
          </div>
          <h3>Bio</h3>
          <div className="flex">
            <input
              type="text"
              name="Bio"
              placeholder={!user.bio || user.bio == "" ? user.bio : "Add a Bio"}
              ref={bioRef}
            />
            <button onClick={updateBio}>save</button>
          </div>
        </div>
        <SignOutButton />
      </div>
    </>
  );
}
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}
export default UserProfile;
