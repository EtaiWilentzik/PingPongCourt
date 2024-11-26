const gameServices = require("../services/gameServices");
const Respond = require("../utils/helpers");
const gameSchema = require("../models/gameModel");

const createGame = async (req, res) => {
  const { player1, player2 } = req.body;
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
  const result = await gameServices.getHistory(req.user.userId);

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
//! change this name to Update game in end ! because we create the game inside start game already
const updateGameAtEnd = async (req, res) => {
  result = await gameServices.updateGameAtEnd(req.body);
  res.status(result.statusCode).json(result);
};

const getGame = async (req, res) => {
  result = await gameServices.getGame(req.game);
  res.status(result.statusCode).json(result);
};

const personalStatistics = async (req, res) => {
  result = await gameServices.personalStatistics(req.user.userId);
  res.status(result.statusCode).json(result);
};
const allGames = async (req, res) => {
  result = await gameServices.allGames(req.user.userId);
  res.status(result.statusCode).json(result);
};
const video = async (req, res) => {
  const fs = require("fs");
  const path = require("path");
  try {
    const gameId = req.params.id;
    const game = await gameSchema.Game.findById(gameId);

    //* to do it with try and catch now im lazy
    const videoPath = game.video.url;
    if (!fs.existsSync(videoPath)) {
      console.error("Video file not found at path:", videoPath);
      return res.status(404).send("Video file not found.");
    }

    const videoSize = fs.statSync(videoPath).size;
    const range = req.headers.range;

    if (!range) {
      res.writeHead(200, headers);
      fs.createReadStream(videoPath).pipe(res);
      return;
    }
    const CHUNK_SIZE = 10 ** 6; // 1MB chunks
    const start = Number(range.replace(/\D/g, "")); //the starting number of the range.
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1); //the end of the range.

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers); //Sending partial content 206
    fs.createReadStream(videoPath, { start, end }).pipe(res); //This creates a readable stream for the video file located at videoPath
  } catch (error) {
    // Send a 500 Internal Server Error response
    res.status(500).send(error.message);
  }
};

const startGame = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded!" });
    }
    //* starter is zero if current player is serving and isCurrentInLeft is zero is current in left side .
    // Extract details from the request
    const videoPath = req.file.path; //we got it from multer
    const currentPlayer = req.user.userId; //the current player who did the request
    const opponentId = req.body.opponentId;
    let starter = req.body.starter; //who start serving if its zero the player in the player connoted starting otherwise 1
    let isCurrentInLeft = req.body.isCurrentInLeft; //who playing in the left side
    let leftPlayerId, rightPlayerId;

    //* if current user is starting and he is in the right side starter need to be 1.  starter need to be 1 if the serves start from right to left
    if (starter === "0" && isCurrentInLeft === "1") {
      starter = 1;
      //* if current is not starting and he is in right side its mean that the opponent start from left side.
    } else if (starter === "1" && isCurrentInLeft === "1") {
      starter = 0;
    }
    if (isCurrentInLeft) {
      leftPlayerId = currentPlayer;
      rightPlayerId = opponentId;
    } else {
      rightPlayerId = currentPlayer;
      leftPlayerId = opponentId;
    }
    game = await gameServices.createDefaultGame(leftPlayerId, rightPlayerId);
    gameID = game._id.toString();
    const path = require("path");
    const scriptName = path.resolve(__dirname, "../../Algorithm/predict_cpu.py");
    console.log("The script name is:", scriptName);
    console.log(videoPath);
    //* function to run the python script.
    const runPythonScript = () => {
      return new Promise((resolve, reject) => {
        const spawn = require("child_process").spawn;

        const pythonProcess = spawn("python", [scriptName, videoPath, leftPlayerId, rightPlayerId, starter, gameID]);

        let pythonOutput = "";
        //* take control on std out,error and on close connection.
        pythonProcess.stdout.on("data", (data) => {
          console.log(`Python stdout: ${data.toString()}`);
          pythonOutput += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
          console.error(`Python stderr: ${data.toString()}`);
        });

        pythonProcess.on("close", (code) => {
          if (code === 0) {
            resolve(pythonOutput);
          } else {
            reject(new Error("Python script failed to execute."));
          }
        });
      });
    };
    const pythonOutput = await runPythonScript();

    // Send success response
    res.status(200).json({
      message: "Game started successfully!",
      // pythonOutput, // * we dont need it remove
    });
  } catch (error) {
    console.error("Error starting game:", error);
    res.status(500).json({ message: "Error starting the game.", error: error.message });
  }
};

module.exports = {
  createGame,
  updateGame,
  getHistory,
  getHistoryAgainstPlayer,
  updateGameAtEnd,
  video,
  getGame,
  personalStatistics,
  allGames,
  startGame,
};
