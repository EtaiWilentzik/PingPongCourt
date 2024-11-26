const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authenticateMiddleware");
const { authorizeUser } = require("../middleware/authorizeUser");

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get("/otherUsers", authenticateToken, userController.otherUsers);
// userRouter.get("/:id/stats", authenticateToken, authorizeUser, userController.getUserStats);

module.exports = { userRouter };
