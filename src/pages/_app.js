import "@/styles/globals.css";
import { UserContext } from "@/lib/context";
import Nav from "@/components/Nav/Nav";
import { Toaster } from "react-hot-toast";
import { useUserData } from "@/lib/hooks";
export default function App({ Component, pageProps }) {
  const userData = useUserData();
  return (
    <UserContext.Provider value={userData}>
      <Nav />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}
