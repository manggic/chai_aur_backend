// Define a higher-order function called 'asyncHandler'
// This function takes another function 'fn' (an asynchronous function) as its argument
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    // Execute the provided asynchronous function 'fn'
    await fn(req, res, next);
  } catch (error) {
    // If an error occurs during the execution of 'fn', catch the error

    // Respond with a 404 status and a JSON object indicating failure
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// Export the 'asyncHandler' function for use in other modules
export default asyncHandler;
