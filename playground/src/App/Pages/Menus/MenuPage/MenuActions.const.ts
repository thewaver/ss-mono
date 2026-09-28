import type { MenuItemRecord } from "@thewaver/ss-components";

import type { Action, Destination } from "./MenuActions.types";

const LAYER_COUNT = 20;

export const NOTHING_RUN = "nothing run yet";

export const ACTIONS: MenuItemRecord<Action>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" } },
    { value: { name: "Duplicate" } },
    { value: { name: "Delete", shortcut: "Del" } },
];

export const VIEW_OPTIONS: MenuItemRecord<Action>[] = [
    { value: { name: "Word wrap" }, kind: "checkbox" },
    { value: { name: "Show whitespace" }, kind: "checkbox" },
    { value: { name: "Minimap" }, kind: "checkbox" },
    { value: { name: "Small" }, kind: "radio" },
    { value: { name: "Medium" }, kind: "radio" },
    { value: { name: "Large" }, kind: "radio" },
    { value: { name: "Reset view" } },
];

export const ZOOM_ACTIONS: MenuItemRecord<Action>[] = [
    { value: { name: "Zoom in", shortcut: "Ctrl++" }, staysOpenOnPick: true },
    { value: { name: "Zoom out", shortcut: "Ctrl+-" }, staysOpenOnPick: true },
    { value: { name: "Reset zoom", shortcut: "Ctrl+0" } },
];

export const ZOOM_STEP_PERCENT = 10;

export const ZOOM_RESET_PERCENT = 100;

export const ZOOM_STEPS: Record<string, number | undefined> = {
    "Zoom in": ZOOM_STEP_PERCENT,
    "Zoom out": -ZOOM_STEP_PERCENT,
};

export const VIEW_DEFAULTS: Action[] = [VIEW_OPTIONS[0].value, VIEW_OPTIONS[4].value];

export const ACTIONS_WITH_DISABLED: MenuItemRecord<Action>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" }, isDisabled: true },
    { value: { name: "Duplicate" }, isDisabled: true },
    { value: { name: "Delete", shortcut: "Del" } },
];

export const LAYERS: MenuItemRecord<Action>[] = Array.from({ length: LAYER_COUNT }, (_unused, index) => ({
    value: { name: `Layer ${index + 1}` },
}));

export const NESTED_ACTIONS: MenuItemRecord<Action>[] = [
    {
        value: { name: "New" },
        items: [
            { value: { name: "Project" } },
            {
                value: { name: "From template" },
                items: [{ value: { name: "Blank" } }, { value: { name: "Dashboard" } }, { value: { name: "Report" } }],
            },
            { value: { name: "Import" } },
        ],
    },
    { value: { name: "Open", shortcut: "Ctrl+O" } },
    {
        value: { name: "Share" },
        items: [
            { value: { name: "Copy link", shortcut: "Ctrl+L" } },
            { value: { name: "Email" }, isDisabled: true },
            {
                value: { name: "Export" },
                items: [{ value: { name: "PDF" } }, { value: { name: "PNG" } }],
            },
        ],
    },
    { value: { name: "Delete", shortcut: "Del" } },
];

type DestinationTree = { name: string; children?: DestinationTree[] };

const DESTINATION_TREE: DestinationTree[] = [
    {
        name: "Europe",
        children: [
            { name: "France", children: [{ name: "Paris" }, { name: "Lyon" }, { name: "Marseille" }] },
            { name: "Portugal", children: [{ name: "Lisbon" }, { name: "Porto" }] },
        ],
    },
    {
        name: "Asia",
        children: [
            { name: "Japan", children: [{ name: "Tokyo" }, { name: "Kyoto" }] },
            { name: "Vietnam", children: [{ name: "Hanoi" }, { name: "Hue" }] },
        ],
    },
    {
        name: "South America",
        children: [{ name: "Peru", children: [{ name: "Lima" }, { name: "Cusco" }] }],
    },
];

const toDestinationItems = (nodes: DestinationTree[], parentPath: string[]): MenuItemRecord<Destination>[] =>
    nodes.map((node) => {
        const path = [...parentPath, node.name];

        return {
            value: { name: node.name, path, isLeaf: node.children === undefined },
            items: node.children && toDestinationItems(node.children, path),
        };
    });

export const DESTINATIONS = toDestinationItems(DESTINATION_TREE, []);
