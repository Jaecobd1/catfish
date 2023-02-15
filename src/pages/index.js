import Head from "next/head";
import Image from "next/image";
import { Inter, Lato, Roboto } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Google from "../images/Google.png";
import { auth, firebase, googleAuthProvider } from "../lib/firebase";
import { toast } from "react-hot-toast";
import { StyleRegistry } from "styled-jsx";
import { useState, useRef, useContext, useEffect, useCallback } from "react";
import { UserContext } from "../lib/context";
import Login from "@/components/RightPanel/Login";
import debounce from "lodash.debounce";
import { firestore } from "../lib/firebase";
import UserProfile from "@/components/Profiles/UserProfile";
import Game from "@/components/Game/Game";

const inter = Inter({ subsets: ["latin"] });
const lato = Lato({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "100"],
});
// This is the Main Page of the website

export default function Home() {
  // Get User Context
  const { user, username } = useContext(UserContext);

  return (
    <>
      <Head>
        <title>🐱🎣</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="">
        <main className={styles.main}>
          {/* Left Side Panel */}
          <div className={styles.leftPanel}>{!user ? <Hero /> : <Game />}</div>

          {/* Could we make this it's own components? */}
          {/* Right Side Panel */}
          <div className={styles.rightPanel}>
            {user ? !username ? <UsernameForm /> : <UserProfile /> : <Login />}
          </div>
        </main>
      </div>
    </>
  );
}

function GoogleSignUp() {
  // This is the sign in with google function
  const signInWithGoogle = async () => {
    await auth
      .signInWithPopup(googleAuthProvider)
      .then(() => {
        toast.success("Signed in");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <button className={styles.SWIGoogle} onClick={signInWithGoogle}>
      <Image src={Google} width={50} height={50} alt="Sign in with google" />
      Sign in Google
    </button>
  );
}

// Username Validation form
function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);
    console.log(user.displayName);
  }, [formValue]);

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form calue if length is < 3 Or it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
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
      username: formValue,
      photoURL: "",
      displayName: formValue,
      firstName: "",
      lastName: "",
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
              value={formValue}
              onChange={onChange}
            />
            <UsernameMessage
              username={formValue}
              isValid={isValid}
              loading={loading}
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

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p> Checking...</p>;
  } else if (isValid) {
    return <p>{username} is available!</p>;
  } else {
    return <p></p>;
  }
}

function Hero() {
  return (
    <>
      <h1 className="text-[50px] font-lato font-black italic">
        WELCOME TO CATFISH!
      </h1>
      <p className="font-raleway tracking-wide">
        In this social media-inspired game, players work together to catch the
        elusive catfish, but be careful - not everyone is who they claim to be!
      </p>
      <p className="font-raleway tracking-wide">
        Analyze messages, photos, and participate in minigames to expose the
        fake profiles and emerge victorious.
      </p>
      <p className="font-raleway tracking-wide mb-2">
        Or will the catfish fool the group with their fake identiy and stand win
        it all?
      </p>
      <h2 className="font-lato italic font-bold">
        DO YOU HAVE WHAT IT TAKES TO CATCH THE CATFISH?
      </h2>
    </>
  );
}
