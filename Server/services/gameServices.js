const gameSchema = require("../models/gameModel");
const userSchema = require("../models/userModel");

const Respond = require("../utils/helpers");

const createGame = async (player1, player2) => {
  try {
    const potentialPlayer1 = await userSchema.User.findOne({ name: player1 });
    const potentialPlayer2 = await userSchema.User.findOne({ name: player2 });

    if (!potentialPlayer1 || !potentialPlayer2) {
      return Respond.createResponse(false, 409, null, "One of the users does not exist");
    }

    if (JSON.stringify(potentialPlayer1._id) === JSON.stringify(potentialPlayer2._id)) {
      return Respond.createResponse(false, 409, null, "Cannot create game with the same player");
    }

    const newGame = new gameSchema.Game({
      scores: { player1: potentialPlayer1._id, player2: potentialPlayer2._id },
    });

    await newGame.save();
    return Respond.createResponse(true, 201, newGame, "Created new game successfully");
  } catch (error) {
    return Respond.createResponse(false, 500, null, "An error occurred while creating the game");
  }
};
//* we dont use this route at the end.
const updateGame = async (player1Score, player2Score, currentGame) => {
  try {
    currentGame.scores.player1Score = player1Score;
    currentGame.scores.player2Score = player2Score;
    await gameSchema.Game.updateOne(
      { _id: currentGame._id },
      {
        $set: {
          "scores.player1Score": player1Score,
          "scores.player2Score": player2Score,
        },
      }
    );
    return Respond.createResponse(true, 201, newGame, "updated successfully");
  } catch (error) {
    return Respond.createResponse(false, 500, null, "An error occurred while updating the game");
  }
};

const getHistory = async (userId) => {
  try {
    // Return all the games where the user participates
    const games = await gameSchema.Game.find({
      $or: [{ "players.playerLeft.userId": userId }, { "players.playerRight.userId": userId }],
    }).sort({ datePlayed: -1 }); // Sort from the newest to the oldest.

    return Respond.createResponse(true, 200, games, "Fetched game history successfully");
  } catch (error) {
    return Respond.createResponse(false, 500, null, error.message);
  }
};

const getHistoryAgainstPlayer = async (currentUserId, friend) => {
  try {
    const result = await userSchema.User.find({ name: friend });
    const friendId = result.id;
    //return all the games where user1 and user2 played no matter who played as player 1 or player2
    const games = await gameSchema.Game.find({
      $or: [
        { $and: [{ "scores.player1": friendId }, { "scores.player2": currentUserId }] },
        { $and: [{ "scores.player1": currentUserId }, { "scores.player2": friendId }] },
      ],
    });
    // console.log(games);
    return Respond.createResponse(true, 200, games, "shows all the games between the 2 players");
  } catch (error) {
    return Respond.createResponse(false, 500, null, error.message);
  }
};

const updateGameAtEnd = async (data) => {
  try {
    // Fetch the game using its ID
    const game = await gameSchema.Game.findById(data.game_id);

    if (!game) {
      return Respond.createResponse(false, 404, null, "Game not found");
    }
    game.video.url = data.video_name;
    // Update game stats
    game.stats.maxHitsInGame = data.max_hits_in_game;
    game.stats.averageHitsInGame = data.average_hits_in_game;
    game.stats.hitsInGame = data.hits_in_game;

    // Update left player's stats
    game.players.playerLeft.userId = data.player_left.name;
    game.players.playerLeft.playerStats = {
      points: data.player_left.points,
      fastestBallSpeed: data.player_left.fastest_ball_speed,
      lossReasons: data.player_left.loss_reasons,
      aces: data.player_left.aces,
      depthOfHits: data.player_left.depth_of_hits,
    };

    // Update right player's stats
    game.players.playerRight.userId = data.player_right.name;
    game.players.playerRight.playerStats = {
      points: data.player_right.points,
      fastestBallSpeed: data.player_right.fastest_ball_speed,
      lossReasons: data.player_right.loss_reasons,
      aces: data.player_right.aces,
      depthOfHits: data.player_right.depth_of_hits,
    };
    const updatedGame = await game.save();
    // Update user stats -(the win and losses )
    await updateUserStats(data.player_left, data.player_right);
    return Respond.createResponse(true, 200, updatedGame, "Game updated successfully");
  } catch (error) {
    console.error("Error updating game:", error);

    // Return a response indicating failure
    return Respond.createResponse(false, 500, null, "Failed to update game");
  }
};

