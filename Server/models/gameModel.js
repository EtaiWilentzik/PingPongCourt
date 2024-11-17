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

const statsSchema = new Schema({
  longestGameInTime: { type: Number },
  maxHitsInGame: { type: Number, default: 0 },
  averageHitsInGame: { type: Number, default: 0 },
});

const playerStatsSchema = new Schema({
  faults: { type: [Number], default: [0, 0, 0] },
  aces: { type: Number, default: 0 },
  averageSpeed: { type: Number, default: 0 },
  depthOfHits: { type: [Number], default: [0, 0] },
});

// const gameSchema2 = new mongoose.Schema({
//   datePlayed: { type: Date, default: Date.now },
//   video: { type: videoSchema, default: () => ({}) },
//   players: {
//     player1: { type: Schema.ObjectId, ref: User },
//     player2: { type: Schema.ObjectId, ref: User },
//   },
//   stats: { type: stats, default: () => ({}) },
// });

const gameSchema2 = new Schema({
  datePlayed: { type: Date, default: Date.now },
  video: {
    title: { type: String, default: "" },
    url: { type: String, default: "" },
    duration: { type: Number, default: 0 },
  },
  players: {
    player1: {
      userId: { type: Schema.ObjectId, ref: "User" },
      stats: { type: playerStatsSchema, default: () => ({}) },
    },
    player2: {
      userId: { type: Schema.ObjectId, ref: "User" },
      stats: { type: playerStatsSchema, default: () => ({}) },
    },
  },
  stats: { type: statsSchema, default: () => ({}) },
});
const Game = mongoose.model("Game", gameSchema);
const Game2 = mongoose.model("Game2", gameSchema2);
module.exports = { Game, Game2 };
