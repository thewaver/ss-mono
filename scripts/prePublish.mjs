import { exec, execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
const PUBLISH_ORDER = [
    "utils",
    "components",
    "components-solid",
    "components-react",
    "components-vue",
    "components-svelte",
];
const BUMP = process.argv.includes("--major") ? "major" : process.argv.includes("--minor") ? "minor" : "patch";

const execAsync = promisify(exec);

const readManifest = (dir) => readFileSync(`${REPO_ROOT}/${dir}/package.json`, "utf8");

const writeManifest = (dir, text) => writeFileSync(`${REPO_ROOT}/${dir}/package.json`, text);

const parseVersion = (version) => {
    const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);

    if (!match) throw new Error(`Cannot bump "${version}": expected major.minor.patch`);

    return match.slice(1).map(Number);
};

const bumpVersion = (version) => {
    const [major, minor, patch] = parseVersion(version);

    if (BUMP === "major") return `${major + 1}.0.0`;
    if (BUMP === "minor") return `${major}.${minor + 1}.0`;

    return `${major}.${minor}.${patch + 1}`;
};

const fetchPublishedVersion = async (name) => {
    try {
        const { stdout } = await execAsync(`npm view ${name} version`, { cwd: REPO_ROOT });

        return stdout.trim();
    } catch (error) {
        if (String(error.stderr).includes("E404")) return null;

        throw new Error(`Could not ask npm for ${name}'s version:\n${error.stderr}`);
    }
};

const run = (command) => execSync(command, { cwd: REPO_ROOT, stdio: "inherit" });

const packages = PUBLISH_ORDER.map((dir) => {
    const manifest = JSON.parse(readManifest(dir));

    return { dir, name: manifest.name, current: manifest.version };
});

const publishedVersions = await Promise.all(packages.map(({ name }) => fetchPublishedVersion(name)));

packages.forEach((pkg, index) => {
    const published = publishedVersions[index];

    pkg.next = published === null ? pkg.current : bumpVersion(published);
    pkg.published = published;
});

for (const { dir } of packages) {
    let text = readManifest(dir);
    const own = packages.find((pkg) => pkg.dir === dir);

    text = text.replace(/("version":\s*")[^"]+(")/, `$1${own.next}$2`);

    for (const { name, next } of packages) {
        text = text.replaceAll(new RegExp(`("${name}":\\s*")\\^[^"]+(")`, "g"), `$1^${next}$2`);
    }

    writeManifest(dir, text);
}

console.log(`\n${BUMP} bump, counted from the versions on npm:\n`);

for (const { name, published, current, next } of packages) {
    const from = published ?? "not on npm yet";
    const note = current === next ? "" : `  (manifest said ${current})`;

    console.log(`  ${name}: ${from} -> ${next}${note}`);
}

console.log("\nUpdating package-lock.json…\n");
run("npm install --package-lock-only --ignore-scripts");

console.log("\nBuilding…\n");
run("npm run build");
