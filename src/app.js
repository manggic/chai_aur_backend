// Import necessary middleware libraries
import cors from "cors"; // Cross-Origin Resource Sharing middleware
import express, { urlencoded } from "express"; // Express framework and its urlencoded middleware
import cookieParser from "cookie-parser"; // Middleware for parsing cookies

// Destructure the 'CORS_ORIGIN' variable from 'process.env'
const { CORS_ORIGIN } = process.env;

// Create an Express application
const app = express();

// console.log("app", app)

// Use cookie-parser middleware to parse cookies in incoming requests
app.use(cookieParser());

// Configure CORS middleware to allow requests from a specified origin with credentials
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

// Parse incoming JSON payloads in request bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Parse incoming URL-encoded data with extended options and a limit of 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


// routes import 
import userRoutes from './routes/user.routes.js'
import videoRoutes from './routes/video.routes.js'
import commentRoutes from './routes/comment.routes.js'
import playlistRoutes from './routes/playlist.routes.js'
import subscriptionRoutes from './routes/subscription.routes.js'
import likeRoutes from './routes/like.routes.js'


app.use('/api/v1/users', userRoutes);
app.use('/api/v1/videos', videoRoutes)
app.use('/api/v1/comments', commentRoutes)
app.use('/api/v1/playlists', playlistRoutes)
app.use('/api/v1/likes', likeRoutes)
app.use('/api/v1/subscriptions', subscriptionRoutes)


// Export the configured Express application for use in other modules
export default app;
