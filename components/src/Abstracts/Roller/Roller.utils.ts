import type { Matrix3d, Point3d } from "@thewaver/ss-utils";
import { EasingUtils, Matrix3dUtils, StoreUtils } from "@thewaver/ss-utils";

import { LiveAnnouncerUtils } from "../LiveAnnouncer/LiveAnnouncer.utils";
import { TurnClockUtils } from "../TurnClock/TurnClock.utils";
import type {
    RollerController,
    RollerCoreDefs,
    RollerDirection,
    RollerFace,
    RollerPhase,
    RollerQuaternion,
    RollerState,
} from "./Roller.types";

/** Zero, as a length, an angle or an index. */
const NOTHING = 0;
/** One, as a whole or a unit length. */
const SINGLE = 1;
/** Halfway. */
const HALF = 0.5;
/** Double, for the doubled terms of a rotation. */
const DOUBLE = 2;
/** A quarter, for recovering a rotation from its largest term. */
const QUARTER = 0.25;
/** A full turn, in radians. */
const TURN = Math.PI * 2;
/** Radians in one degree. */
const RADIANS_PER_DEGREE = Math.PI / 180;
/** How close two rotations may be before blending between them stops being worth the trigonometry. */
const SLERP_EPSILON = 1e-6;
/** Fewer than two faces and there is nowhere to turn to. */
const MIN_ROTATABLE_FACE_COUNT = 2;
/** The first face, which a roller falls back on when it has to name one and has nothing better. */
const FIRST_FACE = 0;
/** No rotation at all. */
const IDENTITY: RollerQuaternion = { w: 1, x: 0, y: 0, z: 0 };
/** How far a step turns at a time while it looks for the next face, in degrees. */
const STEP_SEARCH_DEGREES = 2;
/** How far a step looks before giving up, in degrees: past half a turn it would be coming round the other way. */
const STEP_SEARCH_LIMIT_DEGREES = 180;
/** The screen axis each direction turns about, the way a drag in that direction would. */
const DIRECTION_AXES: Record<RollerDirection, Point3d> = {
    right: { x: 0, y: 1, z: 0 },
    left: { x: 0, y: -1, z: 0 },
    down: { x: -1, y: 0, z: 0 },
    up: { x: 1, y: 0, z: 0 },
};
/** The keys that step the roller, and which way each goes. */
const KEY_DIRECTIONS: Record<string, RollerDirection> = {
    ArrowRight: "right",
    ArrowLeft: "left",
    ArrowDown: "down",
    ArrowUp: "up",
};
/** How far the pointer may wander before a press becomes a drag, in pixels. */
const DRAG_SLOP_PX = 4;
/** How far back from the last pointer position the speed at release is read, in milliseconds. */
const VELOCITY_WINDOW_MS = 100;
/** Below this many radians per millisecond a coast is over and the roller settles. */
const MIN_COAST_SPEED = 0.0002;
/** How steeply a roll eases out as it lands. */
const EASE_POWER = 3;
/** How long past a coast's expected end its backstop timer waits before landing it anyway. */
const FRAME_STARVATION_SLACK_MS = 100;
/** At rest, unturned, with nothing under way and no face landed on yet. */
const RESTING_STATE: RollerState = {
    orientation: IDENTITY,
    rollPhase: "still",
    isAwaitingTarget: false,
    isResting: false,
    restingFace: undefined,
};

type PointerSample = { x: number; y: number; timeMs: number };

type Press = {
    pointerId: number;
    start: { x: number; y: number };
    last: { x: number; y: number };
    samples: PointerSample[];
    radiusPx: number;
    isDragging: boolean;
};

/** Eases a roll's progress so it slows as it lands. */
const easeOut = (progress: number) => SINGLE - (SINGLE - progress) ** EASE_POWER;

/** Eases a settle in and out, so it starts and stops rather than snapping to speed. */
const SETTLE_EASING = EasingUtils.ease;

/** A random axis to tumble about, leaning towards the viewer so the tumble reads as a throw. */
const pickTumbleAxis = () => ({ x: Math.random() - HALF, y: Math.random() - HALF, z: Math.random() * HALF });

