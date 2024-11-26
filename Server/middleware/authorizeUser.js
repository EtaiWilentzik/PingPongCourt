const authorizeUser = async (req, res, next) => {
  try {
    const requestedUserId = req.params.id;
    const authenticatedUserId = req.user.userId;

    // Check if the authenticated user is requesting their own data
    if (requestedUserId !== authenticatedUserId) {
      return res.status(403).json({ message: "Forbidden: Access denied." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

module.exports = { authorizeUser };
