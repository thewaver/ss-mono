import { type Point2d } from "@thewaver/ss-utils";

import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import { PlacementLayoutDefaults } from "./PlacementLayouts.const";
import {
    AXIS_DEGREES,
    FULL_TURN_DEGREES,
    HALF,
    NOTHING,
    NO_SPREAD_DEGREES,
    OVAL_WIDTH,
    SINGLE_ITEM,
    UNSCALED,
    toEllipsePoint,
    toEvenArcAngles,
    toFillingScale,
    toFittingScale,
    toHalfSize,
    toSpan,
} from "./PlacementLayouts.internal";
import type { ArcDefs, SizedLayout, SizedLayoutFn } from "./PlacementLayouts.types";

/** The arc layout family, alone, so code that uses only this one pays for nothing else. */
export namespace PlacementArcUtils {
    /**
     * Places items along a piece of an oval, evenly spaced by the distance walked rather than by angle.
     *
     * The box is the oval's: as wide as it is given, and `ovalHeightRatio` of that tall, whatever the items. Only
     * the piece the spread covers is drawn, so the piece is then grown evenly until it meets the box on one side
     * and centered on the other, and shrunk back evenly until every item fits inside the box. Items keep the size
     * they were given throughout — only the curve and where the items sit on it are scaled — so changing an item's
     * size never moves the box. An item too large for the box on its own is left as it is and reaches past it.
     *
     * Stepping by distance rather than angle matters once the oval is not a circle, where equal angles bunch
     * the items at its flat ends.
     *
     * @param defs How tall the oval is, how far the piece sweeps and which way it faces, and how large its items
     * are.
     * @returns A layout function, sized — it states the width it was drawn at.
     */
    export const createArc = (defs?: ArcDefs): SizedLayoutFn => {
        const base = PlacementLayoutDefaults.ARC_DEFAULTS;
        const ovalHeightRatio = defs?.ovalHeightRatio ?? base.ovalHeightRatio;
        const spreadDegrees = defs?.spreadDegrees ?? base.spreadDegrees;
        const facingDegrees = defs?.facingDegrees ?? base.facingDegrees;
        const tiltRatio = defs?.tiltRatio ?? base.tiltRatio;
        const itemWidth = defs?.itemWidthRatio ?? base.itemWidthRatio;
        const itemHeight = defs?.itemHeightRatio ?? base.itemHeightRatio;
        const radiusX = OVAL_WIDTH * HALF;
        const radiusY = ovalHeightRatio * HALF;

        return ({ itemCount }): SizedLayout => {
            const widestSpread =
                (FULL_TURN_DEGREES * Math.max(itemCount - SINGLE_ITEM, NOTHING)) / Math.max(itemCount, SINGLE_ITEM);
            const spread = Math.min(Math.max(spreadDegrees, NO_SPREAD_DEGREES), widestSpread);
            const fromAngle = facingDegrees - spread * HALF;
            const toAngle = fromAngle + spread;
            const angles = toEvenArcAngles(itemCount, radiusX, radiusY, fromAngle, toAngle);

            const piece = [
                fromAngle,
                toAngle,
                ...AXIS_DEGREES.filter((angle) => angle > fromAngle && angle < toAngle),
            ].map((angle) => toEllipsePoint(radiusX, radiusY, angle));
            const across = toSpan(piece.map((point) => point.x));
            const down = toSpan(piece.map((point) => point.y));
            const center = { x: (across.low + across.high) * HALF, y: (down.low + down.high) * HALF };
            const filling = Math.min(toFillingScale(radiusX, across), toFillingScale(radiusY, down));

            const items = angles.map((angle) => {
                const tiltDegrees = angle * tiltRatio;

                return {
                    point: toEllipsePoint(radiusX, radiusY, angle),
                    halfSize: toHalfSize(itemWidth, itemHeight, tiltDegrees),
                    tiltDegrees,
                };
            });

            const scale = items.reduce(
                (smallest, item) =>
                    Math.min(
                        smallest,
                        toFittingScale(radiusX, item.halfSize.x, item.point.x - center.x),
                        toFittingScale(radiusY, item.halfSize.y, item.point.y - center.y),
                    ),
                Number.isFinite(filling) ? filling : UNSCALED,
            );

            const toBoxPoint = (point: Point2d) => ({
                x: radiusX + (point.x - center.x) * scale,
                y: radiusY + (point.y - center.y) * scale,
            });

            return {
                placements: items.map<PlacementRect>((item) => {
                    const at = toBoxPoint(item.point);

                    return {
                        leftShare: at.x,
                        topShare: at.y,
                        widthShare: itemWidth,
                        heightShare: itemHeight,
                        angle: item.tiltDegrees,
                    };
                }),
                extent: OVAL_WIDTH,
                heightRatio: ovalHeightRatio,
                pickRule: "angle",
                reachRule: "arc",
                origin: toBoxPoint({ x: NOTHING, y: NOTHING }),
                radii: { x: radiusX * scale, y: radiusY * scale },
            };
        };
    };
}
