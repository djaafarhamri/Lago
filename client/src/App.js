import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Board from "./components/Board";
import Register from "./components/register";
import ComputerBoard from "./components/ComputerBoard";
function App() {
  const { name, render } = Home();
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={render} />
        <Route exact path="/computer" element={<ComputerBoard />} />
        <Route exact path="/register" element={<Register />} />
        <Route path="/Game/:param" element={<Board name={name} />} />
      </Routes>
    </div>
  );
}

export default App;
