//this is version 1
// const jwt = require("jsonwebtoken");

// const authenticateToken = (req, res, next,) => {
//   const authHeader = req.headers["authorization"];
//   console.log(authHeader);
//   const token = authHeader?.split(" ")[1];

//   if (token === undefined) return res.status(401); // Unauthorized

//   jwt.verify(token, process.env.KEY, (err, user) => {
//     // console.log("the error is ", err);
//     if (err) return res.status(403).json({ message: err.message });

//     // Save the user information from the token to the request object
//     // req.user = user;

//     const requestedUserName = req.params.id; // The userName from the URL
//     const authenticatedUserName = user.userName; // The userName from the token

//     if (requestedUserName !== authenticatedUserName) {
//       return res.status(404).json({ message: "not the right token for this user" });
//     }

//     next();
//   });
// };

// module.exports = { authenticateToken };

//this is version 2
// const jwt = require("jsonwebtoken");

// const authenticateToken = (getRequestedUserName) => {
//   return (req, res, next) => {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader?.split(" ")[1];

//     if (token === undefined) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     jwt.verify(token, process.env.KEY, (err, user) => {
//       if (err) {
//         return res.status(403).json({ message: err.message });
//       }

//       const requestedUserName = getRequestedUserName(req); //this applying the function inside the router (req)=>req.body.id for example
//       console.log("the requested is " + requestedUserName);
//       const authenticatedUserName = user.userName;

//       if (requestedUserName !== authenticatedUserName) {
//         return res.status(404).json({ message: "Not the right token for this user" });
//       }

//       next();
//     });
//   };
// };

// module.exports = { authenticateToken };

// const jwt = require("jsonwebtoken");

// // Modify authenticateToken to accept an authorization function that can be async
// const authenticateToken = (authorizeFunc) => {
//   return (req, res, next) => {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader?.split(" ")[1];

//     if (token === undefined) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     jwt.verify(token, process.env.KEY, async (err, user) => {
//       if (err) {
//         return res.status(403).json({ message: err.message });
//       }
//       const authenticatedUserId = user.userId; // userId is the string of the object. for example 671e29646677eaf684c536f6 and the type is string.
//       // console.log(typeof authenticatedUserId);
//       try {
//         // Call the authorization function with req and authenticatedUserId
//         const isAuthorized = await authorizeFunc(req, authenticatedUserId);
//         if (!isAuthorized) {
//           return res.status(403).json({ message: "Forbidden" });
//         }
//         next();
//       } catch (error) {
//         return res.status(500).json({ message: error.message });
//       }
//     });
//   };
// };

// module.exports = { authenticateToken };

//this is number 4
// middleware/authenticateMiddleware.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided." });
  }

  jwt.verify(token, process.env.KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token." });
    }

    // Attach user information to the request object
    req.user = user; // Assuming 'user' contains 'userId' and other relevant info
    next();
  });
};

module.exports = { authenticateToken };
