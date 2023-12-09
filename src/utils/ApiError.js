// Define a custom error class 'ApiError' that extends the built-in 'Error' class
class ApiError extends Error {
    // Constructor for creating instances of 'ApiError'
    constructor(
        statusCode,           // HTTP status code for the error
        message = "Something went wrong",  // Default error message
        errors = [],           // Array of additional error details or messages
        stack = ""             // Stack trace for the error
    ) {
        // Call the constructor of the parent 'Error' class with the provided message
        super(message);

        // Set properties specific to the 'ApiError' class
        this.statusCode = statusCode;  // HTTP status code
        this.data = null;              // Additional data (initially set to null)
        this.message = message;        // Error message
        this.success = false;          // Indicates that the operation was not successful
        this.errors = errors;          // Array of additional error details or messages

        // If a stack trace is provided, set the 'stack' property; otherwise, capture the stack trace
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export the 'ApiError' class for use in other modules
export { ApiError };
