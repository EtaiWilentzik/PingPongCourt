const mongoose = require("mongoose");
const { User } = require("./userModel");
const { Match } = require("./matchModel");
const Schema = mongoose.Schema;
// [
//     {
//       "_id": "tournament1",
//       "tournamentName": "Summer Open Championship",
//       "participants": [
//         { "userName": "player1", "rankInTournament": 1 },
//         { "userName": "player2", "rankInTournament": 2 },
//         { "userName": "player3", "rankInTournament": 3 }
//       ],
//       "setIds": ["match1", "match2"]
//     }
//   ]

const TournamentSchema = new mongoose.Schema({
  tournamentName: { type: String, default: "" },
  participants: [
    {
      user: { type: Schema.Types.ObjectId, ref: User },
      rankInTournament: { type: Number, default: 1 },
    },
  ],
  setIds: [{ type: Schema.Types.ObjectId, ref: Match }],
});

const Tournament = mongoose.model("Tournament", TournamentSchema);
module.exports = { Tournament };
