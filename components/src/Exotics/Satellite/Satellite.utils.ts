import type { Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";
import { AnchorUtils } from "../../Abstracts/Anchor/Anchor.utils";
import type { SatelliteLayout } from "./Satellite.types";

/**
 * Reserves room in the layout for something hanging off the corner of an element.
 *
 * A badge or a status dot placed over an element's corner sticks out of it, and would be clipped or
 * overlap its neighbours. So instead of positioning it absolutely and hoping, the wrapper is padded
 * by however much the badge overhangs, and the whole assembly takes up the room it really needs.
 */
export namespace SatelliteUtils {
    /**
     * Works out the padding and offset for a satellite in a given corner.
     *
     * The badge's position is worked out first, as if it were being anchored freely; whatever that puts
     * outside the subject becomes padding on that side, and the badge is then shifted back inside the
     * padded box. So a badge fully inside its corner needs no padding, and one hanging half out needs
     * half its size.
     *
     * @param subjectSize The element the satellite hangs off.
     * @param satelliteSize The satellite's own size.
     * @param placement Which corner, and whether the satellite sits inside or outside the edges.
     * @param offset A nudge from that corner.
     * @returns The `padding` for the wrapper and the `satelliteOffset` for the satellite inside it.
     */
    export const computeLayout = (
        subjectSize: Size2d,
        satelliteSize: Size2d,
        placement: AnchorPlacement,
        offset: Point2d,
    ): SatelliteLayout => {
        const subjectRect: Rect = { x: 0, y: 0, width: subjectSize.width, height: subjectSize.height };
        const shift: Point2d = {
            x: AnchorUtils.getHPlacementShift(placement.x, subjectRect, satelliteSize) + offset.x,
            y: AnchorUtils.getVPlacementShift(placement.y, subjectRect, satelliteSize) + offset.y,
        };

        return {
            padding: {
                paddingLeft: Math.max(0, -shift.x),
                paddingTop: Math.max(0, -shift.y),
                paddingRight: Math.max(0, shift.x + satelliteSize.width - subjectSize.width),
                paddingBottom: Math.max(0, shift.y + satelliteSize.height - subjectSize.height),
            },
            satelliteOffset: {
                x: Math.max(0, shift.x),
                y: Math.max(0, shift.y),
            },
        };
    };
}
