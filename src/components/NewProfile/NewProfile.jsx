import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/lib/context";
import { useCallback } from "react";
import debounce from "lodash.debounce";
import { firestore } from "../../lib/firebase";
// everything relating to the username function
// Username Validation form
export function UsernameForm() {
  const [firstName, setFirstName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [occupation, setOccupation] = useState("");

  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(displayName);
    console.log(user.displayName);
  }, [displayName]);

  // Regex
  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 Or it passes regex
    if (val.length < 3) {
      setDisplayName(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setDisplayName(val);
      setLoading(true);
      setIsValid(true);
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

  const onSubmit = async (e) => {
    e.preventDefault();

    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // Send to DB at same time
    const batch = firestore.batch();
    batch.set(userDoc, {
        photoURL: "",
        firstName: firstName,
        username: displayName,
        bio: bio,
        occupation: occupation,
        interests: [],
        snapchatUsername: "snap",
        instagramUsername: "",
        facebookUsername: "",

      isUserInGame: false,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  return (
    !username && (
      <>
        <section>
          <h3>Username</h3>
          <form onSubmit={onSubmit} className="flex flex-col">
            <input
              type="text"
              name="username"
              placeholder="username"
              value={displayName}
              onChange={onChange}
            />
            <UsernameMessage
              username={displayName}
              isValid={isValid}
              loading={loading}
            />
             <input
              type="text"
              name="fName"
              placeholder="first name"
              value={firstName}
              onChange={() => setFirstName(firstName)}
            />
            <input
              type="text"
              name="bio"
              placeholder="bio"
              value={bio}
              onChange={() => setBio(bio)}
            />
            <input
              type="text"
              name="occupation"
              placeholder="occupation"
              value={occupation}
              onChange={() => setOccupation(occupation)}
            />
            <input
              type="text"
              name="interests"
              placeholder="interests"
            //   value={}
            //   onChange={}
            />
            {/* social media links */}
            <input
              type="text"
              name="snap"
              placeholder="snap username"
            //   value={}
            //   onChange={}
            />
            <input
              type="text"
              name="insta"
              placeholder="instagram username"
            //   value={}
            //   onChange={}
            />
            <input
              type="text"
              name="facebook"
              placeholder="facebook username"
            //   value={}
            //   onChange={}
            />
            <button type="submit" disabled={!isValid}>
              Choose
            </button>
          </form>
        </section>
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
  } else if (!isValid) {
    return <p>{username} is not available</p>;
  } else {
    <p></p>;
  }
}
