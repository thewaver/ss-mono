import type { Size2d } from "@thewaver/ss-utils";
import { RotationUtils } from "@thewaver/ss-utils";

import type { BarrelAxis, BarrelFace } from "./Barrel.types";

const MIN_BARREL_FACE_COUNT = 2;
const MIN_BACKED_FACE_COUNT = 3;
const HALF_TURN_DEG = 180;
const HALF = 0.5;

export const BARREL_PERSPECTIVE_PX = 1000;

export namespace BarrelUtils {
    export const getFaceExtent = (faceSize: Size2d, axis: BarrelAxis) =>
        axis === "row" ? faceSize.width : faceSize.height;

    export const getHasBacks = (faceCount: number) => faceCount >= MIN_BACKED_FACE_COUNT;

    export const getApothem = (faceExtent: number, faceCount: number) => {
        if (faceCount < MIN_BARREL_FACE_COUNT) return 0;

        const halfAngleTangent = Math.tan(Math.PI / faceCount);

        if (!Number.isFinite(halfAngleTangent) || halfAngleTangent <= 0) return 0;

        return Math.round(faceExtent / 2 / halfAngleTangent);
    };

    export const getCircumdiameter = (faceExtent: number, faceCount: number) => {
        if (faceCount < MIN_BARREL_FACE_COUNT) return faceExtent;

        return Math.round(faceExtent / Math.sin(Math.PI / faceCount));
    };

    export const getProjectedExtent = (circumradius: number, apothem: number) => {
        const eyeDistance = BARREL_PERSPECTIVE_PX + apothem;
        const tangentDistanceSquared = eyeDistance * eyeDistance - circumradius * circumradius;

        if (tangentDistanceSquared <= 0) return circumradius * 2;

        return (2 * BARREL_PERSPECTIVE_PX * circumradius) / Math.sqrt(tangentDistanceSquared);
    };

    export const getGirth = (faceExtent: number, faceCount: number) =>
        getProjectedExtent(getCircumdiameter(faceExtent, faceCount) * HALF, getApothem(faceExtent, faceCount));

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
