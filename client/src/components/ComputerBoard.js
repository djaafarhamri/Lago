import React, { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";
import { useParams } from "react-router";
import * as Chess from "chess.js";
import { Game, getFen } from "js-chess-engine";
import Result from "./Result";

const chess = new Chess();
var game = new Game();
export default function ComputerBoard() {
  const { config } = useParams();
  var conArr = config.split("p");
  const orientation = conArr[0];
  const level = conArr[1];
  const [draggable, setDraggable] = useState(false);
  const [canDrag, setCanDrag] = useState(false);
  const [position, setPosition] = useState("start");
  const [result, setResult] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [reason, setReason] = useState("");
  useEffect(() => {
    chess.load("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    game = new Game();
  }, []);
  const onDrop = ({ sourceSquare, targetSquare }) => {
    var prefen = chess.fen();
    chess.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (chess.fen() !== prefen) {
      game.move(sourceSquare, targetSquare);
      setPosition(chess.fen());
    }
  };

  useEffect(() => {
    if (canDrag) {
      if (chess.turn() !== orientation.charAt(0)) {
        setDraggable(false);
      } else {
        setDraggable(true);
      }
    }
  }, [position, draggable, orientation, canDrag]);
  useEffect(() => {
    if (
      position !== "start" &&
      chess.turn() !== orientation.charAt(0) &&
      !chess.game_over()
    ) {
      setTimeout(() => {
        game.aiMove(parseInt(level));
        var con = game.exportJson();
        chess.load(getFen(con));
        setPosition(chess.fen());
      }, 10);
    }
  }, [position, level, orientation]);
  if (chess.game_over()) {
    if (chess.in_checkmate()) {
      setTimeout(() => {
        chess.turn() === "w" ? setResult("Black Win") : setResult("White Win");
        setReason("by checkmate");
        setGameOver(true);
      }, 100);
    }
    if (chess.in_threefold_repetition()) {
      setTimeout(() => {
        setResult("Draw!!!");
        setReason("by repetition");
        setGameOver(true);
      }, 100);
    }
    if (chess.in_stalemate()) {
      setTimeout(() => {
        setResult("Draw!!!");
        setReason("by stalemate");
        setGameOver(true);
      }, 100);
    }
    if (chess.insufficient_material()) {
      setTimeout(() => {
        setResult("Draw!!!");
        setReason("by insufficient material");
        setGameOver(true);
      }, 100);
    }
  }
  const restart = () => {
    setCanDrag(true);
    chess.load("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    game = new Game();
    setPosition(chess.fen());
    setGameOver(false);
  };

  return (
    <div className="computer_board">
      {gameOver && <Result result={result} reason={reason} />}
      <Chessboard
        width={600}
        position={position}
        onDrop={onDrop}
        orientation={orientation}
        draggable={draggable}
      />
      <div className="config">
        <h2>Game Config</h2>
        <button className="btn" onClick={restart}>
          start
        </button>
        <button className="btn" onClick={restart}>
          Restart
        </button>
      </div>
    </div>
  );
}
