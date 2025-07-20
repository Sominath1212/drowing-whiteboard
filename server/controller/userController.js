const { error } = require("console");
const usermodel = require("../model/usrmodel");
const users = [];

const addUser = async ({ name, roomId, userId, host, attendies }) => {
  const user = {
    name,
    roomId,
    userId,
    host,
    attendies,
  };
  users.push(user);
  try {
    const result = await usermodel.create(user);
    if (result) {
      console.log("user added");
    }
  } catch (error) {
    console.error("Error adding user:", error);
  }
  return users;
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.userId === id);

  try {
    usermodel.deleteOne({ userId: id });
    console.log("user delete");
  } catch (error) {
    throw error;
  }
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => user.userId === id);
};
const getUsersInRoom = (roomid) => {
  return users.find((user) => user.roomId === roomid);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
