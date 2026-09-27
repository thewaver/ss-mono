import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const fromHere = (path: string) => fileURLToPath(new URL(path, import.meta.url));

const SOLID_PORT = Number(process.env.PLAYGROUND_SOLID_PORT ?? 8082);
const REACT_PORT = Number(process.env.PLAYGROUND_REACT_PORT ?? 8083);

export default defineConfig({
    root: fromHere("."),
    server: {
        port: 8080,
        strictPort: true,
        open: "/",
        proxy: {
            "/solid": { target: `http://localhost:${SOLID_PORT}`, ws: true },
            "/react": { target: `http://localhost:${REACT_PORT}`, ws: true },
        },
    },
});
