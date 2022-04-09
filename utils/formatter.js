const moment = require("moment");

function formatter(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm:a"),
  };
}

module.exports = formatter;
