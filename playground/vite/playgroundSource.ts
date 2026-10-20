import { readFile, realpath } from "node:fs/promises";
import { isAbsolute, relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";

const SOURCE_QUERY = "?source";
const SOURCE_PREFIX = "\0source:";
const SOURCE_SUFFIX = ".source";
const REPO_ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SOURCE_ROOT_PATTERN = /^playground(-[a-z]+)?[\\/]src[\\/]/;

const isServable = async (path: string) => {
    const realPath = await realpath(path).catch(() => undefined);

    if (!realPath) return false;

    const fromRoot = relative(await realpath(REPO_ROOT), realPath);

    return !isAbsolute(fromRoot) && SOURCE_ROOT_PATTERN.test(fromRoot);
};

export const playgroundSource = (): Plugin => {
    const issuedIds = new Set<string>();

    return {
        name: "playground-source",
        enforce: "pre",
        async resolveId(source, importer) {
            if (!source.endsWith(SOURCE_QUERY)) return undefined;

            const resolved = await this.resolve(source.slice(0, -SOURCE_QUERY.length), importer, { skipSelf: true });

            if (!resolved || !(await isServable(resolved.id))) return undefined;

            const id = `${SOURCE_PREFIX}${resolved.id}${SOURCE_SUFFIX}`;

            issuedIds.add(id);

            return id;
        },
        async load(id) {
            if (!id.startsWith(SOURCE_PREFIX)) return undefined;
            if (!issuedIds.has(id)) this.error(`Refusing to serve ${id.slice(SOURCE_PREFIX.length)}`);

            const path = id.slice(SOURCE_PREFIX.length, -SOURCE_SUFFIX.length);

            this.addWatchFile(path);

            return `export default ${JSON.stringify(await readFile(path, "utf8"))};`;
        },
    };
};
