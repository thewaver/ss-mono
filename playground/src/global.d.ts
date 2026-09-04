/// <reference types="vite/client" />

declare module "virtual:component-dependencies" {
    export type DependencyNames = { abstracts: string[]; components: string[] };

    const dependencies: Record<string, { uses: DependencyNames; usedBy: DependencyNames }>;

    export default dependencies;
}
