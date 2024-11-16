const { User } = require("./models/userModel.js"); // Correctly destructuring User from the exports
const { Game } = require("./models/gameModel.js");
const { Game2 } = require("./models/gameModel.js");
const { Match } = require("./models/matchModel.js");
const { Tournament } = require("./models/tournamentModel.js");
const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/userRoute.js");
const { gameRouter } = require("./routes/gameRoute.js");
const app = express();
//get the dotenv
require("dotenv").config({ path: "./config/.env.test" });

const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/TableTennis");
    console.log("Successfully connected to database.");
  } catch (e) {
    console.error("Error connecting to database: ", e);
  }
};

dbConnect().catch((error) => console.log(error));

//this middleware enable to work with the req.body object.
app.use(express.json());
// this used to parse the correctly the url and remove all the encode of the url. i.e name=eti+a%20gmail.com to  etai a@gmail.com
app.use(express.urlencoded({ extended: true }));

var bodyParser = require("body-parser");
//this let met to access toe req.body in post request.
app.use(bodyParser.json());

// app.post("/games/create", (req, res) => {
//   console.log(req.body); // Check the body content here
//   res.send(req.body);
// });
app.get("/create-game2", async (req, res) => {
  try {
    // Example data for players and stats
    const player1Id = new mongoose.Types.ObjectId(); // Replace with actual user ID if available
    const player2Id = new mongoose.Types.ObjectId();

    const newGame2 = new Game2({
      datePlayed: new Date(),
      video: {
        title: "Final Match Highlights",
        url: "http://example.com/final-match.mp4",
        duration: 240,
      },
      players: {
        player1: {
          userId: player1Id,
          stats: {
            faults: [1, 2, 0],
            aces: 4,
            averageSpeed: 110,
            depthOfHits: [60, 40],
          },
        },
        player2: {
          userId: player2Id,
          stats: {
            faults: [0, 1, 1],
            aces: 5,
            averageSpeed: 115,
            depthOfHits: [70, 30],
          },
        },
      },
      stats: {
        longestGameInTime: 50,
        maxHitsInGame: 200,
        averageHitsInGame: 100,
      },
    });

    await newGame2.save();
    res.status(201).send("Game2 created successfully.");
  } catch (err) {
    console.error("Error creating Game2:", err);
    res.status(500).send("Error creating Game2: " + err.message);
  }
});

app.use("/users", userRouter);
app.use("/games", gameRouter);

app.post("/", (req, res) => {
  console.log(req.body);
  res.json({ message: "Data received successfully!" });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

// app.get("/create-user", async (req, res) => {
//   const newUser = new User({
//     name: "player12",
//     password: "hashed_password_123",
//     stats: {
//       totalWins: 15,
//       totalLosses: 5,
//       totalGames: 20,
//       winLossRatio: 3.0,
//     },
//   });
//   await newUser.save();
//   res.send("User created");
// });

// app.get("/create-game", async (req, res) => {
//   try {
//     // Create or find players
//     let player1 = await User.findOne({ name: "player1" });

//     let player2 = await User.findOne({ name: "player2" });

//     // If players do not exist, create them (you should adjust this based on actual requirements)
//     if (!player1) {
//       player1 = new User({ name: "player1", password: "hashed_password_123" });
//       await player1.save();
//     }
//     if (!player2) {
//       player2 = new User({ name: "player2", password: "hashed_password_123" });
//       await player2.save();
//     }

//     // Create a new game
//     const newGame = new Game({
//       gameNumber: 1,
//       scores: {
//         player1: player1._id,
//         player1Score: 21,
//         player2: player2._id,
//         player2Score: 15,
//       },
//       datePlayed: new Date(),
//       video: {
//         title: "Game 1 - Summer Open Championship",
//         url: "https://example.com/videos/game1.mp4",
//         duration: 360,
//       },
//     });
//     console.log("hello5");
//     await newGame.save();
//     console.log("hello6");
//     res.send("New game created successfully");
//   } catch (err) {
//     res.status(500).send("Error creating game: " + err.message);
//   }
// });

// app.get("/create-match", async (req, res) => {
//   try {
//     const games = await Game.find();
//     const gameIds = games.map((game) => game._id); //get the ids
//     console.log("Querying for player1...");
//     const player1 = await User.findOne({ name: "player1" });
//     console.log("Query result for player1:", player1);

//     console.log("player1:", player1._id); // Check what this logs
//     // console.log("player2:", player2); // Check what this logs player1
//     const match = new Match({
//       players: [
//         await User.findOne({ name: "player1" })._id,
//         await User.findOne({ name: "player2" })._id,
//       ],
//       gameIds: gameIds,
//     });
//     await match.save();
//     res.send("Match created successfully with all current games.");
//   } catch (err) {
//     res.status(500).send("Error creating match: " + err.message);
//   }
// });

// app.get("/", (req, res) => {
//   res.send("helloworld");
// });
// app.get("/users/a", (req, res) => {
//   res.send("User A details");
// });

// app.get("/create-tournament", async (req, res) => {
//   try {
//     // Assuming you have predefined participant IDs and set IDs
//     // For demonstration, these should be replaced with actual user and match IDs from your database
//     const participantIds = [
//       "5f1d7f3e91bc194b5fd3d740",
//       "5f1d7f3e91bc194b5fd3d741",
//     ];
//     const matchIds = ["5f1d7f3e91bc194b5fd3d742", "5f1d7f3e91bc194b5fd3d743"];

//     // Create participants array
//     const participants = participantIds.map((userId, index) => ({
//       user: userId,
//       rankInTournament: index + 1,
//     }));

//     // Create a new tournament
//     const newTournament = new Tournament({
//       tournamentName: "Summer Open Championship",
//       participants: participants,
//       matchIds: matchIds,
//     });

//     // Save the new tournament
//     await newTournament.save();
//     res.send("Tournament created successfully");
//   } catch (err) {
//     res.status(500).send("Error creating tournament: " + err.message);
//   }
// });
