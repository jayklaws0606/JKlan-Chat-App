const userList = [];

//join user to chat
function userJoin(id, username, room) {
  //create user object
  const user = { id, username, room };
  userList.push(user);
  return user;
}

//get current user
function getCurrentUser(id) {
  //search for the matching user with an id
  return userList.find((user) => user.id === id);
}
//user leaves chat
function userLeave(id) {
  const index = userList.findIndex((user) => user.id === id);
  if (index !== -1) {
    //return the user that left
    return userList.splice(index, 1)[0];
  }
}

//get room users
function getRoomUsers(room) {
  //only return an array of users in the room
  return userList.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
