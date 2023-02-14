import { UserContext } from "@/lib/context";
import { useContext } from "react";

function Profile() {
  const { user, username } = useContext(UserContext);
  return <div>{user}</div>;
}

export default Profile;
