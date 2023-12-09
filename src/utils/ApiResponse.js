// Define a class 'ApiResponse' for creating response objects
class ApiResponse {
    // Constructor for creating instances of 'ApiResponse'
    constructor(statusCode, data, message = "Success") {
        // Set properties specific to the 'ApiResponse' class
        this.statusCode = statusCode;   // HTTP status code for the response
        this.data = data;               // Data payload of the response
        this.message = message;         // Message indicating the status of the response (default is "Success")
        this.success = true;            // Indicates that the operation was successful
    }
}

// Export the 'ApiResponse' class for use in other modules
export { ApiResponse };
