import type { Matrix3d, Point3d, Size2d } from "@thewaver/ss-utils";
import { AngleUtils, MathUtils, Matrix3dUtils } from "@thewaver/ss-utils";

import { BarrelUtils } from "../../Primitives/Barrel/Barrel.utils";
import type { CuboidArc, CuboidFace, CuboidSize, CuboidTurns } from "./Cuboid.types";

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

/** No turn on either axis. */
const NO_TURNS: CuboidTurns = { yaw: 0, pitch: 0 };
/** How many quarter turns either way a route to a named face is looked for within. Two reaches every face. */
const ROUTE_REACH = 2;

/** The orientation the cuboid starts in, with the front towards the viewer and the right way up. */
const IDENTITY: Matrix3d = [1, 0, 0, 0, 1, 0, 0, 0, 1];
/** Which way up is on the screen. CSS measures `y` downwards, so up is negative. */
const SCREEN_UP: Point3d = { x: 0, y: -1, z: 0 };
/** The axis a rotation of nothing is written about, since it has to be written about something. */
const VIEW_AXIS: Point3d = { x: 0, y: 0, z: 1 };

/** Which way each face looks out, in the cuboid's own space. */
const FACE_NORMALS: Record<CuboidFace, Point3d> = {
    front: { x: 0, y: 0, z: 1 },
    back: { x: 0, y: 0, z: -1 },
    right: { x: 1, y: 0, z: 0 },
    left: { x: -1, y: 0, z: 0 },
    top: { x: 0, y: -1, z: 0 },
    bottom: { x: 0, y: 1, z: 0 },
};

/** Which way is up for what is drawn on each face, in the cuboid's own space. It follows from each face's transform. */
const FACE_UPS: Record<CuboidFace, Point3d> = {
    front: SCREEN_UP,
    back: SCREEN_UP,
    right: SCREEN_UP,
    left: SCREEN_UP,
    top: { x: 0, y: 0, z: -1 },
    bottom: { x: 0, y: 0, z: 1 },
};

/** The four spins about the line of sight, least first, so a tie between two is won by the smaller. */
const SPINS_DEG = [0, QUARTER_TURN_DEG, -QUARTER_TURN_DEG, QUARTER_TURN_DEG * 2];

/** How far a read-back number may sit from a whole one and still be taken as it, since browsers round what they report. */
const SNAP_TOLERANCE = 1e-4;
/** How close two numbers must be to count as the same. */
const SAME_TOLERANCE = 1e-6;
/** How close two angles must be, in degrees, to count as a tie. */
const TIE_TOLERANCE_DEG = 0.5;
/** How close to a half turn, in radians, a rotation must be before its axis is read from the diagonal rather than the rest. */
const HALF_TURN_TOLERANCE = 1e-2;

/** A rotation matrix with every entry rounded to a whole number, which every orientation of a box at rest has. */
const roundMatrix = (m: Matrix3d) => m.map((value) => Math.round(value) + 0) as Matrix3d;

/** The inverse of a rotation, which for a rotation is its transpose. */
const transpose = (m: Matrix3d): Matrix3d => [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]];

/** The dot product of two directions. */
const dot = (a: Point3d, b: Point3d) => a.x * b.x + a.y * b.y + a.z * b.z;

/** Whether two directions are the same, allowing for rounding. */
const isSameDirection = (a: Point3d, b: Point3d) =>
    Math.abs(a.x - b.x) < SAME_TOLERANCE &&
    Math.abs(a.y - b.y) < SAME_TOLERANCE &&
    Math.abs(a.z - b.z) < SAME_TOLERANCE;

/** Whether two orientations are the same, allowing for rounding. */
const isSameMatrix = (a: Matrix3d, b: Matrix3d) =>
    a.every((value, index) => Math.abs(value - b[index]!) < SAME_TOLERANCE);

/** How far a rotation turns, in radians, from nothing up to a half turn. */
const getRotationRadians = (m: Matrix3d) => Math.acos(MathUtils.clamp((m[0] + m[4] + m[8] - 1) * HALF, -1, 1));

