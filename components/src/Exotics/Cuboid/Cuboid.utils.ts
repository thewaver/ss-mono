import type { Size2d } from "@thewaver/ss-utils";
import { MathUtils } from "@thewaver/ss-utils";

import { BarrelUtils } from "../../Abstracts/Barrel/Barrel.utils";
import type { CuboidFace, CuboidSize } from "./Cuboid.types";

const QUARTER_TURN_DEG = 90;
const QUARTER_TURN_COUNT = 4;
const HALF = 0.5;

const UPRIGHT_FACES: CuboidFace[] = ["front", "right", "back", "left"];
const INVERTED_FACES: CuboidFace[] = ["back", "left", "front", "right"];

const UP_PITCH = 1;
const DOWN_PITCH = 3;
const INVERTED_PITCH = 2;

export namespace CuboidUtils {
    export const getFaceSize = (face: CuboidFace, size: CuboidSize): Size2d => {
        if (face === "top" || face === "bottom") return { width: size.width, height: size.depth };

        if (face === "left" || face === "right") return { width: size.depth, height: size.height };

        return { width: size.width, height: size.height };
    };

    export const getFaceTransform = (face: CuboidFace, size: CuboidSize) => {
        if (face === "front") return `translateZ(${size.depth * HALF}px)`;

        if (face === "back") return `rotateY(180deg) translateZ(${size.depth * HALF}px)`;

        if (face === "right") return `rotateY(90deg) translateZ(${size.width * HALF}px)`;

        if (face === "left") return `rotateY(-90deg) translateZ(${size.width * HALF}px)`;

        if (face === "top") return `rotateX(90deg) translateZ(${size.height * HALF}px)`;

        return `rotateX(-90deg) translateZ(${size.height * HALF}px)`;
    };

    export const getTurnTransform = (yaw: number, pitch: number, size: CuboidSize) =>
        `translateZ(${-size.depth * HALF}px) rotateX(${-pitch * QUARTER_TURN_DEG}deg) rotateY(${-yaw * QUARTER_TURN_DEG}deg)`;

    export const getFacing = (yaw: number, pitch: number): CuboidFace => {
        const turnedUp = MathUtils.wrapIndex(pitch, QUARTER_TURN_COUNT);
        const turnedAcross = MathUtils.wrapIndex(yaw, QUARTER_TURN_COUNT);

        if (turnedUp === UP_PITCH) return "top";

        if (turnedUp === DOWN_PITCH) return "bottom";

        return (turnedUp === INVERTED_PITCH ? INVERTED_FACES : UPRIGHT_FACES)[turnedAcross]!;
    };

    export const getReservedSize = (size: CuboidSize): Size2d => {
        const circumradius = Math.hypot(size.width, size.height, size.depth) * HALF;
        const extent = BarrelUtils.getProjectedExtent(circumradius, size.depth * HALF);

        return { width: extent, height: extent };
    };
}
