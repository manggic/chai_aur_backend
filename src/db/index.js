// Import the 'mongoose' library for MongoDB connectivity
import mongoose from "mongoose";

// Import the constant 'DB_NAME' from the 'constants.js' file
import { DB_NAME } from "../constants.js";

// Define an asynchronous function 'connectDB' for establishing a connection to MongoDB
const connectDB = async () => {
  try {
    // Connect to the MongoDB database using the provided URI and database name
    const dbInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    // Log a message indicating a successful MongoDB connection
    // console.log(`MONGODb connected !! DB HOST ${Object.keys(dbInstance)} `);

  } catch (error) {
    // If an error occurs during the MongoDB connection, log the error and exit the process
    console.log("mongoDB connection error", error);
    process.exit(1);
  }
};

// Export the 'connectDB' function for use in other modules
export default connectDB;
