import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

const VIRTUAL_ID = "virtual:component-dependencies";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;
const IMPORT_PATTERN = /^import\s+(?!type\s)[^;]*?["']([^"']+)["'];?\s*$/gm;
const SOURCE_PATTERN = /\.tsx?$/;
const TEST_PATTERN = /\.test\.tsx?$/;
const ABSTRACTS_LAYER = "Abstracts";
const GENERATORS_LAYER = "Generators";
const PRIMITIVES_LAYER = "Primitives";
const FOLDER_UNIT_LAYERS = new Set([ABSTRACTS_LAYER, GENERATORS_LAYER]);
const COMPONENT_LAYERS = new Set(["Essentials", "Composites", "Exotics"]);
const PACKAGE_IMPORT_PATTERN = /^import\s+(?!type\s)\{([^}]*)\}\s*from\s*["']@thewaver\/ss-components["'];?\s*$/gm;
const EXPORT_PATTERN = /^export\s+(?:const|let|namespace|function|class)\s+(\w+)/gm;
const STYLES_PATTERN = /\.css\.ts$/;

type DependencyKind = "abstracts" | "generators" | "primitives" | "components";

const DEPENDENCY_KINDS: DependencyKind[] = ["abstracts", "generators", "primitives", "components"];

type DependencyNames = Record<DependencyKind, string[]>;

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

export const getUnitName = (relativeFile: string) => {
    const segments = relativeFile.split("/");

    return segments[0] === ABSTRACTS_LAYER ? segments[1] : segments[segments.length - 2];
};

const getUnitKind = (relativeFile: string) => {
    const layer = relativeFile.split("/")[0];

    if (layer === ABSTRACTS_LAYER) return "abstracts" as const;
    if (layer === GENERATORS_LAYER) return "generators" as const;
    if (layer === PRIMITIVES_LAYER) return "primitives" as const;

    return COMPONENT_LAYERS.has(layer) ? ("components" as const) : undefined;
};

/** Which core file declares each name the core package exports, so an import of the package lands on a file. */
const buildCoreExportIndex = async (coreFiles: string[]) => {
    const index = new Map<string, string>();

    for (const file of coreFiles) {
        if (STYLES_PATTERN.test(file)) {
            index.set(`${path.posix.basename(file).replace(STYLES_PATTERN, "")}Styles`, file);

            continue;
        }

        const source = await readFile(file, "utf8");

        for (const match of source.matchAll(EXPORT_PATTERN)) index.set(match[1], file);
    }

    return index;
};

const buildDependencyMap = async (roots: string[]) => {
    const rootFiles = await Promise.all(roots.map((root) => collectFiles(root)));
    const files = rootFiles.flat();
    const known = new Set(files);
    const coreIndex = await buildCoreExportIndex(rootFiles[rootFiles.length - 1]);
    const imports = new Map<string, string[]>();

    for (const file of files) {
        const source = await readFile(file, "utf8");
        const targets: string[] = [];

        for (const match of source.matchAll(IMPORT_PATTERN)) {
            const resolved = resolveSpecifier(file, match[1], known);

            if (resolved) targets.push(resolved);
        }

        for (const match of source.matchAll(PACKAGE_IMPORT_PATTERN)) {
            for (const specifier of match[1].split(",")) {
                const name = specifier
                    .trim()
                    .replace(/^type\s+/, "")
                    .split(/\s+as\s+/)[0];
                const target = !specifier.trim().startsWith("type ") && name ? coreIndex.get(name) : undefined;

                if (target) targets.push(target);
            }
        }

        imports.set(file, targets);
    }

    const rootPosixes = roots.map(toPosix);
    const relativeTo = (file: string) => {
        const root = rootPosixes.find((candidate) => file.startsWith(`${candidate}/`)) ?? "";

        return file.slice(root.length + 1);
    };

    const entries = new Map<string, string[]>();
    const abstractUnits = new Map<string, string[]>();

    for (const file of files) {
        const relative = relativeTo(file);
        const segments = relative.split("/");
        const owner = segments[segments.length - 2];

        if (owner && segments[segments.length - 1].replace(SOURCE_PATTERN, "") === owner && !entries.has(owner)) {
            entries.set(owner, [file]);
        }

        if (!FOLDER_UNIT_LAYERS.has(segments[0])) continue;

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
    const kinds = new Map<string, DependencyKind>();

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

        const found = Object.fromEntries(DEPENDENCY_KINDS.map((kind) => [kind, new Set<string>()])) as Record<
            DependencyKind,
            Set<string>
        >;

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
            uses: Object.fromEntries(
                DEPENDENCY_KINDS.map((kind) => [kind, [...found[kind]].sort()]),
            ) as DependencyNames,
            usedBy: Object.fromEntries(DEPENDENCY_KINDS.map((kind) => [kind, [] as string[]])) as DependencyNames,
        };
    }

    for (const [name, dependencies] of Object.entries(map)) {
        const kind = kinds.get(name);

        if (!kind) continue;

        for (const used of Object.values(dependencies.uses).flat()) {
            map[used]?.usedBy[kind].push(name);
        }
    }

    for (const dependencies of Object.values(map)) {
        for (const names of Object.values(dependencies.usedBy)) names.sort();
    }

    return map;
};

export const componentDependencies = (componentsRoots: string[]): Plugin => ({
    name: "component-dependencies",
    resolveId(source) {
        return source === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },
    async load(id) {
        if (id !== RESOLVED_ID) return undefined;

        return `export default ${JSON.stringify(await buildDependencyMap(componentsRoots))};`;
    },
    configureServer(server) {
        for (const root of componentsRoots) server.watcher.add(root);

        server.watcher.on("all", (_event, file) => {
            if (!componentsRoots.some((root) => toPosix(file).startsWith(toPosix(root)))) return;

            const module = server.moduleGraph.getModuleById(RESOLVED_ID);

            if (module) server.reloadModule(module);
        });
    },
});
