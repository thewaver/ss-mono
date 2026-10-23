import { RangeUtils, type ScrollerAxis } from "@thewaver/ss-components";
import { AngleUtils, type Point2d } from "@thewaver/ss-utils";

import { ARC_RADIUS, ARC_START_ANGLE, ARC_SWEEP_ANGLE, ARC_THUMB_SIZE } from "./ScrollerArcContent.const";

const ARC_TRAVEL = { min: 0, max: 1, startAngle: ARC_START_ANGLE, sweepAngle: ARC_SWEEP_ANGLE };
const CENTER = ARC_RADIUS + ARC_THUMB_SIZE * 0.5;

export namespace ScrollerArcContentUtils {
    export const WIDTH = CENTER * 2;

    export const HEIGHT = CENTER + ARC_THUMB_SIZE * 0.5;

    export const PATH = `M ${CENTER - ARC_RADIUS} ${CENTER} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${CENTER + ARC_RADIUS} ${CENTER}`;

    export const computeThumbCenter = (ratio: number): Point2d => {
        const radians = AngleUtils.toRadians(ARC_START_ANGLE + ratio * ARC_SWEEP_ANGLE);

        return { x: CENTER + ARC_RADIUS * Math.cos(radians), y: CENTER + ARC_RADIUS * Math.sin(radians) };
    };

    export const computeProgressAtPoint = (_axis: ScrollerAxis, point: Point2d, rect: DOMRect) =>
        RangeUtils.computeAngularValue(
            point,
            { x: rect.left, y: rect.top, width: rect.width, height: rect.width },
            ARC_TRAVEL,
        );
}
