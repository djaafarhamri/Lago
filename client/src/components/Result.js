import React from "react";
import './Result.css'
import { useNavigate } from "react-router";

export default function Result(props) {
  const nav = useNavigate();
  return (
    <div className={"result"+props.id}>
      <h2>{props.result}</h2>
      <p>{props.reason}</p>
      <button
        onClick={() => {
          nav("/");
        }}
      >
        home
      </button>
    </div>
  );
}