const dot = (a: Point3d, b: Point3d) => a.x * b.x + a.y * b.y + a.z * b.z;

const cross = (a: Point3d, b: Point3d): Point3d => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
});

const normalizeVector = (a: Point3d): Point3d => {
    const length = Math.hypot(a.x, a.y, a.z);

    return length > NOTHING ? { x: a.x / length, y: a.y / length, z: a.z / length } : a;
};

const normalizeQuaternion = (q: RollerQuaternion): RollerQuaternion => {
    const length = Math.hypot(q.w, q.x, q.y, q.z);

    return length > NOTHING ? { w: q.w / length, x: q.x / length, y: q.y / length, z: q.z / length } : IDENTITY;
};

const computeVelocity = (samples: PointerSample[]) => {
    const last = samples[samples.length - 1];
    const first = last && samples.find((sample) => last.timeMs - sample.timeMs <= VELOCITY_WINDOW_MS);
    const elapsedMs = first ? last.timeMs - first.timeMs : NOTHING;

    if (!first || elapsedMs <= NOTHING) return { x: NOTHING, y: NOTHING };

    return { x: (last.x - first.x) / elapsedMs, y: (last.y - first.y) / elapsedMs };
};

/**
 * Turns a solid of faces freely in three dimensions and lands it on a chosen face.
 *
 * The wheel's behavior with one more dimension: where `RotatorUtils` holds one angle, this holds one rotation, as a
 * quaternion so two rotations blend smoothly and a long run of drags never piles up the error two separate angles
 * would. It drifts while idle, rolls with whole tumbles onto a face that may be chosen later, follows a drag like a
 * ball under the pointer, coasts when the drag lets go and settles onto the nearest face, and steps one face at a
 * time from the keys or a command. A face is anything with a direction out of the solid and a direction that reads as
 * down on it.
 */
export namespace RollerUtils {
    /**
     * A rotation matrix as a quaternion, so it can be blended with another.
     *
     * @param m A rotation, as a matrix in rows.
     */
    export const toQuaternion = (m: Matrix3d): RollerQuaternion => {
        const trace = m[0] + m[4] + m[8];

        if (trace > NOTHING) {
            const s = HALF / Math.sqrt(trace + SINGLE);

            return { w: QUARTER / s, x: (m[7] - m[5]) * s, y: (m[2] - m[6]) * s, z: (m[3] - m[1]) * s };
        }

        if (m[0] > m[4] && m[0] > m[8]) {
            const s = DOUBLE * Math.sqrt(SINGLE + m[0] - m[4] - m[8]);

            return { w: (m[7] - m[5]) / s, x: QUARTER * s, y: (m[1] + m[3]) / s, z: (m[2] + m[6]) / s };
        }

        if (m[4] > m[8]) {
            const s = DOUBLE * Math.sqrt(SINGLE + m[4] - m[0] - m[8]);

            return { w: (m[2] - m[6]) / s, x: (m[1] + m[3]) / s, y: QUARTER * s, z: (m[5] + m[7]) / s };
        }

        const s = DOUBLE * Math.sqrt(SINGLE + m[8] - m[0] - m[4]);

        return { w: (m[3] - m[1]) / s, x: (m[2] + m[6]) / s, y: (m[5] + m[7]) / s, z: QUARTER * s };
    };

    /**
     * A quaternion as a rotation matrix.
     *
     * @param q A unit quaternion.
     * @returns The rotation, as a matrix in rows.
     */
    export const toRotation = (q: RollerQuaternion): Matrix3d => [
        SINGLE - DOUBLE * (q.y * q.y + q.z * q.z),
        DOUBLE * (q.x * q.y - q.z * q.w),
        DOUBLE * (q.x * q.z + q.y * q.w),
        DOUBLE * (q.x * q.y + q.z * q.w),
        SINGLE - DOUBLE * (q.x * q.x + q.z * q.z),
        DOUBLE * (q.y * q.z - q.x * q.w),
        DOUBLE * (q.x * q.z - q.y * q.w),
        DOUBLE * (q.y * q.z + q.x * q.w),
        SINGLE - DOUBLE * (q.x * q.x + q.y * q.y),
    ];