/** A rotation matrix written as the CSS function that draws it. CSS lists a matrix column by column. */
const toMatrixFunction = (m: Matrix3d) =>
    `matrix3d(${m[0]}, ${m[3]}, ${m[6]}, 0, ${m[1]}, ${m[4]}, ${m[7]}, 0, ${m[2]}, ${m[5]}, ${m[8]}, 0, 0, 0, 0, 1)`;

/** The axis a set of presses turns the cuboid about, as seen on screen, for breaking a tie between two ways round. */
const getPushAxis = (turns: CuboidTurns): Point3d => ({ x: -Math.sign(turns.pitch), y: -Math.sign(turns.yaw), z: 0 });

/**
 * Makes the same press a number of times.
 *
 * A press followed by standing the face upright can only land on six orientations, so a long run must come
 * back round to one it has already been in. Once it does, the rest of the run is read off the loop rather
 * than walked, which keeps a count that jumps by a million as cheap as one that moves by one.
 */
const repeatPress = (orientation: Matrix3d, press: (m: Matrix3d) => Matrix3d, count: number) => {
    const seen = [orientation];

    for (let step = 0; step < count; step++) {
        const current = press(seen[seen.length - 1]!);
        const loopStart = seen.findIndex((previous) => isSameMatrix(previous, current));

        if (loopStart >= 0) return seen[loopStart + ((count - loopStart) % (seen.length - loopStart))]!;

        seen.push(current);
    }

    return seen[seen.length - 1]!;
};

