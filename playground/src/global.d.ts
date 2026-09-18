/// <reference types="vite/client" />

declare module "virtual:component-dependencies" {
    export type DependencyNames = { abstracts: string[]; components: string[] };

    const dependencies: Record<string, { uses: DependencyNames; usedBy: DependencyNames }>;

    export default dependencies;
}

declare module "virtual:component-props" {
    export type PropEntry = {
        name: string;
        type: string;
        description: string;
        isOptional: boolean;
        isAccessor: boolean;
    };

    const props: Record<string, PropEntry[]>;

    export default props;
}
