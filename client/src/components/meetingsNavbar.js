import React from "react";

import "./navbar.css";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";
const Navbar = () => {
  const history = useHistory();
  async function handleLogout() {
    await auth.signOut();
    history.push("/");
  }
  return (
    <div className="navbar">
      <ul className="nav-links">
        <li>
          <div onClick={handleLogout} className="logout-tab_meeting">
            Logout
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
