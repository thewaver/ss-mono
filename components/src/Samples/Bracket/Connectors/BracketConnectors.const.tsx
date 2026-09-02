import type { Point2d } from "@thewaver/ss-utils";

import type { BracketConnectorDefs } from "../../../Exotics/Bracket/Bracket.types";
import { BracketConnectorPaths } from "./BracketConnectorPaths.const";
import type { BracketConnectorFn, BracketConnectorPaintDefs } from "./BracketConnectors.types";

const ARROW_LENGTH = 9;
const ARROW_HALF_WIDTH = 5;
const BALL_RADIUS = 4;
const HALF = 0.5;

const getGradientId = (defs: BracketConnectorDefs) => `bracketConnector-${defs.id}`;

const getGradient = (paint: BracketConnectorPaintDefs) => (
    <linearGradient
        id={getGradientId(paint.defs)}
        gradientUnits={"userSpaceOnUse"}
        x1={paint.defs.from.x}
        y1={paint.defs.from.y}
        x2={paint.defs.to.x}
        y2={paint.defs.to.y}
    >
        <stop offset={"0%"} style={{ "stop-color": paint.fromColor }} />
        <stop offset={"100%"} style={{ "stop-color": paint.toColor }} />
    </linearGradient>
);

const getStroke = (paint: BracketConnectorPaintDefs) => `url(#${getGradientId(paint.defs)})`;

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

const strokeOnly =
    (build: (defs: BracketConnectorDefs, radius: number) => string): BracketConnectorFn =>
    (paint) => (
        <g>
            <defs>{getGradient(paint)}</defs>

            <path
                d={build(paint.defs, paint.radius)}
                fill={"none"}
                stroke={getStroke(paint)}
                stroke-width={paint.width}
                stroke-linecap={"round"}
                stroke-linejoin={"round"}
            />
        </g>
    );

export namespace BracketConnectors {
    export const flat = strokeOnly(BracketConnectorPaths.elbow);

    export const rounded = strokeOnly(BracketConnectorPaths.roundedElbow);

    export const curved = strokeOnly(BracketConnectorPaths.curve);

    export const ballAndArrow: BracketConnectorFn = (paint) => {
        const spine = BracketConnectorPaths.getSpine(paint.defs);
        const isHorizontal = paint.defs.orientation === "horizontal";
        const elbowTip = {
            x: isHorizontal ? spine : paint.defs.from.x,
            y: isHorizontal ? paint.defs.from.y : spine,
        };

        return (
            <g>
                <defs>{getGradient(paint)}</defs>

                <path
                    d={BracketConnectorPaths.roundedElbow(paint.defs, paint.radius)}
                    fill={"none"}
                    stroke={getStroke(paint)}
                    stroke-width={paint.width}
                    stroke-linecap={"round"}
                    stroke-linejoin={"round"}
                />

                <circle
                    cx={paint.defs.to.x}
                    cy={paint.defs.to.y}
                    r={BALL_RADIUS + paint.width * HALF}
                    style={{ fill: paint.toColor }}
                />

                <polygon
                    points={getArrowPoints(paint.defs.from, elbowTip, paint.defs)}
                    style={{ fill: paint.fromColor }}
                />
            </g>
        );
    };

    export const ALL: Record<string, BracketConnectorFn> = { flat, rounded, curved, ballAndArrow };
}
