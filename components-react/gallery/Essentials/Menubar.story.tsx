import { type ReactNode, useState } from "react";

import type { InteractionFlags, MenuItemFlags } from "@thewaver/ss-components";

import { type MenuItem, Menubar, type MenubarAction } from "../../src";

type Entry = { name: string; shortcut?: string };

const NOTHING_PICKED = "nothing picked yet";
const STARTING_BAR_WIDTH = 420;
const SURFACE_INSET = 5;
const SUBMENU_OFFSET = { x: SURFACE_INSET, y: -SURFACE_INSET };
const SUBMENU_MARK = "›";
const CHECKED_MARK = "✓";
const PICKED_MARK = "●";

const FILE_ITEMS: MenuItem<Entry>[] = [
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

const EDIT_ITEMS: MenuItem<Entry>[] = [
    { value: { name: "Undo", shortcut: "Ctrl+Z" } },
    { value: { name: "Redo", shortcut: "Ctrl+Y" } },
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" } },
];

const VIEW_ITEMS: MenuItem<Entry>[] = [
    { value: { name: "Word wrap" }, kind: "checkbox" },
    { value: { name: "Minimap" }, kind: "checkbox" },
    { value: { name: "Small" }, kind: "radio" },
    { value: { name: "Medium" }, kind: "radio" },
    { value: { name: "Large" }, kind: "radio" },
];

const WORDS: MenubarAction<Entry>[] = [
    { value: { name: "File" }, items: FILE_ITEMS },
    { value: { name: "Edit" }, items: EDIT_ITEMS },
    { value: { name: "View" }, items: VIEW_ITEMS },
];

const VIEW_DEFAULTS: Entry[] = [VIEW_ITEMS[0].value, VIEW_ITEMS[3].value];

const renderItem = (item: MenuItem<Entry>, flags: InteractionFlags<MenuItemFlags>) => (
    <div style={{ display: "flex", gap: 8, padding: "4px 8px", background: flags.isHighlighted ? "#ddd" : undefined }}>
        {item.kind !== undefined && item.kind !== "command" && (
            <span aria-hidden="true">
                {flags.isChecked ? (item.kind === "radio" ? PICKED_MARK : CHECKED_MARK) : ""}
            </span>
        )}
        <span>{item.value.name}</span>
        {item.value.shortcut && <span>{item.value.shortcut}</span>}
        {flags.hasSubmenu && <span aria-hidden="true">{SUBMENU_MARK}</span>}
    </div>
);

const renderPopup = (renderItems: () => ReactNode, visibilityTarget: 0 | 1) => (
    <div
        style={{ padding: SURFACE_INSET - 1, border: "1px solid #888", background: "white", opacity: visibilityTarget }}
    >
        {renderItems()}
    </div>
);

export const Default = () => {
    const [width, setWidth] = useState(STARTING_BAR_WIDTH);
    const [lastPicked, setLastPicked] = useState(NOTHING_PICKED);
    const checkedState = useState<Entry[]>(VIEW_DEFAULTS);

    return (
        <>
            <input
                type="number"
                data-testid="barWidth"
                aria-label="Bar width in pixels"
                value={width}
                onChange={(e) => setWidth(Number(e.currentTarget.value))}
            />
            <div data-testid="bar" style={{ width }}>
                <Menubar
                    actions={WORDS}
                    ariaLabel={"Editor"}
                    overflowAriaLabel={"More menus"}
                    checkedState={checkedState}
                    submenuOffset={SUBMENU_OFFSET}
                    renderAction={(action) => <span style={{ padding: "0 8px" }}>{action.value.name}</span>}
                    renderOverflowTrigger={() => <span>More</span>}
                    renderItem={renderItem}
                    renderPopup={renderPopup}
                    onActivate={(entry) => setLastPicked(entry.name)}
                />
            </div>
            <output data-readout="last">{`last picked: ${lastPicked} — checked: ${checkedState[0].length}`}</output>
        </>
    );
};
