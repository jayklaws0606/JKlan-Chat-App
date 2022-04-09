const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userArray = document.getElementById("users");
const input = document.getElementById("msg");
const typing = document.createElement("div");
//get username and room from URL using query string
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

//join chat room
socket.emit("JoinRoom", { username, room });

//get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  ouputCurrentUsers(users);
});

//message coming in from the server
socket.on("message", (message) => {
  outputMessage(message);
  //scroll down to the latest message when someone sends a message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit

chatForm.addEventListener("submit", (e) => {
  //prevent page from reloading and submit
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  //emit a message to the server
  socket.emit("chatMsg", msg);

  //clear the input and auto focus after user submits
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  //document.querySelector(".typing:last-child").innerHTML = "";
  // (document.querySelectorAll(".message").length - 2).innerHTML = "";
  //chatMessages.removeChild(chatMessages.lastElementChild);
});

//output the message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");

  div.innerHTML = ` <p class="info-user"><span>${message.username}</span> <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
  chatMessages.appendChild(div);
}
function userTyping(message) {
  typing.classList.add("message");

  typing.innerHTML = ` <p class="info-user"><span>${message.username}</span> <span>${message.time}</span></p>
    <p class="text">
      <em>${message.text}</em>
    </p>`;
  chatMessages.appendChild(typing);
}

//add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}
//add users to DOM , showing currently connected users
function ouputCurrentUsers(users) {
  //return current users in the room
  userArray.innerHTML = `${users
    .map((user) => `<li>💀${user.username}</li>`)
    .join("")}`;
}

input.addEventListener("input", () => {
  socket.emit("typing");
});

socket.on("typing", (message) => {
  userTyping(message);
});
