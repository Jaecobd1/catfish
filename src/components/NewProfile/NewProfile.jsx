import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "@/lib/context";
import { useCallback } from "react";
import debounce from "lodash.debounce";
import { firestore, storage, STATE_CHANGED } from "../../lib/firebase";
import styles from "@/styles/LeftPanel/NewProfile.module.css";
import { toast } from "react-hot-toast";
// import { first } from "lodash";
// everything relating to the username function
// Username Validation form
export function UsernameForm() {
  const [uploading, setUploading] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, username } = useContext(UserContext);
  const firstNameRef = useRef();
  const bioRef = useRef();
  const occupationRef = useRef();
  const [downloadURL, setDownloadURL] = useState(null);
  const imageRef = useRef();
  const userDoc = firestore.doc(`users/${user.uid}`);

  useEffect(() => {
    checkUsername(displayName);
    console.log(user.displayName);
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${displayName}`);
    // Send to DB at same time
    const batch = firestore.batch();
    batch.set(userDoc, {
      photoURL: downloadURL,
      firstName: firstNameRef.current.value,
      username: displayName,
      bio: bioRef.current.value,
      occupation: occupationRef.current.value,
      interests: [],
      snapchatUsername: "snap",
      instagramUsername: "",
      facebookUsername: "",
      isUserInGame: false,
    });
    batch.set(usernameDoc, { uid: user.uid });
    await batch.commit();
  };

  // Regex
  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form calue if length is < 3 Or it passes regex
    if (val.length < 3) {
      setDisplayName(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setDisplayName(val);
      setLoading(true);
    }
  };

  // Check database for username match after debounce
  // useCallback is needed for debounce
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );
  const userStorageRef = storage.ref().child(user.uid);

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
        .then(() => ref.getDownloadURL())
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
    !username && (
      <>
        <div className={styles.newProfileContainer}>
          <h1 className="text-[40px] font-lato font-black italic tracking-wide">
            CREATE YOUR PROFILE!
          </h1>
          <form
            onSubmit={onSubmit}
            className={`${styles.newUserForm} font-raleway italic`}
          >
            <div className="flex">
              <div>
                <label for="username">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="username"
                  onChange={onChange}
                  required
                  className={styles.smallInput}
                />
              </div>
              <div>
                <label for="firstName">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="first name"
                  ref={firstNameRef}
                  className={styles.smallInput}
                />
              </div>
            </div>
            <UsernameMessage
              username={displayName}
              isValid={isValid}
              loading={loading}
            />

            <label for="bio" className="mt-5">
              Bio
            </label>
            <textarea
              type="text"
              name="bio"
              placeholder="bio"
              ref={bioRef}
              className={styles.formBigBox}
              style={{ height: 50 }}
            />

            {/* need to specify what file type? */}
            <div className="flex mt-3">
              <div>
                <label for="occupation" className="mt-3">
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  placeholder="occupation"
                  ref={occupationRef}
                />
              </div>
              <div>
                <label for="profilePicture">Profile Picture</label>
                <input
                  type="file"
                  name="profilePicture"
                  placeholder="first name"
                  ref={imageRef}
                  className={styles.smallInput}
                  onChange={addImage}
                />
              </div>
            </div>
            <label for="interests" className="mt-3">
              Interests
            </label>
            <select name="interests">
              <option value="skiing">Skiing</option>
            </select>

            <button
              type="submit"
              disabled={!isValid}
              className={`${styles.formSubmit} font-lato font-bold`}
            >
              Create Profile
            </button>
          </form>
        </div>
      </>
    )
  );
}

// Shows the user if the username is available
function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p> Checking...</p>;
  } else if (isValid) {
    return <p>{username} is available!</p>;
  } else {
    return <p></p>;
  }
}
