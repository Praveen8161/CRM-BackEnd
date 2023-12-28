import { Service } from "../Schema/service.js";
import { User } from "../Schema/user.js";
import { getUser, getUserBySessionToken } from "./user.js";

// Create Service
export function createService(req) {
  return new Service({ serviceName: req.body.serviceName }).save();
}

// Delete Service
export function deleteService(req) {
  return Service.deleteOne({ _id: req.body._id });
}

// Get Service with new user
export function getServiceCurr(req) {
  return Service.findOne({ _id: req.body._id }).populate("currentUser");
}

// Get Service with old user
export function getServiceOld(req) {
  return Service.findOne({ _id: req.body._id }).populate("oldUser");
}

// Get All Service
export function getAllServices() {
  return Service.find();
}

// Changing Services for Users
export async function changeServices(req) {
  try {
    // Get user data
    const user = await getUserBySessionToken(req);
    if (!user) return { error: "Data not found", acknowledged: false };

    // Remove user data from old services
    for (let val of user.services) {
      const service = await Service.findOne({ _id: val });
      if (!service) return { error: "Data not found", acknowledged: false };

      // add user data to Old user array
      if (!service.oldUser.includes(user._id)) {
        service.oldUser = [...service.oldUser, user._id];
      }

      // remove user data from Current User Array
      if (
        service.currentUser.includes(user._id) &&
        service.currentUser.length > 0
      ) {
        service.currentUser = service.currentUser.filter((curr) => {
          return curr !== user._id;
        });
      }

      // saving service
      await service.save();
    }

    // Add user to the new services
    for (let val of req.body.services) {
      const service = await Service.findOne({ _id: val });
      if (!service) return { error: "Data not found", acknowledged: false };

      // remove user data from oldUser Array
      if (service.oldUser.includes(user._id) && service.oldUser.length > 0) {
        service.oldUser = service.oldUser.filter((old) => {
          return old !== user._id;
        });
      }

      // add user data to current user array
      if (!service.currentUser.includes(user._id)) {
        service.currentUser = [...service.currentUser, user._id];
      }

      // saving service
      await service.save();
    }

    // adding the service to the user database
    user.services = [...req.body.services];

    // saving User data
    await user.save();

    return "Service changed Successfully";
  } catch (err) {
    console.log(err);
  }
}
