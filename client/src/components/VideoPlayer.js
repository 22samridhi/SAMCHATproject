import React from "react";
import { v1 as uuid } from "uuid";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";

const customStyle = {
  background: "#6264A7",
  backgroundImage: "-webkit-linear-gradient(top, #6264A7, #7375bf)",
  backgroundImage: "-moz-linear-gradient(top, #6264A7, #7375bf)",
  backgroundImage: "-ms-linear-gradient(top, #6264A7, #7375bf)",
  backgroundImage: "-o-linear-gradient(top, #6264A7, #7375bf)",
  backgroundImage: "linear-gradient(to bottom, #6264A7, #7375bf)",
  webkitBorderRadius: "15",
  mozBorderRadius: "15",
  borderRadius: "15px",
  fontFamily: "Arial",
  color:" #ffffff",
  fontSize: "20px",
  padding: "10px 20px 10px 20px",
  textDecoration: "none",
  marginBottom:"18px",
  cursor:"pointer",
  border:"solid purple 1px",
  padding:"10px 35px 10px",
};

const ec={
  textDecoration:"none",
  border:"solid 0.5px",
  padding:"10px 35px 10px",
  mozBorderRadius: "15",
  borderRadius: "15px",
  background:"#7375bf",
  color:"#f3f2f1",
  background: "#6264A7",
  backgroundImage: "-webkit-linear-gradient(top, #6264A7, #7375bf)",
  backgroundImage: "-moz-linear-gradient(top, #6264A7, #7375bf)",
  backgroundImage: "-ms-linear-gradient(top, #6264A7, #7375bf)",
  backgroundImage: "-o-linear-gradient(top, #6264A7, #7375bf)",
  backgroundImage: "linear-gradient(to bottom, #6264A7, #7375bf)",
  border:"solid purple 1px", 
  fontSize: "20px",
}
const Meetings = () => {
  const history = useHistory();
  function create() {
    const id = uuid();
    history.push(`/room/${id}`);
    return;
  }

  return (
    <React.Fragment>
      <button style={customStyle} onClick={create}>Create Room</button>
      <NavLink style={ec} to="/chats">Enter Chat</NavLink>
    </React.Fragment>
  );
};

export default Meetings;
