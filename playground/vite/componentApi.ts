import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import type { Plugin } from "vite";

import { getUnitName } from "./componentDependencies.ts";

const VIRTUAL_ID = "virtual:component-api";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

const PROPS_SUFFIX = "Props";
const DEFINE_COMPONENT_NAME = "defineComponent";
const SLOTS_CONTEXT_NAME = "SlotsContext";
const COMPONENT_RETURN_TYPE = "VNode";
const ACCESSOR_PREFIX = "MaybeAccessor<";
const UNDEFINED_SUFFIX = " | undefined";
const SOURCE_PATTERN = /\.tsx?$/;
const SVELTE_DECLARATION_SUFFIX = ".svelte.d.ts";
const SVELTE_SCRIPT_PATTERN = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;
const SVELTE_MODULE_PATTERN = /\bmodule\b|context\s*=\s*["']module["']/;
const SVELTE_GENERICS_PATTERN = /\bgenerics\s*=\s*"([^"]*)"/;
const PROPS_RUNE = "$props";
const EXCLUDED_LAYERS = new Set(["Samples", "Utils"]);
const EXCLUDED_FILE_KINDS = new Set(["const"]);
const CONSTRUCTOR_NAME = "constructor";
const OBJECT_TYPE_FLAGS = ts.TypeFlags.Object | ts.TypeFlags.Intersection;
const TYPE_FORMAT_FLAGS =
    ts.TypeFormatFlags.NoTruncation |
    ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
    ts.TypeFormatFlags.WriteArrowStyleSignature;

type ApiGroupKind = "props" | "components" | "context" | "utilities" | "classes" | "types";

type ApiTableKind = "props" | "values" | "aliases" | "fields";

type ApiEntry = {
    name: string;
    type: string;
    description: string;
    isOptional: boolean;
    isAccessor: boolean;
};

type ApiTable = {
    kind: ApiTableKind;
    name: string;
    heading: string;
    description: string;
    isDocumented: boolean;
    entries: ApiEntry[];
};

type ApiGroup = {
    kind: ApiGroupKind;
    tables: ApiTable[];
};

export type ComponentApiOptions = {
    /**
     * The suffix of a type whose members are passed alongside a component's props, such as Vue's scoped slots. Such a
     * type is listed with the props of the component its name leads with, straight after that component's props.
     */
    slotsSuffix?: string;
};

type ExportRecord = {
    symbol: ts.Symbol;
    declaration: ts.Declaration;
    unit: string;
    fileKind: string;
};

const GROUP_ORDER: ApiGroupKind[] = ["props", "components", "context", "utilities", "classes", "types"];

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
        .replace(/;\s*\}/g, " }")
        .replace(/^\|\s*/, "")
        .trim();

const toWrittenType = (declaration: ts.Declaration | undefined) => {
    if (!declaration) return undefined;
    if (!ts.isPropertySignature(declaration) && !ts.isPropertyDeclaration(declaration)) return undefined;

    const written = declaration.type?.getText();

    return written === undefined ? undefined : normalize(written);
};

const toDescription = (symbol: ts.Symbol, checker: ts.TypeChecker) =>
    normalize(ts.displayPartsToString(symbol.getDocumentationComment(checker)));

const toTypeParameters = (declaration: ts.Declaration) => {
    const parameters = (declaration as ts.DeclarationWithTypeParameterChildren).typeParameters;

    return parameters?.length ? `<${parameters.map((parameter) => normalize(parameter.getText())).join(", ")}>` : "";
};

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);

const byPrimary = (primary: string) => (a: { name: string }, b: { name: string }) =>
    Number(b.name === primary) - Number(a.name === primary) || byName(a, b);

const byPrimaries = (primaries: string[]) => (a: { name: string }, b: { name: string }) => {
    const rank = (name: string) => (primaries.includes(name) ? primaries.indexOf(name) : primaries.length);

    return rank(a.name) - rank(b.name) || byName(a, b);
};

const byAliasesFirst = (a: ApiTable, b: ApiTable) =>
    Number(b.kind === "aliases") - Number(a.kind === "aliases") || byName(a, b);

const getFileKind = (fileName: string) => {
    const base = path.basename(fileName).replace(SOURCE_PATTERN, "");
    const dot = base.indexOf(".");

    return dot === -1 ? "component" : base.slice(dot + 1);
};

