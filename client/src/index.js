import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { SocketContext } from "./context/socket";
import { socket } from "./context/socket";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <React.Fragment>
    <Router>
      <SocketContext.Provider value={socket}>
        <App />
      </SocketContext.Provider>
    </Router>
  </React.Fragment>,
  document.getElementById("root")
);
