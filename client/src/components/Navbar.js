import { SocketContext } from "../context/socket";
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Navbar.css";
import defaultAvatar from "../assets/chess default avatar.jpg";
import logo from "../assets/logo.png";
import err from "../assets/close.png";
import Challengers from "./Challengers";
import axios from "axios";
import notificationImg from "../assets/notification.png";

const Navbar = ({ name, setName }) => {
  const ENDPOINT = "https://floating-everglades-75335.herokuapp.com/";
  const socket = useContext(SocketContext);
  const [effect, setEffect] = useState("");
  const [username, setUsrname] = useState("");
  const [challengers, setChallengers] = useState([]);
  const [showChallengers, setShowChallengers] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [times, setTimes] = useState("");
  const [notCount, setNotCount] = useState(0);
  const inputRef = useRef();
  const [searchParams] = useSearchParams();
  const p = searchParams.get("p");
  const nav = useNavigate();

  
  useEffect(() => {
    socket.on("challenge", (data) => {
      setChallengers((old) => [...old, data.name]);
      setTimes((old) => [...old, data.time]);
    });
  }, [socket]);
  useEffect(() => {
    setNotCount(challengers.length)
  }, [challengers])


  useEffect(() => {
    if (p === "register") {
      setShowInput(true);
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [p]);

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
  }, [effect, setName]);

  return (
    <div className="nav">
      {loginError && (
        <div className="login_error">
          <img src={err} alt="" />
          <h5>username or password incorrect</h5>
        </div>
      )}
      <div className="logo">
        <img className="logoImg" src={logo} alt="" />
        <h2>Lago Chess</h2>
        {name && (
          <div className="not">
            <img
              className="notimg"
              src={notificationImg}
              alt=""
              onClick={() => {
                setShowChallengers(prev => !prev);
              }}
            />
            {notCount !== 0 && <div className="notCount">{notCount}</div>}
            {showChallengers && (
            <Challengers
              times={times}
              challengers={challengers}
              setChallengers={setChallengers}
            />
          )}
          </div>
        )}
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
  );
};

export default Navbar;
