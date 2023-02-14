import Head from "next/head";
import Image from "next/image";
import { Inter, Lato, Roboto } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Google from "../images/Google.png";
import { auth, firebase, googleAuthProvider } from "../lib/firebase";
import { toast } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
const lato = Lato({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "100"],
});

export default function Home() {
  // This is the Main Page of the website

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
          <button className={styles.SWIGoogle} onClick={signInWithGoogle}>
            <Image
              src={Google}
              width={50}
              height={50}
              alt="Sign in with google"
            />
            Sign in Google
          </button>
        </div>
      </main>
    </>
  );
}

function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}
