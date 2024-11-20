const { response } = require("express");
const gameServices = require("../services/gameServices");
const Respond = require("../utils/helpers");

const createGame = async (req, res) => {
  const { player1, player2 } = req.body;
  console.log(" in game controller ", player2);
  result = await gameServices.createGame(player1, player2);
  res.status(result.statusCode).json(result);
};

const updateGame = async (req, res) => {
  console.log(req.body);
  const { player1Score, player2Score } = req.body;
  result = await gameServices.updateGame(player1Score, player2Score, req.game); //pass the game i stored in the middleware function.
  res.status(result.statusCode).json(result);
};

const getHistory = async (req, res) => {
  const result = await gameServices.getHistory(req.user);

  res.status(result.statusCode).json(result);
};
const getHistoryAgainstPlayer = async (req, res) => {
  const friend = req?.query?.player_name;

  if (!friend) {
    result = Respond.createResponse(true, 201, newGame, "no param given ");
    res.status(result.statusCode).json(result);
  }
  console.log(friend);
  result = await gameServices.getHistoryAgainstPlayer(req.user.userId, friend);
  res.status(result.statusCode).json(result);
};

const createGameAtEnd = async (req, res) => {
  result = await gameServices.createGameAtEnd(req.body);
  //!WE DO'NT DO RES.SOOTHING BECAME WE GOT THIS PATH FROM THE ALGORITHM
};

const getGame = async (req, res) => {
  result = await gameServices.getGame(req.game);
};
module.exports = { createGame, updateGame, getHistory, getHistoryAgainstPlayer, createGameAtEnd, getGame };
