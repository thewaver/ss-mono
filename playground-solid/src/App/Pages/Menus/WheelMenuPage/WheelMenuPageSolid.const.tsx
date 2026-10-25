import type { Accessor, JSX } from "solid-js";
import { Show } from "solid-js";

import { PlacementUtils } from "@thewaver/ss-components-solid";
import type {
    InteractionFlags,
    MenuItem,
    MenuItemFlags,
    PlacementRect,
    WheelMenuCloserDefs,
    WheelMenuItem,
} from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.css";

import { PageLayer } from "../../../PageComponents/Layer/Layer";
import type { WheelAction, WheelGradientDefsProps } from "./WheelMenuPageSolid.types";

const HALF = 0.5;
const SUBMENU_MARK = "›";
const CLOSER_MARK = "✕";

const toViewBox = (rect: PlacementRect) =>
    `${rect.leftShare - rect.widthShare * HALF} ${rect.topShare - rect.heightShare * HALF} ${rect.widthShare} ${rect.heightShare}`;

export const ACTIONS: WheelMenuItem<WheelAction>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" } },
    { value: { name: "Duplicate" } },
    { value: { name: "Delete", shortcut: "Del" } },
];

export const NESTED_ACTIONS: WheelMenuItem<WheelAction>[] = [
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
        items: [{ value: { name: "Copy link", shortcut: "Ctrl+L" } }, { value: { name: "Email" } }],
    },
    { value: { name: "Delete", shortcut: "Del" } },
];

export const WEIGHTED_ACTIONS: WheelMenuItem<WheelAction>[] = [
    { value: { name: "Confirm" }, arcDegrees: 180 },
    { value: { name: "Cancel" } },
    { value: { name: "Later" } },
    { value: { name: "Help" } },
];

export const CLOSER_DEFS: WheelMenuCloserDefs = {
    ariaLabel: "Close the wheel",
    renderContent: (getFlags) => (
        <div
            class={styles.closer}
            classList={{ [styles.closerHighlighted]: getFlags().isHighlighted }}
            aria-hidden={"true"}
        >
            {CLOSER_MARK}
        </div>
    ),
};

export const PageWheelGradientDefs = (props: WheelGradientDefsProps) => (
    <svg class={styles.wedgeDefs} aria-hidden={"true"}>
        <defs>
            <linearGradient id={props.gradientId} x1={"0"} y1={"1"} x2={"1"} y2={"0"}>
                <stop class={styles.wedgeGradientFrom} offset={"0%"} />
                <stop class={styles.wedgeGradientTo} offset={"100%"} />
            </linearGradient>
        </defs>
    </svg>
);

export const createWheelItemRenderer =
    (gradientId: string) =>
    (
        getItem: Accessor<MenuItem<WheelAction>>,
        getFlags: () => InteractionFlags<MenuItemFlags>,
        getPlacement: () => PlacementRect | undefined,
    ) => (
        <Show when={getPlacement()?.sector}>
            {(getSector) => (
                <>
                    <svg class={styles.canvas} viewBox={toViewBox(getPlacement()!)} aria-hidden={"true"}>
                        <path
                            class={styles.wedge}
                            classList={{ [styles.wedgeDisabled]: getFlags().isDisabled }}
                            style={{ fill: getFlags().isHighlighted ? `url(#${gradientId})` : undefined }}
                            d={PlacementUtils.getSectorPath(getSector())}
                        />
                    </svg>

                    <div class={styles.label} classList={{ [styles.labelHighlighted]: getFlags().isHighlighted }}>
                        <span>{getItem().value.name}</span>

                        <Show when={getItem().value.shortcut}>
                            {(getShortcut) => <span class={styles.shortcut}>{getShortcut()}</span>}
                        </Show>

                        <Show when={getFlags().hasSubmenu}>
                            <span aria-hidden={"true"}>{SUBMENU_MARK}</span>
                        </Show>
                    </div>
                </>
            )}
        </Show>
    );

export const renderWheelPopup = (
    renderItems: () => JSX.Element,
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
) => (
    <div
        class={styles.layer}
        classList={{ [styles.layerVisible]: getVisibilityTarget() === 1 }}
        style={{
            transition: `opacity ${getTransitionDurationMs()}ms, transform ${getTransitionDurationMs()}ms`,
        }}
    >
        <PageLayer level={2}>{renderItems()}</PageLayer>
    </div>
);
