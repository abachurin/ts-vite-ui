import { defineConfig } from "vite";
import dns from "dns";
import react from "@vitejs/plugin-react";

dns.setDefaultResultOrder("verbatim");

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        target: "esnext",
    },
    server: {
        host: "0.0.0.0",
        port: 8080,
    },
});
