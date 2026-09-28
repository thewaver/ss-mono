import type { TreeNodeRecord } from "@thewaver/ss-components";

import type { Asset } from "./TreeRecords.types";

export const OUTSIDE_COLLAPSE_DELAY_MS = 500;

export const FILES: TreeNodeRecord<string, never>[] = [
    {
        value: "src",
        children: [
            { value: "index.ts" },
            {
                value: "Lib",
                children: [
                    { value: "Tree.tsx" },
                    { value: "Tree.utils.ts" },
                    { value: "Input", children: [{ value: "Select.tsx" }, { value: "TextInput.tsx" }] },
                ],
            },
            { value: "Playground", children: [{ value: "App.tsx" }] },
        ],
    },
    { value: "package.json" },
    { value: "README.md" },
];

export const FILES_WITH_DISABLED: TreeNodeRecord<string, never>[] = [
    {
        value: "src",
        children: [
            { value: "index.ts", isDisabled: true },
            {
                value: "Lib",
                isDisabled: true,
                children: [{ value: "Tree.tsx" }, { value: "Tree.utils.ts" }],
            },
            { value: "Playground", children: [{ value: "App.tsx" }] },
        ],
    },
    { value: "package.json" },
];

export const DOCS: TreeNodeRecord<string, never>[] = [
    {
        value: "Guides",
        children: [
            { value: "Installing", href: "#tree-installing" },
            { value: "Theming", href: "#tree-theming" },
        ],
    },
    {
        value: "Reference",
        children: [{ value: "Props", href: "#tree-props" }],
    },
    { value: "Changelog", href: "#tree-changelog" },
];

export const ASSETS: TreeNodeRecord<Asset, never>[] = [
    {
        value: { name: "Sprites", kind: "folder" },
        children: [
            { value: { name: "knight.webp", kind: "image" } },
            { value: { name: "knightette.webp", kind: "image" } },
        ],
    },
    {
        value: { name: "Audio", kind: "folder" },
        children: [{ value: { name: "theme.ogg", kind: "track" } }],
    },
    { value: { name: "credits.txt", kind: "text" } },
];

export const STRESS_BRANCH_COUNT = 200;
export const STRESS_LEAF_COUNT = 50;

export const createStressFiles = (): TreeNodeRecord<string, never>[] =>
    Array.from({ length: STRESS_BRANCH_COUNT }, (_unused, branchIndex) => ({
        value: `package-${branchIndex + 1}`,
        children: Array.from({ length: STRESS_LEAF_COUNT }, (_leafUnused, leafIndex) => ({
            value: `package-${branchIndex + 1}/file-${leafIndex + 1}.ts`,
        })),
    }));

export const REMOTE_LOAD_DELAY_MS = 600;

export const REMOTE_ROOT: TreeNodeRecord<string, never>[] = [
    { value: "packages", hasMoreChildren: true },
    { value: "docs", hasMoreChildren: true },
    { value: "README.md" },
];

export const REMOTE_CHILDREN: Record<string, TreeNodeRecord<string, never>[]> = {
    packages: [
        { value: "core", hasMoreChildren: true },
        { value: "ui", hasMoreChildren: true },
    ],
    core: [{ value: "index.ts" }, { value: "registry.ts" }],
    ui: [{ value: "Button.tsx" }, { value: "Modal.tsx" }],
    docs: [{ value: "getting-started.md" }, { value: "api.md" }],
};

export const RANKS: TreeNodeRecord<string, never>[] = [
    {
        value: "Animalia",
        children: [
            {
                value: "Chordata",
                children: [{ value: "Mammalia" }, { value: "Aves" }, { value: "Reptilia" }],
            },
            { value: "Arthropoda", children: [{ value: "Insecta" }, { value: "Arachnida" }] },
            { value: "Mollusca", children: [{ value: "Gastropoda" }, { value: "Bivalvia" }] },
            { value: "Annelida", children: [{ value: "Clitellata" }] },
        ],
    },
];

export const RANK_ROOTS = ["Animalia", "Chordata", "Arthropoda", "Mollusca", "Annelida"];
