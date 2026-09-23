import type { Accessor, JSX } from "solid-js";

import type { AnchorPlacement, InteractionFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components";

import { PageMenuItemContent } from "../../../StyledComponents/MenuItemContent/MenuItemContent";
import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { Action, Destination } from "./MenuPage.types";

const LAYER_COUNT = 20;

export const NOTHING_RUN = "nothing run yet";

export const ACTIONS: MenuItem<Action>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" } },
    { value: { name: "Duplicate" } },
    { value: { name: "Delete", shortcut: "Del" } },
];

export const VIEW_OPTIONS: MenuItem<Action>[] = [
    { value: { name: "Word wrap" }, kind: "checkbox" },
    { value: { name: "Show whitespace" }, kind: "checkbox" },
    { value: { name: "Minimap" }, kind: "checkbox" },
    { value: { name: "Small" }, kind: "radio" },
    { value: { name: "Medium" }, kind: "radio" },
    { value: { name: "Large" }, kind: "radio" },
    { value: { name: "Reset view" } },
];

export const ZOOM_ACTIONS: MenuItem<Action>[] = [
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

export const ACTIONS_WITH_DISABLED: MenuItem<Action>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" }, isDisabled: true },
    { value: { name: "Duplicate" }, isDisabled: true },
    { value: { name: "Delete", shortcut: "Del" } },
];

export const ACTIONS_WITH_REACHABLE: MenuItem<Action>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    {
        value: { name: "Paste", shortcut: "Ctrl+V" },
        isDisabled: true,
        isReachableWhenDisabled: true,
        tooltipDefs: {
            placement: () => ({ x: "right-out", y: "center" }),
            offset: () => ({ x: 10, y: 0 }),
            renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                <PageTooltipContent
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                >
                    The clipboard is empty.
                </PageTooltipContent>
            ),
        },
    },
    { value: { name: "Duplicate" } },
    { value: { name: "Delete", shortcut: "Del" } },
];

export const LAYERS: MenuItem<Action>[] = Array.from({ length: LAYER_COUNT }, (_unused, index) => ({
    value: { name: `Layer ${index + 1}` },
}));

export const NESTED_ACTIONS: MenuItem<Action>[] = [
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

export const renderMenuPopup = (
    renderItems: () => JSX.Element,
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
    getPlacement: () => AnchorPlacement,
) => (
    <PagePopoverSurface
        visibilityTarget={getVisibilityTarget}
        transitionDurationMs={getTransitionDurationMs}
        placement={getPlacement}
    >
        {renderItems()}
    </PagePopoverSurface>
);

export const renderMenuItem = (
    getItem: Accessor<MenuItem<Action>>,
    getFlags: () => InteractionFlags<MenuItemFlags>,
) => (
    <PageMenuItemContent flags={getFlags} kind={() => getItem().kind} shortcut={() => getItem().value.shortcut ?? ""}>
        {getItem().value.name}
    </PageMenuItemContent>
);

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

const toDestinationItems = (nodes: DestinationTree[], parentPath: string[]): MenuItem<Destination>[] =>
    nodes.map((node) => {
        const path = [...parentPath, node.name];

        return {
            value: { name: node.name, path, isLeaf: node.children === undefined },
            items: node.children && toDestinationItems(node.children, path),
        };
    });

export const DESTINATIONS = toDestinationItems(DESTINATION_TREE, []);

export const renderDestinationItem = (
    getItem: Accessor<MenuItem<Destination>>,
    getFlags: () => InteractionFlags<MenuItemFlags>,
) => (
    <PageMenuItemContent flags={getFlags} kind={() => getItem().kind} shortcut={""}>
        {getItem().value.name}
    </PageMenuItemContent>
);
