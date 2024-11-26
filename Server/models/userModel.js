const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userStats = new Schema(
  {
    totalWins: { type: Number, default: 0 },
    totalLosses: { type: Number, default: 0 },
    totalGames: { type: Number, default: 0 },
  },
  { _id: false }
);

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
    default: () => ({}), // Set default as an empty object, which will trigger defaults in userStats schema
  },
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
