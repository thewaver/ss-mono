import type { Plugin } from "vite";

const FRAMEWORK_PACKAGES = {
    solid: ["solid-js", "@solidjs/", "@thewaver/ss-components-solid"],
    react: ["react", "react-dom", "react-router", "@thewaver/ss-components-react"],
    vue: ["vue", "vue-router", "@vue/", "@thewaver/ss-components-vue"],
    svelte: ["svelte", "sv-router", "@thewaver/ss-components-svelte"],
};

type Framework = keyof typeof FRAMEWORK_PACKAGES;

const getIsPackage = (source: string, pkg: string) =>
    pkg.endsWith("/") ? source.startsWith(pkg) : source === pkg || source.startsWith(`${pkg}/`);

export const refuseFrameworks = (own: Framework): Plugin => {
    const refused = (Object.keys(FRAMEWORK_PACKAGES) as Framework[])
        .filter((framework) => framework !== own)
        .flatMap((framework) => FRAMEWORK_PACKAGES[framework]);

    return {
        name: "refuse-frameworks",
        enforce: "pre",
        resolveId(source, importer) {
            if (!refused.some((pkg) => getIsPackage(source, pkg))) return undefined;

            this.error(`${importer ?? "A module"} imports ${source}; the ${own} Playground must not.`);
        },
    };
};
