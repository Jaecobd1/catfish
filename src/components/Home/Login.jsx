import { useState, useEffect, useRef, useContext } from "react";
import styles from "@/styles/RightPanel/Login.module.css";
import { toast } from "react-hot-toast";
import { auth, firestore, googleAuthProvider } from "../../lib/firebase";
import Image from "next/image";
import Google from "../../images/Google.png";
import Apple from "../../images/Apple.png";
import Facebook from "../../images/Facebook.png";
import firebase from "firebase/app";

function Login() {
  // This is the sign in with google function
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider).then(() => {
      toast.success("Signed in");
    });
  };

  //Sign Up with Apple

  // Sign up/ with Facebook
  const signInWithFB = async () => {
    var provider = new firebase.auth.FacebookAuthProvider();
    await auth
      .signInWithPopup(provider)
      .then((res) => {
        var credential = result.credential;
        var user = result.user;
        toast.success("Signed in");
      })
      .catch((err) => {
        toast.error("Try again or a different sign in method");
      });
  };

  // Sign Up with an email & add username
  const signUpWithEmail = async () => {
    var email = signUpEmailRef.current.value;
    var password = signUpPasswordRef.current.value;
    var confirmPassword = signUpPasswordConfirmRef.current.value;
    if (password == confirmPassword) {
      await auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredentials) => {
          var user = userCredentials.user;
          if (user) {
            toast.success("Account Created");
            firestore.collection("users").doc(user.uid).set({ email: email });
          }
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          toast.error(errorCode + ":" + errorMessage);
        });
    } else {
      toast.error("passwords must match");
    }
  };

  // Login With Email
  const loginWithEmail = async () => {
    var username = loginEmail.current.value;
    var password = loginPasswordRef.current.value;
    await auth
      .signInWithEmailAndPassword(username, password)
      .then((userCredentials) => {
        toast.success(user.displayName + " Signed in");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        toast.error(errorCode + ":" + errorMessage);
      });
  };

  // Reset Password
  const resetPassword = () => {
    const email = loginEmail.current.value;

    if (!email || email == "") {
      toast.error("Please enter your email");
    }

    auth.sendPasswordResetEmail(email).then(() => {
      toast.success(
        "Password reset email has been sent,\n check your spam folder"
      );
    });
  };

  // State for Right Panel (Signup/Login)
  const [userLogin, setUserLogin] = useState(true);

  // Reference objs
  const loginEmail = useRef();
  const loginPasswordRef = useRef();

  const signUpEmailRef = useRef();
  const signUpPasswordRef = useRef();
  const signUpPasswordConfirmRef = useRef();
  return (
    <>
      {userLogin ? (
        <div className={styles.loginContainer}>
          <div className="font-lato">
            <div className={`${styles.loginTab} ${styles.authTab}`}>Login</div>
            <div
              className={`${styles.signUpTab} ${styles.authTab} ${styles.hiddenTab}`}
              onClick={() => setUserLogin(false)}
            >
              Signup
            </div>
          </div>
          <h3 style={{ marginTop: 50 }} className="font-lato">
            Email
          </h3>
          <input
            type="text"
            ref={loginEmail}
            className="loginUsername p-2 font-lato"
          />
          <h3 className="font-lato">Password</h3>
          <input
            type="password"
            ref={loginPasswordRef}
            className="loginPassword p-2 font-lato"
          />
          <p
            className="text-right underline hover:no-underline font-lato italic"
            onClick={() => resetPassword()}
          >
            Need to reset your password?
          </p>
          <div className={styles.authSubmit} onClick={() => loginWithEmail()}>
            <p className="font-lato italic font-bold">Login</p>
          </div>
          <div className={styles.loginDivider}>
            <div className={styles.line}></div>
            <p className="font-lato italic">OR</p>
            <div className={styles.line}></div>
          </div>
          <div className={styles.signInProviders}>
            <Image
              src={Google}
              height={40}
              alt="Sign in with google"
              onClick={signInWithGoogle}
            />
            <Image src={Apple} height={40} alt="Sign in with apple" />
            <Image
              src={Facebook}
              height={40}
              alt="Sign in with facebook"
              onClick={signInWithFB}
            />
          </div>
        </div>
      ) : (
        <div className={styles.loginContainer}>
          <div className="font-lato">
            <div
              className={`${styles.loginTab} ${styles.authTab} ${styles.hiddenTab}`}
              onClick={() => setUserLogin(true)}
            >
              Login
            </div>
            <div className={`${styles.signUpTab} ${styles.authTab}`}>
              Signup
            </div>
          </div>
          <h3 style={{ marginTop: 50 }} className="font-lato">
            Email
          </h3>
          <input type="email" ref={signUpEmailRef} className=" p-2 font-lato" />

          <h3 className="font-lato">Password</h3>
          <input
            type="password"
            ref={signUpPasswordRef}
            className="p-2 font-lato"
          />
          <h3 className="font-lato">Confirm Password</h3>
          <input
            type="password"
            style={{ marginBottom: 10 }}
            ref={signUpPasswordConfirmRef}
            className="p-2 font-lato"
          />
          <div className={styles.authSubmit} onClick={() => signUpWithEmail()}>
            <p className="font-lato italic font-bold">Sign up</p>
          </div>
        </div>
      )}
      <p className={`${styles.copyright} font-lato`}>
        Developed by Jake Dobler and John Gaynor
      </p>
    </>
  );
}

export default Login;
