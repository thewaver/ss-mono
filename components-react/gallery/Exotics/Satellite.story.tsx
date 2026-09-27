import { type PropsWithChildren, useState } from "react";

import type { AnchorHPlacement, AnchorPlacement, AnchorVPlacement } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import { Satellite, type SatelliteDefs } from "../../src";

type BadgeCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const SUBJECT_STYLE = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "140px",
    height: "80px",
    background: "lightsteelblue",
} as const;
const HOST_STYLE = { margin: "60px", width: "fit-content" };
const PILL_STYLE = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    height: "22px",
    minWidth: "22px",
    padding: "0 6px",
    background: "tomato",
    whiteSpace: "nowrap",
} as const;
const CORNER_SIZE = 28;
const SIDE_SIZE = 36;
const TUCKED_SIZE = 44;
const CORNER_OVERHANG = 10;
const TUCKED_DEPTH = 16;
const LONG_COUNT = 99999;

const PLACEMENTS: Record<BadgeCorner, AnchorPlacement> = {
    "top-left": { x: "left-in", y: "top-in" },
    "top-right": { x: "right-in", y: "top-in" },
    "bottom-left": { x: "left-in", y: "bottom-in" },
    "bottom-right": { x: "right-in", y: "bottom-in" },
};

const OUTWARD: Record<BadgeCorner, Point2d> = {
    "top-left": { x: -1, y: -1 },
    "top-right": { x: 1, y: -1 },
    "bottom-left": { x: -1, y: 1 },
    "bottom-right": { x: 1, y: 1 },
};

const Badge = ({ size, children }: PropsWithChildren<{ size: number }>) => (
    <div
        style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            background: "gold",
        }}
    >
        {children}
    </div>
);

type DefaultProps = {
    hPlacement?: AnchorHPlacement;
    vPlacement?: AnchorVPlacement;
    offset?: Point2d;
    hasSatellite?: boolean;
    badgeSize?: number;
};

export const Default = ({
    hPlacement = "right-out",
    vPlacement = "top-out",
    offset,
    hasSatellite = true,
    badgeSize = CORNER_SIZE,
}: DefaultProps) => {
    const [isBehindSubject, setIsBehindSubject] = useState(false);

    return (
        <>
            <label>
                <input
                    type="checkbox"
                    data-testid="behind"
                    checked={isBehindSubject}
                    onChange={(e) => setIsBehindSubject(e.currentTarget.checked)}
                />
                Behind
            </label>
            <div data-testid="default" style={HOST_STYLE}>
                <Satellite
                    satellites={
                        hasSatellite
                            ? [
                                  {
                                      placement: { x: hPlacement, y: vPlacement },
                                      offset,
                                      isBehindSubject,
                                      renderSatellite: () => <Badge size={badgeSize}>{badgeSize}</Badge>,
                                  },
                              ]
                            : []
                    }
                >
                    <div style={SUBJECT_STYLE}>Subject</div>
                </Satellite>
            </div>
        </>
    );
};

const SEVERAL: SatelliteDefs[] = [
    {
        placement: { x: "right-in", y: "top-in" },
        offset: { x: CORNER_OVERHANG, y: -CORNER_OVERHANG },
        renderSatellite: () => <Badge size={CORNER_SIZE}>3</Badge>,
    },
    {
        placement: { x: "left-out", y: "center" },
        renderSatellite: () => <Badge size={SIDE_SIZE}>A</Badge>,
    },
    {
        placement: { x: "center", y: "bottom-out" },
        offset: { x: 0, y: -TUCKED_DEPTH },
        isBehindSubject: true,
        renderSatellite: () => <Badge size={TUCKED_SIZE} />,
    },
];

export const Several = () => (
    <div data-testid="several" style={HOST_STYLE}>
        <Satellite satellites={SEVERAL}>
            <div style={SUBJECT_STYLE}>Subject</div>
        </Satellite>
    </div>
);

export const CountBadge = ({ corner = "top-right", overhang = 8 }: { corner?: BadgeCorner; overhang?: number }) => {
    const [count, setCount] = useState(7);

    return (
        <>
            <button type="button" data-testid="grow" onClick={() => setCount(LONG_COUNT)}>
                Grow
            </button>
            <div data-testid="badge" style={HOST_STYLE}>
                <Satellite
                    satellites={[
                        {
                            placement: PLACEMENTS[corner],
                            offset: { x: OUTWARD[corner].x * overhang, y: OUTWARD[corner].y * overhang },
                            renderSatellite: () => <div style={PILL_STYLE}>{count}</div>,
                        },
                    ]}
                >
                    <div style={SUBJECT_STYLE}>Inbox</div>
                </Satellite>
            </div>
        </>
    );
};
