import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import close from "../assets/cancel.png";
import { Slider } from "@reach/slider";
import "@reach/slider/styles.css";

export default function NewComputerGame({ setNewComputerGame }) {
  const [level, setLevel] = useState(0);
  const [orientation, setOrientation] = useState("white");

  useEffect(() => {
    return () => {};
  }, []);
  return (
    <div className="newgame">
      <button
        className="buttonback"
        onClick={() => {
          setNewComputerGame(false);
        }}
      >
        <img src={close} alt="" />
      </button>
      <div className="online_users">
        <h2>Game config</h2>
        <div className="slider">
          <p>computer level</p>
          <Slider
            min={0}
            max={4}
            step={1}
            onChange={(value) => {
              setLevel(value);
            }}
          />
          <p>{level}</p>
        </div>
        <div className="timecontrol">
          <button
            style={
              orientation === "white"
                ? { background: "#7a3ffb", color: "white" }
                : { background: "white", color: "black" }
            }
            className="btn"
            onClick={() => {
              setOrientation("white");
            }}
          >
            WHITE
          </button>
          <button
            style={
              orientation === "black"
                ? { background: "#7a3ffb", color: "white" }
                : { background: "white", color: "black" }
            }
            className="btn"
            onClick={() => {
              setOrientation("black");
            }}
          >
            BLACK
          </button>
        </div>
        <Link to={"/computer/" + orientation + "p" + level}>
          <button className="btn">Start</button>
        </Link>
      </div>
    </div>
  );
}
