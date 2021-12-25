import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css'
import { SocketContext } from "../context/socket";
import Challengers from "./Challengers";
import Chessboard from "chessboardjsx";
import OnlineUsers from "./OnlineUsers";
import GameSettings from "./GameSettings";
import Navbar from "./Navbar";

function Home() {
  const nav = useNavigate();
  const socket = useContext(SocketContext);
  const [name, setName] = useState("");
  
  const [times, setTimes] = useState("");
  const [challengers, setChallengers] = useState([]);
  const { seconds, minutes, hours, incre, renderGameSettings } = GameSettings();
  //https://floating-everglades-75335.herokuapp.com/  

  useEffect(() => {
    if (name) {
      socket.emit("nickname", name);
    }
  }, [name, socket]);

  useEffect(() => {
    socket.on("challenge", (data) => {
      setChallengers((old) => [...old, data.name]);
      setTimes((old) => [...old, data.time]);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("friendGame", (data) => {
      data.room && nav("/Game/" + data.time + data.room);
    });
  }, [socket, nav]);

  useEffect(() => {
    return () => {};
  }, []);
  return {
    name,
    render: (
      <div className="home">
        <Navbar name={name} setName={setName} />
        <div className="content">
          <Challengers
            times={times}
            challengers={challengers}
            setChallengers={setChallengers}
          />
          <div className="homeBoard">
            <Chessboard width={600} position="start" />
          </div>
          <OnlineUsers name={name} time={`${hours}@${minutes}@${seconds}@${incre}@`} />
          {renderGameSettings}
        </div>
      </div>
    ),
  };
}

export default Home;
