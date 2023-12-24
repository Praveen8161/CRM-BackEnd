import { Notification } from "../Schema/notification.js";
import { User } from "../Schema/user.js";

// Get Users Notification
export function getNotifyByUser(req) {
  return User.find({ sessionToken: req.body.sessionToken }).populate(
    "notification.data"
  );
}

// Delete Notification Document
export function deleteNotify(req) {
  return Notification.deleteOne({ _id: req.body.notifyId });
}

// Create Notification
export function createNotify(req) {
  return new Notification(req.body).save();
}

// Get Notification
export function getNotify(req) {
  return Notification.findOne({ _id: req.body._id });
}
