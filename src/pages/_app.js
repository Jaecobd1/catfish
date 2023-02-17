import "@/styles/globals.css";
import { UserContext, GameContext } from "@/lib/context";
import { Toaster } from "react-hot-toast";
import { useUserData, useGameData } from "@/lib/hooks";
export default function App({ Component, pageProps }) {
  const userData = useUserData();
  const gameData = useGameData();
  return (
    <UserContext.Provider value={userData}>
      <GameContext.Provider value={gameData}>
        <Component {...pageProps} />
        <Toaster />
      </GameContext.Provider>
    </UserContext.Provider>
  );
}
