import React, { useEffect, useState, useContext } from "react";
import { SocketContext } from "../context/socket";
import defAvatatar from "../assets/chess default avatar.jpg";
import Computer from "./Computer";

const OnlineUsers = ({ name, time }) => {
  const socket = useContext(SocketContext);
  const [friends, setFriends] = useState([]);
  const play = (friend) => {
    socket.emit("play", { name, friend, time });
  };
  useEffect(() => {
    socket.emit("get_users");
    return () => {};
  }, [socket]);

  useEffect(() => {
    socket.on("user_dis", () => {
      socket.emit("get_users");
    });
    return () => {};
  }, [socket]);

  useEffect(() => {
    socket.on("online_users", (data) => {
      var users = [];
      for (let i = 0; i < data.length; i++) {
        if (!users.includes(data[i].name)) {
          users.push(data[i].name);
        }
      }
      setFriends(users.filter((user) => user !== name));
    });
    return () => {};
  }, [socket, name]);

      
  return (
    <div className="online">
      <div className="title">
        <h2>Online Users</h2>
      </div>
      <div className="friends">
        {friends &&
          friends.map((friend, friendid) => (
            <div className="friend" key={friendid}>
              <img src={defAvatatar} alt="" />
              <h2>{friend}</h2>
              <button
                className={friend}
                onClick={() => {
                  play(friend);
                }}
              >
                Play
              </button>
            </div>
          ))}
      </div>
      <Computer />
    </div>
  );
};

export default OnlineUsers;
