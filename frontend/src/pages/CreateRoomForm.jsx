import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function CreateRoomForm({ socket, setUserData }) {
  // connection with socket.io

  //   const [user, setUser] = useState(null);
  //   const socket = io(server, connectionOptions);

  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  //   const navigate = useNavigate();

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

  const handleCreateRoom = (e) => {
    e.preventDefault();

    //roomdata
    const roomData = {
      name,
      roomId,
      userId,
      host: true,
      attendies: true,
    };
    setUserData(roomData);
    
    socket.emit("userJoined", roomData);
    // console.log(roomData);
  };
  const handleGenerate = () => {
    const rid = generateRandomString(10);
    setRoomId(rid);
    setUserId(generateRandomString(8));
    toast.success("Room ID generated!");
  };
  const handleCopy = () => {
    if (roomId) {
      const tempInput = document.createElement("textarea");
      tempInput.value = roomId;
      document.body.appendChild(tempInput);
      tempInput.select(); // Select the text
      document.execCommand("copy"); // Copy the selected text
      document.body.removeChild(tempInput); // Remove the temporary element

      toast.success("Room ID copied to clipboard!");
    } else {
      toast.error("No Room ID to copy.");
    }
  };

  return (
    <div className="shadow-2xl rounded flex-col  justify-center border-gray-400 border w-[50%] p-10 flex items-center relative">
      <h1 className="text-3xl font-bold p-3">Create Room</h1>
      <form
        // onSubmit={handleSubmit}
        className="flex items-center shadow-2xl p-10 rounded-2xl justify-center w-[100%] flex-col gap-10"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Enter Your name"
          className="border mx-4 rounded-2xl w-full outline-none p-4"
        />
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
          placeholder="Generate or enter Room ID"
          className="border mx-4 rounded-2xl w-full outline-none p-4"
        />
        <div className="w-full flex gap-4 ">
          <button
            type="button" // Important: Use type="button" to prevent it from submitting the form
            onClick={handleGenerate} // Call the handleGenerate function
            className="bg-blue-500 hover:bg-blue-600 text-white w-full rounded-2xl border px-10 text-center py-2.5 transition duration-300 ease-in-out shadow-md"
          >
            Generate Room Id
          </button>

          <button
            type="button" // Important: Use type="button" to prevent it from submitting the form
            onClick={handleCopy} // Call the handleCopy function
            className="bg-green-500 hover:bg-green-600 text-white w-full rounded-2xl border px-10 text-center py-2.5 transition duration-300 ease-in-out shadow-md"
            disabled={!roomId} // Disable button if roomId is empty
          >
            Copy Room Id
          </button>
        </div>

        {/* Button to generate the Room ID */}

        {/* Button to create the room (submits the form) */}
        <button
          type="submit" // This button will submit the form
          onClick={handleCreateRoom}
          className="bg-orange-400 hover:bg-orange-500 text-white w-full rounded-2xl border px-10 text-center py-2.5 transition duration-300 ease-in-out shadow-md"
        >
          Create Room
        </button>
      </form>
    </div>
  );
}

export default CreateRoomForm;
