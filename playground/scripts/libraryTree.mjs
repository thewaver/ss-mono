import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_ROOTS = ["../../components/src", "../../components-solid/src"].map((root) =>
    fileURLToPath(new URL(root, import.meta.url)),
);
const OUTPUT_FILE = fileURLToPath(new URL("../src/App/Pages/TreemapPage/TreemapPage.const.ts", import.meta.url));
const SOURCE_PATTERN = /\.(tsx?|css)$/;
const TEST_PATTERN = /\.test\.tsx?$/;
const LOOSE_FILES_SUFFIX = " files";
const INDENT = "    ";

const countLines = async (file) => (await readFile(file, "utf8")).split("\n").length - 1;

const byName = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

const walk = async (dirs, name) => {
    const listings = await Promise.all(
        dirs.map(async (dir) => ({ dir, entries: await readdir(dir, { withFileTypes: true }).catch(() => []) })),
    );

    let looseLines = 0;

    for (const { dir, entries } of listings) {
        for (const entry of entries) {
            if (entry.isFile() && SOURCE_PATTERN.test(entry.name) && !TEST_PATTERN.test(entry.name)) {
                looseLines += await countLines(path.join(dir, entry.name));
            }
        }
    }

    const folderNames = [
        ...new Set(
            listings.flatMap(({ entries }) => entries.filter((entry) => entry.isDirectory()).map((e) => e.name)),
        ),
    ];

    if (folderNames.length === 0) return looseLines > 0 ? { name, lines: looseLines } : undefined;

    const children = [];

    for (const folderName of folderNames) {
        const child = await walk(
            listings.map(({ dir }) => path.join(dir, folderName)),
            folderName,
        );

        if (child) children.push(child);
    }

    children.sort(byName);

    if (looseLines > 0) children.push({ name: `${name}${LOOSE_FILES_SUFFIX}`, lines: looseLines });

    return children.length > 0 ? { name, children } : undefined;
};

const render = (node, depth) => {
    const pad = INDENT.repeat(depth);

    if ("lines" in node) return `${pad}leaf(${JSON.stringify(node.name)}, ${node.lines})`;

    const children = node.children.map((child) => render(child, depth + 1)).join(",\n");

    return `${pad}branch(\n${pad}${INDENT}${JSON.stringify(node.name)},\n${children},\n${pad})`;
};

const tree = await walk(SOURCE_ROOTS, "src");

if (!tree) throw new Error(`No source files under ${SOURCE_ROOTS.join(", ")}`);

const output = `import type { TreemapNode } from "@thewaver/ss-components";

const leaf = (value: string, weight: number): TreemapNode<string> => ({ value, weight });

const branch = (value: string, ...children: TreemapNode<string>[]): TreemapNode<string> => ({ value, children });

export const formatLines = (lines: number) => \`\${lines.toLocaleString("en-US")} lines\`;

export const LIBRARY: TreemapNode<string> = ${render(tree, 0).trimStart()};
`;

await writeFile(OUTPUT_FILE, output);

console.log(`Wrote ${path.relative(process.cwd(), OUTPUT_FILE)}`);
