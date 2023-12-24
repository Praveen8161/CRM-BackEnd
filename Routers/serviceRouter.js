import express from "express";
import {
  createService,
  deleteService,
  getServiceCurr,
  getServiceOld,
} from "../Controllers/service.js";
import { getAllUser } from "../Controllers/user.js";
const router = express.Router();

// Create Service
router.post("/createservice", async (req, res) => {
  try {
    // create new notification
    const newService = await createService(req);
    if (!newService)
      return res.status(404).json({
        error: "Error creating a new Service",
        acknowledged: false,
      });

    return res.status(201).json({ acknowledged: true, data: newService });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Delete Service
router.delete("/deleteservice", async (req, res) => {
  try {
    // create new notification
    const rmService = await deleteService(req);
    if (!rmService)
      return res.status(404).json({
        error: "Error creating a new Service",
        acknowledged: false,
      });

    // delete Service for All users
    const allUsers = await getAllUser();
    if (!allUsers || allUsers.length < 1)
      return res
        .status(404)
        .json({ acknowledged: false, error: "No user found" });

    for (let val of allUsers) {
      let len = val.services.length;
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          let serID = val.services.pop();
          if (serID !== req.body._id) {
            val.services.push(serID);
          }
        }
      }
      await val.save();
    }

    return res
      .status(201)
      .json({ acknowledged: true, data: "service removed" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Get Service with User Details
router.get("/getservice", async (req, res) => {
  try {
    if (req.body.user === "currentUser") {
      const service = await getServiceCurr(req);
      if (!service)
        return res.status(404).json({
          error: "No Services found",
          acknowledged: false,
        });

      return res.status(201).json({ acknowledged: true, data: service });
    } else {
      const service = await getServiceOld(req);
      if (!service)
        return res.status(404).json({
          error: "No Services found",
          acknowledged: false,
        });

      return res.status(201).json({ acknowledged: true, data: service });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Change Service for Users
router.patch("/changeservice", async (req, res) => {
  try {
    const changes = await changeServices(req);
    if (!changes)
      return res
        .status(400)
        .json({ error: "Error adding data", acknowledged: false });

    res.status(200).json({ data: changes, acknowledged: true });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

export const serviceRouter = router;
