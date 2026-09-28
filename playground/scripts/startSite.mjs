import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const REPO_ROOT = fileURLToPath(new URL("../..", import.meta.url));
const VITE_BIN = fileURLToPath(new URL("../../node_modules/vite/bin/vite.js", import.meta.url));
const SOLID_PORT = "8082";
const REACT_PORT = "8083";

const servers = [
    {
        name: "solid",
        args: [
            "--config",
            "playground-solid/vite.config.ts",
            "--base",
            "/solid/",
            "--port",
            SOLID_PORT,
            "--strictPort",
        ],
        env: { VITE_OTHER_PLAYGROUND_URL: "/react/" },
    },
    {
        name: "react",
        args: [
            "--config",
            "playground-react/vite.config.ts",
            "--base",
            "/react/",
            "--port",
            REACT_PORT,
            "--strictPort",
        ],
        env: { VITE_OTHER_PLAYGROUND_URL: "/solid/" },
    },
    {
        name: "landing",
        args: ["--config", "playground/landing/vite.config.ts"],
        env: { PLAYGROUND_SOLID_PORT: SOLID_PORT, PLAYGROUND_REACT_PORT: REACT_PORT },
    },
];

const children = servers.map(({ args, env }) =>
    spawn(process.execPath, [VITE_BIN, ...args], {
        cwd: REPO_ROOT,
        stdio: "inherit",
        env: { ...process.env, ...env },
    }),
);

const stopAll = () => {
    for (const child of children) child.kill("SIGTERM");
};

for (const child of children) child.on("exit", (code) => code !== null && code !== 0 && stopAll());

process.on("SIGINT", () => {
    stopAll();
    process.exit(0);
});
process.on("SIGTERM", stopAll);
