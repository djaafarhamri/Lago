import socketio from "socket.io-client";
import React from "react";
const ENDPOINT = "https://lago-chess.herokuapp.com/"
export const socket = socketio(ENDPOINT);
export const SocketContext = React.createContext();
