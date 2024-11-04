const { json } = require("express");
const gameSchema = require("../models/gameModel");
const userSchema = require("../models/userModel");

const Respond = require("../utils/helpers");
const createGame = async (player1, player2) => {
  console.log(player1, player2);
  const potentialPlayer1 = await userSchema.User.findOne({ name: player1 });

  const potentialPlayer2 = await userSchema.User.findOne({ name: player2 });

  if (!potentialPlayer1 || !potentialPlayer2) {
    return Respond.createResponse(false, 409, null, "one of the users does not exists");
  }

  if (JSON.stringify(potentialPlayer1._id) === JSON.stringify(potentialPlayer2._id)) {
    return Respond.createResponse(false, 409, null, "cant create game with exact same  player");
  }
  const newGame = new gameSchema.Game({
    scores: { player1: potentialPlayer1._id, player2: potentialPlayer2._id },
  });
  await newGame.save();
  return Respond.createResponse(true, 201, newGame, "Created new game successfully");
};

const updateGame = async (player1Score, player2Score, currentGame) => {
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
};

const getHistory = async (currentUser) => {
  try {
    // Get all games where either player1 or player2 is the current user
    const result = await gameSchema.Game.find({
      $or: [{ "scores.player1": currentUser.userId }, { "scores.player2": currentUser.userId }],
    });

    console.log(result);
    return Respond.createResponse(true, 200, result, "Fetched game history successfully");
  } catch (error) {
    return Respond.createResponse(false, 500, null, error.message);
  }
};

const getHistoryAgainstPlayer = async (currentUserId, friend) => {
  try {
    console.log(friend);
    const result = await userSchema.User.find({ name: friend });

    const friendId = result.id;
    //return all the games where user1 and user2 played no matter who played as player 1 or player2
    const games = await gameSchema.Game.find({
      $or: [
        { $and: [{ "scores.player1": friendId }, { "scores.player2": currentUserId }] },
        { $and: [{ "scores.player1": currentUserId }, { "scores.player2": friendId }] },
      ],
    });
    console.log(games);
    return Respond.createResponse(true, 200, games, "shows all the games between the 2 players");
  } catch (error) {
    return Respond.createResponse(false, 500, null, error.message);
  }
};
module.exports = { createGame, updateGame, getHistory, getHistoryAgainstPlayer };
