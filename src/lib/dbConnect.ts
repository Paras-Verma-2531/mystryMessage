import mongoose from "mongoose";

// method to make connection with database
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("database connected successfully");
    });
  } catch (error: any) {
    console.log("database connection failed", error.message);
    process.exit(1);
  }
};
export default connectDb;
