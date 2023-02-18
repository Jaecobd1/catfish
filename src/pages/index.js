import Head from "next/head";
import { Inter, Lato, Roboto } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { auth, googleAuthProvider } from "../lib/firebase";
import { toast } from "react-hot-toast";
import { StyleRegistry } from "styled-jsx";
import { useState, useRef, useContext, useEffect, useCallback } from "react";
import { UserContext } from "../lib/context";
import Login from "@/components/Home/Login";
import debounce from "lodash.debounce";
import { firestore } from "../lib/firebase";
import UserProfile from "@/components/Profiles/UserProfile";
import Game from "@/components/Game/Game";
import Hero from "@/components/Home/Hero";
import { FaArrowCircleRight } from "react-icons/fa";
import Image from "next/image";

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
  // true is about page, false is login page
  const [homePanel, setHomePanel] = useState(true);

  // checking active panel, only applies to home page
  useEffect(() => {
    const rightPanel = document.getElementById("right-panel");
    const leftPanel = document.getElementById("left-panel");
    if (homePanel) {
      rightPanel.classList.add(`${styles.hiddenPanel}`);
      leftPanel.classList.remove(`${styles.hiddenPanel}`);
    } else {
      rightPanel.classList.remove(`${styles.hiddenPanel}`);
      leftPanel.classList.add(`${styles.hiddenPanel}`);
    }
  }, [homePanel]);
  // this doesn't work if you go from being on mobile to desktop, as of right now user has to refresh

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
          <div className={styles.leftPanel} id="left-panel">
            {!user ? (
              <div>
                <Hero />
                <div
                  className={
                    "flex lg:hidden items-center absolute right-[20px] bottom-[40px]"
                  }
                >
                  <FaArrowCircleRight
                    className={styles.switchArrow}
                    onClick={() => setHomePanel(false)}
                  />
                </div>
              </div>
            ) : (
              <Game />
            )}
          </div>
          {/* Right Side Panel */}
          <div className={styles.rightPanel} id="right-panel">
            {user ? (
              !username ? (
                <UsernameForm />
              ) : (
                <UserProfile />
              )
            ) : (
              <div>
                <Login />
                <div
                  className={
                    "flex lg:hidden items-center absolute right-[20px] bottom-[40px] font-lato"
                  }
                >
                  <p className="text-[16px] text-slate-400">BACK</p>
                  <FaArrowCircleRight
                    className={styles.switchArrow}
                    onClick={() => setHomePanel(true)}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
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

  // Regex
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
