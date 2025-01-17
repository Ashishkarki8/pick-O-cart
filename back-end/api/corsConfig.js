import appConfig from "./appConfig.js";

// Determine if the environment is development
const isDevelopment = appConfig.nodeEnv === "development";

// CORS options
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            appConfig.frontendURL,
            "http://127.0.0.1:5173",
        ];

        if (isDevelopment) {
            // Allow requests with no origin (e.g., mobile apps, CLI tools)
            if (!origin) {
                return callback(null, true);
            }

            // Check if the origin is allowed
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
        } else {
            // In production, perform strict origin checking
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
        }

        callback(new Error("Not allowed by CORS"));
    },

    // Allowed HTTP methods
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

    // Allowed headers
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
        "Cache-Control",
    ],

    // Exposed headers (accessible to client)
    exposedHeaders: [
        "Content-Length",
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
    ],

    // Allow credentials (cookies, authorization headers)
    credentials: true,

    // Cache preflight requests
    maxAge: isDevelopment ? 86400 : 7200, // 24 hours in dev, 2 hours in prod

    // Additional security options
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

// Helper function to apply CORS and security headers
export const applyCorsAndSecurity = (app) => {
    app.use((req, res, next) => {
        // Security headers
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-XSS-Protection", "1; mode=block");

        if (!isDevelopment) {
            res.setHeader(
                "Strict-Transport-Security",
                "max-age=31536000; includeSubDomains"
            );
        }

        next();
    });

    return corsOptions;
};

export default corsOptions;
