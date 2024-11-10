const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// example of the schema is this. we does not use the salt because we have it built in inside the crypto library
// {
//   "userName": "player1",
//   "password": "hashed_password_123",
//   "salt": "random_salt",
//   "stats": {
//     "totalWins": 15,
//     "totalLosses": 5,
//     "totalGames": 20,
//     "winLossRatio": 3.0
//   }

const userStats = new Schema({
  totalWins: { type: Number, default: 0 },
  totalLosses: { type: Number, default: 0 },
  totalGames: { type: Number, default: 0 },
  winLossRatio: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  stats: {
    type: userStats,
    default: () => ({}), // Set default as an empty object, which will trigger defaults in userStats schema a
  },
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
