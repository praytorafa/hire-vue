import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: "Failed to authenticate token" });
    }

    req.email = decoded.email;
    req.organizationName = decoded.organizationName;
    next();
  });
};

export default verifyToken;
