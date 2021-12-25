import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Navbar.css";
import defaultAvatar from "../assets/chess default avatar.jpg";
import logo from "../assets/logo.png";
import err from "../assets/close.png";
import axios from "axios";

const Navbar = ({name, setName}) => {
  const ENDPOINT = "http://localhost:4000/";
  const [effect, setEffect] = useState("");
  const [username, setUsrname] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef();
  const [searchParams] = useSearchParams();
  const p = searchParams.get("p");
  const nav = useNavigate();

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
  );
};

export default Navbar;
