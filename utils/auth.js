const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const expiration = "10h";

const signToken = ({ _id, username, email }) => {
  const payload = { _id, username, email };

  return jwt.sign({ data: payload }, secret, {
    expiresIn: expiration,
  });
};

const authMiddleware = (req, res, next) => {
  // A token is header.payload.signature

  // Checks to see if the token was sent in the request
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }

  if (!token) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  // Check if the token is expired.
  try {
    const  data  = jwt.verify(token, secret, {
      maxAge: expiration,
    });

    req.user = data;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = {
  signToken,
  authMiddleware,
};