// middleware/verify-token.js

// We'll need to import jwt to use the verify method
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Assign decoded payload to req.user
    req.user = decoded;
    // Call next() to invoke the next middleware function
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token has expired." });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token." });
    } else {
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}

// We'll need to export this function so that we can use it in our controllers file
module.exports = verifyToken;