/**
 * Sizes and positions the six faces of a CSS 3D cuboid, and says which one is facing the viewer.
 *
 * The faces are all laid out in the same place and then each pushed out to its own surface, which is
 * how CSS 3D transforms build a box. Turns are counted in quarter turns rather than degrees, since a
 * cuboid only ever comes to rest on a face.
 *
 * An orientation is a {@link Matrix3d} in CSS's own space — `x` rightwards, `y` downwards, `z` towards the
 * viewer — that carries a point on the cuboid at rest to where it is now. The upright mode keeps one, since
 * there the two counts no longer say how the box lies.
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
     * The transform that turns the whole cuboid to show a chosen face, read straight off the two counts.
     *
     * The cuboid is pushed back by half its depth first, so it turns about its own center rather than
     * about its front surface — without that, turning would swing the box through the space around it.
     * Fractional counts are allowed, which is how a drag shows a turn part of the way through.
     *
     * @param yaw How many quarter turns about the vertical axis.
     * @param pitch How many quarter turns about the horizontal axis.
     * @param size The cuboid's width, height and depth.
     */
    export const getTurnTransform = (yaw: number, pitch: number, size: CuboidSize) =>
        `translateZ(${-size.depth * HALF}px) rotateX(${-pitch * QUARTER_TURN_DEG}deg) rotateY(${-yaw * QUARTER_TURN_DEG}deg)`;

    /**
     * The transform that holds the cuboid in a kept orientation, with a drag's part-turns laid over it.
     *
     * The part-turns are about the screen's own axes rather than the cuboid's — across first, then up —
     * which is what lets a drag match what is seen however the box lies.
     *
     * @param orientation How the cuboid lies.
     * @param size The cuboid's width, height and depth.
     * @param turns Quarter turns still being dragged, fractional, on top of the orientation.
     */
    export const getOrientationTransform = (orientation: Matrix3d, size: CuboidSize, turns: CuboidTurns = NO_TURNS) =>
        `translateZ(${-size.depth * HALF}px) rotateX(${-turns.pitch * QUARTER_TURN_DEG}deg) rotateY(${-turns.yaw * QUARTER_TURN_DEG}deg) ${toMatrixFunction(orientation)}`;

    /**
     * Which face a pair of counts leaves facing the viewer, when the counts are a pose.
     *
     * @param yaw How many quarter turns about the vertical axis.
     * @param pitch How many quarter turns about the horizontal axis.
     * @returns The face. Turns wrap, so any whole number works, and a half turn upwards swaps front for
     * back and left for right — which is why the sideways turn cannot be read on its own.
     */
    export const getFacingFromTurns = (yaw: number, pitch: number): CuboidFace => {
        const turnedUp = MathUtils.wrapIndex(pitch, QUARTER_TURN_COUNT);
        const turnedAcross = MathUtils.wrapIndex(yaw, QUARTER_TURN_COUNT);

        if (turnedUp === UP_PITCH) return "top";

        if (turnedUp === DOWN_PITCH) return "bottom";

        return (turnedUp === INVERTED_PITCH ? INVERTED_FACES : UPRIGHT_FACES)[turnedAcross]!;
    };

    /**
     * Which face an orientation leaves facing the viewer.
     *
     * @param orientation How the cuboid lies. It is expected to rest on a face; a cuboid caught part of the
     * way through a turn reports the face nearest the viewer.
     * @returns The face.
     */
    export const getFacingFromOrientation = (orientation: Matrix3d): CuboidFace => {
        const faces = Object.keys(FACE_NORMALS) as CuboidFace[];
        const towardsViewer = (face: CuboidFace) => Matrix3dUtils.apply(orientation, FACE_NORMALS[face]).z;

        return faces.reduce((best, face) => (towardsViewer(face) > towardsViewer(best) ? face : best));
    };

    /**
     * The orientation a pair of counts describes when they are a pose.
     *
     * It is the rotation {@link getTurnTransform} draws, as a matrix, so a box switched into the upright mode
     * starts from where it visibly was.
     *
     * @param yaw How many quarter turns about the vertical axis. Expected to be whole.
     * @param pitch How many quarter turns about the horizontal axis. Expected to be whole.
     */
    export const getCountedOrientation = (yaw: number, pitch: number) =>
        roundMatrix(
            Matrix3dUtils.multiply(
                Matrix3dUtils.rotationX(-pitch * QUARTER_TURN_DEG),
                Matrix3dUtils.rotationY(-yaw * QUARTER_TURN_DEG),
            ),
        );

    /**
     * Spins a cuboid about the line of sight until the face it shows reads the right way up.
     *
     * Which face shows does not change; only which way round it is. A face already upright is returned
     * as it was.
     *
     * @param orientation How the cuboid lies, resting on a face.
     * @returns The same face showing, upright.
     */
    export const standUpright = (orientation: Matrix3d) => {
        const up = Matrix3dUtils.apply(orientation, FACE_UPS[getFacingFromOrientation(orientation)]);

        for (const spin of SPINS_DEG) {
            const turn = roundMatrix(Matrix3dUtils.rotationZ(spin));

            if (isSameDirection(Matrix3dUtils.apply(turn, up), SCREEN_UP))
                return roundMatrix(Matrix3dUtils.multiply(turn, orientation));
        }

        return orientation;
    };

    /**
     * Applies presses the way the upright mode does: each one a quarter turn about a screen axis, and each
     * followed by standing the new face upright.
     *
     * The turns across are made first and the turns up second, which is the order a named-face route is
     * planned in. Presses do not undo one another here — across then back again from the lid lands on the
     * front, since the lid was righted in between — so the order is part of the answer.
     *
     * @param orientation How the cuboid lies before the presses.
     * @param turns How many quarter turns each way; positive brings the face on the right, or the face
     * above, to the front. Rounded to whole turns.
     * @returns How it lies afterwards, upright.
     */
    export const turnUpright = (orientation: Matrix3d, turns: CuboidTurns) => {
        const yaw = Math.round(turns.yaw);
        const pitch = Math.round(turns.pitch);
        const press = (rotation: Matrix3d) => (m: Matrix3d) =>
            standUpright(roundMatrix(Matrix3dUtils.multiply(rotation, m)));
        const turnedAcross = repeatPress(
            standUpright(orientation),
            press(Matrix3dUtils.rotationY(-QUARTER_TURN_DEG * Math.sign(yaw))),
            Math.abs(yaw),
        );

        return repeatPress(
            turnedAcross,
            press(Matrix3dUtils.rotationX(-QUARTER_TURN_DEG * Math.sign(pitch))),
            Math.abs(pitch),
        );
    };

    /**
     * The fewest quarter turns that bring a face to the front.
     *
     * Every pair within two turns each way is tried, since two reaches every face from every orientation.
     * Of the shortest, the one tipping least wins, so turning across comes before tipping on a tie; then
     * positive before negative.
     *
     * @param face The face wanted.
     * @param getFacingAfter Which face a pair of turns would leave showing. It is what makes the route
     * depend on the mode: the counts as a pose, or presses from a kept orientation.
     * @returns The turns, `{ yaw: 0, pitch: 0 }` when the face already shows, or `undefined` if no route
     * within reach finds it.
     */
    export const getTurnsTo = (face: CuboidFace, getFacingAfter: (turns: CuboidTurns) => CuboidFace) => {
        const candidates: CuboidTurns[] = [];

        for (let yaw = -ROUTE_REACH; yaw <= ROUTE_REACH; yaw++) {
            for (let pitch = -ROUTE_REACH; pitch <= ROUTE_REACH; pitch++) candidates.push({ yaw, pitch });
        }

        const cost = (turns: CuboidTurns) => Math.abs(turns.yaw) + Math.abs(turns.pitch);
        const rank = (a: CuboidTurns, b: CuboidTurns) =>
            cost(a) - cost(b) ||
            Math.abs(a.pitch) - Math.abs(b.pitch) ||
            Number(a.yaw < 0) - Number(b.yaw < 0) ||
            Number(a.pitch < 0) - Number(b.pitch < 0);

        return candidates.sort(rank).find((turns) => getFacingAfter(turns) === face);
    };

    /**
     * Reads the rotation out of a computed CSS transform, so a turn can start from where the cuboid is
     * actually drawn, part-way through a turn or a drag included.
     *
     * Only the rotation is kept; the push back to the cuboid's center is a translation and does not
     * affect it. Numbers within a hair of a whole one are taken as it, since browsers round what they
     * report and a cuboid at rest should read back exactly.
     *
     * @param transform A computed `transform` value: `none`, `matrix(…)` or `matrix3d(…)`.
     * @returns The orientation, or `undefined` for anything else.
     */
    export const readOrientation = (transform: string): Matrix3d | undefined => {
        if (transform === "none") return IDENTITY;

        const values = transform
            .slice(transform.indexOf("(") + 1, transform.lastIndexOf(")"))
            .split(",")
            .map(Number);
        const snap = (m: Matrix3d) =>
            m.map((value) =>
                Math.abs(value - Math.round(value)) < SNAP_TOLERANCE ? Math.round(value) + 0 : value,
            ) as Matrix3d;

        if (transform.startsWith("matrix3d(") && values.length === 16) {
            return snap([
                values[0]!,
                values[4]!,
                values[8]!,
                values[1]!,
                values[5]!,
                values[9]!,
                values[2]!,
                values[6]!,
                values[10]!,
            ]);
        }

        if (transform.startsWith("matrix(") && values.length === 6) {
            return snap([values[0]!, values[2]!, 0, values[1]!, values[3]!, 0, 0, 0, 1]);
        }

        return undefined;
    };

    /**
     * The shortest single rotation that carries one orientation onto another.
     *
     * A rotation of exactly half a turn can go either way round, and there the direction pushed decides:
     * two presses across turn the way they were pressed rather than whichever way the arithmetic lands.
     *
     * @param from Where the cuboid is.
     * @param to Where it should end up.
     * @param turns The presses that asked for the move, for deciding a half turn. No presses leaves it to
     * the arithmetic.
     * @returns The axis, in screen space, and how far round it in degrees, from nothing to a half turn;
     * `undefined` when the two are already the same.
     */
    export const getArcBetween = (
        from: Matrix3d,
        to: Matrix3d,
        turns: CuboidTurns = NO_TURNS,
    ): CuboidArc | undefined => {
        const d = Matrix3dUtils.multiply(to, transpose(from));
        const radians = getRotationRadians(d);

        if (radians < SAME_TOLERANCE) return undefined;

        const degrees = AngleUtils.fromRadians(radians);

        if (Math.PI - radians > HALF_TURN_TOLERANCE) {
            const scale = 1 / (2 * Math.sin(radians));

            return { axis: { x: (d[7] - d[5]) * scale, y: (d[2] - d[6]) * scale, z: (d[3] - d[1]) * scale }, degrees };
        }

        const xx = Math.max((d[0] + 1) * HALF, 0);
        const yy = Math.max((d[4] + 1) * HALF, 0);
        const zz = Math.max((d[8] + 1) * HALF, 0);

        let axis: Point3d;

        if (xx >= yy && xx >= zz) {
            const x = Math.sqrt(xx);

            axis = { x, y: (d[1] + d[3]) / (4 * x), z: (d[2] + d[6]) / (4 * x) };
        } else if (yy >= zz) {
            const y = Math.sqrt(yy);

            axis = { x: (d[1] + d[3]) / (4 * y), y, z: (d[5] + d[7]) / (4 * y) };
        } else {
            const z = Math.sqrt(zz);

            axis = { x: (d[2] + d[6]) / (4 * z), y: (d[5] + d[7]) / (4 * z), z };
        }

        if (dot(axis, getPushAxis(turns)) < 0) axis = { x: -axis.x, y: -axis.y, z: -axis.z };

        return { axis, degrees };
    };

    /**
     * The keyframes that carry the cuboid from where it is drawn to where it should rest: the shortest turn
     * to the face, then a spin about the line of sight until that face reads upright.
     *
     * Of the four ways the target face can lie, the turn goes to the nearest, so a single press is exactly
     * the quarter turn about the screen axis that was asked for, and whatever righting is still needed comes
     * after it as a spin. Each phase takes a share of the time in proportion to how far it turns.
     *
     * Every keyframe is written with the same list of functions, and each function changes in only one
     * number from one keyframe to the next — an angle about a fixed axis — so the browser interpolates that
     * angle directly. Nothing is left to its matrix interpolation, which may go the long way round.
     *
     * @param from Where the cuboid is drawn now, from {@link readOrientation}.
     * @param to Where it should rest.
     * @param size The cuboid's width, height and depth.
     * @param turns The presses that asked for the move, for deciding a half turn.
     * @returns The keyframes, or an empty list when the cuboid is already there.
     */
    export const getSettleKeyframes = (
        from: Matrix3d,
        to: Matrix3d,
        size: CuboidSize,
        turns: CuboidTurns = NO_TURNS,
    ) => {
        const push = getPushAxis(turns);
        const [best] = SPINS_DEG.map((spin) => {
            const via = roundMatrix(Matrix3dUtils.multiply(Matrix3dUtils.rotationZ(-spin), to));
            const arc = getArcBetween(from, via, turns);

            return { spin, via, arc, degrees: arc?.degrees ?? 0, alignment: arc ? Math.abs(dot(arc.axis, push)) : 0 };
        }).sort((a, b) =>
            Math.abs(a.degrees - b.degrees) > TIE_TOLERANCE_DEG ? a.degrees - b.degrees : b.alignment - a.alignment,
        );

        if (!best || (!best.arc && best.spin === 0)) return [];

        const axis = best.arc?.axis ?? VIEW_AXIS;
        const total = best.degrees + Math.abs(best.spin);
        const frame = (spin: number, degrees: number, offset: number): Keyframe => ({
            offset,
            transform: `translateZ(${-size.depth * HALF}px) rotateZ(${spin}deg) rotate3d(${axis.x}, ${axis.y}, ${axis.z}, ${degrees}deg) ${toMatrixFunction(best.via)}`,
        });

        return [frame(0, -best.degrees, 0), frame(0, 0, best.degrees / total), frame(best.spin, 0, 1)];
    };

    /**
     * How much room to leave for a cuboid so it never clips as it turns.
     *
     * The worst case is a corner pointing at the viewer, so the space needed is set by the distance from
     * the center to a corner rather than by any one dimension. Perspective then makes the near part of
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
