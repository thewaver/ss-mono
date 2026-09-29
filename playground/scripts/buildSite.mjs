import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const REPO_ROOT = fileURLToPath(new URL("../..", import.meta.url));
const VITE_BIN = fileURLToPath(new URL("../../node_modules/vite/bin/vite.js", import.meta.url));
const DIST = fileURLToPath(new URL("../../dist", import.meta.url));
const FRAMEWORKS = ["solid", "react", "vue", "svelte"];
const PLAYGROUND_URLS = JSON.stringify(
    Object.fromEntries(FRAMEWORKS.map((framework) => [framework, `/${framework}/`])),
);

const builds = [
    ...FRAMEWORKS.map((framework) => ({
        cwd: `playground-${framework}`,
        args: ["--base", `/${framework}/`, "--outDir", `../dist/${framework}/`],
    })),
    { cwd: "", args: ["--config", "playground/landing/vite.config.ts", "--outDir", DIST, "--emptyOutDir", "false"] },
];

rmSync(DIST, { recursive: true, force: true });

for (const { cwd, args } of builds) {
    const { status } = spawnSync(process.execPath, [VITE_BIN, "build", ...args], {
        cwd: `${REPO_ROOT}${cwd}`,
        stdio: "inherit",
        env: { ...process.env, VITE_PLAYGROUND_URLS: PLAYGROUND_URLS },
    });

    if (status !== 0) process.exit(status ?? 1);
}
