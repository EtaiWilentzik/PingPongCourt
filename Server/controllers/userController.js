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

// const getUserStats = async (req, res) => {
//   const userName = req.params.id;
//   result = await userService.getUserStats({ userName });
//   res.json(result);
// };

const otherUsers = async (req, res) => {
  result = await userService.otherUsers(req.user.userId);
  res.status(result.statusCode).json(result);
};
module.exports = { register, login, otherUsers };
