import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const REPO_ROOT = fileURLToPath(new URL("../..", import.meta.url));
const VITE_BIN = fileURLToPath(new URL("../../node_modules/vite/bin/vite.js", import.meta.url));
const DIST = fileURLToPath(new URL("../../dist", import.meta.url));

const builds = [
    { cwd: "playground-solid", args: ["--base", "/solid/", "--outDir", "../dist/solid/"], otherUrl: "/react/" },
    { cwd: "playground-react", args: ["--base", "/react/", "--outDir", "../dist/react/"], otherUrl: "/solid/" },
    { cwd: "", args: ["--config", "playground/landing/vite.config.ts", "--outDir", DIST, "--emptyOutDir", "false"] },
];

rmSync(DIST, { recursive: true, force: true });

for (const { cwd, args, otherUrl } of builds) {
    const { status } = spawnSync(process.execPath, [VITE_BIN, "build", ...args], {
        cwd: `${REPO_ROOT}${cwd}`,
        stdio: "inherit",
        env: { ...process.env, VITE_OTHER_PLAYGROUND_URL: otherUrl },
    });

    if (status !== 0) process.exit(status ?? 1);
}
