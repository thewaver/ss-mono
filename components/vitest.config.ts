import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const fromRepo = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            "@thewaver/ss-utils": fromRepo("../utils/src/index.ts"),
        },
    },
    ssr: {
        resolve: {
            conditions: ["browser", "development"],
            externalConditions: ["browser", "development"],
        },
    },
    test: {
        include: ["src/**/*.test.ts"],
        environment: "node",
        fsModuleCache: true,
    },
});
