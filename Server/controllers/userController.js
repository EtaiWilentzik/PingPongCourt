const userService = require("../services/userService");

const register = async (req, res) => {
  const { userName, password } = req.body;
  let result = await userService.register({ userName, password });
  res.status(result.statusCode).json(result);
};

const login = async (req, res) => {
  const { userName, password } = req.body;
  result = await userService.login({ userName, password });
  res.status(result.statusCode).json(result);
};

const getUserStats = async (req, res) => {
  const userName = req.params.id;
  console.log(userName);

  result = await userService.getUserStats({ userName });
  // Logic to get the stats for the user
  res.json(result);
};
module.exports = { register, login, getUserStats };
