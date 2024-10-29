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

module.exports = { createGame };
