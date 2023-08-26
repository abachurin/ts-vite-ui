export const BACK_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : "http://service:5000";
