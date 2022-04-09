const join_chat = (req, res) => {
  res.render("join", { title: "Join" });
};

const leave_chat = (req, res) => {
  res.render("chat", { title: "ChatRoom" });
};

module.exports = { join_chat, leave_chat };
