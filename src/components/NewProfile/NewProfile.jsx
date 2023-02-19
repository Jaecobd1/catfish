import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "@/lib/context";
import { useCallback } from "react";
import debounce from "lodash.debounce";
import { firestore } from "../../lib/firebase";
// import { first } from "lodash";
// everything relating to the username function
// Username Validation form
export function UsernameForm() {
  const [displayName, setDisplayName] = useState("");

  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, username } = useContext(UserContext);
  const firstNameRef = useRef();
  const bioRef = useRef();
  const occupationRef = useRef();

  useEffect(() => {
    checkUsername(displayName);
    console.log(user.displayName);
  }, []);

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
    const usernameDoc = firestore.doc(`usernames/${displayName}`);

    // Send to DB at same time
    const batch = firestore.batch();
    batch.set(userDoc, {
      photoURL: "",
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
              onChange={onChange}
              required
            />
            <UsernameMessage
              username={displayName}
              isValid={isValid}
              loading={loading}
            />
            <input
              type="text"
              name="firstName"
              placeholder="first name"
              ref={firstNameRef}
            />
            <input type="text" name="bio" placeholder="bio" ref={bioRef} />
            <input
              type="text"
              name="occupation"
              placeholder="occupation"
              ref={occupationRef}
            />
            <button
              type="submit"
              disabled={!isValid}
              className="bg-blue-200 w-min hover:bg-blue-500"
            >
              Create Profile
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
