import React, { useState, useEffect, useContext, useRef } from "react";
import "./Board.css";
import { useParams, useNavigate } from "react-router-dom";
import Chessboard from "chessboardjsx";
import * as Chess from "chess.js";
import defaultAvatar from "../assets/chess default avatar.jpg";
import Result from "./Result";
import { SocketContext } from "../context/socket";
import MyTimer from "./MyTimer";

const chess = new Chess();
function Board(props) {
  const socket = useContext(SocketContext);
  const nav = useNavigate();
  const { param } = useParams();
  const [position, setPosition] = useState("start");
  const [newTime, setNewTime] = useState(0);
  const [result, setResult] = useState("");
  const [reason, setReason] = useState("");
  const [orientation, setOrientation] = useState("white");
  const [opDraw, setOpDraw] = useState(false);
  const [candrag, setCandrag] = useState(false);
  const [timeover, setTimeover] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [opponantName, setOpponantName] = useState("Waiting For Opponant...");
  const mytimer = useRef();
  const optimer = useRef();
  var config1;
  config1 = param.split("@");
  var hour = parseInt(config1[0]);
  var min = parseInt(config1[1]);
  var sec = parseInt(config1[2]);
  var incr = parseInt(config1[3]);
  var time = hour * 3600 + min * 60 + sec;
  var room = config1[4];

  useEffect(() => {
    chess.load("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    setResult("");
    setReason("");
    setGameOver(false);
  }, []);
  useEffect(() => {
    socket.emit("opname", { name: props.name, room });
    return () => {};
  });

  useEffect(() => {
    socket.emit("room", room);
  }, [socket, room]);
  useEffect(() => {
    socket.on("getopname", (name) => {
      setOpponantName(name);
    });
    socket.on("start", (data) => {
      if (data !== undefined) {
        setCandrag(true);
      }
    });
    socket.on("turn", (data) => {
      setOrientation("black");
    });
    socket.on("newTimer", (data) => {
      setNewTime(data);
      optimer.current !== undefined &&
        optimer.current !== null &&
        optimer.current.newSet();
    });
  }, [socket]);

  const draw = () => {
    socket.emit("draw_offer", room);
  };
  useEffect(() => {
    socket.on("OpDraw", () => {
      setOpDraw(true);
    });
  }, [socket]);
  useEffect(() => {
    socket.on("OpAccepteOffer", () => {
      setOpDraw(false);
      setResult("Draw!!!");
      setReason("by Draw Offer");
      setGameOver(true);
      mytimer.current !== undefined &&
        mytimer.current !== null &&
        mytimer.current.pause();
      optimer.current !== undefined &&
        optimer.current !== null &&
        optimer.current.pause();
    });
  }, [socket, room]);
  const resign = () => {
    socket.emit("resign", room);
  };

  const onDrop = ({ sourceSquare, targetSquare }) => {
    if (chess.turn() === orientation.charAt(0) && candrag) {
      var preFen = chess.fen();
      chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      setPosition(chess.fen());
      if (chess.fen() !== preFen) {
        mytimer.current !== undefined &&
          mytimer.current !== null &&
          mytimer.current.pause();
        optimer.current !== undefined &&
          optimer.current !== null &&
          optimer.current !== null &&
          optimer.current.resume();
        socket.emit("move", [sourceSquare, targetSquare, room]);
        mytimer.current !== undefined &&
          mytimer.current !== null &&
          mytimer.current.incr();
        socket.emit("timerSet", { room, time: mytimer.current.set() });
      }
    }
  };

  useEffect(() => {
    socket.on("receive-move", (move) => {
      mytimer.current !== undefined &&
        mytimer.current !== null &&
        mytimer.current.resume();
      optimer.current !== undefined &&
        optimer.current !== null &&
        optimer.current.pause();
      let sourceSquare = move[0];
      let targetSquare = move[1];
      chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      setPosition(chess.fen());
    });
  }, [socket]);
  useEffect(() => {
    if (timeover === true) {
      socket.emit("timeout", room);
      orientation === "black" ? setResult("White Win") : setResult("Black Win");
      setReason("by Timeout");
      setGameOver(true);
      mytimer.current !== undefined &&
        mytimer.current !== null &&
        mytimer.current.pause();
      optimer.current !== undefined &&
        optimer.current !== null &&
        optimer.current.pause();
    }
    socket.on("optimeout", () => {
      orientation === "black" ? setResult("Black Win") : setResult("White Win");
      setReason("by Timeout");
      setGameOver(true);
      mytimer.current !== undefined &&
        mytimer.current !== null &&
        mytimer.current.pause();
      optimer.current !== undefined &&
        optimer.current !== null &&
        optimer.current.pause();
    });
  }, [timeover, socket, result, reason, gameOver, orientation, room]);

  useEffect(() => {
    socket.on("OpResign", () => {
      orientation === "black" ? setResult("Black Win") : setResult("White Win");
      setReason("by resignation");
      setGameOver(true);
      mytimer.current !== undefined &&
        mytimer.current !== null &&
        mytimer.current.pause();
      optimer.current !== undefined &&
        optimer.current !== null &&
        optimer.current.pause();
    });
  }, [socket, orientation]);

  useEffect(() => {
    if (chess.game_over()) {
      if (chess.in_checkmate()) {
        setTimeout(() => {
          chess.turn() === "w"
            ? setResult("Black Win")
            : setResult("White Win");
          setReason("by checkmate");
          setGameOver(true);
          mytimer.current !== undefined &&
            mytimer.current !== null &&
            mytimer.current.pause();
          optimer.current !== undefined &&
            optimer.current !== null &&
            optimer.current.pause();
        }, 100);
      }
      if (chess.in_threefold_repetition()) {
        setTimeout(() => {
          setResult("Draw!!!");
          setReason("by repetition");
          setGameOver(true);
          mytimer.current !== undefined &&
            mytimer.current !== null &&
            mytimer.current.pause();
          optimer.current !== undefined &&
            optimer.current !== null &&
            optimer.current.pause();
        }, 100);
      }
      if (chess.in_stalemate()) {
        setTimeout(() => {
          setResult("Draw!!!");
          setReason("by stalemate");
          setGameOver(true);
          mytimer.current !== undefined &&
            mytimer.current !== null &&
            mytimer.current.pause();
          optimer.current !== undefined &&
            optimer.current !== null &&
            optimer.current.pause();
        }, 100);
      }
      if (chess.insufficient_material()) {
        setTimeout(() => {
          setResult("Draw!!!");
          setReason("by insufficient material");
          setGameOver(true);
          mytimer.current !== undefined &&
            mytimer.current !== null &&
            mytimer.current.pause();
          optimer.current !== undefined &&
            optimer.current !== null &&
            optimer.current.pause();
        }, 100);
      }
    }
  });
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <div className="container">
      {opDraw && (
        <div className="draw_offer">
          <p style={{ color: "white" }}>Draw Offer</p>
          <button
            onClick={() => {
              socket.emit("offer_accepted", room);
              setResult("Draw!!!");
              setReason("by Draw Offer");
              setGameOver(true);
              mytimer.current !== undefined &&
                mytimer.current !== null &&
                mytimer.current.pause();
              optimer.current !== undefined &&
                optimer.current !== null &&
                optimer.current.pause();
            }}
          >
            accept
          </button>
          <button
            onClick={() => {
              setOpDraw(false);
            }}
          >
            refuse
          </button>
        </div>
      )}
      <button
        className="gameback"
        onClick={() => {
          !gameOver && resign();
          nav("/");
        }}
      >
        back
      </button>
      <div className="board-container">
        <div className="player">
          <div className="playerInfo">
            <img src={defaultAvatar} alt="" />
            <p>{opponantName}</p>
          </div>
          <MyTimer
            expiryTimestamp={new Date().setSeconds(
              new Date().getSeconds() + time
            )}
            incr={incr}
            newTime={newTime}
            id="optimer"
            ref={optimer}
          />
        </div>
        <Chessboard
          id={room}
          width={600}
          position={position}
          onDrop={onDrop}
          orientation={orientation}
        />
        <div className="player">
          <div className="playerInfo">
            <img src={defaultAvatar} alt="" />
            <p>{props.name}</p>
            <button onClick={draw} className="draw">
              draw
            </button>
            <button
              onClick={() => {
                resign();
                orientation === "black"
                  ? setResult("Black Win")
                  : setResult("White Win");
                setReason("by resignation");
                setGameOver(true);
                mytimer.current !== undefined &&
                  mytimer.current !== null &&
                  mytimer.current !== null &&
                  mytimer.current.pause();
                optimer.current !== undefined &&
                  optimer.current !== null &&
                  optimer.current.pause();
              }}
              className="draw"
            >
              resign
            </button>
          </div>
          <MyTimer
            expiryTimestamp={new Date().setSeconds(
              new Date().getSeconds() + time
            )}
            incr={incr}
            setTimeover={setTimeover}
            id="mytimer"
            ref={mytimer}
          />
        </div>
      </div>
      {gameOver && <Result result={result} reason={reason} />}
    </div>
  );
}

export default Board;
