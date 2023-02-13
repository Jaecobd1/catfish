import "@/styles/globals.css";
import { UserContext } from "@/lib/context";
import Nav from "@/components/Nav/Nav";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <UserContext.Provider value={{ user: {}, username: {} }}>
      <Nav />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}
