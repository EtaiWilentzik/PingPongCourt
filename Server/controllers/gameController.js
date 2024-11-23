const { response } = require("express");
const gameServices = require("../services/gameServices");
const Respond = require("../utils/helpers");

const createGame = async (req, res) => {
  const { player1, player2 } = req.body;
  console.log(" in game controller ", player2);
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

const createGameAtEnd = async (req, res) => {
  result = await gameServices.createGameAtEnd(req.body);
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
const video = (req, res) => {
  const fs = require("fs");
  const path = require("path");

  // console.log("Video streaming endpoint hit"); // Debug log
  // console.log("Headers:", req.headers); // Log headers to debug the Range header

  const videoPath = path.resolve(__dirname, "./v2_short.mp4_out.mp4");

  // Check if the video file exists
  if (!fs.existsSync(videoPath)) {
    console.error("Video file not found at path:", videoPath);
    return res.status(404).send("Video file not found.");
  }

  const videoSize = fs.statSync(videoPath).size;
  const range = req.headers.range;

  if (!range) {
    // console.log("No Range header provided; sending entire file.");
    // const headers = {
    //   "Content-Length": videoSize,
    //   "Content-Type": "video/mp4",
    // };
    res.writeHead(200, headers);
    fs.createReadStream(videoPath).pipe(res);
    return;
  }

  // console.log("Range header provided:", range);
  const CHUNK_SIZE = 10 ** 6; // 1MB chunks
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // console.log(`Streaming bytes ${start} to ${end} of size ${videoSize}`);

  res.writeHead(206, headers);
  fs.createReadStream(videoPath, { start, end }).pipe(res);
};

const startGame = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded!" });
    }

    // Extract details from the request
    const videoPath = req.file.path;
    const leftPlayerId = req.body.playerLeft;
    const rightPlayerId = req.body.playerRight;
    let starter = req.body.start;

    // Resolve the Python script path
    const path = require("path");
    const scriptName = path.resolve(__dirname, "../../Algorithm/video_handler_cpu.py");
    console.log("The script name is:", scriptName);

    // Function to run Python script and await its result
    const runPythonScript = () => {
      return new Promise((resolve, reject) => {
        const spawn = require("child_process").spawn;
        const pythonProcess = spawn("python", [scriptName, videoPath, leftPlayerId, rightPlayerId, starter]);

        let pythonOutput = "";

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

    // Await the result of the Python script
    const pythonOutput = await runPythonScript();

    // Send success response
    res.status(200).json({
      message: "Game started successfully!",
      pythonOutput, // Include Python script output in the response
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
  createGameAtEnd,
  video,
  getGame,
  personalStatistics,
  allGames,
  startGame,
};