const createDefaultGame = async (leftPlayerId, rightPlayerId) => {
  try {
    const newGame = new gameSchema.Game({
      players: {
        playerLeft: {
          userId: leftPlayerId,
        },
        playerRight: {
          userId: rightPlayerId,
        },
      },
    });

    const savedGame = await newGame.save();

    return savedGame;
  } catch (error) {
    console.error("Error creating default game:", error);
    throw error;
  }
};

const updateUserStats = async (playerLeft, playerRight) => {
  try {
    let winnerId = null;
    let loserId = null;

    // Determine winner based on ping pong rules
    if (
      playerLeft.points >= 11 &&
      playerLeft.points - playerRight.points >= 2 // Player Left scored at least 11 and a t least 2 points ahead
    ) {
      winnerId = playerLeft.name;
      loserId = playerRight.name;
    } else if (playerRight.points >= 11 && playerRight.points - playerLeft.points >= 2) {
      winnerId = playerRight.name;
      loserId = playerLeft.name;
    }

    if (winnerId) {
      await userSchema.User.findByIdAndUpdate(winnerId, {
        $inc: {
          "stats.totalWins": 1,
          "stats.totalGames": 1,
        },
      });

      await userSchema.User.findByIdAndUpdate(loserId, {
        $inc: {
          "stats.totalLosses": 1,
          "stats.totalGames": 1,
        },
      });
    } else {
      console.warn("No valid winner found based on ping pong rules.");
    }
  } catch (error) {
    console.error("Error updating user stats:", error);
    throw error;
  }
};
//* we need to add here the video upload
const getGame = async (gameId) => {
  try {
    //get the data from the userid using populate
    const game = await gameSchema.Game.findById(gameId)
      .populate("players.playerLeft.userId", "name") //taking only the name column from the user table.
      .populate("players.playerRight.userId", "name");

    if (!game) {
      return Respond.createResponse(false, 404, null, "Game not found");
    }

    const player_left_name = game.players.playerLeft.userId.name;
    const player_right_name = game.players.playerRight.userId.name;
    const player_left = game.players.playerLeft.playerStats;
    const player_right = game.players.playerRight.playerStats;
    const shared_stats = game.stats;

    const return_obj = {
      player_right_name,
      player_left_name,
      player_left,
      player_right,
      shared_stats,
      datePlayed: game.datePlayed,
    };

    return Respond.createResponse(true, 200, return_obj, "Fetched the game successfully");
  } catch (error) {
    console.error(error);
    return Respond.createResponse(false, 500, null, "An error occurred while fetching the game");
  }
};

