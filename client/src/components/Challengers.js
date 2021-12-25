import React, { useContext, useEffect } from "react";
import './Challengers.css'
import { Link } from "react-router-dom";
import { SocketContext } from "../context/socket";

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
            style={{ top: (cid + 1) * 85 + "px" }}
            className="challenger"
            key={cid}
          >
            <p style={{ color: "white" }}>challenge from {challenger}</p>
            <Link to={"/Game/" + times[cid] + room}>
              <button
                onClick={() => {
                  accept(challenger, cid);
                }}
              >
                accept
              </button>
            </Link>
            <button
              onClick={() => {
                refuse(challenger);
              }}
            >
              refuse
            </button>
          </div>
        ))}
    </div>
  );
}