    /**
     * A turn about an axis, as a quaternion.
     *
     * @param axis The axis to turn about. It need not be a unit vector; a zero one gives no turn.
     * @param radians How far to turn.
     */
    export const fromAxisAngle = (axis: Point3d, radians: number): RollerQuaternion => {
        if (Math.hypot(axis.x, axis.y, axis.z) <= NOTHING) return IDENTITY;

        const unit = normalizeVector(axis);
        const sine = Math.sin(radians * HALF);

        return { w: Math.cos(radians * HALF), x: unit.x * sine, y: unit.y * sine, z: unit.z * sine };
    };

    /**
     * Two rotations combined into one.
     *
     * @param a The rotation applied second.
     * @param b The rotation applied first.
     */
    export const multiply = (a: RollerQuaternion, b: RollerQuaternion): RollerQuaternion => ({
        w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
        x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
        y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
        z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
    });

    /**
     * A rotation part of the way from one to another, along the shortest turn between them.
     *
     * @param from Where it starts.
     * @param to Where it ends.
     * @param progress How far along, `0` at `from` and `1` at `to`.
     */
    export const slerp = (from: RollerQuaternion, to: RollerQuaternion, progress: number): RollerQuaternion => {
        let cosine = from.w * to.w + from.x * to.x + from.y * to.y + from.z * to.z;
        let target = to;

        if (cosine < NOTHING) {
            cosine = -cosine;
            target = { w: -to.w, x: -to.x, y: -to.y, z: -to.z };
        }

        if (SINGLE - cosine < SLERP_EPSILON) {
            return normalizeQuaternion({
                w: from.w + (target.w - from.w) * progress,
                x: from.x + (target.x - from.x) * progress,
                y: from.y + (target.y - from.y) * progress,
                z: from.z + (target.z - from.z) * progress,
            });
        }

        const angle = Math.acos(cosine);
        const sine = Math.sin(angle);
        const fromShare = Math.sin((SINGLE - progress) * angle) / sine;
        const toShare = Math.sin(progress * angle) / sine;

        return {
            w: from.w * fromShare + target.w * toShare,
            x: from.x * fromShare + target.x * toShare,
            y: from.y * fromShare + target.y * toShare,
            z: from.z * fromShare + target.z * toShare,
        };
    };

    /**
     * Where a direction on the solid points once the solid is turned.
     *
     * @param orientation How the solid is turned.
     * @param direction A direction in the solid's own space.
     * @returns The direction on screen: `x` to the right, `y` down and `z` towards the viewer.
     */
    export const turnVector = (orientation: RollerQuaternion, direction: Point3d) =>
        Matrix3dUtils.apply(toRotation(orientation), direction);

    /**
     * The landing for a face: the rotation that turns it towards the viewer the right way up.
     *
     * @param face The face, by the direction it points out of the solid and the direction that reads as down on it.
     * The two must be at right angles.
     * @returns The rotation that sends the face's direction straight at the viewer and its down straight down the
     * screen. It depends only on the face, not on how the solid is turned now, so landing on a face always leaves it
     * upright however the solid got there.
     */
    export const getLandingQuaternion = (face: RollerFace) => {
        const right = cross(face.down, face.normal);

        return toQuaternion([
            right.x,
            right.y,
            right.z,
            face.down.x,
            face.down.y,
            face.down.z,
            face.normal.x,
            face.normal.y,
            face.normal.z,
        ]);
    };

    /**
     * The face nearest the viewer for a given turn.
     *
     * @param faces The solid's faces.
     * @param orientation How the solid is turned.
     * @returns The index of the face pointing most nearly at the viewer, or `undefined` when there are no faces. On a
     * tie the face listed first wins.
     */
    export const getClosestFace = (faces: RollerFace[], orientation: RollerQuaternion) => {
        const rotation = toRotation(orientation);

        let closest: number | undefined;
        let closestFacing = -Infinity;

        faces.forEach((face, index) => {
            const facing = Matrix3dUtils.apply(rotation, face.normal).z;

            if (facing > closestFacing) {
                closest = index;
                closestFacing = facing;
            }
        });

        return closest;
    };

