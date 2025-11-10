const jwt = require("jsonwebtoken");
const Users = require("../module/userModule");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "RANDOM-TOKEN");
      req.user = await Users.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found, token invalid" });
      }

      next();
    } catch (error) {
      console.error("Auth Error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

const adminOnly = (req, res, next) => {
  console.log(req.user)
  console.log(req.user.role)
  if (req.user && String(req.user.role) === "admin") next();
  else res.status(403).json({ message: "Admin access only" });
};

module.exports = { protect, adminOnly };

// const jwt = require("jsonwebtoken");
// const Users = require("../module/userModule");
// // import Book from '../module/booksModule.js'

// const protect = async (req, res, next) => {
//   let token;

//   // Check for Bearer token in headers
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET || "RANDOM-TOKEN");

//       // Attach user (excluding password) to request
//       // req.user = await User.findById(decoded.id).select('-password');
//     req.user = await Users.findById(decoded.userId).select('-password');

//       if (!req.user) {
//         return res.status(401).json({ message: 'User not found, token invalid' });
//       }
//       next();
//     } catch (error) {
//       console.error('Auth Error:', error);
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   } else {
//     res.status(401).json({ message: 'Not authorized, no token provided' });
//   }
// };
// const adminOnly = (req, res, next) => {
//   if (req.user && req.user.role === "admin") next();
//   else res.status(403).json({ message: "Admin access only" });
// };

// module.exports = {protect, adminOnly};


// module.exports = async (request, response, next) => {
// try {
// //   get the token from the authorization header
//     const token = await request.headers.authorization.split(" ")[1];

//     //check if the token matches the supposed origin
//     const decodedToken = await jwt.verify(
//       token,
//       "RANDOM-TOKEN"
//     );

//     // retrieve the user details of the logged in user
//     const user = decodedToken;

//     // pass the the user down to the endpoints here
//     request.user = user;

//     // pass down functionality to the endpoint
//     next();

    
//     } catch (error) {
//         response.status(401).json({
//             error: "invalid request"
//           });
//     }
// }