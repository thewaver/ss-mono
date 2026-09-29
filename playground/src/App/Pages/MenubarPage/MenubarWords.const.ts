import type { MenuItemRecord, ToolbarAction } from "@thewaver/ss-components";

import type { MenubarEntry } from "./MenubarEntry.types";

export const NOTHING_PICKED = "nothing picked yet";

const FILE_ITEMS: MenuItemRecord<MenubarEntry>[] = [
    {
        value: { name: "New" },
        items: [
            { value: { name: "Project" } },
            {
                value: { name: "From template" },
                items: [{ value: { name: "Blank" } }, { value: { name: "Report" } }],
            },
        ],
    },
    { value: { name: "Open", shortcut: "Ctrl+O" } },
    { value: { name: "Save", shortcut: "Ctrl+S" } },
    {
        value: { name: "Export" },
        items: [{ value: { name: "PDF" } }, { value: { name: "PNG" } }],
    },
];

const EDIT_ITEMS: MenuItemRecord<MenubarEntry>[] = [
    { value: { name: "Undo", shortcut: "Ctrl+Z" } },
    { value: { name: "Redo", shortcut: "Ctrl+Y" } },
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" } },
];

const VIEW_ITEMS: MenuItemRecord<MenubarEntry>[] = [
    { value: { name: "Word wrap" }, kind: "checkbox" },
    { value: { name: "Minimap" }, kind: "checkbox" },
    { value: { name: "Small" }, kind: "radio" },
    { value: { name: "Medium" }, kind: "radio" },
    { value: { name: "Large" }, kind: "radio" },
];

export const WORDS: (ToolbarAction<MenubarEntry> & { items: MenuItemRecord<MenubarEntry>[] })[] = [
    { value: { name: "File" }, items: FILE_ITEMS },
    { value: { name: "Edit" }, items: EDIT_ITEMS },
    { value: { name: "View" }, items: VIEW_ITEMS },
];

export const VIEW_DEFAULTS: MenubarEntry[] = [VIEW_ITEMS[0].value, VIEW_ITEMS[3].value];
