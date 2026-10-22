import type { Size2d } from "@thewaver/ss-utils";
import { PolygonUtils, RotationUtils } from "@thewaver/ss-utils";

import type { BarrelAxis, BarrelFace } from "./Barrel.types";

/** Fewer than two faces and there is no prism to build. */
const MIN_BARREL_FACE_COUNT = 2;
/** From three faces up, a face can be turned far enough for its back to be seen. */
const MIN_BACKED_FACE_COUNT = 3;
/** A half turn, for facing a back panel the other way. */
const HALF_TURN_DEG = 180;
/** Halfway, for taking a radius from a diameter. */
const HALF = 0.5;
/** Double, for taking a diameter from a radius. */
const DOUBLE = 2;

/** How far the viewer sits from the barrel. Every projected measurement depends on it, so it must match the `perspective` the stylesheet applies. */
const VIEWER_DISTANCE_PX = 1000;

/**
 * Builds a rotating prism out of flat faces — the shape behind a picker drum or a slot-machine reel.
 *
 * The faces are all laid out in the same place, then each turned by its share of a full turn and
 * pushed outwards, which makes them the sides of a prism. The measurements needed for that are the
 * apothem, the distance from the axis out to the middle of a face, and the circumdiameter, the
 * distance across the corners.
 *
 * The subtlety is perspective. Under a CSS `perspective`, the near side of the prism is drawn larger
 * than life, so the room it occupies on screen is more than its true width — and the projection is
 * what has to be reserved in the layout, or the barrel will clip as it turns.
 */
export namespace BarrelUtils {
    /** How far the viewer sits from the barrel. A consumer writing the `perspective` themselves has to match it. */
    export const PERSPECTIVE_PX = VIEWER_DISTANCE_PX;

    /**
     * How wide a face is along the direction the barrel turns.
     *
     * @param faceSize A face's size.
     * @param axis Which way the barrel turns.
     */
    export const getFaceExtent = (faceSize: Size2d, axis: BarrelAxis) =>
        axis === "row" ? faceSize.width : faceSize.height;

    /**
     * Whether faces need backs drawn.
     *
     * With three faces or more, turning brings a face round far enough to be seen from behind, so
     * something has to be there. Two faces never turn that far.
     *
     * @param faceCount How many faces the barrel has.
     */
    export const getHasBacks = (faceCount: number) => faceCount >= MIN_BACKED_FACE_COUNT;

    /**
     * How far a face sits from the barrel's axis.
     *
     * This is what each face is pushed outwards by, and it is set by the faces themselves: the wider they
     * are and the fewer of them there are, the fatter the barrel has to be for them to meet edge to edge.
     *
     * @param faceExtent A face's width along the turning direction.
     * @param faceCount How many faces the barrel has.
     * @returns The distance in whole pixels, since a fractional one shows as a seam between faces. Zero
     * for fewer than two faces.
     */
    export const getApothem = (faceExtent: number, faceCount: number) => {
        if (faceCount < MIN_BARREL_FACE_COUNT) return 0;

        return Math.round(PolygonUtils.getRegularApothem(faceExtent, faceCount));
    };

    /**
     * The distance across the barrel through its corners.
     *
     * @param faceExtent A face's width along the turning direction.
     * @param faceCount How many faces the barrel has.
     * @returns The diameter in whole pixels, or the face's own width for fewer than two faces.
     */
    export const getCircumdiameter = (faceExtent: number, faceCount: number) => {
        if (faceCount < MIN_BARREL_FACE_COUNT) return faceExtent;

        return Math.round(PolygonUtils.getRegularCircumradius(faceExtent, faceCount) * DOUBLE);
    };

    /**
     * How much room a barrel takes on screen once perspective has enlarged its near side.
     *
     * The widest part drawn is not the barrel's own diameter but the silhouette the viewer's line of
     * sight grazes it at, which is wider. That is what has to be reserved.
     *
     * @param circumradius Half the distance across the corners.
     * @param apothem How far a face sits from the axis, which sets how close the barrel's surface comes
     * to the viewer.
     * @returns The projected width, falling back to the true diameter where the barrel is so large it
     * would enclose the viewpoint and the projection has no meaning.
     */
    export const getProjectedExtent = (circumradius: number, apothem: number) => {
        const eyeDistance = VIEWER_DISTANCE_PX + apothem;
        const tangentDistanceSquared = eyeDistance * eyeDistance - circumradius * circumradius;

        if (tangentDistanceSquared <= 0) return circumradius * 2;

        return (2 * VIEWER_DISTANCE_PX * circumradius) / Math.sqrt(tangentDistanceSquared);
    };

    /**
     * How much room to reserve across a barrel, perspective included.
     *
     * A barrel of three faces or more shows several of them at rest, curving away either side of the one in front, so
     * its room is the silhouette it really has standing still. A two-face barrel rests flat, one face square to the
     * viewer, so its room is exactly that face: the bulge of a turn is allowed to spill past it rather than being set
     * aside as room nothing uses at rest.
     *
     * @param faceExtent A face's width along the turning direction.
     * @param faceCount How many faces the barrel has.
     */
    export const getGirth = (faceExtent: number, faceCount: number) =>
        faceCount <= MIN_BARREL_FACE_COUNT
            ? faceExtent
            : getProjectedExtent(getCircumdiameter(faceExtent, faceCount) * HALF, getApothem(faceExtent, faceCount));

    /**
     * How much room the whole barrel takes: its girth along the way it turns, and one face across the other way.
     *
     * @param faceSize A face's size.
     * @param axis Which way the barrel turns.
     * @param girth What {@link getGirth} answered for this barrel.
     */
    export const getRootSize = (faceSize: Size2d, axis: BarrelAxis, girth: number): Size2d =>
        axis === "row" ? { width: girth, height: faceSize.height } : { width: faceSize.width, height: girth };

    /**
     * The turn that puts one face at its place round the barrel.
     *
     * A face is two elements: this turn goes on the outer one, which is the one transitioned, and
     * {@link getFaceOffsetTransform} on the inner one, which never is. Kept apart so that a change of face count
     * moves each face out to its new distance at once while only the turn animates — one transform carrying both
     * would animate the distance as well, and for the length of a turn the faces would sit outside the room the
     * barrel had already resized to.
     *
     * @param axis Which way the barrel turns.
     * @param angle How far the barrel is currently turned.
     * @param index Which face this is.
     * @param faceCount How many faces the barrel has.
     */
    export const getFaceTurnTransform = (axis: BarrelAxis, angle: number, index: number, faceCount: number) =>
        `${axis === "row" ? "rotateY" : "rotateX"}(${-angle - RotationUtils.getStepAngle(faceCount) * index}deg)`;

    /**
     * The move that puts one face out on the barrel's surface, once {@link getFaceTurnTransform} has turned it.
     *
     * @param axis Which way the barrel turns.
     * @param face `"front"` or `"back"`. A back is turned a further half turn so it faces outwards.
     * @param apothem How far a face sits from the axis.
     */
    export const getFaceOffsetTransform = (axis: BarrelAxis, face: BarrelFace, apothem: number) =>
        `translateZ(${apothem}px)${face === "back" ? ` ${axis === "row" ? "rotateY" : "rotateX"}(${HALF_TURN_DEG}deg)` : ""}`;
}
