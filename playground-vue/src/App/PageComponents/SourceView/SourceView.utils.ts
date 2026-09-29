import vue from "shiki/langs/vue.mjs";

import { getDefaultHighlighterConfig, highlighter } from "@thewaver/ss-playground/shiki";

import type { SourceFile, SourceGroup } from "./SourceView.types";

const CORE_PACKAGE = "@thewaver/ss-playground/";
const CORE_GLOB_ROOT = "../../../../../playground/src/";

const APP_MODULES = import.meta.glob<string>("/src/**/*.{ts,vue}", {
    query: "?source",
    import: "default",
});

const CORE_MODULES = import.meta.glob<string>("../../../../../playground/src/**/*.{ts,tsx}", {
    query: "?source",
    import: "default",
});

const SOURCE_MODULES: Record<string, () => Promise<string>> = {
    ...Object.fromEntries(
        Object.entries(CORE_MODULES).map(([path, load]) => [`/src/${path.slice(CORE_GLOB_ROOT.length)}`, load]),
    ),
    ...APP_MODULES,
};

const APP_ROOT = "/src/App";
const PAGES_ROOT = `${APP_ROOT}/Pages/`;
const STYLED_COMPONENTS_ROOT = `${APP_ROOT}/StyledComponents/`;
const THEME_STEM = `${APP_ROOT}/Theme`;
const COMPONENT_EXTENSION = ".vue";
const SOURCE_EXTENSIONS = ["", COMPONENT_EXTENSION, ".ts"];
const SIBLING_SUFFIXES = [".types.ts", ".css.ts"];
const FILE_KIND_ORDER = [COMPONENT_EXTENSION, ".ts", ".const.ts", ".utils.ts", ".types.ts", ".css.ts"];
const SPLIT_COMPONENT_PATTERN = /\/Page[A-Z]\w*\.vue$/;
const IMPORT_PATTERN = /^import\b[^;]*?["']([^"']+)["']\s*;?\s*$/gm;

const SHOW_PAGE_SCAFFOLDING = true;

const VUE_LANGUAGE = highlighter.loadLanguage(vue);

const getFileName = (path: string) => path.slice(path.lastIndexOf("/") + 1);

const getFolder = (path: string) => path.slice(0, path.lastIndexOf("/"));

const getStem = (path: string) => {
    if (SPLIT_COMPONENT_PATTERN.test(path)) return `${getFolder(path)}/${getFileName(getFolder(path))}`;

    return path.replace(/\.(ts|vue)$/, "").replace(/\.(const|css|types|utils)$/, "");
};

const getFileKind = (path: string, stem: string) =>
    path.endsWith(COMPONENT_EXTENSION) ? COMPONENT_EXTENSION : path.slice(stem.length);

const byFileKind = (stem: string) => (first: string, second: string) =>
    FILE_KIND_ORDER.indexOf(getFileKind(first, stem)) - FILE_KIND_ORDER.indexOf(getFileKind(second, stem));

const isTraversable = (path: string) => path.startsWith(STYLED_COMPONENTS_ROOT);

const isPageScaffolding = (path: string) =>
    path.startsWith(PAGES_ROOT) && path.slice(PAGES_ROOT.length).split("/").length === 2;

const findExistingModule = (stem: string) =>
    SOURCE_EXTENSIONS.map((ext) => `${stem}${ext}`).find((p) => p in SOURCE_MODULES);

const resolveSpecifier = (fromPath: string, specifier: string) => {
    if (specifier.startsWith(CORE_PACKAGE)) return findExistingModule(`/src/${specifier.slice(CORE_PACKAGE.length)}`);
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

            if (resolved && getStem(resolved) !== THEME_STEM) add(resolved);
        }
    };

    await addImportsOf(entryPath);

    while (queue.length > 0) {
        await addImportsOf(queue.shift()!);
    }

    return result;
};

const toFile = async (path: string): Promise<SourceFile> => {
    const source = await loadSource(path);

    if (!path.endsWith(COMPONENT_EXTENSION)) {
        return { name: getFileName(path), source: highlighter.codeToHtml(source, getDefaultHighlighterConfig("ts")) };
    }

    await VUE_LANGUAGE;

    return {
        name: getFileName(path),
        source: highlighter.codeToHtml(source, { ...getDefaultHighlighterConfig(), lang: "vue" }),
    };
};

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
                files: await Promise.all([...paths, ...siblings].sort(byFileKind(stem)).map(toFile)),
                expandedNames: paths.map(getFileName),
            });
        }

        return groups;
    };
}
