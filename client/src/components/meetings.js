import React from "react";
import Navbar from "./meetingsNavbar";
import { Typography, AppBar } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import VideoPlayer from "./VideoPlayer";

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: "30px 100px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "600px",
   

    // [theme.breakpoints.down("xs")]: {
    //   width: "90%",
    // },
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
}));
const MeetingRoom = () => {
  const classes = useStyles();
  return (
    <div>
      <div className="main-content">
        <Navbar />

        <div className={classes.wrapper}>
          <AppBar className={classes.appBar} position="static" color="inherit">
            <Typography variant="h2" align="center" style={{color:"#6264a7"}}>
              Sam's Chat
            </Typography>
          </AppBar>

          <VideoPlayer />
        </div>
      </div>
    </div>
  );
};
export default MeetingRoom;
