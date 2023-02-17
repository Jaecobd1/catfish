import { createContext } from "react";

export const UserContext = createContext({
  user: null,
  username: null,
  photoURL: null,
  gameID: null,
  isUserCatfish: null,
});

export const GameContext = createContext({
  isUserInGame: null,
  userProfile: null,
  test: "test",
});
