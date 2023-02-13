import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Google from "../images/Google.png";
import { auth, firebase, googleAuthProvider } from "../lib/firebase";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // This is the Main Page of the website

  // This is the sign in with google function
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <>
      <Head>
        <title>🐈🐟</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.leftPanel}></div>
        <div className={styles.rightPanel}>
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
