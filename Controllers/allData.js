import { Service } from "../Schema/service.js";
import { Ticket } from "../Schema/tickets.js";
import { User } from "../Schema/user.js";

// All  ticket data
export function getAllTicketData() {
  return Ticket.find();
}

// All user Ticket
export function getAllUserTicket(req) {
  return Ticket.find({ createdBy: req.user._id });
}

// All Services
export function getAllServices() {
  return Service.find();
}

// All Users
export function getAllUser() {
  return User.find();
}
