require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, `${process.env.SECRET_KEY}`, (err, decoded) => {
      if (err) return reject(err);

      return resolve(decoded);
    });
  });
};

const authenticate = async (req, res, next) => {
  // if user dont have or not present bearer token in header
  if (!req.headers.authorization)
    return res
      .status(400)
      .send({ message: "Authorization token not found or incorrect" });

  //if someone dont have a token in header which starts with "Bearer "
  if (!req.headers.authorization.startsWith("Bearer "))
    return res
      .status(400)
      .send({ message: "Authorization token not found or incorrect" });

  const token = req.headers.authorization.trim().split(" ")[1];

  let decoded;
  try {
    decoded = await verifyToken(token);
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ message: "Authorization token not found or incorrect" });
  }

  console.log(decoded);

  req.userID = decoded.user._id;

  // if you dont return next it going in infinite
  return next();
};

module.exports = authenticate;
