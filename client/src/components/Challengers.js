import React, { useContext, useEffect } from "react";
import "./Challengers.css";
import { Link } from "react-router-dom";
import { SocketContext } from "../context/socket";
import acceptImg from "../assets/accept.png";
import refuseImg from "../assets/refuse.png";

export default function Challengers({ times, challengers, setChallengers }) {
  const socket = useContext(SocketContext);
  var room =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const accept = (challenger, cid) => {
    socket.emit("accept", { challenger, room, time: times[cid] });
    setChallengers(challengers.filter((e) => e !== challenger));
  };
  const refuse = (challenger) => {
    setChallengers(challengers.filter((e) => e !== challenger));
  };
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <div className="challengers">
      {challengers &&
        challengers.map((challenger, cid) => (
          <div
            style={{ top: cid * 85 + "px" }}
            className="challenger"
            key={cid}
          >
            <p>challenge from {challenger}</p>
            <div className="response">
              <Link to={"/Game/" + times[cid] + room}>
                <button
                  onClick={() => {
                    accept(challenger, cid);
                  }}
                >
                  <img className="responseImg" src={acceptImg} alt="" />
                </button>
              </Link>
              <button
                onClick={() => {
                  refuse(challenger);
                }}
              >
                <img className="responseImg" src={refuseImg} alt="" />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
