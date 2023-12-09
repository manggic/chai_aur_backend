// Import the 'dotenv' library to load environment variables from a file
import dotenv from "dotenv";

// Configure dotenv to use the specified file path for loading environment variables
dotenv.config({
  path: "./env",
});

// Destructure the 'PORT' variable from 'process.env' or use an empty object as default
const { PORT } = process.env || {};

// Import the 'connectDB' function from the './db/index.js' file
import connectDB from "./db/index.js";

// Import the 'app' instance from the './app.js' file
import app from "./app.js";

// Establish a connection to the database and start the server
connectDB()
  .then(() => {
    // Server successfully connected to the database, start listening on the specified port
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((err) => {
    // An error occurred during the database connection or server startup
    console.log("ERROR", err);
  });

// The following code block is an alternative method to connect to the database using Mongoose
// This block is currently commented out and not in use

// ;(async () => {
//   try {
//     // Use Mongoose to connect to the MongoDB database using the URI from environment variables
//     const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//   } catch (error) {
//     // An error occurred during the database connection
//     console.log('DB ERROR', error);
//   }
// })();
