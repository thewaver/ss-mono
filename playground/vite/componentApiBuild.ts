import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

import { getUnitName } from "./componentDependencies.ts";

const PROPS_SUFFIX = "Props";
const DEFINE_COMPONENT_NAME = "defineComponent";
const SLOTS_CONTEXT_NAME = "SlotsContext";
const COMPONENT_RETURN_TYPE = "VNode";
const ACCESSOR_PREFIX = "MaybeAccessor<";
const UNDEFINED_SUFFIX = " | undefined";
const SOURCE_PATTERN = /\.tsx?$/;
const SVELTE_DECLARATION_SUFFIX = ".svelte.d.ts";
const SVELTE_COMPONENT_SUFFIX = ".svelte";
const DECLARATION_SUFFIX = ".d.ts";
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

export type ApiGroupKind = "props" | "components" | "context" | "utilities" | "classes" | "types";

export type ApiTableKind = "props" | "values" | "aliases" | "fields";

export type ApiEntry = {
    name: string;
    type: string;
    description: string;
    isOptional: boolean;
    isAccessor: boolean;
};

export type ApiTable = {
    kind: ApiTableKind;
    name: string;
    heading: string;
    description: string;
    isDocumented: boolean;
    entries: ApiEntry[];
};

export type ApiGroup = {
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

export type ApiReader = {
    units: string[];
    read: (unit: string) => ApiGroup[];
};

type ExportRecord = {
    symbol: ts.Symbol;
    declaration: ts.Declaration;
    unit: string;
    fileKind: string;
};

type Placement = {
    record: ExportRecord;
    owner: string;
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
        fileName.endsWith(SVELTE_DECLARATION_SUFFIX) ? fileName.slice(0, -DECLARATION_SUFFIX.length) : undefined;
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

const toCompilerOptions = (entryFile: string, coreEntry: string, utilsEntry: string): ts.CompilerOptions => ({
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
});

const createCachingHost = (host: ts.CompilerHost, sourceFiles: Map<string, ts.SourceFile>) =>
    ({
        ...host,
        getSourceFile: (fileName, languageVersion, ...rest) => {
            const cached = sourceFiles.get(fileName);

            if (cached) return cached;

            const sourceFile = host.getSourceFile(fileName, languageVersion, ...rest);

            if (sourceFile) sourceFiles.set(fileName, sourceFile);

            return sourceFile;
        },
    }) satisfies ts.CompilerHost;

const createApiReader = (
    program: ts.Program,
    entryFile: string,
    coreEntry: string,
    apiOptions: ComponentApiOptions,
): ApiReader => {
    const sourceRoots = [toPosix(path.dirname(entryFile)), toPosix(path.dirname(coreEntry))];
    const getRoot = (fileName: string) => sourceRoots.find((root) => toPosix(fileName).startsWith(`${root}/`));

    const checker = program.getTypeChecker();
    const source = program.getSourceFile(entryFile);
    const moduleSymbol = source && checker.getSymbolAtLocation(source);

    if (!moduleSymbol) return { units: [], read: () => [] };

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

    const getOwnerSuffix = (symbol: ts.Symbol) => {
        if (symbol.flags & (ts.SymbolFlags.Module | ts.SymbolFlags.Class)) return undefined;
        if (!(symbol.flags & (ts.SymbolFlags.TypeAlias | ts.SymbolFlags.Interface))) return undefined;

        return [PROPS_SUFFIX, apiOptions.slotsSuffix].find((suffix) => suffix && symbol.getName().endsWith(suffix));
    };

    const toOwner = (record: ExportRecord) => {
        const ownerSuffix = getOwnerSuffix(record.symbol);

        if (!ownerSuffix) return record.unit;

        return units.get(record.symbol.getName().slice(0, -ownerSuffix.length).toLowerCase()) ?? record.unit;
    };

    const placements = new Map<string, Placement[]>();

    for (const record of records) {
        const owner = toOwner(record);
        const placed = placements.get(owner.toLowerCase()) ?? [];

        placed.push({ record, owner });
        placements.set(owner.toLowerCase(), placed);
    }

    const read = (key: string): ApiGroup[] => {
        const unit = units.get(key) ?? key;
        const tablesByKind = new Map<ApiGroupKind, ApiTable[]>();
        const valuesByKind = new Map<ApiGroupKind, ApiEntry[]>();
        const aliases: ApiEntry[] = [];

        const addTable = (kind: ApiGroupKind, table: ApiTable) => {
            const tables = tablesByKind.get(kind) ?? [];

            tables.push(table);
            tablesByKind.set(kind, tables);
        };

        const addValue = (kind: ApiGroupKind, entry: ApiEntry) => {
            const entries = valuesByKind.get(kind) ?? [];

            entries.push(entry);
            valuesByKind.set(kind, entries);
        };

        for (const { record } of placements.get(key) ?? []) {
            const { symbol, declaration, fileKind } = record;
            const name = symbol.getName();
            const heading = `${name}${toTypeParameters(declaration)}`;

            if (symbol.flags & ts.SymbolFlags.Module) {
                const members = checker
                    .getExportsOfModule(symbol)
                    .map((member) => toValueEntry(member, member.declarations?.[0] ?? declaration))
                    .sort(byName);

                addTable("utilities", toTable("values", name, heading, toDescription(symbol, checker), members));
                continue;
            }

            if (symbol.flags & ts.SymbolFlags.Class) {
                const constructors = checker
                    .getSignaturesOfType(
                        checker.getTypeOfSymbolAtLocation(symbol, declaration),
                        ts.SignatureKind.Construct,
                    )
                    .map((signature) => ({
                        name: CONSTRUCTOR_NAME,
                        description: normalize(ts.displayPartsToString(signature.getDocumentationComment(checker))),
                        type: checker.signatureToString(signature, declaration, TYPE_FORMAT_FLAGS),
                        isOptional: false,
                        isAccessor: false,
                    }));
                const members = toEntries(checker.getDeclaredTypeOfSymbol(symbol), declaration);

                addTable(
                    "classes",
                    toTable("values", name, heading, toDescription(symbol, checker), [...constructors, ...members]),
                );
                continue;
            }

            if (symbol.flags & (ts.SymbolFlags.TypeAlias | ts.SymbolFlags.Interface)) {
                const declared = checker.getDeclaredTypeOfSymbol(symbol);

                if (getOwnerSuffix(symbol)) {
                    const entries = toEntries(declared, declaration);

                    if (entries.length)
                        addTable("props", toTable("props", name, heading, toDescription(symbol, checker), entries));

                    continue;
                }

                const isObjectShaped =
                    (declared.flags & OBJECT_TYPE_FLAGS) !== 0 && !declared.getCallSignatures().length;
                const entries = isObjectShaped ? toEntries(declared, declaration) : [];

                if (entries.length) {
                    addTable("types", toTable("fields", name, heading, toDescription(symbol, checker), entries));
                    continue;
                }

                const written = ts.isTypeAliasDeclaration(declaration)
                    ? normalize(declaration.type.getText())
                    : typeText(declared, declaration);

                aliases.push({
                    name: heading,
                    description: toDescription(symbol, checker),
                    type: written,
                    isOptional: false,
                    isAccessor: false,
                });
                continue;
            }

            const entry = toValueEntry(symbol, declaration);

            addValue(fileKind === "context" ? "context" : "components", {
                ...entry,
                type: toDefinedComponentSignature(declaration) ?? entry.type,
            });
        }

        for (const [kind, entries] of valuesByKind)
            addTable(kind, toTable("values", kind, "", "", entries.sort(byPrimary(unit))));

        if (aliases.length) addTable("types", toTable("aliases", "aliases", "", "", aliases.sort(byName)));

        return GROUP_ORDER.flatMap((kind) => {
            const tables = tablesByKind.get(kind);

            if (!tables) return [];

            return [
                {
                    kind,
                    tables: tables.sort(
                        kind === "props"
                            ? byPrimaries([`${unit}${PROPS_SUFFIX}`, `${unit}${apiOptions.slotsSuffix ?? PROPS_SUFFIX}`])
                            : byAliasesFirst,
                    ),
                },
            ];
        });
    };

    return { units: [...placements.keys()].sort(), read };
};

/**
 * Builds the export tables over and over as the library changes, keeping every file it has parsed so a rebuild
 * re-reads only the files it is told have changed.
 */
export const createApiSession = (
    entryFile: string,
    coreEntry: string,
    utilsEntry: string,
    apiOptions: ComponentApiOptions = {},
) => {
    const options = toCompilerOptions(entryFile, coreEntry, utilsEntry);
    const sourceFiles = new Map<string, ts.SourceFile>();
    const host = createCachingHost(createSvelteAwareHost(options), sourceFiles);

    let program: ts.Program | undefined;

    const open = (changedFiles: string[]) => {
        for (const file of changedFiles.map(toPosix)) {
            sourceFiles.delete(file);

            if (file.endsWith(SVELTE_COMPONENT_SUFFIX)) sourceFiles.delete(`${file}${DECLARATION_SUFFIX}`);
        }

        program = ts.createProgram([entryFile], options, host, program);

        return createApiReader(program, entryFile, coreEntry, apiOptions);
    };

    return { open };
};

export const buildApiMap = (
    entryFile: string,
    coreEntry: string,
    utilsEntry: string,
    apiOptions: ComponentApiOptions = {},
) => {
    const reader = createApiSession(entryFile, coreEntry, utilsEntry, apiOptions).open([]);

    return Object.fromEntries(reader.units.map((unit) => [unit, reader.read(unit)]));
};
