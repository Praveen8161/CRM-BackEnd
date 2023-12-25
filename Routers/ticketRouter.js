import express from "express";
import {
  createNewTicket,
  deleteTicket,
  getAllTickets,
  getTicketById,
  getUserTickets,
} from "../Controllers/tickets.js";

const router = express.Router();

// Get tickets all roles
router.get("/view", async (req, res) => {
  try {
    //check user
    if (req.user.role === "Admin" || req.user.role === "Manager") {
      // get all tickets
      const allTickets = await getAllTickets();

      if (!allTickets || allTickets.length < 1)
        return res
          .status(404)
          .json({ message: "No Tickets Found", error: "404 no tickets found" });

      return res.status(201).json({ acknowlegment: true, ticktes: allTickets });
    }

    if (req.user.role === "User") {
      // get only user tickets
      const userTickets = await getUserTickets(req);
      if (!userTickets || userTickets.length < 1)
        return res
          .status(404)
          .json({ message: "No Tickets Found", error: "404 no tickets found" });

      return res
        .status(201)
        .json({ acknowlegment: true, ticktes: userTickets });
    }

    return res
      .status(400)
      .json({ message: "No Tickets Found", error: "No user Role found" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Delete ticket -- Admin
router.delete("/delete", async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const deleteOneTicket = await deleteTicket(req);
      return res
        .status(201)
        .json({ message: "ticket deleted", data: deleteOneTicket });
    }
    return res.status(401).json({ error: "permission denied" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Create ticket -- User
router.post("/create", async (req, res) => {
  try {
    if (req.user.role === "User") {
      const newTicket = await createNewTicket(req);

      if (!newTicket)
        return res
          .status(404)
          .json({ error: "Cannot create ticket", acknowleged: false });

      return res.status(201).json({
        message: "Ticket Created",
        data: newTicket,
        acknowleged: true,
      });
    }
    return res.status(401).json({ error: "permission denied" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Resolve ticket -- Admin and Manager
router.post("/resolve", async (req, res) => {
  try {
    if (req.user.role === "User") {
      return res.status(404).json({
        error: "Cannot Resolve ticket",
        acknowleged: false,
        message: "Permission denied",
      });
    }
    const ticket = await getTicketById(req);
    if (!ticket)
      return res
        .status(404)
        .json({ acknowleged: false, error: "No Ticket Found" });

    ticket.resolvedBy = req.user._id;
    ticket.resolvedAt = new Date.now();
    ticket.resolveComment = req.body.comment || "No Comment";
    await ticket.save();

    return res
      .status(201)
      .json({ acknowleged: true, message: "Ticket Resolved" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

export const ticketRouter = router;
