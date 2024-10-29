const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { User } = require("./userModel");

//this is example of one document in the collection
// {

//     "gameNumber": 1,
//     "scores": {
//       "player1": "player1",
//       "player1Score": 21,
//       "player2": "player2",
//       "player2Score": 15
//     },
//     "datePlayed": "2024-10-12T18:30:00Z",
//     "video": {
//       "title": "Game 1 - Summer Open Championship",
//       "url": "https://example.com/videos/game1.mp4",
//       "duration": 360
//     }
// }

const videoSchema = new Schema({
  title: { type: String, default: "" },
  url: { type: String, default: "" },
  duration: { type: Number, default: 0 },
});

const gameSchema = new mongoose.Schema({
  gameNumber: { type: Number, default: 1 },
  datePlayed: { type: Date, default: Date.now },
  video: { type: videoSchema, default: () => ({}) },
  scores: {
    player1: { type: Schema.ObjectId, ref: User },
    player1Score: { type: Number, default: 0 },
    player2: { type: Schema.ObjectId, ref: User },
    player2Score: { type: Number, default: 0 },
  },
});
const Game = mongoose.model("Game", gameSchema);
module.exports = { Game };
