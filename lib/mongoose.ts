import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");
  if (isConnected) return console.log("Already Connected");

  try {
    console.log("not Connected");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected");
  } catch (error) {}
};
