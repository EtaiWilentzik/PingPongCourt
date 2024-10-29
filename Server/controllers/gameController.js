const gameServices = require("../services/gameServices");
const createGame = async (req, res) => {
  const { player1, player2 } = req.body;
  console.log(" in game controller ", player2);
  result = await gameServices.createGame(player1, player2);
  res.status(result.statusCode).json(result);
};

const updateGame = async (req, res) => {
  console.log(req.body);
  res.send("hello ");
};

module.exports = { createGame, updateGame };
