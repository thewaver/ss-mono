import { type BracketConnectorDefs, BracketConnectorPaths } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import { markup } from "../../../Utils/markupUtils.js";
import BracketConnectorElement from "./BracketConnectorElement.svelte";
import type { BracketConnectorFn } from "./BracketConnectorsSvelte.types.js";

const ARROW_LENGTH = 9;
const ARROW_HALF_WIDTH = 5;
const BALL_RADIUS = 4;
const HALF = 0.5;

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
    (paint) =>
        markup(BracketConnectorElement, { paint, d: build(paint.defs, paint.radius) });

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

        return markup(BracketConnectorElement, {
            paint,
            d: BracketConnectorPaths.roundedElbow(paint.defs, paint.radius),
            tips: {
                ballRadius: BALL_RADIUS + paint.width * HALF,
                arrowPoints: getArrowPoints(paint.defs.from, elbowTip, paint.defs),
            },
        });
    };

    export const SAMPLE_CONNECTORS = { flat, rounded, curved, ball_and_arrow: ballAndArrow } satisfies Record<
        string,
        BracketConnectorFn
    >;

    export type SampleKey = keyof typeof SAMPLE_CONNECTORS;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_CONNECTORS) as SampleKey[];
}
