const router = require("express").Router();
const controller = require("../controllers/controller");
router.get("/", controller.join_chat);
router.get("/chat", controller.leave_chat);

module.exports = router;
