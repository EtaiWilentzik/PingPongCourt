const express = require("express");
const gameRouter = express.Router();
const gameController = require("../controllers/gameController");
const authorization = require("../middleware/authenticateMiddleware");
const gameSchema = require("../models/gameModel");
const userSchema = require("../models/userModel");
const { uploadSingleVideo, addAbsolutePath } = require("../middleware/uploadMiddleware"); // Adjust path as needed
const { authenticateToken } = require("../middleware/authenticateMiddleware");
const { authorizeGameAccess } = require("../middleware/authorizeGame");
const { createServerFolder } = require("../utils/helpers"); // Import this

// Apply express.json() middleware to the router
// gameRouter.use(express.json());

// gameRouter.post(
//   "/create",
//   authorization.authenticateToken((req) => req.body.player1),
//   gameController.createGame
// ); //verification of the jwt on user1 only assuming he is making the request to crete new game..

// gameRouter.post(
//   "/create",
//   authorization.authenticateToken(async (req, authenticatedUserId) => {
//     console.log(req.body.player1);
//     const user1name = req.body.player1;
//     const user2name = req.body.player2;

//     const user1document = await userSchema.User.findOne({ name: user1name });
//     const user2document = await userSchema.User.find({ name: user2name });

//     console.log(user1document._id.toString());
//     // console.log(authenticatedUserId);
//     return authenticatedUserId === user1document._id.toString() || authenticatedUserId === user1document._id;
//   }),
//   gameController.createGame
// );
gameRouter.post("/create", authenticateToken, gameController.createGame);

// gameRouter.put(
//   "/:gameId",
//   authorization.authenticateToken((req) => req.params.gameId)
// );

// gameRouter.put(
//   "/:gameId",
//   authorization.authenticateToken(async (req, authenticatedUserId) => {
//     const gameId = req.params.gameId;

//     // Fetch the game from the database
//     const game = await gameSchema.Game.findById(gameId).exec();
//     if (!game) {
//       throw new Error("Game not found");
//     }

//     // Check if the authenticated user is one of the players
//     const player1Id = game.scores.player1.toString();
//     const player2Id = game.scores.player2.toString();
//     const authUserIdStr = authenticatedUserId.toString();
//     console.log(player1Id);
//     console.log(player2Id);
//     console.log(authUserIdStr);
//     return authenticatedUserId === player1Id || authenticatedUserId === player2Id;
//   }),
//   gameController.updateGame
// );

gameRouter.put("/:gameId", authenticateToken, authorizeGameAccess, gameController.updateGame);
gameRouter.get("/history", authenticateToken, gameController.getHistory);
gameRouter.get("/history/against-player", authenticateToken, gameController.getHistoryAgainstPlayer);
gameRouter.get("/allGames", authenticateToken, gameController.allGames);
gameRouter.post("/stats", gameController.createGameAtEnd);
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