const personalStatistics = async (userId) => {
  try {
    const user = await userSchema.User.findById(userId);
    const totalPoints = await getUserWinLoseScores(user._id);
    if (!totalPoints.success) {
      return totalPoints;
    }
    if (totalPoints.statusCode === 204) {
      return totalPoints;
    }

    const return_obj = {
      stats: user.stats,
      totalWinPoints: totalPoints?.data?.totalWinPoints,
      totalLossPoints: totalPoints?.data?.totalLosePoints,
      lossReasonsSum: totalPoints?.data?.lossReasonsSum,
      depthOfHits: totalPoints?.data?.depthOfHits,
      lastFiveGames: totalPoints?.data?.lastFiveGames,
    };
    return Respond.createResponse(true, 200, return_obj, "successfully");
  } catch (error) {
    return Respond.createResponse(false, 500, null, error.message);
  }
};
const getUserWinLoseScores = async (userId) => {
  try {
    // Return all the games where the user participates
    const games = await gameSchema.Game.find({
      $or: [{ "players.playerLeft.userId": userId }, { "players.playerRight.userId": userId }],
    })
      .populate("players.playerLeft.userId", "name") // Populate playerLeft user name
      .populate("players.playerRight.userId", "name") // Populate playerRight user name
      .sort({ datePlayed: -1 }); // Sort from newest to oldest
    if (games.length === 0) {
      return Respond.createResponse(true, 204, null, "No games found for the user");
    }
    const lastFiveGames = getLastGames(games, userId, 5);
    let totalWinPoints = 0;
    let totalLosePoints = 0;
    let lossReasonsSum = [0, 0, 0, 0];
    let depthOfHits = [0, 0, 0, 0, 0, 0, 0, 0];

    games.forEach((game) => {
      const leftPlayer = game.players.playerLeft;
      const rightPlayer = game.players.playerRight;
      const leftScore = leftPlayer.playerStats.points;
      const rightScore = rightPlayer.playerStats.points;
      const userIsLeft = leftPlayer.userId._id.toString() === userId.toString();
      const userIsRight = rightPlayer.userId._id.toString() === userId.toString();
      if (userIsLeft) {
        playerLossReason = leftPlayer.playerStats.lossReasons;
        playerDepthOfHits = leftPlayer.playerStats.depthOfHits;
      } else if (userIsRight) {
        playerLossReason = rightPlayer.playerStats.lossReasons;
        playerDepthOfHits = rightPlayer.playerStats.depthOfHits;
      }
      // Sum the player's loss_reason array
      playerLossReason.forEach((value, index) => {
        lossReasonsSum[index] += value;
      });
      playerDepthOfHits.forEach((value, index) => {
        depthOfHits[index] += value;
      });
      // Update scores based on the game result
      if (leftScore > rightScore) {
        if (userIsLeft) {
          totalWinPoints += leftScore;
          totalLosePoints += rightScore;
        } else if (userIsRight) {
          totalWinPoints += rightScore;
          totalLosePoints += leftScore;
        }
      } else if (rightScore > leftScore) {
        if (userIsRight) {
          totalWinPoints += rightScore;
          totalLosePoints += leftScore;
        } else if (userIsLeft) {
          totalWinPoints += leftScore;
          totalLosePoints += rightScore;
        }
      }
    });
    return Respond.createResponse(
      true,
      200,
      { totalWinPoints, totalLosePoints, lossReasonsSum, depthOfHits, lastFiveGames },
      "Fetched user's win and lose scores successfully"
    );
  } catch (error) {
    console.error(error);
    return Respond.createResponse(false, 500, null, error.message);
  }
};

const getLastGames = (games, userId, length = games.length) => {
  // Filter games where leftPlayerScore is not null or 0
  const validGames = games.filter((game) => {
    const leftPlayerScore = game.players.playerLeft.playerStats.points;
    return leftPlayerScore !== null && leftPlayerScore !== 0;
  });

  const selectedGames = validGames.slice(0, length);

  return selectedGames.map((game) => {
    const leftPlayerName = game.players.playerLeft.userId.name;
    const rightPlayerName = game.players.playerRight.userId.name;
    const leftPlayerScore = game.players.playerLeft.playerStats.points;
    const rightPlayerScore = game.players.playerRight.playerStats.points;
    //sending the side of the connected user.
    let side = null;
    if (game.players.playerLeft.userId._id.toString() === userId.toString()) {
      side = "left";
    } else {
      side = "right";
    }
    return {
      side: side,
      gameId: game._id.toString(),
      playerLeft: { name: leftPlayerName, score: leftPlayerScore },
      playerRight: { name: rightPlayerName, score: rightPlayerScore },
      datePlayed: game.datePlayed,
    };
  });
};

const allGames = async (userId) => {
  try {
    const user = await userSchema.User.findById(userId);
    const games = await gameSchema.Game.find({
      $or: [{ "players.playerLeft.userId": userId }, { "players.playerRight.userId": userId }],
    })
      .populate("players.playerLeft.userId", "name") // Populate left player's name
      .populate("players.playerRight.userId", "name") // Populate right player's name
      .sort({ datePlayed: -1 });

    data = getLastGames(games, userId);
    return Respond.createResponse(true, 200, data, "return all games");
  } catch (error) {
    return Respond.createResponse(false, 500, null, "An error occurred while fetching user scores");
  }
};

module.exports = {
  createGame,
  updateGame,
  getHistory,
  getHistoryAgainstPlayer,
  updateGameAtEnd,
  getGame,
  personalStatistics,
  allGames,
  createDefaultGame,
};
