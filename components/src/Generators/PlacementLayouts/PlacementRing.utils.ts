import { AngleUtils, MathUtils } from "@thewaver/ss-utils";

import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import { PlacementLayoutDefaults } from "./PlacementLayouts.const";
import {
    FULL_TURN_DEGREES,
    HALF,
    NOTHING,
    NO_HOLE,
    NO_SPREAD_DEGREES,
    QUARTER_TURN_DEGREES,
    SINGLE_ITEM,
    WHOLE_RADIUS,
    toSum,
    toTurnExtent,
} from "./PlacementLayouts.internal";
import type { ArcBox } from "./PlacementLayouts.internal";
import type { BandDefs, SizedLayout, SizedLayoutFn } from "./PlacementLayouts.types";

/** The ring layout family, alone, so code that uses only this one pays for nothing else. */
export namespace PlacementRingUtils {
    /**
     * Places items round a band, at even angles.
     *
     * Each item is given the wedge of the ring it sits in as well as its box, so a control can hand its
     * painter a shape rather than a rectangle. A spread below a whole turn opens the band into an arc of
     * wedges, and the box stays the whole circle, so a part-ring leaves the side it does not cover empty and
     * nested bands still share a center.
     *
     * @param defs How wide the band is, which way it faces, and how its items sit on it.
     * @returns A layout function, sized — it states the width it was drawn at.
     */
    export const createRing = (defs?: BandDefs): SizedLayoutFn => {
        const base = PlacementLayoutDefaults.BAND_DEFAULTS;
        const spreadDegrees = Math.min(
            Math.max(defs?.spreadDegrees ?? base.spreadDegrees, NO_SPREAD_DEGREES),
            FULL_TURN_DEGREES,
        );
        const facingDegrees = defs?.facingDegrees ?? base.facingDegrees;
        const holeRatio = Math.min(Math.max(defs?.holeRatio ?? base.holeRatio, NO_HOLE), WHOLE_RADIUS);
        const bandWidth = WHOLE_RADIUS - holeRatio;
        const wedgeGapDegrees = defs?.wedgeGapDegrees ?? base.wedgeGapDegrees;
        const tiltRatio = defs?.tiltRatio ?? base.tiltRatio;
        const itemRadiusRatio = defs?.itemRadiusRatio ?? base.itemRadiusRatio;
        const itemHeightRatio = defs?.itemHeightRatio ?? base.itemHeightRatio;
        const itemMaxWidthRatio = defs?.itemMaxWidthRatio ?? base.itemMaxWidthRatio;
        const computeItemArcs = defs?.computeItemArcs;
        const innerRadius = holeRatio;
        const outerRadius = WHOLE_RADIUS;
        const itemRadius = innerRadius + bandWidth * itemRadiusRatio;

        return ({ itemCount }): SizedLayout => {
            const declared = computeItemArcs?.() ?? [];
            const asked = Array.from({ length: itemCount }, (_unused, index) => declared[index]);
            const askedTotal = toSum(asked.map((arc) => arc ?? NOTHING));
            const freeCount = asked.filter((arc) => arc === undefined).length;
            const evenArc = Math.max(spreadDegrees - askedTotal, NOTHING) / Math.max(freeCount, SINGLE_ITEM);
            const wanted = asked.map((arc) => arc ?? evenArc);
            const total = toSum(wanted);
            const arcs = wanted.map((arc) => (arc * spreadDegrees) / Math.max(total, Number.EPSILON));
            const blockArc = toSum(arcs);
            const start = facingDegrees - blockArc * HALF;

            const boxes: ArcBox[] = [];
            let walked = NOTHING;

            for (let index = NOTHING; index < itemCount; index++) {
                const fromAngle = start + walked + wedgeGapDegrees * HALF;
                const toAngle = start + walked + arcs[index] - wedgeGapDegrees * HALF;
                const centerAngle = (fromAngle + toAngle) * HALF;
                const radians = centerAngle * AngleUtils.RADIANS_PER_DEGREE;
                const itemWidth = Math.min(
                    2 *
                        itemRadius *
                        Math.sin(
                            MathUtils.clamp((toAngle - fromAngle) * HALF, NOTHING, QUARTER_TURN_DEGREES) *
                                AngleUtils.RADIANS_PER_DEGREE,
                        ),
                    bandWidth * itemMaxWidthRatio,
                );

                walked += arcs[index];

                boxes.push({
                    x: Math.cos(radians) * itemRadius,
                    y: Math.sin(radians) * itemRadius,
                    width: itemWidth,
                    height: itemWidth * itemHeightRatio,
                    tiltDegrees: centerAngle * tiltRatio,
                    fromAngle,
                    toAngle,
                });
            }

            const extent = toTurnExtent(outerRadius);
            const width = extent.right - extent.left;
            const height = extent.bottom - extent.top;
            const origin = { x: -extent.left / width, y: -extent.top / width };

            const placements = boxes.map<PlacementRect>((box) => ({
                leftShare: origin.x + box.x / width,
                topShare: origin.y + box.y / width,
                widthShare: box.width / width,
                heightShare: box.height / width,
                angle: box.tiltDegrees,
                sector:
                    box.fromAngle === undefined || box.toAngle === undefined
                        ? undefined
                        : {
                              innerRadius: innerRadius / width,
                              outerRadius: outerRadius / width,
                              fromAngle: box.fromAngle,
                              toAngle: box.toAngle,
                              origin,
                          },
            }));

            return {
                placements,
                extent: width,
                heightRatio: height / width,
                pickRule: "angle",
                reachRule: "arc",
                origin,
            };
        };
    };
}
