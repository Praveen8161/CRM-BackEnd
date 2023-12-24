import { Admin } from "../Schema/admin.js";

// find one user by email for login and forgot password
export function getAdmin(req) {
  return Admin.findOne({ email: req.body.email });
}

// add new user
export function newAdmin(user) {
  return new Admin(user).save();
}

// get Admin by token for update password
export async function getAdminByToken(token) {
  return Admin.findOne({ token: token });
}

// get Admin by Session Token for to use all app features and logout
export async function getAdminBySessionToken(req) {
  return Admin.findOne({ sessionToken: req.body.sessionToken });
}
