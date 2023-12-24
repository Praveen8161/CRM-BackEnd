import jwt from "jsonwebtoken";

// Activation token
export function genearateActiveToken(email) {
  return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "2d" });
}

// Session token
export function genearateSessionToken(id) {
  return jwt.sign({ id }, process.env.SECRET_KEY);
}

// reset token
export function genearateToken(id) {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "15m" });
}