    /**
     * The face on the far side of the solid from a given one.
     *
     * @param faces The solid's faces.
     * @param index The face to look across from.
     * @returns The index of the face pointing most nearly the opposite way, which on a solid with parallel faces is
     * the one exactly behind, or `undefined` for a face that does not exist or a solid with no other face. On a tie
     * the face listed first wins.
     */
    export const getOppositeFace = (faces: RollerFace[], index: number) => {
        const face = faces[index];

        if (!face) return undefined;

        let opposite: number | undefined;
        let oppositeAlignment = Infinity;

        faces.forEach((other, otherIndex) => {
            if (otherIndex === index) return;

            const alignment = dot(face.normal, other.normal);

            if (alignment < oppositeAlignment) {
                opposite = otherIndex;
                oppositeAlignment = alignment;
            }
        });

        return opposite;
    };

    /**
     * The face a step in a direction brings to the front.
     *
     * The solid is turned bit by bit about the screen axis a drag in that direction would turn it about, and the
     * first face other than the nearest one to come nearest is the answer. So a step reaches the neighbor that way on
     * any solid, whatever its faces, and a step right does what a drag to the right does: the front face moves right
     * and the face on its left comes round.
     *
     * @param faces The solid's faces.
     * @param orientation How the solid is turned to begin with.
     * @param direction Which way to step.
     * @returns The face, or `undefined` when no other face comes round within half a turn.
     */
    export const getNextFace = (faces: RollerFace[], orientation: RollerQuaternion, direction: RollerDirection) => {
        const start = getClosestFace(faces, orientation);
        const axis = DIRECTION_AXES[direction];

        if (start === undefined) return undefined;

        for (let degrees = STEP_SEARCH_DEGREES; degrees <= STEP_SEARCH_LIMIT_DEGREES; degrees += STEP_SEARCH_DEGREES) {
            const turned = multiply(fromAxisAngle(axis, degrees * RADIANS_PER_DEGREE), orientation);
            const closest = getClosestFace(faces, turned);

            if (closest !== start) return closest;
        }

        return undefined;
    };

    /**
     * The turn a drag makes, as if the pointer were rolling a ball under it.
     *
     * The turn is about the screen axis at right angles to the movement, so the point under the pointer goes with it,
     * by as many radians as the movement is long in radii.
     *
     * @param dx How far the pointer moved to the right, in pixels.
     * @param dy How far the pointer moved down, in pixels.
     * @param radiusPx How large the solid is drawn, center to corner, in the same pixels.
     * @returns The turn, to apply on top of the current one; no turn for no movement or no size.
     */
    export const getDragTurn = (dx: number, dy: number, radiusPx: number) => {
        const distance = Math.hypot(dx, dy);

        if (distance <= NOTHING || radiusPx <= NOTHING) return IDENTITY;

        return fromAxisAngle({ x: -dy, y: dx, z: NOTHING }, distance / radiusPx);
    };

    /**
     * Turns a coasting solid on by the time that has passed, slowing it as it goes.
     *
     * The speed decays exponentially, by the same share in every equal stretch of time, so the coast lasts as long on
     * any frame rate; the angle is the exact sum of that decaying speed rather than a frame-by-frame guess.
     *
     * @param speed How fast it turns, in radians per millisecond.
     * @param elapsedMs How long has passed.
     * @param momentumMs How slowly it loses speed: after this long about 63% of it is gone. `0` or less stops at once.
     * @returns How far it turned, in radians, and how fast it turns now.
     */
    export const stepCoast = (speed: number, elapsedMs: number, momentumMs: number) => {
        if (momentumMs <= NOTHING) return { angle: NOTHING, speed: NOTHING };

        const kept = Math.exp(-Math.max(elapsedMs, NOTHING) / momentumMs);

        return { angle: speed * momentumMs * (SINGLE - kept), speed: speed * kept };
    };

