import { useContext } from "react";
import { UserContext } from "@/lib/context";
function Nav() {
  const { user, username } = useContext(UserContext);
  return <div>Nav</div>;
}

export default Nav;
