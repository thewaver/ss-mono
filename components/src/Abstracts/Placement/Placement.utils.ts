import type { Point2d } from "@thewaver/ss-utils";

import type {
    PlacementLayout,
    PlacementPickDefs,
    PlacementPickRule,
    PlacementRect,
    PlacementSector,
} from "./Placement.types";

const NOTHING = 0;
const HALF = 0.5;
const FULL_WIDTH = 1;
const DEFAULT_PICK_RULE: PlacementPickRule = "nearest";
const HALF_TURN_DEGREES = 180;
const FULL_TURN_DEGREES = 360;
const NO_DIRECTION_RADIUS = 1e-6;
const DEGREES_PER_RADIAN = 180 / Math.PI;
const LARGE_ARC = 1;
const SMALL_ARC = 0;
const CLOCKWISE = 1;
const COUNTER_CLOCKWISE = 0;

export namespace PlacementUtils {
    export const getOrigin = (layout: PlacementLayout): Point2d =>
        layout.origin ?? { x: FULL_WIDTH * HALF, y: layout.heightRatio * HALF };

    export const toLayoutPoint = (boxRatio: Point2d, heightRatio: number): Point2d => ({
        x: boxRatio.x,
        y: boxRatio.y * heightRatio,
    });

    export const getCentre = (placement: PlacementRect): Point2d => ({ x: placement.left, y: placement.top });

    export const getSectorPath = (sector: PlacementSector, origin?: Point2d) => {
        const centre = origin ?? { x: FULL_WIDTH * HALF, y: FULL_WIDTH * HALF };
        const { innerRadius, outerRadius, fromAngle, toAngle } = sector;
        const sweep = toAngle - fromAngle > HALF_TURN_DEGREES ? LARGE_ARC : SMALL_ARC;
        const at = (radius: number, angle: number) => {
            const radians = angle / DEGREES_PER_RADIAN;

            return `${centre.x + Math.cos(radians) * radius} ${centre.y + Math.sin(radians) * radius}`;
        };

        if (innerRadius <= NOTHING) {
            return [
                `M ${centre.x} ${centre.y}`,
                `L ${at(outerRadius, fromAngle)}`,
                `A ${outerRadius} ${outerRadius} 0 ${sweep} ${CLOCKWISE} ${at(outerRadius, toAngle)}`,
                "Z",
            ].join(" ");
        }

        return [
            `M ${at(outerRadius, fromAngle)}`,
            `A ${outerRadius} ${outerRadius} 0 ${sweep} ${CLOCKWISE} ${at(outerRadius, toAngle)}`,
            `L ${at(innerRadius, toAngle)}`,
            `A ${innerRadius} ${innerRadius} 0 ${sweep} ${COUNTER_CLOCKWISE} ${at(innerRadius, fromAngle)}`,
            "Z",
        ].join(" ");
    };

    export const getAngle = (from: Point2d, to: Point2d) =>
        (Math.atan2(to.y - from.y, to.x - from.x) * HALF_TURN_DEGREES) / Math.PI;

    export const getAngleDelta = (a: number, b: number) => {
        const wrapped = (((a - b + HALF_TURN_DEGREES) % FULL_TURN_DEGREES) + FULL_TURN_DEGREES) % FULL_TURN_DEGREES;
        const delta = wrapped - HALF_TURN_DEGREES;

        return Math.abs(delta);
    };

    export const getDistance = (a: Point2d, b: Point2d) => Math.hypot(a.x - b.x, a.y - b.y);

    export const pickIndex = (defs: PlacementPickDefs) => {
        const { placements } = defs.layout;
        const rule = defs.layout.pickRule ?? DEFAULT_PICK_RULE;
        const origin = getOrigin(defs.layout);
        const isPickable = defs.isPickable ?? (() => true);

        if (rule === "angle" && getDistance(defs.point, origin) < NO_DIRECTION_RADIUS) return undefined;

        let bestIndex: number | undefined;
        let bestScore = Infinity;

        for (let index = NOTHING; index < placements.length; index++) {
            if (!isPickable(index)) continue;

            const centre = getCentre(placements[index]);
            const score =
                rule === "angle"
                    ? getAngleDelta(getAngle(origin, defs.point), getAngle(origin, centre))
                    : getDistance(defs.point, centre);

            if (score >= bestScore) continue;

            bestScore = score;
            bestIndex = index;
        }

        return bestIndex;
    };
}
