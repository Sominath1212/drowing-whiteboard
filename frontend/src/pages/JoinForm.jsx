import React, { useState } from "react";
import toast from "react-hot-toast"; // Assuming toast is installed for notifications
import { useNavigate } from "react-router-dom";
function JoinRoom({ socket, setUserData }) {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState(""); // Initialize with an empty string
  const [name, setName] = useState("");
  // const [userId, setUserId] = useState("");
  const generateRandomString = (length = 8) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roomData = {
      name,
      roomId,
      userId: generateRandomString(8),
      host: false,
      attendies: true,
    };
    setUserData(roomData);
    console.log(roomData);

    socket.emit("userJoined", roomData);
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="shadow-2xl rounded flex-col  justify-center border-gray-400 border w-[50%] p-10 flex items-center relative">
      <h1 className="text-3xl font-bold p-3">join Room</h1>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center w-[100%] h-auto shadow-2xl p-10 rounded-2xl flex-col gap-10"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Enter your name"
          className="border mx-4 rounded-2xl w-full outline-none p-4"
        />
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
          placeholder="Enter Room ID"
          className="border mx-4 rounded-2xl w-full outline-none p-4"
        />

        {/* Button to create the room (submits the form) */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-orange-400 hover:bg-orange-500 text-white w-full rounded-2xl border px-10 text-center py-2.5 transition duration-300 ease-in-out shadow-md"
        >
          Join Room
        </button>
      </form>
    </div>
  );
}

export default JoinRoom;
