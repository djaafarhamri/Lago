import React from "react";
import './Computer.css'
import { Link } from "react-router-dom";
import computer from "../assets/computer.png";

export default function Computer() {
  return (
    <>
      <div className="title">
        <h2>Play the Computer</h2>
      </div>
      <div className="friend computer">
        <img src={computer} alt="" />
        <h2>Computer</h2>
        <Link to="/computer">
          <button>Play</button>
        </Link>
      </div>
    </>
  );
}
