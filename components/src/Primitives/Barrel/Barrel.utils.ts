import type { Size2d } from "@thewaver/ss-utils";
import { RotationUtils } from "@thewaver/ss-utils";

import type { BarrelAxis, BarrelFace } from "./Barrel.types";

/** Fewer than two faces and there is no prism to build. */
const MIN_BARREL_FACE_COUNT = 2;
/** From three faces up, a face can be turned far enough for its back to be seen. */
const MIN_BACKED_FACE_COUNT = 3;
/** A half turn, for facing a back panel the other way. */
const HALF_TURN_DEG = 180;
/** Halfway, for taking a radius from a diameter. */
const HALF = 0.5;

/** How far the viewer sits from the barrel. Every projected measurement depends on it, so it must match the `perspective` the stylesheet applies. */
export const BARREL_PERSPECTIVE_PX = 1000;

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

        const halfAngleTangent = Math.tan(Math.PI / faceCount);

        if (!Number.isFinite(halfAngleTangent) || halfAngleTangent <= 0) return 0;

        return Math.round((faceExtent * 0.5) / halfAngleTangent);
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

        return Math.round(faceExtent / Math.sin(Math.PI / faceCount));
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
        const eyeDistance = BARREL_PERSPECTIVE_PX + apothem;
        const tangentDistanceSquared = eyeDistance * eyeDistance - circumradius * circumradius;

        if (tangentDistanceSquared <= 0) return circumradius * 2;

        return (2 * BARREL_PERSPECTIVE_PX * circumradius) / Math.sqrt(tangentDistanceSquared);
    };

    /**
     * How much room to reserve across a barrel, perspective included.
     *
     * @param faceExtent A face's width along the turning direction.
     * @param faceCount How many faces the barrel has.
     */
    export const getGirth = (faceExtent: number, faceCount: number) =>
        getProjectedExtent(getCircumdiameter(faceExtent, faceCount) * HALF, getApothem(faceExtent, faceCount));

    /**
     * The transform that puts one face on the barrel's surface.
     *
     * @param axis Which way the barrel turns.
     * @param face `"front"` or `"back"`. A back is turned a further half turn so it faces outwards.
     * @param angle How far the barrel is currently turned.
     * @param index Which face this is.
     * @param faceCount How many faces the barrel has.
     * @param apothem How far a face sits from the axis.
     */
    export const getFaceTransform = (
        axis: BarrelAxis,
        face: BarrelFace,
        angle: number,
        index: number,
        faceCount: number,
        apothem: number,
    ) => {
        const rotate = axis === "row" ? "rotateY" : "rotateX";
        const faceAngle = -angle - RotationUtils.getStepAngle(faceCount) * index;
        const flip = face === "back" ? ` ${rotate}(${HALF_TURN_DEG}deg)` : "";

        return `${rotate}(${faceAngle}deg) translateZ(${apothem}px)${flip}`;
    };
}