const findPropsType = (script: ts.SourceFile) => {
    let found: string | undefined;

    const visit = (node: ts.Node) => {
        if (
            ts.isVariableDeclaration(node) &&
            node.type &&
            node.initializer &&
            ts.isCallExpression(node.initializer) &&
            node.initializer.expression.getText(script) === PROPS_RUNE
        ) {
            found = node.type.getText(script);
        }

        if (found === undefined) ts.forEachChild(node, visit);
    };

    visit(script);

    return found;
};

const toSvelteDeclaration = (componentFile: string) => {
    const source = readFileSync(componentFile, "utf8");
    const name = path.basename(componentFile, ".svelte");
    const instance = [...source.matchAll(SVELTE_SCRIPT_PATTERN)].find((match) => !SVELTE_MODULE_PATTERN.test(match[1]));
    const script = ts.createSourceFile(componentFile, instance?.[2] ?? "", ts.ScriptTarget.ESNext, true);
    const imports = script.statements.filter(ts.isImportDeclaration).map((statement) => statement.getText(script));
    const propsType = findPropsType(script) ?? "Record<string, never>";
    const generics = instance ? SVELTE_GENERICS_PATTERN.exec(instance[1])?.[1] : undefined;
    const signature = generics
        ? `declare function ${name}<${generics}>(internals: ComponentInternals, props: ${propsType}): {};`
        : `declare const ${name}: Component<${propsType}>;`;

    return [
        ...imports,
        `import type { Component, ComponentInternals } from "svelte";`,
        signature,
        `export default ${name};`,
    ].join("\n");
};

const createSvelteAwareHost = (options: ts.CompilerOptions) => {
    const host = ts.createCompilerHost(options);
    const toComponentFile = (fileName: string) =>
        fileName.endsWith(SVELTE_DECLARATION_SUFFIX) ? fileName.slice(0, -".d.ts".length) : undefined;
    const getIsSvelteDeclaration = (fileName: string) => {
        const componentFile = toComponentFile(fileName);

        return componentFile !== undefined && !existsSync(fileName) && existsSync(componentFile);
    };

    return {
        ...host,
        fileExists: (fileName: string) => getIsSvelteDeclaration(fileName) || host.fileExists(fileName),
        readFile: (fileName: string) =>
            getIsSvelteDeclaration(fileName)
                ? toSvelteDeclaration(toComponentFile(fileName)!)
                : host.readFile(fileName),
        getSourceFile: (fileName: string, languageVersion: ts.ScriptTarget | ts.CreateSourceFileOptions, ...rest) =>
            getIsSvelteDeclaration(fileName)
                ? ts.createSourceFile(fileName, toSvelteDeclaration(toComponentFile(fileName)!), languageVersion, true)
                : host.getSourceFile(fileName, languageVersion, ...rest),
    } satisfies ts.CompilerHost;
};

