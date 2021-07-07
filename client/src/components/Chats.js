import React, { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatEngine } from "react-chat-engine";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";
import Modal from "./Modal";
import "./Chats.css";

export default function Chats() {
  const didMountRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const history = useHistory();

  const [show, setshow] = React.useState(false);

  const showModal = () => {
    setshow(true);
  };

  const hideModal = () => {
    setshow(false);
  };

  async function handleLogout() {
    await auth.signOut();
    history.push("/");
  }

  async function getFile(url) {
    let response = await fetch(url);
    let data = await response.blob();
    return new File([data], "test.jpg", { type: "image/jpeg" });
  }

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;

      if (!user || user === null) {
        history.push("/");
        return;
      }

      // This request lets your check
      //  if your authentication headers are correct
      // and will return the user's data (status == 200) if so.
      axios
        .get("https://api.chatengine.io/users/me/", {
          headers: {
            "project-id": process.env.REACT_APP_CHAT_ENGINE_ID,
            "user-name": user.email,
            "user-secret": user.uid,
          },
        })

        .then(() => setLoading(false))

        .catch((e) => {
          let formdata = new FormData();
          formdata.append("email", user.email);
          formdata.append("username", user.email);
          formdata.append("secret", user.uid);
          getFile(user.photoURL).then((avatar) => {
            formdata.append("avatar", avatar, avatar.name);

            axios
              .post("https://api.chatengine.io/users/", formdata, {
                headers: {
                  "private-key": process.env.REACT_APP_CHAT_ENGINE_KEY,
                },
              })
              .then(() => setLoading(false))
              .catch((e) => console.log("e", e.response));
          });
        });
    }
  }, [user, history]);

  if (!user || loading) return <div />;

  return (
    <div className="chats-page">
      <div className="nav-bar">
        <div className="logo-tab">Sam's Chat</div>

        <button className="btn_meeting" type="button" onClick={showModal}>
          Start Video call
        </button>
        <div onClick={handleLogout} className="logout-tab">
          Logout
        </div>
      </div>

      <ChatEngine
        height="calc(100vh - 66px)"
        projectID={process.env.REACT_APP_CHAT_ENGINE_ID}
        userName={user.email}
        userSecret={user.uid}
        // // renderChatHeader={(chat) => {
        // //   return (
        // //     <div>
        // //       <ChatHeader />
        // //     </div>
        // //   );
        // // }}
      />

      <Modal show={show} handleClose={hideModal}>
        <Modal show={show} handleClose={hideModal}>
          <div className="modalbody">
            <h1 style={{color:"purple"}}>Hit the button to checkout to meeting room</h1>

            <NavLink to="/meetings" exact>
              <button className="button.btn_meeting meeting1" type="button">
                Start meeting
              </button>
            </NavLink>
          </div>
        </Modal>
      </Modal>
    </div>
  );
}
