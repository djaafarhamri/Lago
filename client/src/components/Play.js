import React, { useState } from "react";
import profile from "../assets/chess default avatar.jpg";

export default function Play(name) {
  const [newGame, setNewGame] = useState(false);
  return {
    newGame,
    setNewGame,
    renderPlay: (
      <div className="play">
        <h1>Play</h1>
        <div className="profile">
          <img src={profile} alt="" />
          <p>{name}</p>
        </div>
        <div className="start">
          <button
            onClick={() => {
              setNewGame(true);
            }}
          >
            Find an opponent
          </button>
        </div>
      </div>
    ),
  };
}