    /**
     * The face a roller lands on for the face its owner holds, which may be out of range or not a whole number.
     *
     * @param face The owner's face.
     * @param faceCount How many faces there are.
     * @returns The face, truncated and clamped to the faces there are.
     */
    export const clampFace = (face: number, faceCount: number) =>
        Math.min(Math.max(FIRST_FACE, Math.trunc(face)), faceCount - SINGLE);

    /**
     * Whether a roller can turn at all: it is enabled and has at least two faces to turn between.
     *
     * @param isDisabled Whether the roller is off.
     * @param faceCount How many faces it has.
     */
    export const getIsRotatable = (isDisabled: boolean, faceCount: number) =>
        !isDisabled && faceCount >= MIN_ROTATABLE_FACE_COUNT;

    /**
     * Whether a roll could start right now: the roller can turn, has a way to choose a face, is standing still or
     * drifting, and is not waiting on a target.
     *
     * @param state What the roller holds.
     * @param isRotatable The answer from {@link getIsRotatable}.
     * @param hasRollTarget Whether the owner gave a way to choose the face a roll lands on.
     */
    export const getIsRollable = (state: RollerState, isRotatable: boolean, hasRollTarget: boolean) =>
        isRotatable && hasRollTarget && state.rollPhase === "still" && !state.isAwaitingTarget;

    /**
     * What a roller is doing, from what it holds and whether idle drift is allowed.
     *
     * A roll, a settle, a drag or a coast under way is reported as itself. Otherwise the roller is idling when drift
     * has a delay, is allowed, the rest after a landing is over, and it can turn — and still when any of those fails.
     *
     * @param state What the roller holds.
     * @param opts.idleDelayMs How long one step of idle drift takes. `undefined` means no drift.
     * @param opts.isIdleAllowed Whether drift is allowed at all — switched on, and the tab in the foreground.
     * @param opts.isRotatable The answer from {@link getIsRotatable}.
     */
    export const computePhase = (
        state: RollerState,
        opts: { idleDelayMs: number | undefined; isIdleAllowed: boolean; isRotatable: boolean },
    ): RollerPhase => {
        if (state.rollPhase !== "still") return state.rollPhase;

        return TurnClockUtils.getIsIdling({ ...opts, isResting: state.isResting }) ? "idling" : "still";
    };

    /**
     * Whether a turn under way was started by somebody rather than by idle drift: a roll from the moment it is asked
     * for, a drag, its coast, and every settle onto a face.
     *
     * @param state What the roller holds.
     */
    export const getIsBusy = (state: RollerState) => state.isAwaitingTarget || state.rollPhase !== "still";

