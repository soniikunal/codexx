import jwt, { SignOptions } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "yourfallbacksecret";

export const signToken = (
  payload: string | object | Buffer,
  expiresIn: SignOptions["expiresIn"] = "1d"
): string => {
  return jwt.sign(payload, SECRET, {
    expiresIn,
  });
};

export const verifyToken = (token: string) => jwt.verify(token, SECRET);
