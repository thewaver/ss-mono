import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

const VIRTUAL_ID = "virtual:component-dependencies";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;
const IMPORT_PATTERN = /^import\s+(?!type\s)[^;]*?["']([^"']+)["'];?\s*$/gm;
const SOURCE_PATTERN = /\.tsx?$/;
const TEST_PATTERN = /\.test\.tsx?$/;
const ABSTRACTS_LAYER = "Abstracts";
const COMPONENT_LAYERS = new Set(["Fundamentals", "Composites", "Exotics"]);
const UNIT_NAME_OVERRIDES: [folder: string, name: string][] = [
    ["Abstracts/SVG/Defs/Animation", "SVGAnimations"],
    ["Abstracts/SVG/Defs/Filter", "SVGFilters"],
    ["Abstracts/SVG/Defs/Gradient", "SVGGradients"],
    ["Abstracts/SVG/Defs/Pattern", "SVGPatterns"],
];

type DependencyNames = {
    abstracts: string[];
    components: string[];
};

type Dependencies = {
    uses: DependencyNames;
    usedBy: DependencyNames;
};

const toPosix = (file: string) => file.split(path.sep).join("/");

const collectFiles = async (dir: string): Promise<string[]> => {
    const entries = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) files.push(...(await collectFiles(full)));
        else if (SOURCE_PATTERN.test(entry.name) && !TEST_PATTERN.test(entry.name)) files.push(toPosix(full));
    }

    return files;
};

const resolveSpecifier = (fromFile: string, specifier: string, known: Set<string>) => {
    if (!specifier.startsWith(".")) return undefined;

    const base = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), specifier));

    return [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find((candidate) => known.has(candidate));
};

const getUnitName = (relativeFile: string) => {
    const override = UNIT_NAME_OVERRIDES.find(([folder]) => relativeFile.startsWith(`${folder}/`));

    if (override) return override[1];

    const segments = relativeFile.split("/");

    return segments[0] === ABSTRACTS_LAYER ? segments[1] : segments[segments.length - 2];
};

const getUnitKind = (relativeFile: string) => {
    const layer = relativeFile.split("/")[0];

    if (layer === ABSTRACTS_LAYER) return "abstracts" as const;

    return COMPONENT_LAYERS.has(layer) ? ("components" as const) : undefined;
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

    const entries = new Map<string, string[]>();
    const abstractUnits = new Map<string, string[]>();

    for (const file of files) {
        const relative = relativeTo(file);
        const segments = relative.split("/");
        const owner = segments[segments.length - 2];

        if (owner && segments[segments.length - 1].replace(SOURCE_PATTERN, "") === owner) entries.set(owner, [file]);

        if (segments[0] !== ABSTRACTS_LAYER) continue;

        const unit = getUnitName(relative);

        if (!unit) continue;

        const unitFiles = abstractUnits.get(unit) ?? [];

        unitFiles.push(file);
        abstractUnits.set(unit, unitFiles);
    }

    for (const [unit, unitFiles] of abstractUnits) {
        if (!entries.has(unit)) entries.set(unit, unitFiles);
    }

    const map: Record<string, Dependencies> = {};
    const kinds = new Map<string, "abstracts" | "components">();

    for (const [name, entry] of entries) {
        const seen = new Set(entry);
        const queue = [...entry];

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
            const relative = relativeTo(file);
            const unit = getUnitName(relative);
            const kind = getUnitKind(relative);

            if (!unit || !kind || unit === name) continue;

            found[kind].add(unit);
        }

        const kind = getUnitKind(relativeTo(entry[0]));

        if (kind) kinds.set(name, kind);

        map[name] = {
            uses: {
                abstracts: [...found.abstracts].sort(),
                components: [...found.components].sort(),
            },
            usedBy: { abstracts: [], components: [] },
        };
    }

    for (const [name, dependencies] of Object.entries(map)) {
        const kind = kinds.get(name);

        if (!kind) continue;

        for (const used of [...dependencies.uses.abstracts, ...dependencies.uses.components]) {
            map[used]?.usedBy[kind].push(name);
        }
    }

    for (const dependencies of Object.values(map)) {
        dependencies.usedBy.abstracts.sort();
        dependencies.usedBy.components.sort();
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
