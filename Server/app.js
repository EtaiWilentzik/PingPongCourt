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
//* this used to parse the correctly the url and remove all the encode of the url. i.e name=eti+a%20gmail.com to  etai a@gmail.com
app.use(express.urlencoded({ extended: true }));

var bodyParser = require("body-parser");
//this let met to access toe req.body in post request.
app.use(bodyParser.json());
app.use("/users", userRouter);
app.use("/games", gameRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
