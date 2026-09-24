/// <reference types="vite/client" />

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

    const api: Record<string, ApiGroup[]>;

    export default api;
}
