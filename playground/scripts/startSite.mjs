import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const REPO_ROOT = fileURLToPath(new URL("../..", import.meta.url));
const VITE_BIN = fileURLToPath(new URL("../../node_modules/vite/bin/vite.js", import.meta.url));
const FRAMEWORK_PORTS = { solid: "8082", react: "8083", vue: "8084", svelte: "8085" };
const PLAYGROUND_URLS = JSON.stringify(
    Object.fromEntries(Object.keys(FRAMEWORK_PORTS).map((framework) => [framework, `/${framework}/`])),
);

const servers = [
    ...Object.entries(FRAMEWORK_PORTS).map(([framework, port]) => ({
        args: [
            "--config",
            `playground-${framework}/vite.config.ts`,
            "--base",
            `/${framework}/`,
            "--port",
            port,
            "--strictPort",
        ],
        env: { VITE_PLAYGROUND_URLS: PLAYGROUND_URLS },
    })),
    {
        args: ["--config", "playground/landing/vite.config.ts"],
        env: {
            PLAYGROUND_SOLID_PORT: FRAMEWORK_PORTS.solid,
            PLAYGROUND_REACT_PORT: FRAMEWORK_PORTS.react,
            PLAYGROUND_VUE_PORT: FRAMEWORK_PORTS.vue,
            PLAYGROUND_SVELTE_PORT: FRAMEWORK_PORTS.svelte,
        },
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
