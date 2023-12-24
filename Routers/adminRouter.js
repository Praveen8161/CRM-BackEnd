import express from "express";
import bcrypt from "bcrypt";
import { sendActivationMail } from "../helpers/activationMail.js";
import { genearateActiveToken, genearateSessionToken } from "../Auth/auth.js";
import {
  getAdmin,
  getAdminBySessionToken,
  getAdminByToken,
  newAdmin,
} from "../Controllers/admin.js";
import { ticketRouter } from "./ticketRouter.js";
import { forgotRouter } from "./forgotPasswordRouter.js";
import { updateRouter } from "./updateNewPassword.js";
import { notificationRouter } from "./notificationRouter.js";

const router = express.Router();

// middleware function for forgot password
const checkAdmin = async (req, res, next) => {
  try {
    // user exist
    const user = await getAdmin(req);
    if (!user) return res.status(404).json({ error: "user not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
};

// check user by token for updating password
const checkUserByToken = async (req, res, next) => {
  try {
    const { id, token } = req.params;
    // user exist
    const user = await getAdminByToken(token);
    if (!user) return res.status(404).json({ error: "user not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
};

// check user by Session Token for logout and to use App features
const checkUserBySessionToken = async (req, res, next) => {
  try {
    // user exist
    const user = await getUserBySessionToken(req);
    if (!user) return res.status(404).json({ error: "user not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
};

// to send activation email
async function activationMail(email) {
  const actToken = genearateActiveToken(email);

  const activeMail = await sendActivationMail(email, actToken);

  if (!activeMail)
    return {
      acknowledged: false,
    };

  return {
    acknowledged: true,
    actToken,
  };
}

// Signup
router.post("/signup", async (req, res) => {
  try {
    // check user
    const checkUser = await getAdmin(req);
    if (checkUser) return res.status(400).json({ error: "user already exist" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // saving new user
    const user = {
      ...req.body,
      password: hashedPassword,
    };

    //Send activation mail
    const actMailSent = await activationMail(user.email);
    if (!actMailSent.acknowledged)
      return res.status(400).json({
        error: "error sending confirmation mail Please check the mail address",
        acknowledged: false,
      });

    // save the new user after confirmation email
    const savedUser = await newAdmin(user);
    savedUser.activationToken = actMailSent.actToken;
    await savedUser.save();

    res.status(201).json({
      message: "Successfully Registered",
      id: savedUser._id,
      email: "Confirmation email is send to your email Address",
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    // user exist
    const user = await getAdmin(req);
    if (!user) return res.status(404).json({ error: "user not found" });

    //validating password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(404).json({ error: "Incorrect password" });
    if (user.account === "inactive")
      return res.status(404).json({
        error: "verification not completed, verify your account to login",
        active: true,
      });

    // generate session token
    const sesToken = genearateSessionToken(user._id);
    if (!sesToken) res.status(404).json({ error: "user not found" });

    user.sessionToken = sesToken;
    await user.save();

    res
      .status(200)
      .json({ data: "logged in successfully", sessionToken: sesToken });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Resend Activation email by email
router.post("/resendemail", async (req, res) => {
  try {
    // check user
    const checkUser = await getAdmin(req);

    if (!checkUser)
      return res
        .status(400)
        .json({ error: "user not found", acknowledged: false });

    // Send activation mail
    const actMailSent = await activationMail(checkUser.email);
    if (!actMailSent.acknowledged)
      return res.status(400).json({
        error:
          "error sending confirmation mail Please check the entered mail address",
        acknowledged: false,
      });

    checkUser.activationToken = actMailSent.actToken;
    await checkUser.save();

    res.status(201).json({
      message: "verification email is send to your email Address",
      acknowledged: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// logout
router.get("/logout", async (req, res) => {
  try {
    // check user
    const checkUser = await getAdminBySessionToken(req);

    if (!checkUser)
      return res
        .status(400)
        .json({ error: "user not found", acknowledged: false });

    // removing the session token
    checkUser.sessionToken = "";
    await checkUser.save();

    res.status(201).json({
      message: "session token removed",
      acknowledged: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// forgot password
router.use("/forgot", checkAdmin, forgotRouter);

// update password
router.use("/update", checkUserByToken, updateRouter);

// tickets
router.use("/ticket", checkUserBySessionToken, ticketRouter);

// Notification
router.use("/notify", checkManagerBySessionToken, notificationRouter);

export const adminRouter = router;
