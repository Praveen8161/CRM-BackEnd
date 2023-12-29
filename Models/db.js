import mongoose from "mongoose";
import dotenv from "dotenv";

//dot env config
dotenv.config();

const localURL = process.env.LOCAL_URL;
const mongoURL = process.env.MONGO_URL;

export function dbConnect() {
  try {
    mongoose.connect(mongoURL);
    console.log("DataBase Connected");
  } catch (err) {
    console.log(`DataBase Not Connected: ${err}`);
  }
}
