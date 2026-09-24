import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_ROOT = fileURLToPath(new URL("../../components/src", import.meta.url));
const OUTPUT_FILE = fileURLToPath(new URL("../src/App/Pages/TreemapPage/TreemapPage.const.ts", import.meta.url));
const SOURCE_PATTERN = /\.(tsx?|css)$/;
const TEST_PATTERN = /\.test\.tsx?$/;
const LOOSE_FILES_SUFFIX = " files";
const INDENT = "    ";

type Node = { name: string; lines: number } | { name: string; children: Node[] };

const countLines = async (file: string) => (await readFile(file, "utf8")).split("\n").length - 1;

const byName = (a: Node, b: Node) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

const walk = async (dir: string, name: string): Promise<Node | undefined> => {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = entries.filter(
        (entry) => entry.isFile() && SOURCE_PATTERN.test(entry.name) && !TEST_PATTERN.test(entry.name),
    );
    const folders = entries.filter((entry) => entry.isDirectory());

    let looseLines = 0;

    for (const file of files) looseLines += await countLines(path.join(dir, file.name));

    if (folders.length === 0) return looseLines > 0 ? { name, lines: looseLines } : undefined;

    const children: Node[] = [];

    for (const folder of folders) {
        const child = await walk(path.join(dir, folder.name), folder.name);

        if (child) children.push(child);
    }

    children.sort(byName);

    if (looseLines > 0) children.push({ name: `${name}${LOOSE_FILES_SUFFIX}`, lines: looseLines });

    return children.length > 0 ? { name, children } : undefined;
};

const render = (node: Node, depth: number): string => {
    const pad = INDENT.repeat(depth);

    if ("lines" in node) return `${pad}leaf(${JSON.stringify(node.name)}, ${node.lines})`;

    const children = node.children.map((child) => render(child, depth + 1)).join(",\n");

    return `${pad}branch(\n${pad}${INDENT}${JSON.stringify(node.name)},\n${children},\n${pad})`;
};

const tree = await walk(SOURCE_ROOT, "src");

if (!tree) throw new Error(`No source files under ${SOURCE_ROOT}`);

const output = `import type { TreemapNode } from "@thewaver/ss-components";

const leaf = (value: string, weight: number): TreemapNode<string> => ({ value, weight });

const branch = (value: string, ...children: TreemapNode<string>[]): TreemapNode<string> => ({ value, children });

export const formatLines = (lines: number) => \`\${lines.toLocaleString("en-US")} lines\`;

export const LIBRARY: TreemapNode<string> = ${render(tree, 0).trimStart()};
`;

await writeFile(OUTPUT_FILE, output);

console.log(`Wrote ${path.relative(process.cwd(), OUTPUT_FILE)}`);
