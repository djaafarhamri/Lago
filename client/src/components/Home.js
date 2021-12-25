import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { SocketContext } from "../context/socket";
import defaultAvatar from "../assets/chess default avatar.jpg";
import logo from "../assets/logo.png";
import err from "../assets/close.png";
import Challengers from "./Challengers";
import Play from "./Play";
import Chessboard from "chessboardjsx";
import Computer from "./Computer";
import OnlineUsers from "./OnlineUsers";
import GameSettings from "./GameSettings";

function Home() {
  const nav = useNavigate();
  const socket = useContext(SocketContext);
  const [name, setName] = useState("");
  const [effect, setEffect] = useState("");
  const [username, setUsrname] = useState("");
  const [password, setPassword] = useState("");
  const [times, setTimes] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [challengers, setChallengers] = useState([]);
  const { newGame, setNewGame, renderPlay } = Play(name);
  const { newComputerGame, setNewComputerGame, renderComputer } = Computer();
  const { seconds, minutes, hours, incre, renderGameSettings } = GameSettings();
  //https://floating-everglades-75335.herokuapp.com/
  const ENDPOINT = "http://localhost:4000/";
  const inputRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const p = searchParams.get("p");
  useEffect(() => {
    if (p === "register") {
      setShowInput(true);
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [p]);

  useEffect(() => {
    if (name) {
      socket.emit("nickname", name);
    }
  }, [name, socket, setSearchParams]);

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
  }, [socket, nav, setNewGame]);

  const login = async () => {
    await axios
      .post(
        ENDPOINT + "login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => setEffect())
      .catch((e) => {
        console.log(e);
        setLoginError(true);
      });
  };

  const logout = async () => {
    await axios
      .get(ENDPOINT + "logout", {
        withCredentials: true,
      })
      .then((res) => nav(0))
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    axios
      .get(ENDPOINT + "game", {
        withCredentials: true,
      })
      .then((res) => {
        res.data.user && setName(res.data.user.username);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [effect]);
  useEffect(() => {
    return () => {};
  }, []);
  return {
    name,
    render: (
      <div className="home">
        <div className="nav">
          <div className="logo">
            <img src={logo} alt="" />
            <h2>Lago Chess</h2>
          </div>
          {!name ? (
            <div className="login">
              <button
                onClick={() => {
                  nav("/register");
                }}
              >
                Register
              </button>
              <button
                onClick={() => {
                  if (showInput === false) {
                    setShowInput(true);
                  } else if (showInput === true) {
                    login();
                  }
                }}
              >
                Login
              </button>
              {showInput && (
                <>
                  <input
                    type="text"
                    placeholder="username"
                    required
                    ref={inputRef}
                    onChange={(e) => {
                      setUsrname(e.target.value);
                      setLoginError(false);
                    }}
                  />
                  <input
                    type="password"
                    placeholder="password"
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError(false);
                    }}
                  />
                </>
              )}
            </div>
          ) : (
            <div className="logininfo">
              <button onClick={logout}>Logout</button>
              <p>{name}</p>
              <img src={defaultAvatar} alt="" />
            </div>
          )}
        </div>
        <div className="content">
          {loginError && (
            <div className="login_error">
              <img src={err} alt="" />
              <h5>username or password incorrect</h5>
            </div>
          )}
          <Challengers
            times={times}
            challengers={challengers}
            setChallengers={setChallengers}
          />
          <div className="homeBoard">
            <Chessboard id="homeBoard" width={600} position="start" />
          </div>
          <OnlineUsers name={name} time={`${hours}@${minutes}@${seconds}@${incre}@`} />
          {renderGameSettings}
        </div>
      </div>
    ),
  };
}

export default Home;