const buildApiMap = (entryFile: string, coreEntry: string, utilsEntry: string, apiOptions: ComponentApiOptions) => {
    const sourceRoots = [toPosix(path.dirname(entryFile)), toPosix(path.dirname(coreEntry))];
    const getRoot = (fileName: string) => sourceRoots.find((root) => toPosix(fileName).startsWith(`${root}/`));
    const options: ts.CompilerOptions = {
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        jsx: ts.JsxEmit.Preserve,
        jsxImportSource: "solid-js",
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        baseUrl: path.dirname(entryFile),
        paths: { "@thewaver/ss-components": [coreEntry], "@thewaver/ss-utils": [utilsEntry] },
    };
    const program = ts.createProgram([entryFile], options, createSvelteAwareHost(options));

    const checker = program.getTypeChecker();
    const source = program.getSourceFile(entryFile);
    const moduleSymbol = source && checker.getSymbolAtLocation(source);

    if (!moduleSymbol) return {};

    const getIsOwnDeclaration = (declaration: ts.Declaration | undefined) => {
        const fileName = declaration?.getSourceFile().fileName;

        return fileName !== undefined && getRoot(fileName) !== undefined;
    };

    const typeText = (type: ts.Type, at: ts.Node) => checker.typeToString(type, at, TYPE_FORMAT_FLAGS);

    const toEntries = (type: ts.Type, at: ts.Node) => {
        const entries: ApiEntry[] = [];

        for (const property of checker.getPropertiesOfType(type)) {
            const declaration =
                property.declarations?.find((candidate) => toWrittenType(candidate) !== "undefined") ??
                property.declarations?.[0];

            if (!getIsOwnDeclaration(declaration)) continue;
            if (
                declaration &&
                ts.getCombinedModifierFlags(declaration) & ts.ModifierFlags.NonPublicAccessibilityModifier
            )
                continue;

            const resolved = stripUndefined(
                typeText(checker.getTypeOfSymbolAtLocation(property, declaration ?? at), at),
            );

            entries.push({
                name: property.getName(),
                description: toDescription(property, checker),
                type: unwrapAccessor(toWrittenType(declaration) ?? resolved),
                isOptional: (property.flags & ts.SymbolFlags.Optional) !== 0,
                isAccessor: resolved.startsWith(ACCESSOR_PREFIX),
            });
        }

        return entries.sort(byName);
    };

    const toValueEntry = (symbol: ts.Symbol, at: ts.Node): ApiEntry => ({
        name: symbol.getName(),
        description: toDescription(symbol, checker),
        type: typeText(checker.getTypeOfSymbolAtLocation(symbol, at), at),
        isOptional: false,
        isAccessor: false,
    });

    /** A Vue component's row reads as its setup function's props and slots, not as the type `defineComponent` returns. */
    const toDefinedComponentSignature = (declaration: ts.Declaration) => {
        if (!ts.isVariableDeclaration(declaration) || !declaration.initializer) return undefined;

        const call = declaration.initializer;

        if (!ts.isCallExpression(call) || call.expression.getText() !== DEFINE_COMPONENT_NAME) return undefined;

        const setup = call.arguments[0];

        if (!setup || !(ts.isArrowFunction(setup) || ts.isFunctionExpression(setup))) return undefined;

        const [propsParameter, contextParameter] = setup.parameters;
        const contextType = contextParameter?.type;
        const slotsType =
            contextType && ts.isTypeReferenceNode(contextType) && contextType.typeName.getText() === SLOTS_CONTEXT_NAME
                ? contextType.typeArguments?.[0]
                : undefined;
        const parameters = [
            `props: ${propsParameter?.type ? normalize(propsParameter.type.getText()) : "object"}`,
            ...(slotsType ? [`slots: ${normalize(slotsType.getText())}`] : []),
        ];

        return `${toTypeParameters(setup)}(${parameters.join(", ")}) => ${COMPONENT_RETURN_TYPE}`;
    };

    const toTable = (kind: ApiTableKind, name: string, heading: string, description: string, entries: ApiEntry[]) => ({
        kind,
        name,
        heading,
        description,
        entries,
        isDocumented: kind === "props" || entries.some((entry) => entry.description),
    });

    const records: ExportRecord[] = [];

    for (const exported of checker.getExportsOfModule(moduleSymbol)) {
        const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
        const declaration = symbol.declarations?.[0];

        if (!declaration || !getIsOwnDeclaration(declaration)) continue;

        const fileName = declaration.getSourceFile().fileName;
        const relative = toPosix(fileName).slice((getRoot(fileName) ?? "").length + 1);
        const fileKind = getFileKind(relative);

        if (EXCLUDED_LAYERS.has(relative.split("/")[0]) || EXCLUDED_FILE_KINDS.has(fileKind)) continue;

        const unit = getUnitName(relative);

        if (unit) records.push({ symbol, declaration, unit, fileKind });
    }

    const units = new Map(records.map((record) => [record.unit.toLowerCase(), record.unit]));
    const groups = new Map<string, Map<ApiGroupKind, ApiTable[]>>();

    const addTable = (unit: string, kind: ApiGroupKind, table: ApiTable) => {
        const byKind = groups.get(unit) ?? new Map<ApiGroupKind, ApiTable[]>();
        const tables = byKind.get(kind) ?? [];

        tables.push(table);
        byKind.set(kind, tables);
        groups.set(unit, byKind);
    };

    const values = new Map<string, Map<ApiGroupKind, ApiEntry[]>>();
    const aliases = new Map<string, ApiEntry[]>();

    const addValue = (unit: string, kind: ApiGroupKind, entry: ApiEntry) => {
        const byKind = values.get(unit) ?? new Map<ApiGroupKind, ApiEntry[]>();
        const entries = byKind.get(kind) ?? [];

        entries.push(entry);
        byKind.set(kind, entries);
        values.set(unit, byKind);
    };

    for (const { symbol, declaration, unit, fileKind } of records) {
        const name = symbol.getName();
        const heading = `${name}${toTypeParameters(declaration)}`;

        if (symbol.flags & ts.SymbolFlags.Module) {
            const members = checker
                .getExportsOfModule(symbol)
                .map((member) => toValueEntry(member, member.declarations?.[0] ?? declaration))
                .sort(byName);

            addTable(unit, "utilities", toTable("values", name, heading, toDescription(symbol, checker), members));
            continue;
        }

        if (symbol.flags & ts.SymbolFlags.Class) {
            const constructors = checker
                .getSignaturesOfType(checker.getTypeOfSymbolAtLocation(symbol, declaration), ts.SignatureKind.Construct)
                .map((signature) => ({
                    name: CONSTRUCTOR_NAME,
                    description: normalize(ts.displayPartsToString(signature.getDocumentationComment(checker))),
                    type: checker.signatureToString(signature, declaration, TYPE_FORMAT_FLAGS),
                    isOptional: false,
                    isAccessor: false,
                }));
            const members = toEntries(checker.getDeclaredTypeOfSymbol(symbol), declaration);

            addTable(
                unit,
                "classes",
                toTable("values", name, heading, toDescription(symbol, checker), [...constructors, ...members]),
            );
            continue;
        }

        if (symbol.flags & (ts.SymbolFlags.TypeAlias | ts.SymbolFlags.Interface)) {
            const declared = checker.getDeclaredTypeOfSymbol(symbol);

            const ownerSuffix = [PROPS_SUFFIX, apiOptions.slotsSuffix].find(
                (suffix) => suffix && name.endsWith(suffix),
            );

            if (ownerSuffix) {
                const owner = units.get(name.slice(0, -ownerSuffix.length).toLowerCase()) ?? unit;
                const entries = toEntries(declared, declaration);

                if (entries.length)
                    addTable(owner, "props", toTable("props", name, heading, toDescription(symbol, checker), entries));

                continue;
            }

            const isObjectShaped = (declared.flags & OBJECT_TYPE_FLAGS) !== 0 && !declared.getCallSignatures().length;
            const entries = isObjectShaped ? toEntries(declared, declaration) : [];

            if (entries.length) {
                addTable(unit, "types", toTable("fields", name, heading, toDescription(symbol, checker), entries));
                continue;
            }

            const written = ts.isTypeAliasDeclaration(declaration)
                ? normalize(declaration.type.getText())
                : typeText(declared, declaration);
            const alias = aliases.get(unit) ?? [];

            alias.push({
                name: heading,
                description: toDescription(symbol, checker),
                type: written,
                isOptional: false,
                isAccessor: false,
            });
            aliases.set(unit, alias);
            continue;
        }

        const entry = toValueEntry(symbol, declaration);

        addValue(unit, fileKind === "context" ? "context" : "components", {
            ...entry,
            type: toDefinedComponentSignature(declaration) ?? entry.type,
        });
    }

    for (const [unit, byKind] of values) {
        for (const [kind, entries] of byKind)
            addTable(unit, kind, toTable("values", kind, "", "", entries.sort(byPrimary(unit))));
    }

    for (const [unit, entries] of aliases)
        addTable(unit, "types", toTable("aliases", "aliases", "", "", entries.sort(byName)));

    const map: Record<string, ApiGroup[]> = {};

    for (const [unit, byKind] of groups) {
        map[unit.toLowerCase()] = GROUP_ORDER.flatMap((kind) => {
            const tables = byKind.get(kind);

            if (!tables) return [];

            return [
                {
                    kind,
                    tables: tables.sort(
                        kind === "props"
                            ? byPrimaries([
                                  `${unit}${PROPS_SUFFIX}`,
                                  `${unit}${apiOptions.slotsSuffix ?? PROPS_SUFFIX}`,
                              ])
                            : byAliasesFirst,
                    ),
                },
            ];
        });
    }

    return map;
};

export const componentApi = (
    componentsRoot: string,
    coreRoot: string,
    utilsEntry: string,
    options: ComponentApiOptions = {},
): Plugin => {
    const entryFile = path.join(componentsRoot, "index.ts");
    const coreEntry = path.join(coreRoot, "index.ts");
    const roots = [componentsRoot, coreRoot];

    return {
        name: "component-api",
        resolveId(source) {
            return source === VIRTUAL_ID ? RESOLVED_ID : undefined;
        },
        load(id) {
            if (id !== RESOLVED_ID) return undefined;

            return {
                code: `export default ${JSON.stringify(buildApiMap(entryFile, coreEntry, utilsEntry, options))};`,
                map: { mappings: "" },
            };
        },
        configureServer(server) {
            for (const root of roots) server.watcher.add(root);

            server.watcher.on("all", (_event, file) => {
                if (!roots.some((root) => toPosix(file).startsWith(toPosix(root)))) return;

                const module = server.moduleGraph.getModuleById(RESOLVED_ID);

                if (module) server.reloadModule(module);
            });
        },
    };
};
