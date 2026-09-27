import { type ReactNode, useState } from "react";

import type { InteractionFlags, MenuItemFlags } from "@thewaver/ss-components";

import { Button, ContextMenu, Menu, type MenuItem } from "../../src";

type Action = { name: string; shortcut?: string };

type Destination = { name: string; path: string[]; isLeaf: boolean };

type DestinationTree = { name: string; children?: DestinationTree[] };

const NOTHING_RUN = "nothing run yet";
const SURFACE_INSET = 5;
const SUBMENU_OFFSET = { x: SURFACE_INSET, y: -SURFACE_INSET };
const SUBMENU_MARK = "›";
const CHECKED_MARK = "✓";
const PICKED_MARK = "●";
const PATH_SEPARATOR = " / ";
const NOTHING_CHOSEN = "Choose a destination";
const REGION_SIZE = { width: 480, height: 240 };

const ACTIONS: MenuItem<Action>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" } },
    { value: { name: "Duplicate" } },
    { value: { name: "Delete", shortcut: "Del" } },
];

const ACTIONS_WITH_DISABLED: MenuItem<Action>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" }, isDisabled: true },
    { value: { name: "Duplicate" }, isDisabled: true },
    { value: { name: "Delete", shortcut: "Del" } },
];

const ACTIONS_WITH_REACHABLE: MenuItem<Action>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    {
        value: { name: "Paste", shortcut: "Ctrl+V" },
        isDisabled: true,
        isReachableWhenDisabled: true,
        tooltipDefs: {
            placement: { x: "right-out", y: "center" },
            offset: { x: 10, y: 0 },
            renderContent: (visibilityTarget) => (
                <span style={{ opacity: visibilityTarget }}>The clipboard is empty.</span>
            ),
        },
    },
    { value: { name: "Duplicate" } },
    { value: { name: "Delete", shortcut: "Del" } },
];

const VIEW_OPTIONS: MenuItem<Action>[] = [
    { value: { name: "Word wrap" }, kind: "checkbox" },
    { value: { name: "Show whitespace" }, kind: "checkbox" },
    { value: { name: "Minimap" }, kind: "checkbox" },
    { value: { name: "Small" }, kind: "radio" },
    { value: { name: "Medium" }, kind: "radio" },
    { value: { name: "Large" }, kind: "radio" },
    { value: { name: "Reset view" } },
];

const VIEW_DEFAULTS: Action[] = [VIEW_OPTIONS[0].value, VIEW_OPTIONS[4].value];

