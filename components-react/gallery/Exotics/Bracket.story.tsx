import { type ReactNode, useState } from "react";

import {
    type BracketConnectorDefs,
    BracketConnectorPaths,
    type BracketNode,
    type BracketNodeState,
    type BracketOrientation,
    type BracketRootSide,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import { Bracket, type BracketProps } from "../../src";

type ConnectorKey = "flat" | "rounded" | "curved" | "ballAndArrow";

type Paint = { defs: BracketConnectorDefs; width: number; fromColor: string; toColor: string };

const CONNECTOR_RADIUS = 14;
const CONNECTOR_WIDTH = 2;
const ROUTE_CONNECTOR_WIDTH = 3;
const CONNECTOR_COLORS = { from: "rgb(120, 120, 120)", to: "rgb(180, 180, 180)" };
const ROUTE_COLORS = { from: "rgb(200, 40, 40)", to: "rgb(240, 120, 40)" };
const ARROW_LENGTH = 9;
const ARROW_HALF_WIDTH = 5;
const BALL_RADIUS = 4;
const ROOT_LAYER = 0;
const NOTHING_PICKED = "nothing picked yet";
const HOST_STYLE = { padding: "12px" };

const seed = (value: string): BracketNode<string> => ({ value });

const branch = (value: string, ...children: BracketNode<string>[]): BracketNode<string> => ({ value, children });

const DRAW = branch(
    "Final",
    branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
    branch(
        "Semi 2",
        branch("Quarter 3", seed("Eli"), seed("Fay")),
        branch("Quarter 4", seed("Gus"), { value: "Withdrawn", isDisabled: true }),
    ),
);

const COMPANY = branch(
    "Founder",
    branch("Product", seed("Design"), seed("Research"), seed("Content")),
    branch("Engineering", branch("Platform", seed("Data"), seed("Infra")), seed("Clients")),
    seed("Finance"),
);

const SKILLS = branch(
    "Adept",
    branch("Fire", branch("Ember", seed("Spark"))),
    branch("Frost", seed("Chill"), { value: "Blizzard", isDisabled: true }),
);

const ROUND_NAMES = ["Final", "Semifinals", "Quarterfinals", "Entrants"];
const TIER_NAMES = ["Tier 4", "Tier 3", "Tier 2", "Tier 1"];

const Gradient = ({ paint }: { paint: Paint }) => (
    <linearGradient
        id={`bracketConnector-${paint.defs.id}`}
        gradientUnits="userSpaceOnUse"
        x1={paint.defs.from.x}
        y1={paint.defs.from.y}
        x2={paint.defs.to.x}
        y2={paint.defs.to.y}
    >
        <stop offset="0%" style={{ stopColor: paint.fromColor }} />
        <stop offset="100%" style={{ stopColor: paint.toColor }} />
    </linearGradient>
);

const Stroke = ({ paint, d }: { paint: Paint; d: string }) => (
    <path
        d={d}
        fill="none"
        stroke={`url(#bracketConnector-${paint.defs.id})`}
        strokeWidth={paint.width}
        strokeLinecap="round"
        strokeLinejoin="round"
    />
);

const getArrowPoints = (tip: Point2d, spine: Point2d, defs: BracketConnectorDefs) => {
    const isHorizontal = defs.orientation === "horizontal";
    const along = isHorizontal ? Math.sign(tip.x - spine.x) : Math.sign(tip.y - spine.y);
    const back = {
        x: isHorizontal ? tip.x - along * ARROW_LENGTH : tip.x,
        y: isHorizontal ? tip.y : tip.y - along * ARROW_LENGTH,
    };
    const wing = isHorizontal
        ? [
              { x: back.x, y: back.y - ARROW_HALF_WIDTH },
              { x: back.x, y: back.y + ARROW_HALF_WIDTH },
          ]
        : [
              { x: back.x - ARROW_HALF_WIDTH, y: back.y },
              { x: back.x + ARROW_HALF_WIDTH, y: back.y },
          ];

    return [tip, ...wing].map((point) => `${point.x},${point.y}`).join(" ");
};

const CONNECTORS: Record<ConnectorKey, (paint: Paint) => ReactNode> = {
    flat: (paint) => (
        <g>
            <defs>
                <Gradient paint={paint} />
            </defs>
            <Stroke paint={paint} d={BracketConnectorPaths.elbow(paint.defs, CONNECTOR_RADIUS)} />
        </g>
    ),
    rounded: (paint) => (
        <g>
            <defs>
                <Gradient paint={paint} />
            </defs>
            <Stroke paint={paint} d={BracketConnectorPaths.roundedElbow(paint.defs, CONNECTOR_RADIUS)} />
        </g>
    ),
    curved: (paint) => (
        <g>
            <defs>
                <Gradient paint={paint} />
            </defs>
            <Stroke paint={paint} d={BracketConnectorPaths.curve(paint.defs, CONNECTOR_RADIUS)} />
        </g>
    ),
    ballAndArrow: (paint) => {
        const spine = BracketConnectorPaths.getSpine(paint.defs);
        const isHorizontal = paint.defs.orientation === "horizontal";
        const elbowTip = {
            x: isHorizontal ? spine : paint.defs.from.x,
            y: isHorizontal ? paint.defs.from.y : spine,
        };

        return (
            <g>
                <defs>
                    <Gradient paint={paint} />
                </defs>
                <Stroke paint={paint} d={BracketConnectorPaths.roundedElbow(paint.defs, CONNECTOR_RADIUS)} />
                <circle
                    cx={paint.defs.to.x}
                    cy={paint.defs.to.y}
                    r={BALL_RADIUS + paint.width * 0.5}
                    style={{ fill: paint.toColor }}
                />
                <polygon
                    points={getArrowPoints(paint.defs.from, elbowTip, paint.defs)}
                    style={{ fill: paint.fromColor }}
                />
            </g>
        );
    },
};

const renderNode = (node: BracketNode<string>, state: BracketNodeState) => (
    <div
        className={[
            "node",
            state.isFocused ? "nodeFocused" : "",
            state.isOnFocusedRoute ? "nodeOnRoute" : "",
            state.placement.layer === ROOT_LAYER ? "nodeRoot" : "",
            state.placement.isDisabled ? "nodeDisabled" : "",
        ]
            .filter(Boolean)
            .join(" ")}
    >
        {node.value}
    </div>
);

type Shared = Pick<BracketProps<string>, "orientation" | "rootSide" | "crossGap" | "renderConnector">;

const Board = ({
    testId,
    shared,
    ...props
}: { testId: string; shared: Shared } & Omit<BracketProps<string>, "renderNode" | "onActivate">) => {
    const [picked, setPicked] = useState(NOTHING_PICKED);

    return (
        <div data-testid={testId} style={HOST_STYLE}>
            <button type="button">Before</button>
            <Bracket<string>
                {...props}
                {...shared}
                renderNode={renderNode}
                onActivate={(value, placement) =>
                    setPicked(`${value}, node ${placement.id} in layer ${placement.layer}`)
                }
            />
            <output data-readout={testId}>{`picked: ${picked}`}</output>
        </div>
    );
};

type BoardsProps = {
    orientation?: BracketOrientation;
    rootSide?: BracketRootSide;
    crossGap?: number;
    connector?: ConnectorKey;
};

export const Boards = ({ orientation = "horizontal", rootSide, crossGap, connector = "flat" }: BoardsProps) => {
    const isHorizontal = orientation === "horizontal";
    const shared: Shared = {
        orientation,
        rootSide,
        crossGap,
        renderConnector: (defs) =>
            CONNECTORS[connector]({
                defs,
                width: defs.isOnFocusedRoute ? ROUTE_CONNECTOR_WIDTH : CONNECTOR_WIDTH,
                fromColor: defs.isOnFocusedRoute ? ROUTE_COLORS.from : CONNECTOR_COLORS.from,
                toColor: defs.isOnFocusedRoute ? ROUTE_COLORS.to : CONNECTOR_COLORS.to,
            }),
    };

    return (
        <>
            <Board
                testId="knockout"
                shared={shared}
                root={DRAW}
                nodeSize={{ width: 96, height: 34 }}
                layerHeaderSize={isHorizontal ? 24 : 96}
                ariaLabel="Knockout draw"
                renderLayerHeader={(layer) => <div>{ROUND_NAMES[layer]}</div>}
            />
            <Board
                testId="orgChart"
                shared={shared}
                root={COMPANY}
                nodeSize={{ width: 88, height: 40 }}
                ariaLabel="Who reports to whom"
            />
            <Board
                testId="skillTree"
                shared={shared}
                root={SKILLS}
                nodeSize={{ width: 80, height: 36 }}
                layerHeaderSize={isHorizontal ? 24 : 56}
                ariaLabel="Skills and what they unlock"
                renderLayerHeader={(layer) => <div>{TIER_NAMES[layer]}</div>}
            />
        </>
    );
};
