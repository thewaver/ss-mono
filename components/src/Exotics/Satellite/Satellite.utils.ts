import type { Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import { AnchorUtils } from "../../Abstracts/Anchor/Anchor.utils";
import type { SatelliteLayout, SatelliteLayoutEntry } from "./Satellite.types";

/**
 * Reserves room in the layout for things hanging off the edges of an element.
 *
 * A badge or a status dot placed over an element's corner sticks out of it, and would be clipped or
 * overlap its neighbors. So instead of positioning it absolutely and hoping, the wrapper is padded
 * by however much the satellites overhang, and the whole assembly takes up the room it really needs.
 */
export namespace SatelliteUtils {
    /**
     * Works out the one padding and the per-satellite offsets for any number of satellites.
     *
     * Each satellite's position is worked out first, as if it were being anchored freely to the subject;
     * whatever that puts outside the subject becomes padding on that side, and each side takes the
     * furthest overhang any satellite has there. Every satellite is then shifted by the same padding, so
     * they all land in one padded box. A satellite fully inside the subject needs no padding, one hanging
     * half out needs half its size, and two on the same side need only the larger of the two.
     *
     * @param subjectSize The element the satellites hang off.
     * @param entries Each satellite's own size, placement and nudge, in the order the offsets should come back.
     * @returns The `padding` for the wrapper, and one offset per entry inside the padded box. No entries
     * gives no padding and no offsets.
     */
    export const computeLayout = (subjectSize: Size2d, entries: SatelliteLayoutEntry[]): SatelliteLayout => {
        const subjectRect: Rect = { x: 0, y: 0, width: subjectSize.width, height: subjectSize.height };
        const shifts: Point2d[] = entries.map((entry) => ({
            x: AnchorUtils.getHPlacementShift(entry.placement.x, subjectRect, entry.size) + entry.offset.x,
            y: AnchorUtils.getVPlacementShift(entry.placement.y, subjectRect, entry.size) + entry.offset.y,
        }));

        const paddingLeft = Math.max(0, ...shifts.map((shift) => -shift.x));
        const paddingTop = Math.max(0, ...shifts.map((shift) => -shift.y));

        return {
            padding: {
                paddingLeft,
                paddingTop,
                paddingRight: Math.max(
                    0,
                    ...shifts.map((shift, index) => shift.x + entries[index].size.width - subjectSize.width),
                ),
                paddingBottom: Math.max(
                    0,
                    ...shifts.map((shift, index) => shift.y + entries[index].size.height - subjectSize.height),
                ),
            },
            satelliteOffsets: shifts.map((shift) => ({ x: shift.x + paddingLeft, y: shift.y + paddingTop })),
        };
    };
}
