import Head from "next/head";
import Image from "next/image";
import { Inter, Lato, Roboto } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Google from "../images/Google.png";
import { auth, firebase, googleAuthProvider } from "../lib/firebase";
import { toast } from "react-hot-toast";
import { StyleRegistry } from "styled-jsx";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });
const lato = Lato({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "100"],
});

export default function Home() {
  // This is the Main Page of the website
  const [userLogin, setUserLogin] = useState(true);

  // This is the sign in with google function
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider).then(() => {
      toast.success("Signed in");
    });
  };

  //Sign out button

  return (
    <>
      <Head>
        <title>🐈🐟</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.leftPanel}>
          <h1 className={lato.className}>WELCOME TO CATFISH!</h1>
          <p>
            In this social media-inspired game, players work together to catch
            the elusive catfish, but be careful - not everyone is who they claim
            to be!
          </p>
          <p>
            Analyze messages, photos, and participate in minigames to expose the
            fake profiles and emerge victorious.
          </p>
          <h2>DO YOU HAVE WHAT IT TAKES TO CATCH THE CATFISH?</h2>
        </div>
        <div className={styles.rightPanel}>
          {userLogin ? (
            <>
              <div className={`${styles.loginTab} ${styles.authTab}`}>
                Login
              </div>
              <div
                className={`${styles.signUpTab} ${styles.authTab} ${styles.hiddenTab}`}
                onClick={() => setUserLogin(false)}
              >
                Signup
              </div>

              <h3>Username</h3>
              <input type="text" />
              <h3>Password</h3>
              <input type="text" />
              <p>Forgot your username/password?</p>
              <div className={styles.loginSubmit}>
                <p>submit</p>
              </div>
              <div className={styles.loginDivider}></div>
            </>
          ) : (
            <>
              <div
                className={`${styles.loginTab} ${styles.authTab} ${styles.hiddenTab}`}
                onClick={() => setUserLogin(true)}
              >
                Login
              </div>
              <div className={`${styles.signUpTab} ${styles.authTab}`}>
                Signup
              </div>

              <h3>Username</h3>
              <input type="text" />
              <h3>Password</h3>
              <input type="text" />
              <div className={styles.loginSubmit}>
                <p>submit</p>
              </div>
              <div className={styles.loginDivider}></div>
            </>
          )}

          {/* <button className={styles.SWIGoogle} onClick={signInWithGoogle}>
            <Image
              src={Google}
              width={50}
              height={50}
              alt="Sign in with google"
            />
            Sign in Google
          </button> */}
        </div>
      </main>
    </>
  );
}

function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}
