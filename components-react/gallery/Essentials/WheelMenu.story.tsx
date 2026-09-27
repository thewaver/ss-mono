import { type ReactNode, useState } from "react";

import { type InteractionFlags, type MenuItemFlags, type PlacementRect, PlacementUtils } from "@thewaver/ss-components";

import { WheelMenu, type WheelMenuItem } from "../../src";

type Action = { name: string; shortcut?: string };

const NOTHING_RUN = "nothing run yet";
const HALF = 0.5;
const HALF_TURN_DEGREES = 180;
const SUBMENU_MARK = "›";
const CLOSER_MARK = "✕";
const HOLE_RADIUS = 64;
const BAND_WIDTH = 84;
const LEVEL_GAP = 8;
const STAGE_HEIGHT = 1100;
const CENTER_PLACEMENT = { x: "center", y: "center" } as const;

const ACTIONS: WheelMenuItem<Action>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" } },
    { value: { name: "Duplicate" } },
    { value: { name: "Delete", shortcut: "Del" } },
];

const NESTED_ACTIONS: WheelMenuItem<Action>[] = [
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

const STORIES = {
    wheel: { items: ACTIONS },
    concentric: { items: NESTED_ACTIONS },
    concentricHalves: { items: NESTED_ACTIONS, spreadDegrees: HALF_TURN_DEGREES },
    flick: { items: ACTIONS, opensOnHold: true },
};

const toViewBox = (rect: PlacementRect) =>
    `${rect.leftShare - rect.widthShare * HALF} ${rect.topShare - rect.heightShare * HALF} ${rect.widthShare} ${rect.heightShare}`;

const renderWedge = (
    item: WheelMenuItem<Action>,
    flags: InteractionFlags<MenuItemFlags>,
    placement: PlacementRect | undefined,
) =>
    placement?.sector && (
        <>
            <svg
                viewBox={toViewBox(placement)}
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    overflow: "visible",
                    pointerEvents: "none",
                }}
            >
                <path
                    d={PlacementUtils.getSectorPath(placement.sector)}
                    style={{ fill: flags.isHighlighted ? "#99c" : "#eee", stroke: "#888", pointerEvents: "all" }}
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    fontSize: 12,
                    pointerEvents: "none",
                }}
            >
                <span>{item.value.name}</span>
                {item.value.shortcut && <span>{item.value.shortcut}</span>}
                {flags.hasSubmenu && <span aria-hidden="true">{SUBMENU_MARK}</span>}
            </div>
        </>
    );

const renderCloser = (flags: InteractionFlags<MenuItemFlags>) => (
    <div
        aria-hidden="true"
        style={{
            display: "grid",
            placeItems: "center",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: flags.isHighlighted ? "#99c" : "#eee",
        }}
    >
        {CLOSER_MARK}
    </div>
);

const renderPopup = (renderItems: () => ReactNode, visibilityTarget: 0 | 1, transitionDurationMs: number) => (
    <div style={{ opacity: visibilityTarget, transition: `opacity ${transitionDurationMs}ms` }}>{renderItems()}</div>
);

export const Default = ({ variant = "wheel" }: { variant?: keyof typeof STORIES }) => {
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    const story: { items: WheelMenuItem<Action>[]; spreadDegrees?: number; opensOnHold?: boolean } = STORIES[variant];

    return (
        <div style={{ position: "relative", display: "grid", placeItems: "center", height: STAGE_HEIGHT }}>
            <WheelMenu
                id="trigger"
                layoutSize={"368px"}
                items={story.items}
                ariaLabel={"Edit actions"}
                spreadDegrees={story.spreadDegrees}
                opensOnHold={story.opensOnHold}
                holeRadius={HOLE_RADIUS}
                bandWidth={BAND_WIDTH}
                levelGap={LEVEL_GAP}
                placement={CENTER_PLACEMENT}
                closerDefs={{ ariaLabel: "Close the wheel", renderContent: renderCloser }}
                renderContent={() => <span>Wheel</span>}
                renderItem={renderWedge}
                renderPopup={renderPopup}
                onActivate={(action) => setLastRun(action.name)}
            />
            <output data-readout="last" style={{ position: "absolute", top: 0, left: 0 }}>
                {lastRun}
            </output>
        </div>
    );
};
