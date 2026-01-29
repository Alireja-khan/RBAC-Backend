import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const generateJWT = (payload: object, expiresIn = "1h") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};
export const verifyJWT = (token: string) => {
    return jwt.verify(token, JWT_SECRET)
}