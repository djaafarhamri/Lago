import socketio from "socket.io-client";
import React from "react";
//https://floating-everglades-75335.herokuapp.com/
const ENDPOINT = "https://floating-everglades-75335.herokuapp.com/";
export const socket = socketio(ENDPOINT);
export const SocketContext = React.createContext();
