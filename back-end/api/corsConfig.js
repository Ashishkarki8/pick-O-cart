import appConfig from "./appConfig.js";

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            appConfig.frontendURL, // Main front-end URL
            'https://staging.example.com' // Test URL
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS')); // Block the request
        }
    },
    methods: ['POST', 'GET', 'DELETE', 'PATCH', 'PUT', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: [
        "Content-Type",       // Specifies data format (JSON, etc.)
        "Authorization",      // For secure login tokens
        "Cache-Control",      // Controls caching behavior
        "Expires",            // Caching header
        "Pragma",             // Caching header
        "X-Requested-With"    // AJAX requests
    ],
    credentials: true, // Allow cookies or tokens
    maxAge: 86400      // Cache preflight requests for 24 hours
};

export default corsOptions 