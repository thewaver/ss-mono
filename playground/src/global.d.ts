/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PLAYGROUND_URLS: Readonly<Record<string, string>>;
}

declare module "virtual:component-dependencies" {
    export type DependencyNames = {
        abstracts: string[];
        generators: string[];
        primitives: string[];
        components: string[];
    };

    const dependencies: Record<string, { uses: DependencyNames; usedBy: DependencyNames }>;

    export default dependencies;
}

declare module "virtual:component-api" {
    export type ApiGroupKind = "props" | "components" | "context" | "utilities" | "classes" | "types";

    export type ApiTableKind = "props" | "values" | "aliases" | "fields";

    export type ApiTextPart =
        { kind: "text"; text: string } | { kind: "prop"; text: string } | { kind: "link"; text: string; href: string };

    export type ApiText = ApiTextPart[];

    export type ApiEntry = {
        name: string;
        type: string;
        description: ApiText;
        isOptional: boolean;
        isAccessor: boolean;
    };

    export type ApiInclude = {
        text: string;
        target?: { unit: string; group: ApiGroupKind; table: string };
    };

    export type ApiTable = {
        kind: ApiTableKind;
        name: string;
        heading: string;
        description: ApiText;
        isDocumented: boolean;
        entries: ApiEntry[];
        includes: ApiInclude[];
    };

    export type ApiGroup = {
        kind: ApiGroupKind;
        tables: ApiTable[];
    };

    const api: Record<string, () => Promise<{ default: ApiGroup[] }>>;

    export default api;
}
