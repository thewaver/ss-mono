import type { Size2d } from "@thewaver/ss-utils";
import { MathUtils } from "@thewaver/ss-utils";

import { BarrelUtils } from "../../Primitives/Barrel/Barrel.utils";
import type { CuboidFace, CuboidSize } from "./Cuboid.types";

/** A quarter turn. The cuboid only ever rests on a face, so every angle is a multiple of this. */
const QUARTER_TURN_DEG = 90;
/** Quarter turns in a full turn. */
const QUARTER_TURN_COUNT = 4;
/** Halfway, for pushing a face out to half the depth it faces along. */
const HALF = 0.5;

/** Which face is towards the viewer at each quarter turn, while the cuboid is the right way up. */
const UPRIGHT_FACES: CuboidFace[] = ["front", "right", "back", "left"];
/** The same, upside down, where front and back have swapped along with left and right. */
const INVERTED_FACES: CuboidFace[] = ["back", "left", "front", "right"];

/** The quarter turn that brings the top face towards the viewer. */
const UP_PITCH = 1;
/** The quarter turn that brings the bottom face towards the viewer. */
const DOWN_PITCH = 3;
/** The half turn that leaves the cuboid upside down. */
const INVERTED_PITCH = 2;

/**
 * Sizes and positions the six faces of a CSS 3D cuboid, and says which one is facing the viewer.
 *
 * The faces are all laid out in the same place and then each pushed out to its own surface, which is
 * how CSS 3D transforms build a box. Turns are counted in quarter turns rather than degrees, since a
 * cuboid only ever comes to rest on a face.
 */
export namespace CuboidUtils {
    /**
     * A face's own width and height.
     *
     * Which two of the cuboid's three dimensions a face has depends on which way it points: the top and
     * bottom are width by depth, the sides are depth by height, and the front and back are width by
     * height.
     *
     * @param face Which face.
     * @param size The cuboid's width, height and depth.
     */
    export const getFaceSize = (face: CuboidFace, size: CuboidSize): Size2d => {
        if (face === "top" || face === "bottom") return { width: size.width, height: size.depth };

        if (face === "left" || face === "right") return { width: size.depth, height: size.height };

        return { width: size.width, height: size.height };
    };

    /**
     * The transform that puts a face on its own surface.
     *
     * Each face is turned to point the right way and then pushed out along its new forward direction by
     * half the dimension it faces along.
     *
     * @param face Which face.
     * @param size The cuboid's width, height and depth.
     */
    export const getFaceTransform = (face: CuboidFace, size: CuboidSize) => {
        if (face === "front") return `translateZ(${size.depth * HALF}px)`;

        if (face === "back") return `rotateY(180deg) translateZ(${size.depth * HALF}px)`;

        if (face === "right") return `rotateY(90deg) translateZ(${size.width * HALF}px)`;

        if (face === "left") return `rotateY(-90deg) translateZ(${size.width * HALF}px)`;

        if (face === "top") return `rotateX(90deg) translateZ(${size.height * HALF}px)`;

        return `rotateX(-90deg) translateZ(${size.height * HALF}px)`;
    };

    /**
     * The transform that turns the whole cuboid to show a chosen face.
     *
     * The cuboid is pushed back by half its depth first, so it turns about its own centre rather than
     * about its front surface — without that, turning would swing the box through the space around it.
     *
     * @param yaw How many quarter turns about the vertical axis.
     * @param pitch How many quarter turns about the horizontal axis.
     * @param size The cuboid's width, height and depth.
     */
    export const getTurnTransform = (yaw: number, pitch: number, size: CuboidSize) =>
        `translateZ(${-size.depth * HALF}px) rotateX(${-pitch * QUARTER_TURN_DEG}deg) rotateY(${-yaw * QUARTER_TURN_DEG}deg)`;

    /**
     * Which face a turn leaves facing the viewer.
     *
     * @param yaw How many quarter turns about the vertical axis.
     * @param pitch How many quarter turns about the horizontal axis.
     * @returns The face. Turns wrap, so any whole number works, and a half turn upwards swaps front for
     * back and left for right — which is why the sideways turn cannot be read on its own.
     */
    export const getFacing = (yaw: number, pitch: number): CuboidFace => {
        const turnedUp = MathUtils.wrapIndex(pitch, QUARTER_TURN_COUNT);
        const turnedAcross = MathUtils.wrapIndex(yaw, QUARTER_TURN_COUNT);

        if (turnedUp === UP_PITCH) return "top";

        if (turnedUp === DOWN_PITCH) return "bottom";

        return (turnedUp === INVERTED_PITCH ? INVERTED_FACES : UPRIGHT_FACES)[turnedAcross]!;
    };

    /**
     * How much room to leave for a cuboid so it never clips as it turns.
     *
     * The worst case is a corner pointing at the viewer, so the space needed is set by the distance from
     * the centre to a corner rather than by any one dimension. Perspective then makes the near part of
     * the box larger than life, which is allowed for as well.
     *
     * @param size The cuboid's width, height and depth.
     * @returns A square big enough for every orientation, so the layout does not shift as the cuboid
     * turns.
     */
    export const getReservedSize = (size: CuboidSize): Size2d => {
        const circumradius = Math.hypot(size.width, size.height, size.depth) * HALF;
        const extent = BarrelUtils.getProjectedExtent(circumradius, size.depth * HALF);

        return { width: extent, height: extent };
    };
}
