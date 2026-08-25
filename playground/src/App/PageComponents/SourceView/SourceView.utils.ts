import { getDefaultHighlighterConfig, highlighter } from "../../../shiki";
import type { SourceFile, SourceGroup } from "./SourceView.types";

const SOURCE_MODULES = import.meta.glob<string>("/src/**/*.{ts,tsx}", {
    query: "?source",
    import: "default",
});

const APP_ROOT = "/src/App";
const PAGES_ROOT = `${APP_ROOT}/Pages/`;
const STYLED_COMPONENTS_ROOT = `${APP_ROOT}/StyledComponents/`;
const THEME_MODULE = `${APP_ROOT}/Theme.css.ts`;
const SOURCE_EXTENSIONS = [".tsx", ".ts"];
const SIBLING_SUFFIXES = [".types.ts", ".css.ts"];
const IMPORT_PATTERN = /^import\b[^;]*?["']([^"']+)["']\s*;?\s*$/gm;

const SHOW_PAGE_SCAFFOLDING = true;

const getFileName = (path: string) => path.slice(path.lastIndexOf("/") + 1);

const getStem = (path: string) => path.replace(/\.tsx?$/, "").replace(/\.(const|css|types|utils)$/, "");

const isTraversable = (path: string) => path.startsWith(STYLED_COMPONENTS_ROOT);

const isPageScaffolding = (path: string) =>
    path.startsWith(PAGES_ROOT) && path.slice(PAGES_ROOT.length).split("/").length === 2;

const findExistingModule = (stem: string) =>
    SOURCE_EXTENSIONS.map((ext) => `${stem}${ext}`).find((p) => p in SOURCE_MODULES);

const resolveSpecifier = (fromPath: string, specifier: string) => {
    if (!specifier.startsWith(".")) return undefined;

    const segments = `${fromPath.slice(0, fromPath.lastIndexOf("/"))}/${specifier}`.split("/");
    const stack: string[] = [];

    for (const segment of segments) {
        if (segment === "" || segment === ".") continue;
        if (segment === "..") stack.pop();
        else stack.push(segment);
    }

    return findExistingModule(`/${stack.join("/")}`);
};

const loadSource = (path: string) => SOURCE_MODULES[path]?.() ?? Promise.resolve("");

const parseImports = (source: string) => Array.from(source.matchAll(IMPORT_PATTERN), (match) => match[1]);

const collectImportedPaths = async (entryPath: string) => {
    const result = [entryPath];
    const seen = new Set(result);
    const queue: string[] = [];

    const add = (path: string) => {
        if (seen.has(path)) return;

        seen.add(path);
        result.push(path);

        if (isTraversable(path)) queue.push(path);
    };

    const addImportsOf = async (path: string) => {
        for (const specifier of parseImports(await loadSource(path))) {
            const resolved = resolveSpecifier(path, specifier);

            if (resolved && resolved !== THEME_MODULE) add(resolved);
        }
    };

    await addImportsOf(entryPath);

    while (queue.length > 0) {
        await addImportsOf(queue.shift()!);
    }

    return result;
};

const toFile = async (path: string): Promise<SourceFile> => ({
    name: getFileName(path),
    source: highlighter.codeToHtml(
        await loadSource(path),
        getDefaultHighlighterConfig(path.endsWith(".tsx") ? "tsx" : "ts"),
    ),
});

export namespace SourceViewUtils {
    export const loadGroups = async (entryPath: string): Promise<SourceGroup[]> => {
        const importedPaths = await collectImportedPaths(entryPath);
        const pathsByStem = new Map<string, string[]>();

        for (const path of importedPaths) {
            if (!SHOW_PAGE_SCAFFOLDING && isPageScaffolding(path)) continue;

            const stem = getStem(path);

            pathsByStem.set(stem, [...(pathsByStem.get(stem) ?? []), path]);
        }

        const groups: SourceGroup[] = [];

        for (const [stem, paths] of pathsByStem) {
            const siblings = SIBLING_SUFFIXES.map((suffix) => `${stem}${suffix}`).filter(
                (path) => path in SOURCE_MODULES && !paths.includes(path),
            );

            groups.push({
                name: getFileName(stem),
                files: await Promise.all([...paths, ...siblings].map(toFile)),
                expandedNames: paths.map(getFileName),
            });
        }

        return groups;
    };
}