    /**
     * Drives one solid.
     *
     * The rotation is the single source of truth and the face nearest the viewer is read back out of it, whether the
     * solid got there by rolling, drifting, being dragged or being stepped. Every landing is on a face, upright, and
     * is announced, since a screen reader user cannot see the solid stop; a landing then rests before drift resumes.
     *
     * The roller is a store of the rotation, the roll phase, whether a target is being waited on, whether it rests
     * after a landing, and the face it last came to rest on — `undefined` from the moment anything turns it again.
     * Its commands:
     *
     * - `roll` starts a roll if one could start, by {@link getIsRollable}, and says whether it did. The target is asked
     *   for at once and written to the target face as soon as it is known, then the solid tumbles onto it.
     * - `step` turns the solid one face in a direction, by {@link getNextFace}, and says whether it did. It declines
     *   while a roll is under way or awaited, and during a drag. The face is written as the target at once.
     * - `rest` puts the solid straight onto a face, stopping anything under way. For the first face, at mount.
     * - `turnToTarget` settles the solid onto a face the owner chose, unless anything is under way or it already rests
     *   there. Call it when the target face changes from outside.
     * - `reshape` answers a change of faces: a solid resting on a face the new shape also has is put straight onto
     *   that face of the new shape, one resting on a face the new shape lacks turns from where it is drawn onto the
     *   face its target clamps to ({@link clampFace}), the last for a face past its end, a settle under way starts again from where the solid is towards the new shape's face,
     *   and anything else is left to finish on its own.
     * - `startRest` holds the solid still after landing, for the given time, and returns the function that calls it
     *   off. A negative time rests for good.
     * - `drift` turns the solid about an axis on screen, one step per `idleDelayMs`, and returns the function that
     *   stops it. Call it while {@link computePhase} says `"idling"`.
     * - `observe` attaches the drag and the arrow keys to an element, while `getIsMovable` allows them, and returns
     *   the function that detaches them. A drag past a few pixels captures the pointer, turns the solid as a ball
     *   under it, and on release coasts on the last moment's speed, slowing exponentially, then settles onto the
     *   nearest face, which it writes as the target. A drag does not also click what it started on. The arrow keys
     *   step, and only while the element itself has focus, so keys inside the faces are left to them.
     * - `stop` abandons whatever is under way and leaves the solid where it is, usable again. Call it when the owner
     *   goes away.
     *
     * Every function in `defs` is read when it is needed, and `computeRollTarget`'s presence is read at each roll.
     *
     * @param defs What the roller reads and writes. `getRadius` is how large the solid is drawn, center to corner, in
     * layout pixels; a drag turns by the pointer's travel in radii. `targetFace` is the face the solid is heading for
     * or last landed on, read and written.
     * @returns The roller.
     */
    export const createRoller = (defs: RollerCoreDefs): RollerController => {
        LiveAnnouncerUtils.reserve("polite");

        const store = StoreUtils.create(RESTING_STATE, { isEqual: StoreUtils.getIsShallowEqual });
        const [getTargetFace, setTargetFace] = defs.targetFace;

        const tween = TurnClockUtils.createTween();
        const targetRequest = TurnClockUtils.createTargetRequest();

        let stopCoast: (() => void) | undefined;
        let press: Press | undefined;

        const write = (next: Partial<RollerState>) => store.update((current) => ({ ...current, ...next }));

        const getFaceCount = () => defs.getFaces().length;

        const getLanding = (index: number) => {
            const face = defs.getFaces()[index];

            return face ? getLandingQuaternion(face) : IDENTITY;
        };

        const getClampedTarget = () => clampFace(getTargetFace(), getFaceCount());

        const halt = () => {
            tween.cancel();
            stopCoast?.();
            stopCoast = undefined;
        };

        const land = (index: number, isRoll: boolean) => {
            halt();
            write({ orientation: getLanding(index), rollPhase: "still", isResting: true, restingFace: index });
            setTargetFace(index);

            LiveAnnouncerUtils.announce(defs.computeFaceLabel(index, getFaceCount()));

            if (isRoll) defs.onRollEnd?.(index);
        };

        const settleOnto = (index: number) => {
            halt();
            write({ rollPhase: "settling", isResting: false, restingFace: undefined });
            setTargetFace(index);

            const from = store.get().orientation;
            const to = getLanding(index);

            tween.run(
                defs.getSettleDurationMs(),
                (ratio) => write({ orientation: slerp(from, to, SETTLE_EASING(ratio)) }),
                () => land(index, false),
            );
        };

        const getClosest = () => getClosestFace(defs.getFaces(), store.get().orientation) ?? FIRST_FACE;

        const settleOntoClosest = () => settleOnto(getClosest());

        const rest = (index: number) => {
            halt();
            write({ orientation: getLanding(index), rollPhase: "still", restingFace: index });
        };

        const roll = () => {
            const computeRollTarget = defs.computeRollTarget;
            const isRotatable = getIsRotatable(defs.getIsDisabled(), getFaceCount());

            if (!computeRollTarget || !getIsRollable(store.get(), isRotatable, true)) return false;

            write({ isResting: false, isAwaitingTarget: true });

            targetRequest.request(
                () => computeRollTarget(),
                (target) => {
                    const index = clampFace(target, getFaceCount());
                    const from = store.get().orientation;
                    const to = getLanding(index);
                    const axis = pickTumbleAxis();
                    const tumbleCount = defs.getTumbleCount();

                    halt();
                    write({ rollPhase: "rolling", isAwaitingTarget: false, restingFace: undefined });
                    setTargetFace(index);

                    tween.run(
                        defs.getRollDurationMs(),
                        (ratio) => {
                            const progress = easeOut(ratio);
                            const tumble = fromAxisAngle(axis, TURN * tumbleCount * progress);

                            write({ orientation: multiply(tumble, slerp(from, to, progress)) });
                        },
                        () => land(index, true),
                    );
                },
                () => write({ isAwaitingTarget: false }),
            );

            return true;
        };

        const step = (direction: RollerDirection) => {
            const state = store.get();

            if (!getIsRotatable(defs.getIsDisabled(), getFaceCount())) return false;
            if (state.isAwaitingTarget || state.rollPhase === "rolling" || state.rollPhase === "dragging") return false;

            const base = state.rollPhase === "settling" ? getLanding(getClampedTarget()) : state.orientation;
            const next = getNextFace(defs.getFaces(), base, direction);

            if (next === undefined) return false;

            settleOnto(next);

            return true;
        };

        const turnToTarget = (index: number) => {
            const state = store.get();

            if (state.rollPhase !== "still" || state.isAwaitingTarget) return;
            if (getFaceCount() < MIN_ROTATABLE_FACE_COUNT) return;

            const clamped = clampFace(index, getFaceCount());

            if (clamped === state.restingFace) return;

            settleOnto(clamped);
        };

        const reshape = () => {
            const state = store.get();

            if (state.isAwaitingTarget) return;

            if (state.rollPhase === "settling") {
                settleOnto(getClampedTarget());

                return;
            }

            if (state.rollPhase !== "still" || state.restingFace === undefined) return;

            const target = getClampedTarget();

            if (target === state.restingFace) rest(target);
            else settleOnto(target);
        };

        const startRest = (restDurationMs: number) => {
            if (!store.get().isResting) return () => {};

            return TurnClockUtils.holdRest(restDurationMs, () => write({ isResting: false }));
        };

        const drift = (idleDelayMs: number | undefined, stepAngle: number, axis: Point3d) => {
            if (idleDelayMs === undefined || idleDelayMs <= NOTHING || stepAngle <= NOTHING) return () => {};

            const radiansPerMs = (stepAngle * RADIANS_PER_DEGREE) / idleDelayMs;

            return TurnClockUtils.runFrames((elapsedMs) =>
                store.update((current) => ({
                    ...current,
                    restingFace: undefined,
                    orientation: normalizeQuaternion(
                        multiply(fromAxisAngle(axis, elapsedMs * radiansPerMs), current.orientation),
                    ),
                })),
            );
        };

        const coast = (velocity: { x: number; y: number }, radiusPx: number) => {
            const momentumMs = defs.getMomentumMs();
            const axis = { x: -velocity.y, y: velocity.x, z: NOTHING };

            let speed = Math.hypot(velocity.x, velocity.y) / radiusPx;

            if (momentumMs <= NOTHING || !(speed >= MIN_COAST_SPEED)) {
                settleOntoClosest();

                return;
            }

            halt();
            write({ rollPhase: "coasting" });

            const stopFrames = TurnClockUtils.runFrames((elapsedMs) => {
                const next = stepCoast(speed, elapsedMs, momentumMs);

                speed = next.speed;
                write({
                    orientation: normalizeQuaternion(
                        multiply(fromAxisAngle(axis, next.angle), store.get().orientation),
                    ),
                });

                if (speed < MIN_COAST_SPEED) settleOntoClosest();
            });
            const expectedMs = momentumMs * Math.log(speed / MIN_COAST_SPEED);
            const startSpeed = speed;
            const starvationHandle = setTimeout(() => {
                const remaining = stepCoast(startSpeed, expectedMs, momentumMs).angle;

                write({
                    orientation: normalizeQuaternion(multiply(fromAxisAngle(axis, remaining), store.get().orientation)),
                });
                land(getClosest(), false);
            }, expectedMs + FRAME_STARVATION_SLACK_MS);

            stopCoast = () => {
                stopFrames();
                clearTimeout(starvationHandle);
            };
        };

        const observe = (element: HTMLElement) => {
            const suppressNextClick = () => {
                const handleClick = (event: MouseEvent) => {
                    event.preventDefault();
                    event.stopPropagation();
                };

                element.addEventListener("click", handleClick, { capture: true, once: true });
                setTimeout(() => element.removeEventListener("click", handleClick, { capture: true }));
            };

            const startDrag = (event: PointerEvent) => {
                if (!press) return;

                press.isDragging = true;
                element.setPointerCapture(event.pointerId);
                halt();
                write({ rollPhase: "dragging", isResting: false, restingFace: undefined });
            };

            const handlePointerDown = (event: PointerEvent) => {
                const state = store.get();

                if (!defs.getIsMovable() || defs.getIsDisabled() || event.button !== NOTHING) return;
                if (state.isAwaitingTarget || state.rollPhase === "rolling") return;

                const point = { x: event.clientX, y: event.clientY };
                const width = element.offsetWidth;
                const scale = width > NOTHING ? element.getBoundingClientRect().width / width : SINGLE;

                press = {
                    pointerId: event.pointerId,
                    start: point,
                    last: point,
                    samples: [{ ...point, timeMs: event.timeStamp }],
                    radiusPx: defs.getRadius() * scale,
                    isDragging: false,
                };

                if (state.rollPhase === "coasting" || state.rollPhase === "settling") startDrag(event);
            };

            const handlePointerMove = (event: PointerEvent) => {
                if (!press || event.pointerId !== press.pointerId) return;

                const point = { x: event.clientX, y: event.clientY };

                if (!press.isDragging) {
                    if (Math.hypot(point.x - press.start.x, point.y - press.start.y) <= DRAG_SLOP_PX) return;

                    startDrag(event);
                }

                const turn = getDragTurn(point.x - press.last.x, point.y - press.last.y, press.radiusPx);

                press.last = point;
                press.samples.push({ ...point, timeMs: event.timeStamp });
                press.samples = press.samples.filter((sample) => event.timeStamp - sample.timeMs <= VELOCITY_WINDOW_MS);

                write({ orientation: normalizeQuaternion(multiply(turn, store.get().orientation)) });
            };

            const handlePointerUp = (event: PointerEvent) => {
                if (!press || event.pointerId !== press.pointerId) return;

                const ended = press;

                press = undefined;

                if (!ended.isDragging) return;

                suppressNextClick();
                coast(computeVelocity(ended.samples), ended.radiusPx);
            };

            const handlePointerCancel = (event: PointerEvent) => {
                if (!press || event.pointerId !== press.pointerId) return;

                const ended = press;

                press = undefined;

                if (ended.isDragging) settleOntoClosest();
            };

            const handleKeyDown = (event: KeyboardEvent) => {
                const direction = KEY_DIRECTIONS[event.key];

                if (!direction || event.target !== element || !defs.getIsMovable()) return;

                event.preventDefault();
                step(direction);
            };

            element.addEventListener("pointerdown", handlePointerDown);
            element.addEventListener("pointermove", handlePointerMove);
            element.addEventListener("pointerup", handlePointerUp);
            element.addEventListener("pointercancel", handlePointerCancel);
            element.addEventListener("keydown", handleKeyDown);

            return () => {
                element.removeEventListener("pointerdown", handlePointerDown);
                element.removeEventListener("pointermove", handlePointerMove);
                element.removeEventListener("pointerup", handlePointerUp);
                element.removeEventListener("pointercancel", handlePointerCancel);
                element.removeEventListener("keydown", handleKeyDown);
            };
        };

        const stop = () => {
            targetRequest.cancel();
            halt();
            press = undefined;
            write({ rollPhase: "still", isAwaitingTarget: false });
        };

        return {
            get: store.get,
            subscribe: store.subscribe,
            roll,
            step,
            rest,
            turnToTarget,
            reshape,
            startRest,
            drift,
            observe,
            stop,
        };
    };
}
