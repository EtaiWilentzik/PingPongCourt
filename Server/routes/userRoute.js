const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const authorization = require("../middleware/authenticateMiddleware");

// TODO: https://express-validator.github.io/docs/guides/validation-chain used this for validation and sanitize the input

userRouter.post("/register", userController.register);

userRouter.post("/login", userController.login);

userRouter.get(
  "/:id/stats",
  authorization.authenticateToken(async (req, authenticatedUserId) => {
    return req.params.id === authenticatedUserId;
  }),
  userController.getUserStats
);

module.exports = { userRouter };
