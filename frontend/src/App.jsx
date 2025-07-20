import React, { useEffect, useState } from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import CreateRoomForm from "./pages/CreateRoomForm";
import JoinRoom from "./pages/JoinForm";
import Room from "./pages/Room";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
const server = "http://localhost:5000";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};
const socket = io(server, connectionOptions);
function App() {
  const [userData, setUserData] = useState({});
  const [users, setUsers] = useState([]);
  return (
    <div>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              socket={socket}
              setUserData={setUserData}
              setUsers={setUsers}
            />
          }
        />
        <Route
          path="/create-room"
          element={<CreateRoomForm setUserData={setUserData} />}
        />
        <Route
          path="/join-room"
          element={<JoinRoom setUserData={setUserData} />}
        />
        <Route
          path="/room/:id"
          element={<Room socket={socket} userData={userData} users={users} />}
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
