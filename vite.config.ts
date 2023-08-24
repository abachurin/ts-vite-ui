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
        host: "localhost",
        port: 8080,
    },
});
