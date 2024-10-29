const userSchema = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Respond = require("../utils/helpers");

const register = async ({ userName, password }) => {
  try {
    //checked in user table for user with name equals to userName
    const existUser = await userSchema.User.findOne({ name: userName });

    if (!existUser) {
      const hashedPassword = await bcrypt.hash(password, 10); //that create 10 times salt rounds insure strong salt..

      const newUser = new userSchema.User({
        name: userName,
        password: hashedPassword,
      });
      await newUser.save();
      //201 is created from docs: The request succeeded, and a new resource was created as a result.
      return Respond.createResponse(true, 201, null, "User registered successfully");
    } else {
      return Respond.createResponse(false, 409, null, "User already exists");
    }
  } catch (error) {
    return Respond.createResponse(false, 500, null, error.message);
  }
};

const login = async ({ userName, password }) => {
  try {
    const existUser = await userSchema.User.findOne({ name: userName });
    //if there is a user with the given name
    if (existUser) {
      const legitPassword = existUser["password"];
      //compare return true or false value if the password matches.
      const compare = await bcrypt.compare(password, legitPassword);
      if (compare) {
        //create new token to the user
        const token = jwt.sign({ userName: userName, userId: existUser._id }, process.env.KEY);
        return Respond.createResponse(true, 201, { token }, "Login successful");
        // return { statuscode: 201, message: token };
      } else {
        //the password are not the same. return stats 401 meaning "Unauthorized"
        return Respond.createResponse(false, 401, null, "Incorrect password");
        // return { statuscode: 401, message: "Incorrect password" };
      }
    } else {
      //status code 409 for conflict.
      return Respond.createResponse(false, 409, null, "User is not registered yet");
      // return { statusCode: 409, message: "User is not registered yet" };
    }
  } catch (error) {
    return Respond.createResponse(false, 500, null, error.message);
    // return {
    //   statusCode: 500,
    //   message: `Error at login: ${error.message}`,
    // }; // 500 Internal Server Error
  }
};

const getUserStats = async ({ userName }) => {
  // Logic to get the stats for the user
  return { message: `Stats for user ${userName}` };
};

module.exports = { register, login, getUserStats };
