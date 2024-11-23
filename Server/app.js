const { User } = require("./models/userModel.js"); // Correctly destructuring User from the exports
const { Game } = require("./models/gameModel.js");
const { Game2 } = require("./models/gameModel.js");
const { Match } = require("./models/matchModel.js");
const { Tournament } = require("./models/tournamentModel.js");
const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/userRoute.js");
const { gameRouter } = require("./routes/gameRoute.js");
const cors = require("cors");

const app = express();
app.use(cors());
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
// app.get("/create-game2", async (req, res) => {
//   try {
//     // Example data for players and stats
//     const player1Id = new mongoose.Types.ObjectId(); // Replace with actual user ID if available
//     const player2Id = new mongoose.Types.ObjectId();

//     const newGame2 = new Game2({
//       datePlayed: new Date(),
//       video: {
//         title: "Final Match Highlights",
//         url: "http://example.com/final-match.mp4",
//         duration: 240,
//       },
//       players: {
//         player1: {
//           userId: player1Id,
//           stats: {
//             faults: [1, 2, 0],
//             aces: 4,
//             averageSpeed: 110,
//             depthOfHits: [60, 40],
//           },
//         },
//         player2: {
//           userId: player2Id,
//           stats: {
//             faults: [0, 1, 1],
//             aces: 5,
//             averageSpeed: 115,
//             depthOfHits: [70, 30],
//           },
//         },
//       },
//       stats: {
//         longestGameInTime: 50,
//         maxHitsInGame: 200,
//         averageHitsInGame: 100,
//       },
//     });

//     await newGame2.save();
//     res.status(201).send("Game2 created successfully.");
//   } catch (err) {
//     console.error("Error creating Game2:", err);
//     res.status(500).send("Error creating Game2: " + err.message);
//   }
// });

app.use("/users", userRouter);
app.use("/games", gameRouter);

app.post("/", (req, res) => {
  console.log(req.body);
  res.json({ message: "Data received successfully!" });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
