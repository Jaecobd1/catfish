import { useState, useEffect, useRef, useContext } from "react";
import styles from "@/styles/Home.module.css";
import { toast } from "react-hot-toast";
import { auth, firebase, googleAuthProvider } from "../../lib/firebase";
import { UserContext } from "@/lib/context";
function RightPannel() {
  // This is the sign in with google function
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider).then(() => {
      toast.success("Signed in");
    });
  };

  // Sign Up with an email & add username
  const signUpWithEmail = async () => {
    var email = signUpEmailRef.current.value;
    var password = signUpPasswordRef.current.value;
    var confirmPassword = signUpPasswordConfirmRef.current.value;
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        var user = userCredentials.user;
        if (user) {
          toast.success("Account Created");
          user.updateProfile({
            displayName: username,
          });
        }
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        toast.error(errorCode + ":" + errorMessage);
      });
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
        <>
          <div className={`${styles.loginTab} ${styles.authTab}`}>Login</div>
          <div
            className={`${styles.signUpTab} ${styles.authTab} ${styles.hiddenTab}`}
            onClick={() => setUserLogin(false)}
          >
            Signup
          </div>

          <h3 style={{ marginTop: 50 }}>Email</h3>
          <input type="text" ref={loginEmail} className="loginUsername" />
          <h3>Password</h3>
          <input
            type="password"
            ref={loginPasswordRef}
            className="loginPassword"
          />
          <p
            className="text-right underline hover:no-underline"
            onClick={() => resetPassword()}
          >
            Need to reset your password?
          </p>
          <div className={styles.loginSubmit}>
            <button onClick={() => loginWithEmail()}>
              <p className="font-lato italic font-bold">Login</p>
            </button>
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
          <div className={`${styles.signUpTab} ${styles.authTab}`}>Signup</div>

          <h3 style={{ marginTop: 30 }}>Email</h3>
          <input type="email" ref={signUpEmailRef} />

          <h3>Password</h3>
          <input type="password" ref={signUpPasswordRef} />
          <h3>Confirm Password</h3>
          <input
            type="password"
            style={{ marginBottom: 10 }}
            ref={signUpPasswordConfirmRef}
          />
          <div className={styles.loginSubmit}>
            <button onClick={() => signUpWithEmail()}>
              <p className="font-lato italic font-bold text-center ">Sign up</p>
            </button>
          </div>
          <div className={styles.loginDivider}></div>
        </>
      )}
      <p className={styles.copyright}>
        Developed by Jake Dobler and John Gaynor
      </p>

      {/* <button className={styles.SWIGoogle} onClick={signInWithGoogle}>
            <Image
              src={Google}
              width={50}
              height={50}
              alt="Sign in with google"
            />
            Sign in Google
          </button> */}
    </>
  );
}

export default RightPannel;
