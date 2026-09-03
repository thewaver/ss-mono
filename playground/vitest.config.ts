import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const fromRepo = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            "@thewaver/ss-components": fromRepo("../components/src/index.ts"),
            "@thewaver/ss-utils": fromRepo("../utils/src/index.ts"),
        },
    },
    test: {
        include: ["src/**/*.test.ts"],
        environment: "node",
        fsModuleCache: true,
    },
});
