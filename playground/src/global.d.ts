/// <reference types="vite/client" />

declare module "virtual:component-dependencies" {
    const dependencies: Record<string, { abstracts: string[]; components: string[] }>;

    export default dependencies;
}
