import "@/styles/globals.css";
import { UserContext } from "@/lib/context";
import Nav from "@/components/Nav/Nav";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function App({ Component, pageProps }) {
  return (
    <UserContext.Provider value={{ user: {}, username: "Jake" }}>
      <Nav />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}
