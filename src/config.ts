export const BACK_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : "https://api.robot2048.com:5000";
