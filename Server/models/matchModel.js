const mongoose = require("mongoose");
const { User } = require("./userModel");
const Schema = mongoose.Schema;

// {
//     "_id": "match1",
//     "players": ["player1", "player2"],
//     "gameIds": ["game1", "game2"],
//     "tournamentId": "tournament1" i t
//   }

// TODO:  maybe to remove the tournament  id because the set does not need to know
// in which tournament its played but the tournament need to know about the set

const MatchSchema = new mongoose.Schema({
  players: [{ type: Schema.Types.ObjectId, ref: User }],
  gameIds: [
    {
      type: Schema.Types.ObjectId, // Specifies the type of the elements in the array
      ref: "Game", // Indicates the model to which these IDs belong
    },
  ],
});

const Match = mongoose.model("Match", MatchSchema);
module.exports = { Match };
