import React, { useRef, useEffect, useState } from "react";
import {
  AudioMutedOutlined,
  AudioOutlined,
  VideoCameraOutlined,
  ExpandOutlined,
  CompressOutlined,
  PhoneOutlined,
  DesktopOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import io from "socket.io-client";
import Peer from "simple-peer";
import Rodal from "rodal";
import "../components/Room.css";

const Room = () => {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callingFriend, setCallingFriend] = useState(false);
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [receiverID, setReceiverID] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [isfullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socketRef = useRef();
  const myPeer = useRef();

  let landingHTML = (
    <>
      <main>
        <div className="u-margin-top-xxlarge u-margin-bottom-xxlarge">
          <div className="o-wrapper-l">
            <div className="hero flex flex-column">
              <div>
                <div className="welcomeText">Video call with Sam's chat</div>
                {/* <div className="descriptionText">Try here</div> */}
              </div>
              <div>
                <div className="actionText">
                  Share this username,{" "}
                  <span
                    className={
                      copied
                        ? "username highlight copied"
                        : "username highlight"
                    }
                    onClick={() => {
                      showCopiedMessage();
                    }}
                  >
                    {yourID}
                  </span>
                  ?
                </div>
              </div>
              <div className="callBox flex">
                <input
                  type="text"
                  placeholder="Colleague's username"
                  value={receiverID}
                  onChange={(e) => setReceiverID(e.target.value)}
                  className="form-input"
                />
                <button
                  onClick={() => callPeer(receiverID.toLowerCase().trim())}
                  className="primaryButton"
                >
                  Call Your Colleague
                </button>
              </div>
              <div>
                <br />
                Send your username (<span className="username">{yourID}</span>)
                and wait for their call{" "}
                <span style={{ fontWeight: 600 }}>OR</span> enter their username
                and hit call!
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
  useEffect(() => {
    // socket.current = io.connect("/");
    socketRef.current = io.connect(`https://samchat123.herokuapp.com/`);

    socketRef.current.on("yourID", (id) => {
      setYourID(id);
    });
    socketRef.current.on("allUsers", (users) => {
      setUsers(users);
    });

    socketRef.current.on("hey", (data) => {
      setReceivingCall(true);
      // ringtoneSound.play();
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  function callPeer(id) {
    if (id !== "" && users[id] && id !== yourID) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          setCallingFriend(true);
          setCaller(id);
          if (userVideo.current) {
            userVideo.current.srcObject = stream;
          }
          const peer = new Peer({
            initiator: true,
            trickle: false,
            config: {
              iceServers: [
                // {
                //     urls: "stun:numb.viagenie.ca",
                //     username: "sultan1640@gmail.com",
                //     credential: "98376683"
                // },
                // {
                //     urls: "turn:numb.viagenie.ca",
                //     username: "sultan1640@gmail.com",
                //     credential: "98376683"
                // }
                { url: "stun:stun01.sipphone.com" },
                { url: "stun:stun.ekiga.net" },
                { url: "stun:stun.fwdnet.net" },
                { url: "stun:stun.ideasip.com" },
                { url: "stun:stun.iptel.org" },
                { url: "stun:stun.rixtelecom.se" },
                { url: "stun:stun.schlund.de" },
                { url: "stun:stun.l.google.com:19302" },
                { url: "stun:stun1.l.google.com:19302" },
                { url: "stun:stun2.l.google.com:19302" },
                { url: "stun:stun3.l.google.com:19302" },
                { url: "stun:stun4.l.google.com:19302" },
                { url: "stun:stunserver.org" },
                { url: "stun:stun.softjoys.com" },
                { url: "stun:stun.voiparound.com" },
                { url: "stun:stun.voipbuster.com" },
                { url: "stun:stun.voipstunt.com" },
                { url: "stun:stun.voxgratia.org" },
                { url: "stun:stun.xten.com" },
                {
                  url: "turn:numb.viagenie.ca",
                  credential: "muazkh",
                  username: "webrtc@live.com",
                },
                {
                  url: "turn:192.158.29.39:3478?transport=udp",
                  credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
                  username: "28224511:1379330808",
                },
                {
                  url: "turn:192.158.29.39:3478?transport=tcp",
                  credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
                  username: "28224511:1379330808",
                },
              ],
            },
            stream: stream,
          });

          myPeer.current = peer;

          peer.on("signal", (data) => {
            socketRef.current.emit("callUser", {
              userToCall: id,
              signalData: data,
              from: yourID,
            });
          });

          peer.on("stream", (stream) => {
            if (partnerVideo.current) {
              partnerVideo.current.srcObject = stream;
            }
          });

          peer.on("error", (err) => {
            endCall();
          });

          socketRef.current.on("callAccepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
          });

          socketRef.current.on("close", () => {
            window.location.reload();
          });

          socketRef.current.on("rejected", () => {
            window.location.reload();
          });
        })
        .catch(() => {
          setModalMessage(
            "You cannot place/ receive a call without granting video and audio permissions! Please change your settings to use Cuckoo."
          );
          setModalVisible(true);
        });
    } else {
      setModalMessage(
        "We think the username entered is wrong. Please check again and retry!"
      );
      setModalVisible(true);
      return;
    }
  }

  function showCopiedMessage() {
    navigator.clipboard.writeText(yourID);
    setCopied(true);
    setInterval(() => {
      setCopied(false);
    }, 1000);
  }

  function acceptCall() {
    // ringtoneSound.unload();
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        setCallAccepted(true);
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: stream,
        });

        myPeer.current = peer;

        peer.on("signal", (data) => {
          socketRef.current.emit("acceptCall", { signal: data, to: caller });
        });

        peer.on("stream", (stream) => {
          partnerVideo.current.srcObject = stream;
        });

        peer.on("error", (err) => {
          endCall();
        });

        peer.signal(callerSignal);

        socketRef.current.on("close", () => {
          window.location.reload();
        });
      })
      .catch(() => {
        setModalMessage(
          "You cannot place/ receive a call without granting video and audio permissions! Please change your settings to use Cuckoo."
        );
        setModalVisible(true);
      });
  }

  function rejectCall() {
    // ringtoneSound.unload();
    setCallRejected(true);
    socketRef.current.emit("rejected", { to: caller });
    window.location.reload();
  }
  function endCall() {
    myPeer.current.destroy();
    socketRef.current.emit("close", { to: caller });
    window.location.reload();
  }
  function shareScreen() {
    navigator.mediaDevices
      .getDisplayMedia({ cursor: true })
      .then((screenStream) => {
        myPeer.current.replaceTrack(
          stream.getVideoTracks()[0],
          screenStream.getVideoTracks()[0],
          stream
        );
        userVideo.current.srcObject = screenStream;
        screenStream.getTracks()[0].onended = () => {
          myPeer.current.replaceTrack(
            screenStream.getVideoTracks()[0],
            stream.getVideoTracks()[0],
            stream
          );
          userVideo.current.srcObject = stream;
        };
      });
  }

  function toggleMuteAudio() {
    if (stream) {
      setAudioMuted(!audioMuted);
      stream.getAudioTracks()[0].enabled = audioMuted;
    }
  }

  function toggleMuteVideo() {
    if (stream) {
      setVideoMuted(!videoMuted);
      stream.getVideoTracks()[0].enabled = videoMuted;
    }
  }

  function renderLanding() {
    if (!callRejected && !callAccepted && !callingFriend) return "block";
    return "none";
  }

  function renderCall() {
    if (!callRejected && !callAccepted && !callingFriend) return "none";
    return "block";
  }

  // function showCopiedMessage(){
  //   navigator.clipboard.writeText(yourID)
  //   setCopied(true)
  //   setInterval(()=>{
  //     setCopied(false)
  //   },1000)
  // }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <video className="userVideo" playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted && isfullscreen) {
    PartnerVideo = (
      <video
        className="partnerVideo cover"
        playsInline
        ref={partnerVideo}
        autoPlay
      />
    );
  } else if (callAccepted && !isfullscreen) {
    PartnerVideo = (
      <video className="partnerVideo" playsInline ref={partnerVideo} autoPlay />
    );
  }
  let incomingCall;
  if (receivingCall && !callAccepted && !callRejected) {
    incomingCall = (
      <div className="incomingCallContainer">
        <div className="incomingCall flex flex-column">
          <div>
            <span className="callerID">{caller}</span> is calling you!
          </div>
          <div className="incomingCallButtons flex">
            <button
              name="accept"
              className="alertButtonPrimary"
              onClick={() => acceptCall()}
            >
              Accept
            </button>
            <button
              name="reject"
              className="alertButtonSecondary"
              onClick={() => rejectCall()}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    );
  }

  let audioControl;
  if (audioMuted) {
    audioControl = (
      <span className="iconContainer" onClick={() => toggleMuteAudio()}>
        <AudioMutedOutlined style={{ color: "red", fontSize: "1.5rem" }} />
      </span>
    );
  } else {
    audioControl = (
      <span className="iconContainer" onClick={() => toggleMuteAudio()}>
        <AudioOutlined style={{ color: "green", fontSize: "1.5rem" }} />
      </span>
    );
  }

  let videoControl;
  if (videoMuted) {
    videoControl = (
      <span className="iconContainer" onClick={() => toggleMuteVideo()}>
        <VideoCameraAddOutlined style={{ color: "red", fontSize: "1.5rem" }} />
      </span>
    );
  } else {
    videoControl = (
      <span className="iconContainer" onClick={() => toggleMuteVideo()}>
        <VideoCameraOutlined style={{ color: "green", fontSize: "1.5rem" }} />
      </span>
    );
  }

  let screenShare = (
    <span className="iconContainer" onClick={() => shareScreen()}>
      <DesktopOutlined style={{ fontSize: "1.5rem" }} />
    </span>
  );

  let hangUp = (
    <span className="iconContainer" onClick={() => endCall()}>
      <PhoneOutlined style={{ color: "red", fontSize: "1.5rem" }} />
    </span>
  );

  let fullscreenButton;
  if (isfullscreen) {
    fullscreenButton = (
      <span
        className="iconContainer"
        onClick={() => {
          setFullscreen(false);
        }}
      >
        <CompressOutlined style={{ color: "green", fontSize: "1.5rem" }} />
      </span>
    );
  } else {
    fullscreenButton = (
      <span
        className="iconContainer"
        onClick={() => {
          setFullscreen(true);
        }}
      >
        <ExpandOutlined style={{ color: "red", fontSize: "1.5rem" }} />
      </span>
    );
  }
  return (
    <React.Fragment>
      {" "}
      <div style={{ display: renderLanding() }}>
        {landingHTML}{" "}
        <Rodal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          width={20}
          height={5}
          measure={"em"}
          closeOnEsc={true}
        >
          <div>{modalMessage}</div>
        </Rodal>
        {incomingCall}
      </div>
      <div className="callContainer" style={{ display: renderCall() }}>
        <div className="partnerVideoContainer">{PartnerVideo}</div>
        <div className="userVideoContainer">{UserVideo}</div>
        <div className="controlsContainer flex">
          {audioControl}
          {videoControl}
          {screenShare}
          {fullscreenButton}
          {hangUp}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Room;
