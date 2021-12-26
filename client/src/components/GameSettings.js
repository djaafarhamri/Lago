import { useState } from "react";
import ComputerSettings from "./ComputerSettinngs";
import "./GameSettings.css";

const GameSettings = () => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(10);
  const [hours, setHours] = useState(0);
  const [incre, setIncre] = useState(0);
  const [level, setLevel] = useState(0);

  return {
    seconds,
    minutes,
    hours,
    incre,
    level,
    renderGameSettings: (
      <div className="GameSettings">
        <h2>Game Settings</h2>
        <h3>Time Control</h3>
        <div className="TimeControl">
          <div className="GameSettingsInput">
            <input
              onChange={(e) => {
                setHours(e.target.value);
              }}
              type="number"
              min={0}
              placeholder="hou"
              value={hours}
            />
            <p>hour</p>
          </div>
          <div className="GameSettingsInput">
            <input
              onChange={(e) => {
                setMinutes(e.target.value);
              }}
              type="number"
              min={0}
              placeholder="min"
              value={minutes}
            />
            <p>min</p>
          </div>
          <div className="GameSettingsInput">
            <input
              onChange={(e) => {
                setSeconds(e.target.value);
              }}
              type="number"
              min={0}
              placeholder="sec"
              value={seconds}
            />
            <p>sec</p>
          </div>
          <div className="GameSettingsInput">
            <input
              onChange={(e) => {
                setIncre(e.target.value);
              }}
              type="number"
              min={0}
              placeholder="inc"
              value={incre}
            />
            <p>incr</p>
          </div>
        </div>
        <ComputerSettings level={level} setLevel={setLevel} />
      </div>
    ),
  };
};

export default GameSettings;
