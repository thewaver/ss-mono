import type { ReactNode } from "react";

import { PlacementUtils } from "@thewaver/ss-components-react";
import type {
    InteractionFlags,
    MenuItem,
    MenuItemFlags,
    PlacementRect,
    WheelMenuCloserDefs,
    WheelMenuItem,
} from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.css";

import { PageLayer } from "../../../PageComponents/Layer/Layer";
import type { WheelAction, WheelGradientDefsProps } from "./WheelMenuPageReact.types";

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
    renderContent: (flags) => (
        <div
            className={[styles.closer, flags.isHighlighted && styles.closerHighlighted].filter(Boolean).join(" ")}
            aria-hidden={"true"}
        >
            {CLOSER_MARK}
        </div>
    ),
};

export const PageWheelGradientDefs = (props: WheelGradientDefsProps) => (
    <svg className={styles.wedgeDefs} aria-hidden={"true"}>
        <defs>
            <linearGradient id={props.gradientId} x1={"0"} y1={"1"} x2={"1"} y2={"0"}>
                <stop className={styles.wedgeGradientFrom} offset={"0%"} />
                <stop className={styles.wedgeGradientTo} offset={"100%"} />
            </linearGradient>
        </defs>
    </svg>
);

export const createWheelItemRenderer =
    (gradientId: string) =>
    (item: MenuItem<WheelAction>, flags: InteractionFlags<MenuItemFlags>, placement: PlacementRect | undefined) => {
        const sector = placement?.sector;

        if (!placement || !sector) return null;

        return (
            <>
                <svg className={styles.canvas} viewBox={toViewBox(placement)} aria-hidden={"true"}>
                    <path
                        className={[styles.wedge, flags.isDisabled && styles.wedgeDisabled].filter(Boolean).join(" ")}
                        style={{ fill: flags.isHighlighted ? `url(#${gradientId})` : undefined }}
                        d={PlacementUtils.getSectorPath(sector)}
                    />
                </svg>

                <div
                    className={[styles.label, flags.isHighlighted && styles.labelHighlighted].filter(Boolean).join(" ")}
                >
                    <span>{item.value.name}</span>

                    {item.value.shortcut && <span className={styles.shortcut}>{item.value.shortcut}</span>}

                    {flags.hasSubmenu && <span aria-hidden={"true"}>{SUBMENU_MARK}</span>}
                </div>
            </>
        );
    };

export const renderWheelPopup = (
    renderItems: () => ReactNode,
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
) => (
    <div
        className={[styles.layer, visibilityTarget === 1 && styles.layerVisible].filter(Boolean).join(" ")}
        style={{
            transition: `opacity ${transitionDurationMs}ms, transform ${transitionDurationMs}ms`,
        }}
    >
        <PageLayer level={2}>{renderItems()}</PageLayer>
    </div>
);
