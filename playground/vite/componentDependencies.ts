import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

const VIRTUAL_ID = "virtual:component-dependencies";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;
const IMPORT_PATTERN = /^import\s+(?!type\s)[^;]*?["']([^"']+)["'];?\s*$/gm;
const ABSTRACTS_LAYER = "Abstracts";
const COMPONENT_LAYERS = new Set(["Fundamentals", "Composites", "Exotics"]);

type Dependencies = {
    abstracts: string[];
    components: string[];
};

const toPosix = (file: string) => file.split(path.sep).join("/");

const collectFiles = async (dir: string): Promise<string[]> => {
    const entries = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) files.push(...(await collectFiles(full)));
        else if (/\.tsx?$/.test(entry.name)) files.push(toPosix(full));
    }

    return files;
};

const resolveSpecifier = (fromFile: string, specifier: string, known: Set<string>) => {
    if (!specifier.startsWith(".")) return undefined;

    const base = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), specifier));

    return [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find((candidate) => known.has(candidate));
};

const classify = (relativeFile: string, ownerName: string) => {
    const segments = relativeFile.split("/");
    const name = segments[0] === ABSTRACTS_LAYER ? segments[1] : segments[segments.length - 2];

    if (!name || name === ownerName) return undefined;
    if (segments[0] === ABSTRACTS_LAYER) return { kind: "abstracts" as const, name };
    if (COMPONENT_LAYERS.has(segments[0])) return { kind: "components" as const, name };

    return undefined;
};

const buildDependencyMap = async (root: string) => {
    const files = await collectFiles(root);
    const known = new Set(files);
    const imports = new Map<string, string[]>();

    for (const file of files) {
        const source = await readFile(file, "utf8");
        const targets: string[] = [];

        for (const match of source.matchAll(IMPORT_PATTERN)) {
            const resolved = resolveSpecifier(file, match[1], known);

            if (resolved) targets.push(resolved);
        }

        imports.set(file, targets);
    }

    const rootPosix = toPosix(root);
    const relativeTo = (file: string) => file.slice(rootPosix.length + 1);

    const entries = new Map<string, string>();

    for (const file of files) {
        const segments = relativeTo(file).split("/");
        const owner = segments[segments.length - 2];

        if (owner && segments[segments.length - 1].replace(/\.tsx?$/, "") === owner) entries.set(owner, file);
    }

    const map: Record<string, Dependencies> = {};

    for (const [name, entry] of entries) {
        const seen = new Set([entry]);
        const queue = [entry];

        while (queue.length) {
            for (const next of imports.get(queue.pop() as string) ?? []) {
                if (seen.has(next)) continue;

                seen.add(next);
                queue.push(next);
            }
        }

        const found: Record<"abstracts" | "components", Set<string>> = {
            abstracts: new Set(),
            components: new Set(),
        };

        for (const file of seen) {
            const tag = classify(relativeTo(file), name);

            if (tag) found[tag.kind].add(tag.name);
        }

        map[name] = {
            abstracts: [...found.abstracts].sort(),
            components: [...found.components].sort(),
        };
    }

    return map;
};

export const componentDependencies = (componentsRoot: string): Plugin => ({
    name: "component-dependencies",
    resolveId(source) {
        return source === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },
    async load(id) {
        if (id !== RESOLVED_ID) return undefined;

        return `export default ${JSON.stringify(await buildDependencyMap(componentsRoot))};`;
    },
    configureServer(server) {
        server.watcher.add(componentsRoot);

        server.watcher.on("all", (_event, file) => {
            if (!toPosix(file).startsWith(toPosix(componentsRoot))) return;

            const module = server.moduleGraph.getModuleById(RESOLVED_ID);

            if (module) server.reloadModule(module);
        });
    },
});
