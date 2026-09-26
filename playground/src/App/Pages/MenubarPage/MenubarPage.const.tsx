import type { Accessor, JSX } from "solid-js";

import type {
    AnchorPlacement,
    InteractionFlags,
    MenuItem,
    MenuItemFlags,
    MenubarAction,
} from "@thewaver/ss-components";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { PageMenuItemContent } from "../../StyledComponents/MenuItemContent/MenuItemContent";
import { PagePopoverSurface } from "../../StyledComponents/PopoverSurface/PopoverSurface";
import type { MenubarEntry } from "./MenubarPage.types";

export const NOTHING_PICKED = "nothing picked yet";

const FILE_ITEMS: MenuItem<MenubarEntry>[] = [
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

const EDIT_ITEMS: MenuItem<MenubarEntry>[] = [
    { value: { name: "Undo", shortcut: "Ctrl+Z" } },
    { value: { name: "Redo", shortcut: "Ctrl+Y" } },
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" } },
];

const VIEW_ITEMS: MenuItem<MenubarEntry>[] = [
    { value: { name: "Word wrap" }, kind: "checkbox" },
    { value: { name: "Minimap" }, kind: "checkbox" },
    { value: { name: "Small" }, kind: "radio" },
    { value: { name: "Medium" }, kind: "radio" },
    { value: { name: "Large" }, kind: "radio" },
];

export const WORDS: MenubarAction<MenubarEntry>[] = [
    { value: { name: "File" }, items: FILE_ITEMS },
    { value: { name: "Edit" }, items: EDIT_ITEMS },
    { value: { name: "View" }, items: VIEW_ITEMS },
];

export const VIEW_DEFAULTS: MenubarEntry[] = [VIEW_ITEMS[0].value, VIEW_ITEMS[3].value];

export const renderMenubarPopup = (
    renderItems: () => JSX.Element,
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
    getPlacement: () => AnchorPlacement,
) => (
    <PageLayer level={2}>
        <PagePopoverSurface
            visibilityTarget={getVisibilityTarget}
            transitionDurationMs={getTransitionDurationMs}
            placement={getPlacement}
        >
            {renderItems()}
        </PagePopoverSurface>
    </PageLayer>
);

export const renderMenubarItem = (
    getItem: Accessor<MenuItem<MenubarEntry>>,
    getFlags: () => InteractionFlags<MenuItemFlags>,
) => (
    <PageMenuItemContent flags={getFlags} kind={() => getItem().kind} shortcut={() => getItem().value.shortcut ?? ""}>
        {getItem().value.name}
    </PageMenuItemContent>
);
