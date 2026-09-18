import path from "node:path";
import ts from "typescript";
import type { Plugin } from "vite";

const VIRTUAL_ID = "virtual:component-props";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

const PROPS_SUFFIX = "Props";
const ACCESSOR_PREFIX = "MaybeAccessor<";
const UNDEFINED_SUFFIX = " | undefined";

type PropEntry = {
    name: string;
    type: string;
    description: string;
    isOptional: boolean;
    isAccessor: boolean;
};

const toPosix = (value: string) => value.split(path.sep).join("/");

const stripUndefined = (value: string) =>
    value.endsWith(UNDEFINED_SUFFIX) ? value.slice(0, -UNDEFINED_SUFFIX.length) : value;

const unwrapAccessor = (value: string) =>
    value.startsWith(ACCESSOR_PREFIX) ? value.slice(ACCESSOR_PREFIX.length, -1) : value;

const normalize = (value: string) =>
    value
        .replace(/\s+/g, " ")
        .replace(/\(\s+/g, "(")
        .replace(/,\s*\)/g, ")")
        .replace(/\s+([,;])/g, "$1")
        .trim();

const toWrittenType = (declaration: ts.Declaration | undefined) => {
    if (!declaration) return undefined;
    if (!ts.isPropertySignature(declaration) && !ts.isPropertyDeclaration(declaration)) return undefined;

    const written = declaration.type?.getText();

    return written === undefined ? undefined : normalize(written);
};

const getIsOwnDeclaration = (declaration: ts.Declaration | undefined, sourceRoot: string) => {
    const fileName = declaration?.getSourceFile().fileName;

    return fileName !== undefined && toPosix(fileName).startsWith(toPosix(sourceRoot));
};

const buildPropsMap = (entryFile: string, utilsEntry: string) => {
    const program = ts.createProgram([entryFile], {
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        jsx: ts.JsxEmit.Preserve,
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        baseUrl: path.dirname(entryFile),
        paths: { "@thewaver/ss-utils": [utilsEntry] },
    });

    const checker = program.getTypeChecker();
    const source = program.getSourceFile(entryFile);
    const moduleSymbol = source && checker.getSymbolAtLocation(source);

    if (!moduleSymbol) return {};

    const map: Record<string, PropEntry[]> = {};

    for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
        const exportName = symbol.getName();

        if (!exportName.endsWith(PROPS_SUFFIX)) continue;

        const owner = exportName.slice(0, -PROPS_SUFFIX.length);

        if (!owner) continue;

        const declared = checker.getDeclaredTypeOfSymbol(symbol);
        const entries: PropEntry[] = [];

        for (const property of checker.getPropertiesOfType(declared)) {
            const declaration = property.declarations?.[0];

            if (!getIsOwnDeclaration(declaration, path.dirname(entryFile))) continue;

            const resolved = stripUndefined(
                checker.typeToString(checker.getTypeOfSymbolAtLocation(property, declaration ?? source)),
            );

            entries.push({
                name: property.getName(),
                description: normalize(ts.displayPartsToString(property.getDocumentationComment(checker))),
                type: unwrapAccessor(toWrittenType(declaration) ?? resolved),
                isOptional: (property.flags & ts.SymbolFlags.Optional) !== 0,
                isAccessor: resolved.startsWith(ACCESSOR_PREFIX),
            });
        }

        if (entries.length) map[owner] = entries.sort((a, b) => a.name.localeCompare(b.name));
    }

    return map;
};

export const componentProps = (componentsRoot: string, utilsEntry: string): Plugin => {
    const entryFile = path.join(componentsRoot, "index.ts");

    return {
        name: "component-props",
        resolveId(source) {
            return source === VIRTUAL_ID ? RESOLVED_ID : undefined;
        },
        load(id) {
            if (id !== RESOLVED_ID) return undefined;

            return `export default ${JSON.stringify(buildPropsMap(entryFile, utilsEntry))};`;
        },
        configureServer(server) {
            server.watcher.add(componentsRoot);

            server.watcher.on("all", (_event, file) => {
                if (!toPosix(file).startsWith(toPosix(componentsRoot))) return;

                const module = server.moduleGraph.getModuleById(RESOLVED_ID);

                if (module) server.reloadModule(module);
            });
        },
    };
};
