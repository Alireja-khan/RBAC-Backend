import jwt, { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "supersecret";

export const generateJWT = (
  payload: object,
  expiresIn: SignOptions["expiresIn"] = "1h"
) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyJWT = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