const NESTED_ACTIONS: MenuItem<Action>[] = [
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

const toDestinationItems = (nodes: DestinationTree[], parentPath: string[]): MenuItem<Destination>[] =>
    nodes.map((node) => {
        const path = [...parentPath, node.name];

        return {
            value: { name: node.name, path, isLeaf: node.children === undefined },
            items: node.children && toDestinationItems(node.children, path),
        };
    });

const DESTINATIONS = toDestinationItems(DESTINATION_TREE, []);

const renderPopup = (renderItems: () => ReactNode, visibilityTarget: 0 | 1, transitionDurationMs: number) => (
    <div
        style={{
            padding: SURFACE_INSET - 1,
            border: "1px solid #888",
            background: "white",
            opacity: visibilityTarget,
            transition: `opacity ${transitionDurationMs}ms`,
        }}
    >
        {renderItems()}
    </div>
);

const renderEntry = (
    item: { kind?: string; value: { name: string; shortcut?: string } },
    flags: InteractionFlags<MenuItemFlags>,
) => (
    <div
        data-highlighted={flags.isHighlighted}
        style={{ display: "flex", gap: 8, padding: "4px 8px", background: flags.isHighlighted ? "#ddd" : undefined }}
    >
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

const renderTrigger = (caption: string) => (flags: InteractionFlags<{ isOpen: boolean }>) => (
    <span>{`${caption}${flags.isOpen ? " (open)" : ""}`}</span>
);

type ActionsProps = { items: MenuItem<Action>[]; isDisabled?: boolean; isReachable?: boolean };

const ActionsMenu = (props: ActionsProps) => {
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <>
            <Menu
                id="trigger"
                items={props.items}
                ariaLabel={"Edit actions"}
                isDisabled={props.isDisabled}
                isReachableWhenDisabled={props.isReachable}
                submenuOffset={SUBMENU_OFFSET}
                renderContent={renderTrigger("Edit")}
                renderItem={renderEntry}
                renderPopup={renderPopup}
                onActivate={(action) => setLastRun(action.name)}
            />
            <output data-readout="last">{lastRun}</output>
        </>
    );
};

export const Default = () => <ActionsMenu items={ACTIONS} />;

export const DisabledItems = () => <ActionsMenu items={ACTIONS_WITH_DISABLED} />;

export const ReachableItems = () => <ActionsMenu items={ACTIONS_WITH_REACHABLE} />;

export const Submenus = () => <ActionsMenu items={NESTED_ACTIONS} />;

export const DisabledTrigger = ({ isReachable = false }: { isReachable?: boolean }) => (
    <ActionsMenu items={ACTIONS} isDisabled={true} isReachable={isReachable} />
);

export const RightToLeft = () => (
    <>
        <div dir="rtl" data-testid="rtl" style={{ display: "flex", justifyContent: "center" }}>
            <Menu
                id="rtlTrigger"
                items={NESTED_ACTIONS}
                ariaLabel={"Edit actions"}
                renderContent={renderTrigger("تحرير")}
                renderItem={renderEntry}
                renderPopup={renderPopup}
                onActivate={() => {}}
            />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Menu
                id="ltrTrigger"
                items={NESTED_ACTIONS}
                ariaLabel={"Edit actions"}
                renderContent={renderTrigger("Edit")}
                renderItem={renderEntry}
                renderPopup={renderPopup}
                onActivate={() => {}}
            />
        </div>
    </>
);

export const Driven = () => {
    const visibilityState = useState(false);
    const [anchor, setAnchor] = useState<HTMLElement>();
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    const [isOpen, setIsOpen] = visibilityState;

    return (
        <>
            <Menu
                id="trigger"
                visibilityState={visibilityState}
                anchorRef={anchor}
                items={ACTIONS}
                ariaLabel={"Edit actions"}
                renderContent={renderTrigger("Edit")}
                renderItem={renderEntry}
                renderPopup={renderPopup}
                onActivate={(action) => setLastRun(action.name)}
            />
            <Button
                ref={(element) => setAnchor(element ?? undefined)}
                id={"menuToggle"}
                ariaLabel={"Toggle the menu from outside"}
                renderContent={() => <span>{isOpen ? "Close it" : "Open it"}</span>}
                onClick={() => setIsOpen(!isOpen)}
            />
            <output data-readout="last">{`${lastRun} — the menu is ${isOpen ? "open" : "closed"}`}</output>
        </>
    );
};

export const Stateful = () => {
    const checkedState = useState<Action[]>(VIEW_DEFAULTS);
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    const ticked = VIEW_OPTIONS.filter((option) => checkedState[0].includes(option.value)).map(
        (option) => option.value.name,
    );

    return (
        <>
            <Menu
                id="trigger"
                items={VIEW_OPTIONS}
                ariaLabel={"View options"}
                checkedState={checkedState}
                renderContent={renderTrigger("View")}
                renderItem={renderEntry}
                renderPopup={renderPopup}
                onActivate={(action) => setLastRun(action.name)}
            />
            <output data-readout="last">{`${lastRun} — ticked: ${ticked.join(", ")}`}</output>
        </>
    );
};

export const Cascader = () => {
    const [path, setPath] = useState<string[]>([]);

    const pathText = path.length > 0 ? path.join(PATH_SEPARATOR) : NOTHING_CHOSEN;

    return (
        <>
            <Menu
                id="trigger"
                items={DESTINATIONS}
                ariaLabel={`Destination: ${pathText}`}
                submenuOffset={SUBMENU_OFFSET}
                renderContent={() => <span>{pathText}</span>}
                renderItem={renderEntry}
                renderPopup={renderPopup}
                onActivate={(destination) => {
                    if (destination.isLeaf) setPath(destination.path);
                }}
            />
            <output data-readout="last">{`path: [${path.join(", ")}]`}</output>
        </>
    );
};

export const Context = ({ isDisabled = false }: { isDisabled?: boolean }) => {
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <>
            <div data-testid="context">
                <ContextMenu
                    items={ACTIONS}
                    ariaLabel={"Edit actions"}
                    regionAriaLabel={"Editing area"}
                    isDisabled={isDisabled}
                    renderRegion={() => (
                        <div data-testid="region" style={{ ...REGION_SIZE, border: "1px dashed #888" }}>
                            Right-click anywhere in this box
                        </div>
                    )}
                    renderItem={renderEntry}
                    renderPopup={renderPopup}
                    onActivate={(action) => setLastRun(action.name)}
                />
            </div>
            <output data-readout="last">{lastRun}</output>
        </>
    );
};
