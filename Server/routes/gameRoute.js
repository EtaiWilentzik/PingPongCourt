const express = require("express");
const gameRouter = express.Router();
const gameController = require("../controllers/gameController");
const { uploadSingleVideo, addAbsolutePath, createServerFolder } = require("../middleware/uploadMiddleware");
const { authenticateToken } = require("../middleware/authenticateMiddleware");
const { authorizeGameAccess } = require("../middleware/authorizeGame");

gameRouter.post("/create", authenticateToken, gameController.createGame);
// gameRouter.put("/:gameId", authenticateToken, authorizeGameAccess, gameController.updateGame);
gameRouter.get("/history", authenticateToken, gameController.getHistory);
//* we don't use this route. we doing the same functionality in the client.
gameRouter.get("/history/against-player", authenticateToken, gameController.getHistoryAgainstPlayer);
gameRouter.get("/allGames", authenticateToken, gameController.allGames);
gameRouter.post("/stats", gameController.updateGameAtEnd);
gameRouter.get("/video/:id", gameController.video); //the id here is id of game
gameRouter.get("/personalStatistics", authenticateToken, gameController.personalStatistics);
gameRouter.get("/:gameId", authenticateToken, authorizeGameAccess, gameController.getGame);
gameRouter.post(
  "/startGame",
  authenticateToken,
  createServerFolder,
  uploadSingleVideo,
  addAbsolutePath,
  gameController.startGame
);

module.exports = { gameRouter };
