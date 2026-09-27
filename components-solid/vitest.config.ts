import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

const fromRepo = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
    plugins: [vanillaExtractPlugin()],
    resolve: {
        alias: {
            "@thewaver/ss-components": fromRepo("../components/src/index.ts"),
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
