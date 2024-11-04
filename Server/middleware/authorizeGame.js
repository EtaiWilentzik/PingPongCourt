// middleware/authorizeGame.js
const gameSchema = require("../models/gameModel");

const authorizeGameAccess = async (req, res, next) => {
  try {
    const gameId = req.params.gameId;
    //!  req.user.userId is brought from authenticateMiddleware file.
    const authenticatedUserId = req.user.userId;

    // Fetch the game from the database
    const game = await gameSchema.Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found." });
    }

    const player1Id = game.scores.player1.toString();
    const player2Id = game.scores.player2.toString();

    // Check if the authenticated user is a participant in the game
    if (authenticatedUserId !== player1Id && authenticatedUserId !== player2Id) {
      return res.status(403).json({ message: "Forbidden: Not a game participant." });
    }

    //? added the property game if i need in the future maybe to delete it in the end.
    req.game = game;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

module.exports = { authorizeGameAccess };
