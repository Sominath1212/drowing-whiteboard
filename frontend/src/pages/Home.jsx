import React, { useEffect, useState } from "react";
import CreateRoomForm from "./CreateRoomForm";
import JoinForm from "./JoinForm";
import toast from "react-hot-toast";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import JoinRoom from "./JoinForm";

function Home({ socket, setUserData, setUsers }) {
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      // setUserData(data);
      if (data.success) {
        console.log("joined");
        console.log(data);
        setUsers(data.users);
        setUserData(data);
        toast.success("joined");
        navigate(`/room/${data?.roomId}`);
      } else {
        console.log("unable to join");
        toast.error("unable to join");
      }
    });
  }, []);
  return (
    <main className="w-[100%] mt-10 flex items-center self-center justify-center h-[90vh] px-10 gap-30 ">
      <CreateRoomForm socket={socket} setUserData={setUserData} />
      <JoinRoom socket={socket} setUserData={setUserData} />
    </main>
  );
}

export default Home;
