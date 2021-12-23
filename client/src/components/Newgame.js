import React, { useState, useEffect } from "react";
import OnlineUsers from "./OnlineUsers";
import close from "../assets/cancel.png";

function Newgame({ name, setNewGame }) {
  const [timeControl, setTimeControl] = useState(0);
  const [isActiveButton, setIsActiveButton] = useState([
    { id: 0, isActive: true },
    { id: 1, isActive: false },
    { id: 2, isActive: false },
    { id: 3, isActive: false },
    { id: 4, isActive: false },
    { id: 5, isActive: false },
    { id: 6, isActive: false },
    { id: 7, isActive: false },
    { id: 8, isActive: false },
  ]);
  const handle = (id) => {
    const newState = isActiveButton.map((item) => {
      return {
        ...item,
        isActive: item.id === id,
      };
    });
    setIsActiveButton(newState);
    setTimeControl(id);
  };
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <div className="newgame">
      <button
        className="buttonback"
        onClick={() => {
          setNewGame(false);
        }}
      >
        <img src={close} alt="" />
      </button>
      <div className="timeControl">
        <button
          style={
            isActiveButton[0].isActive
              ? { background: "#7a3ffb", color: "white" }
              : { background: "white" }
          }
          onClick={() => {
            handle(0);
          }}
        >
          1 min
        </button>
        <button
          style={
            isActiveButton[1].isActive
              ? { background: "#7a3ffb", color: "white" }
              : { background: "white" }
          }
          onClick={() => {
            handle(1);
          }}
        >
          1 | 1
        </button>
        <button
          style={
            isActiveButton[2].isActive
              ? { background: "#7a3ffb", color: "white" }
              : { background: "white" }
          }
          onClick={() => {
            handle(2);
          }}
        >
          2 min
        </button>
        <button
          style={
            isActiveButton[3].isActive
              ? { background: "#7a3ffb", color: "white" }
              : { background: "white" }
          }
          onClick={() => {
            handle(3);
          }}
        >
          3 min
        </button>
        <button
          style={
            isActiveButton[4].isActive
              ? { background: "#7a3ffb", color: "white" }
              : { background: "white" }
          }
          onClick={() => {
            handle(4);
          }}
        >
          3 | 2
        </button>
        <button
          style={
            isActiveButton[5].isActive
              ? { background: "#7a3ffb", color: "white" }
              : { background: "white" }
          }
          onClick={() => {
            handle(5);
          }}
        >
          5 min
        </button>
        <button
          style={
            isActiveButton[6].isActive
              ? { background: "#7a3ffb", color: "white" }
              : { background: "white" }
          }
          onClick={() => {
            handle(6);
          }}
        >
          10 min
        </button>
        <button
          style={
            isActiveButton[7].isActive
              ? { background: "#7a3ffb", color: "white" }
              : { background: "white" }
          }
          onClick={() => {
            handle(7);
          }}
        >
          30 min
        </button>
        <button
          style={
            isActiveButton[8].isActive
              ? { background: "#7a3ffb", color: "white" }
              : { background: "white" }
          }
          onClick={() => {
            handle(8);
          }}
        >
          60 min
        </button>
      </div>
      <div className="online_users">
        <h2>Online users</h2>
        <OnlineUsers name={name} time={timeControl} />
      </div>
    </div>
  );
}

export default Newgame;
