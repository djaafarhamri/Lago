import { useState } from "react";
import "./GameSettings.css";

const GameSettings = () => {
  const [seconds, setSeconds] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [hours, setHours] = useState('0');
  const [incre, setIncre] = useState('0');
  return {
      seconds,
      minutes,
      hours, 
      incre,
      renderGameSettings:(
    <div className="GameSettings">
      <h2>Game Settings</h2>
      <h3>Time Control</h3>
      <div className="TimeControl">
        <input
          onChange={(e) => {
            setHours(e.target.value);
          }}
          type="text"
          placeholder="hou"
        />
        <input
          onChange={(e) => {
            setMinutes(e.target.value);
          }}
          type="text"
          placeholder="min"
        />
        <input
          onChange={(e) => {
            setSeconds(e.target.value);
          }}
          type="text"
          placeholder="sec"
        />
        <input
          onChange={(e) => {
            setIncre(e.target.value);
          }}
          type="text"
          placeholder="inc"
        />
      </div>
      <div>
        <button className="btn right">Save</button>
      </div>
    </div>
  )};
};

export default GameSettings;
