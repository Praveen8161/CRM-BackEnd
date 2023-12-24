import { User } from "../Schema/user.js";

// find one user by email
export function getUser(req) {
  return User.findOne({ email: req.body.email });
}

// find one user by email
export function getAllUser(req) {
  return User.find();
}

// add new user
export function newUser(user) {
  return new User(user).save();
}

// get user by token
export async function getUserByToken(req) {
  return User.findOne({ token: req.body.token });
}

// get user by Session Token
export async function getUserBySessionToken(req) {
  return User.findOne({ sessionToken: req.body.sessionToken });
}
