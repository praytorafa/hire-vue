// middleware/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized: Invalid token" });
    }

    req.userId = decoded.id;
    next();
  });
};

export default authMiddleware;
